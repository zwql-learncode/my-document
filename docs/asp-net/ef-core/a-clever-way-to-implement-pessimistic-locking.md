---
id: a-clever-way-to-implement-pessimistic-locking
title: Pessimistic Locking
---

# Một Cách Thông Minh Để Triển Khai Pessimistic Locking trong EF Core

Nguồn: Bài viết "A Clever Way To Implement Pessimistic Locking in EF Core" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/a-clever-way-to-implement-pessimistic-locking-in-ef-core)

Đôi khi, đặc biệt trong các hệ thống có lưu lượng truy cập cao, bạn phải đảm bảo rằng chỉ một `process` (tiến trình) có thể thay đổi dữ liệu tại một thời điểm.

Hãy tưởng tượng bạn đang xây dựng hệ thống bán vé cho một buổi hòa nhạc cực kỳ nổi tiếng. Khách hàng đang tranh nhau mua vé, và những chiếc vé cuối cùng có thể bị bán ra cùng lúc.
Nếu bạn không cẩn thận, nhiều khách hàng có thể cùng nghĩ rằng họ đã mua được chiếc vé cuối cùng, dẫn đến overbooking(bán vé vượt mức) và gây thất vọng!

Entity Framework Core là một công cụ tuyệt vời, nhưng nó không hỗ trợ trực tiếp cơ chế khóa bi quan (Pessimistic Locking).
Khóa lạc quan (Optimistic locking) thông qua version có thể hoạt động, nhưng trong những tình huống cạnh tranh cao, nó sẽ dẫn đến nhiều lần retry.

Vậy làm sao để giải quyết vấn đề này với EF Core?

## Ví dụ chi tiết

Đây là một đoạn mã đơn giản mô phỏng bài toán bán vé:

```c#
public async Task Handle(CreateOrderCommand request)
{
    await using DbTransaction transaction = await unitOfWork.BeginTransactionAsync();

    Customer customer = await customerRepository.GetAsync(request.CustomerId);

    Order order = Order.Create(customer);
    Cart cart = await cartService.GetAsync(customer.Id);

    foreach (CartItem cartItem in cart.Items)
    {
        // Uh-oh... nếu 2 request vào cùng lúc thì sao?
        TicketType ticketType = await ticketTypeRepository.GetAsync(cartItem.TicketTypeId);

        ticketType.UpdateQuantity(cartItem.Quantity);

        order.AddItem(ticketType, cartItem.Quantity, cartItem.Price);
    }

    orderRepository.Insert(order);

    await unitOfWork.SaveChangesAsync();

    await transaction.CommitAsync();

    await cartService.ClearAsync(customer.Id);
}
```

Ví dụ trên là giả, nhưng nó đủ để giải thích vấn đề. Trong quá trình thanh toán, ta kiểm tra `AvailableQuantity` cho từng vé.

Điều gì sẽ xảy ra nếu có nhiều request đồng thời mua cùng một vé?

Trường hợp xấu nhất là chúng ta sẽ bị bán quá số vé. Các request đồng thời có thể thấy còn vé và đều hoàn tất việc thanh toán.

Vậy, chúng ta giải quyết vấn đề này như thế nào?

## Raw SQL Giải Cứu!

Vì EF Core không hỗ trợ `Pessimistic Locking` (khóa bi quan) trực tiếp, chúng ta sẽ dùng một chút SQL raw (old but gold). Ta sẽ thay `GetAsync` bằng `GetWithLockAsync`:

```c#
public async Task<TicketType> GetWithLockAsync(Guid id)
{
    return await context
        .TicketTypes
        .FromSql($@"
            SELECT id, event_id, name, price, currency, quantity
            FROM ticketing.ticket_types
            WHERE id = {id}
            FOR UPDATE NOWAIT") // PostgreSQL: khóa hoặc báo lỗi ngay
        .SingleAsync();
}
```

Understanding the magic:

- `FOR UPDATE NOWAIT`: Đây chính là "trái tim" của cơ chế khóa bi quan (pessimistic locking) trong PostgreSQL. Câu lệnh này yêu cầu cơ sở dữ liệu "khóa hàng này ngay lập tức, nếu không được thì báo lỗi luôn."

- Xử lý lỗi: Ta nên bọc `GetWithLockAsync` trong try-catch để xử lý khi không lấy được khóa (có thể retry hoặc thông báo cho người dùng).

