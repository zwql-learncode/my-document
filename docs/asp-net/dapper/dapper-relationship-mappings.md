---
id: dapper-relationship-mappings
title: Làm chủ Dapper Relationship Mappings
---

# Làm chủ Dapper Relationship Mappings

Nguồn: Bài viết "Mastering Dapper Relationship Mappings" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/mastering-dapper-relationship-mappings)

Dapper là một lightweight ORM trong .NET. Nó trở nên phổ biến vì vừa dễ sử dụng vừa có tốc độ rất nhanh.

Dapper extend interface `IDbConnection` bằng cách cung cấp thêm các phương thức để gửi truy vấn SQL đến cơ sở dữ liệu.

Tuy nhiên, do tính chất của SQL, việc mapping kết quả trả về thành `object model` (mô hình đối tượng) đôi khi có thể khá phức tạp.

Vì vậy, trong bản tin tuần này, tôi sẽ hướng dẫn bạn cách mapping:

- Các truy vấn đơn giản
- Mối quan hệ một-một
- Mối quan hệ một-nhiều
- Mối quan hệ nhiều-nhiều

## Simple Mapping (Ánh xạ đơn giản)

Trước tiên, hãy xem cách thực hiện mapping đơn giản bằng Dapper.

Việc viết một truy vấn với Dapper gồm ba bước:

- Tạo một instance của `IDbConnection`
- Viết truy vấn SQL
- Gọi một phương thức mà Dapper cung cấp

Chúng ta sẽ viết một SQL query để tải danh sách các đối tượng `LineItem` cho một `Order` cụ thể.

```c#
public class LineItem
{
    public long LineItemId { get; init; }

    public long OrderId { get; init; }

    public decimal Price { get; init; }

    public string Currency { get; init; }

    public decimal Quantity { get; init; }
}
```

Dưới đây là SQL query trả về kết quả mà chúng ta cần:

```sql
SELECT Id AS LineItemId, OrderId, Price, Currency, Quantity
FROM LineItems
WHERE OrderId = @OrderId
```

Tôi đang truyền tham số cho định danh (identifier) của `Order` bằng cú pháp `@OrderId`. Đây là quy ước của Dapper. Điều quan trọng là bạn phải sử dụng các `parameterized queries` (truy vấn có tham số hóa) để tránh các cuộc tấn công `SQL injection`.

Việc ánh xạ trong trường hợp này rất đơn giản vì chúng ta chỉ trả về một loại đối tượng từ cơ sở dữ liệu.

Chúng ta sẽ gọi phương thức `QueryAsync` và chỉ định `LineItem` làm kiểu trả về. Hãy đảm bảo rằng bạn truyền đầy đủ các đối số cho phương thức này: SQL query và tham số `OrderId`. Tôi ưu tiên tạo các `anonymous objects` (đối tượng ẩn danh) khi truyền tham số cho Dapper.

```c#
using var connection = new SqlConnection();

var lineItems = await connection.QueryAsync<LineItem>(
    sql,
    new { OrderId = orderId });

```

Vậy là bạn đã có mọi thứ cần thiết để thực hiện một mapping đơn giản.

## Mapping 1-1 trong Dapper

Vậy nếu đối tượng mà chúng ta muốn trả về từ SQL query lại chứa một đối tượng lồng bên trong thì sao?

Dưới đây là kiểu `LineItem` đã được cập nhật để chứa thêm một `Product` bên trong:

```c#
public class LineItem
{
    public long LineItemId { get; init; }

    public long OrderId { get; init; }

    public decimal Price { get; init; }

    public string Currency { get; init; }

    public decimal Quantity { get; init; }

    public Product Product { get; init; }
}

public class Product
{
    public long ProductId { get; init; }

    public string Name { get; init; }
}

```

Bây giờ, bạn cần trả về hai loại đối tượng trong cùng một truy vấn.

Dưới đây là SQL query đã được cập nhật, với phép JOIN bảng Products:

```sql
SELECT li.Id AS LineItemId, li.OrderId, li.Price, li.Currency, li.Quantity,
       p.Id AS ProductId, p.Name
FROM LineItems li
JOIN Products p ON p.Id = li.ProductId
WHERE li.OrderId = @OrderId
```

Truy vấn này phức tạp hơn vì chúng ta cần sử dụng tính năng multi-mapping của Dapper.

Trong phương thức `QueryAsync`, ta chỉ định cả `LineItem` và `Product` làm các kiểu dữ liệu trung gian, và `LineItem` là kiểu dữ liệu cuối cùng mà phương thức sẽ trả về.

