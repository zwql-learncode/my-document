---
id: query-filters
title: Query Filters
---

# Cách Sử Dụng Global Query Filters trong EF Core

Nguồn: Bài viết "Understanding Cursor Pagination and Why It's So Fast (Deep Dive)" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/understanding-cursor-pagination-and-why-its-so-fast-deep-dive)

Trong bản tin tuần này, tôi sẽ hướng dẫn bạn cách loại bỏ các điều kiện truy vấn lặp đi lặp lại trong EF Core.

## Những truy vấn nào phù hợp với cách làm này?

Một ví dụ phổ biến là khi bạn triển khai tính năng soft delete, bạn phải kiểm tra xem một bản ghi đã bị soft delete hay chưa trong mọi truy vấn.

Ngoài ra, tính năng này cũng rất hữu ích nếu bạn đang làm việc trong hệ thống multi-tenant, cần chỉ định `tenantId` trong mọi truy vấn.

EF Core cung cấp một tính năng mạnh mẽ giúp bạn loại bỏ các điều kiện lặp lại này.

Tối đang nói về Query Filters.

Hãy cùng xem cách triển khai.

## Cách triển khai Query Filters

Trước khi giới thiệu về Query Filters, hãy xem cách làm thông thường.

Giả sử bạn có bảng Orders hỗ trợ soft delete, và bạn không bao giờ muốn trả về những đơn hàng đã bị xóa.

Ta bắt đầu với entity `Order` có thuộc tính `IsDeleted`:

```c#
public class Order
{
   public int Id { get; set; }
   public bool IsDeleted { get; set; }
}
```

Yêu cầu nghiệp vụ là chỉ truy vấn những đơn hàng chưa bị xóa.

Truy vấn EF thông thường có thể viết như sau:

```c#
var orders = dbContext
                .Orders
                .Where(order => !order.IsDeleted)
                .Where(order => order.Id == orderId)
                .FirstOrDefault();
```

Truy vấn này hoàn toàn chính xác cho nhu cầu.

Tuy nhiên, bạn phải nhớ thêm điều kiện `!order.IsDeleted` mỗi lần truy vấn Order.

Giờ ta sẽ định nghĩa một Query Filter để tự động thêm điều kiện đó vào mọi truy vấn đến bảng `Orders`.

Trong phương thức `OnModelCreating` trong database context, ta cần gọi phương thức `HasQueryFilter` và chỉ định biểu thức chúng ta muốn:

```c#
modelBuilder
   .Entity<Order>()
   .HasQueryFilter(order => !order.IsDeleted);
```

Sau đó bạn có thể bỏ điều kiện !order.IsDeleted trong truy vấn như sau:

```c#
dbContext
   .Orders
   .Where(order => order.Id == orderId)
   .FirstOrDefault();
```

EF sẽ tự sinh ra SQL như sau:

```sql
SELECT o.*
FROM Orders o
WHERE o.IsDeleted = FALSE AND o.Id = @orderId
```

## Tắt Query Filters

Bạn có thể gặp phải tình huống cần vô hiệu hóa Query Filters cho một truy vấn cụ thể. May mắn thay, có một cách dễ dàng để thực hiện việc này.

Trong biểu thức LINQ của bạn, cần gọi phương thức `IgnoreQueryFilters` và tất cả Query Filters được định cấu hình cho entity này sẽ bị vô hiệu hóa:

```c#
dbContext
   .Orders
   .IgnoreQueryFilters()
   .Where(order => order.Id == orderId)
   .FirstOrDefault();
```

Hãy cẩn thận khi thực hiện việc này, vì có thể dẫn đến những hành vi không mong muốn trong ứng dụng.

## Những Điều Nên Biết Trước Khi Sử Dụng Query Filters

Dưới đây là một vài chi tiết bổ sung mà bạn nên biết trước khi sử dụng Query Filters. Hy vọng chúng sẽ giúp bạn tránh được rắc rối khi áp dụng tính năng này vào ứng dụng của mình.

### Cấu hình nhiều Query Filter

Nếu bạn cấu hình nhiều Query Filter cho cùng một thực thể, chỉ điều kiện cuối cùng sẽ được áp dụng. Nếu bạn cần nhiều điều kiện, hãy kết hợp chúng bằng toán tử logic `&&`.

### Bỏ qua một phần trong Query Filter

Nếu bạn muốn bỏ qua một biểu thức cụ thể trong Query Filter và giữ lại các điều kiện khác, thật tiếc là bạn không thể làm điều đó. Mỗi thực thể chỉ được phép có một Query Filter duy nhất.

Một giải pháp khả thi là gọi `IgnoreQueryFilters()`, điều này sẽ loại bỏ toàn bộ Query Filter đã cấu hình cho thực thể đó. Sau đó, bạn có thể thêm thủ công các điều kiện cần thiết trong truy vấn cụ thể mà bạn đang thực hiện.