Vì EF Core không hỗ trợ sẵn cơ chế thêm query hint, nên chúng ta buộc phải viết các raw SQL queries. Cụ thể, chúng ta có thể dùng lệnh `SELECT` `FOR` `UPDATE` của PostgreSQL để lấy row-level lock trên các dòng được chọn. Bất kỳ transaction nào khác muốn truy cập vào các dòng này sẽ bị chặn cho đến khi transaction hiện tại giải phóng khóa. Đây là một cách rất đơn giản để triển khai `Pessimistic Locking` (khóa bi quan).

## Các biến thể của cơ chế khóa và khi nào nên sử dụng chúng

Để tránh việc một thao tác phải chờ các transaction khác giải phóng các row đã bị khóa, bạn có thể kết hợp `FOR` `UPDATE` với:

- `NO WAIT` – Báo lỗi ngay nếu không thể khóa được hàng, thay vì chờ đợi.
- `SKIP LOCKED` – Bỏ qua các hàng không thể khóa được.

Việc bỏ qua các hàng bị khóa (`SKIP LOCKED`) đi kèm với một cảnh báo - Bạn sẽ nhận được kết quả không nhất quán từ cơ sở dữ liệu. Tuy nhiên, điều này lại rất hữu ích trong các tình huống cần tránh xung đột khóa, ví dụ khi nhiều `process` (tiến trình) cùng truy cập vào một bảng có cấu trúc giống như hàng đợi (queue). Một ví dụ điển hình cho trường hợp này là khi bạn triển khai `Outbox pattern`.

Với SQL Server: Bạn có thể sử dụng query hint `WITH (UPDLOCK, READPAST)` để đạt được hiệu ứng tương tự.

## Pessimistic Locking vs. Serializable Transactions

`Serializable Transactions` cung cấp mức độ nhất quán dữ liệu cao nhất. Chúng đảm bảo rằng tất cả các giao dịch được thực hiện như thể chúng xảy ra theo một thứ tự nghiêm ngặt, tuần tự, ngay cả khi chúng xảy ra đồng thời. Điều này loại bỏ khả năng xảy ra các bất thường như `dirty reads` (xem uncommitted data) hoặc `non-repeatable reads` (dữ liệu thay đổi giữa các lần đọc).

Dưới đây là cách nó hoạt động:

- Khi một transaction bắt đầu dưới mức độ cô lập Serializable, cơ sở dữ liệu sẽ khóa tất cả dữ liệu mà transaction đó có thể truy cập.
- Các khóa này sẽ được giữ cho đến khi transaction được comited hoặc bị rollback.
- Bất kỳ transaction nào khác cố gắng truy cập dữ liệu bị khóa sẽ bị chặn cho đến khi transaction đầu tiên giải phóng các khóa.

Mặc dù giao dịch Serializable cung cấp sự cô lập tuyệt đối, nhưng chúng đi kèm với chi phí đáng kể:

- Hiệu suất: Việc khóa một lượng lớn dữ liệu có thể ảnh hưởng nghiêm trọng đến hiệu suất, đặc biệt là trong các tình huống có độ đồng thời cao.
- `Deadlock` (mắc kẹt giữa các giao dịch): Khi có quá nhiều khóa, khả năng xảy ra `deadlock` sẽ cao hơn. `Deadlock` xảy ra khi hai hoặc nhiều transaction đang chờ các khóa mà transaction còn lại giữ, tạo ra một tình trạng đình trệ.

`Pessimistic locking` (khóa tiêu cực) với câu lệnh `SELECT` `FOR` `UPDATE` cung cấp một cách tiếp cận có mục tiêu hơn đối với việc `data isolation` (cô lập dữ liệu). Bạn sẽ khóa các row cụ thể mà bạn cần thay đổi. Các transaction khác cố gắng truy cập các row bị khóa sẽ bị chặn cho đến khi khóa được giải phóng.

Bằng cách chỉ khóa những dữ liệu cần thiết, `pessimistic locking` (khóa tiêu cực) tránh được chi phí hiệu suất liên quan đến việc khóa tất cả mọi thứ. Vì bạn chỉ khóa những tài nguyên cần thiết, khả năng xảy ra deadlock cũng thấp hơn.