Chúng ta cũng phải chỉ dẫn cho Dapper cách mapping `LineItem` và `Product` từ kết quả truy vấn thành một đối tượng `LineItem` duy nhất.

Ngoài ra, chúng ta cần truyền thêm đối số `splitOn`, cho Dapper biết cột nào đánh dấu sự chuyển từ đối tượng `LineItem` sang `Product`.

```c#
using var connection = new SqlConnection();

var lineItems = await connection.QueryAsync<LineItem, Product, LineItem>(
    sql,
    (lineItem, product) =>
    {
        lineItem.Product = product;

        return lineItem;
    },
    new { OrderId = orderId },
    splitOn: "ProductId");
```

Chúng ta phải viết thêm một chút mã để làm việc này, nhưng nó cũng không quá khó để bạn có thể nắm bắt.

## Mapping 1-Nhiều trong Dapper

Một tình huống thường gặp khác là ánh xạ quan hệ một-nhiều từ SQL vào object model.

Bởi vì bạn đang JOIN hai bảng, kết quả trả về sẽ chứa dữ liệu bị trùng lặp ở phía "một" của mối quan hệ.

Trong ví dụ này, chúng ta sẽ dùng một `Order` với danh sách các `LineItem`.

```c#
public class Order
{
    public long OrderId { get; init; }

    public List<LineItem> LineItems { get; init; } = new();
}

public class LineItem
{
    public long LineItemId { get; init; }

    public long OrderId { get; init; }

    public decimal Price { get; init; }

    public string Currency { get; init; }

    public decimal Quantity { get; init; }
}
```

Dưới đây là câu truy vấn SQL trả về dữ liệu cần thiết từ cơ sở dữ liệu:

```sql
SELECT o.Id AS OrderId,
       li.Id AS LineItemId, li.OrderId, li.Price, li.Currency, li.Quantity
FROM Orders o
JOIN LineItems li ON li.OrderId = o.Id
WHERE o.Id = @OrderId
```

Chúng ta sẽ nhận về dữ liệu `Order` bị trùng lặp do phép JOIN. Nhưng mục tiêu chỉ là trả về một đối tượng `Order` duy nhất kèm theo toàn bộ các `LineItem` liên quan.

Hàm ánh xạ trong Dapper sẽ chỉ đưa cho chúng ta `Order` và `LineItem` tương ứng với từng dòng của tập kết quả.

Một cách để giải quyết vấn đề này là dùng một Dictionary để lưu trữ `Order` và tái sử dụng nó trong quá trình mapping:

- Nếu Order chưa có trong Dictionary, ta thêm nó vào.
- Nếu đã có, ta chỉ cần thêm `LineItem` mới vào danh sách `LineItems` của `Order` đã tồn tại.

```c#
using var connection = new SqlConnection();

var ordersDictionary = new Dictionary<long, Order>();

await connection.QueryAsync<Order, LineItem, Order>(
    sql,
    (order, lineItem) =>
    {
        if (ordersDictionary.TryGetValue(order.OrderId, out var existingOrder))
        {
            order = existingOrder;
        }
        else
        {
            ordersDictionary.Add(order.OrderId, order);
        }

        order.LineItems.Add(lineItem);

        return order;
    },
    new { OrderId = orderId },
    splitOn: "LineItemId");

var mappedOrder = ordersDictionary[orderId];
```

Nếu ánh xạ quan hệ nhiều-nhiều, bạn cũng sẽ áp dụng ý tưởng tương tự, chỉ khác là bạn sẽ cần hai Dictionary, mỗi cái cho một phía của mối quan hệ.

## Tổng kết

Dapper là một thư viện tuyệt vời để viết các database queries nhanh chóng bằng SQL.

Tuy nhiên, do cách thức hoạt động của SQL, việc ánh xạ dữ liệu thành object model đôi khi lại trở nên phức tạp.

Có 4 tình huống thường gặp:

- Mapping đơn giản – cấu trúc phẳng, ánh xạ trực tiếp từ SQL vào đối tượng.

- Mapping một-một – cung cấp một mapping function để kết nối hai đối tượng.

- Mapping một-nhiều – quản lý một Dictionary cho phía "một" của mối quan hệ.

- Mapping nhiều-nhiều – tương tự như một-nhiều, nhưng bạn cần một Dictionary cho cả hai phía của mối quan hệ.

Giờ đây bạn đã có một cheat sheet để mapping các mối quan hệ với Dapper.

Hy vọng nội dung này hữu ích cho bạn.
