---
id: query-splitting
title: Query Splitting
---

# Cách Cải Thiện Hiệu Năng Với EF Core Query Splitting

Nguồn: Bài viết "How To Improve Performance With EF Core Query Splitting" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/how-to-improve-performance-with-ef-core-query-splitting)

Gần đây tôi đã gặp một vấn đề với Entity Framework Core.

Truy vấn mà tôi đang thực hiện liên tục bị timeout.

Tôi đã thử scale up application server, và nó không có tác dụng.

Tôi cũng thử scale up the database serve, vẫn không giải quyết được.

Vậy tôi đã giải quyết vấn đề này như thế nào?

## Vấn Đề Của Truy Vấn Là Gì?

Tôi đang làm việc trên một ứng dụng thuộc lĩnh vực thương mại điện tử — cụ thể là hệ thống quản lý đơn hàng cho một nhà sản xuất tủ bếp.

Bảng mà tôi truy vấn thường xuyên là bảng `Orders`. Mỗi `Order` có thể có một hoặc nhiều `LineItems`. Một đơn hàng thông thường chứa khoảng 50 `LineItems`. Ngoài ra, mỗi `LineItem` còn có bảng phụ liên kết là `LineItemDimensions`.

Dưới đây là truy vấn tôi đang cố gắng thực hiện:

```c#
dbContext
    .Orders
    .Include(order => order.LineItems)
    .ThenInclude(lineItem => lineItem.Dimensions)
    .First(order => order.Id == orderId);
```

Khi EF Core chuyển truy vấn trên thành SQL, nó sẽ tạo ra truy vấn như sau:

```sql
SELECT o.*, li.*, d.*
FROM Orders o
LEFT JOIN LineItems li ON li.OrderId = o.Id
LEFT JOIN LineItemDimensions d ON d.LineItemId = li.Id
WHERE o.Id = @orderId
ORDER BY o.Id, li.Id, d.Id;
```

Thông thường, truy vấn này sẽ chạy bình thường.

Tuy nhiên, trong trường hợp của tôi, tôi gặp vấn đề gọi là `Cartesian Explosion` — nguyên nhân chính là do phép JOIN đến bảng `LineItemDimensions`. Đây chính là lý do khiến truy vấn bị lỗi và bị timeout.

## Query Splitting Giải Cứu

BKể từ EF Core 5.0, chúng ta có một tính năng mới gọi là Query Splitting. Tính năng này cho phép chúng ta tách một truy vấn LINQ ra thành nhiều truy vấn SQL riêng biệt.

Để sử dụng, bạn chỉ cần gọi phương thức `AsSplitQuery()`:

```c#
dbContext
    .Orders
    .Include(order => order.LineItems)
    .ThenInclude(lineItem => lineItem.Dimensions)
    .AsSplitQuery()
    .First(order => order.Id == orderId);
```

Trong trường hợp này, EF Core sẽ sinh ra các truy vấn SQL riêng biệt như sau:

```sql
SELECT o.*
FROM Orders o
WHERE o.Id = @orderId;

SELECT li.*
FROM LineItems li
JOIN Orders o ON li.OrderId = o.Id
WHERE o.Id = @orderId;

SELECT d.*
FROM LineItemDimensions d
JOIN LineItems li ON d.LineItemId = li.Id
JOIN Orders o ON li.OrderId = o.Id
WHERE o.Id = @orderId;
```

Lưu ý rằng mỗi lệnh `Include` sẽ tương ứng với một truy vấn SQL riêng biệt. Lợi ích ở đây là không có `duplicated` (dữ liệu bị nhân bản) như trong truy vấn kết hợp ban đầu.

## Bật Query Splitting Mặc Định Cho Mọi Truy Vấn

Bạn có thể cấu hình để bật Query Splitting ở mức toàn cục trong DbContext. Khi cấu hình DbContext, hãy thêm:

```c#
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        "CHUỖI_KẾT_NỐI",
        o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));
```

Việc này sẽ khiến tất cả các truy vấn được EF Core tạo ra sử dụng chế độ Split Query. Nếu bạn muốn quay lại cách truy vấn gộp như cũ, chỉ cần gọi `AsSingleQuery()`:

```c#
dbContext
    .Orders
    .Include(o => o.LineItems)
    .ThenInclude(li => li.Dimensions)
    .AsSingleQuery()
    .First(o => o.Id == orderId);
```

## Một Số Lưu Ý Khi Dùng Query Splitting

Mặc dù Query Splitting là một tính năng rất hữu ích trong EF Core, bạn vẫn nên lưu ý một số điều:

Không có đảm bảo về tính nhất quán dữ liệu giữa các truy vấn SQL riêng biệt. Điều này có thể trở thành vấn đề nếu trong lúc bạn đang đọc dữ liệu thì có một tiến trình khác đang cập nhật cùng dữ liệu đó. Giải pháp là bọc các truy vấn trong một transaction, nhưng điều này có thể gây ảnh hưởng hiệu năng ở nơi khác.

Mỗi truy vấn riêng biệt sẽ cần một lần kết nối đến cơ sở dữ liệu. Nếu độ trễ kết nối cao, điều này có thể ảnh hưởng đến hiệu năng tổng thể.

Bây giờ bạn đã được trang bị kiến ​​thức này, hãy thực hiện truy vấn EF nhanh hơn nhé!
