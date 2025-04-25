---
id: fast-bulk-inserts
title: Chèn Dữ Liệu SQL Nhanh Chóng Với C# và EF Core
---

# Chèn Dữ Liệu SQL Nhanh Chóng Với C# và EF Core

Nguồn: Bài viết "Fast SQL Bulk Inserts With C# and EF Core" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/fast-sql-bulk-inserts-with-csharp-and-ef-core)

Dù bạn đang xây dựng một nền tảng phân tích dữ liệu, chuyển đổi từ hệ thống legacy, hay chuẩn bị tiếp nhận một lượng lớn người dùng mới, sẽ có lúc bạn cần thực hiện thao tác insert một lượng lớn dữ liệu vào database.

Chèn từng bản ghi một giống như đang `watching paint dry in slow motion` (xem sơn khô trong chuyển động chậm).Các phương pháp truyền thống sẽ không đủ nhanh trong trường hợp này.

Vì vậy, việc nắm vững các kỹ thuật `bulk insert` (Chèn Dữ Liệu) hiệu suất cao bằng C# và EF Core là điều cần thiết.

Trong bài viết hôm nay, chúng ta sẽ khám phá một số lựa chọn để thực hiện `bulk insert` trong C#:

- Dapper

- EF Core

- EF Core Bulk Extensions

- SQL Bulk Copy

Đây không phải là danh sách đầy đủ các cách triển khai `bulk insert`. Vẫn còn một vài tùy chọn khác chưa được đề cập, chẳng hạn như `manully generating SQL statements` (tự tạo các câu lệnh SQL thủ công) hoặc sử dụng `Table-Valued Parameters`.

Các ví dụ sẽ dựa trên một `User` class tương ứng với bảng `Users` trong SQL Server.

```
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
}
```

## Cách Tiếp Cận Đơn Giản Với EF Core

Hãy bắt đầu với một ví dụ đơn giản sử dụng EF Core.

Chúng ta tạo một instance của `ApplicationDbContext`, thêm đối tượng `User`, và gọi `SaveChangesAsync`.
Cách này sẽ insert từng bản ghi vào cơ sở dữ liệu một cách tuần tự. Nói cách khác, mỗi bản ghi sẽ cần một `round trip` (chuyến đi – về) tới database.

```
using var context = new ApplicationDbContext();

foreach (var user in GetUsers())
{
    context.Users.Add(user);

    await context.SaveChangesAsync();
}
```

Kết quả rất kém hiệu quả như bạn dự đoán:

- Thêm từng bản ghi và lưu, với 100 users: ~20 ms

- Thêm từng bản ghi và lưu, với 1.000 users: ~260 ms

- Thêm từng bản ghi và lưu, với 10.000 users: ~8.860 ms

Tôi đã bỏ qua kết quả với 100.000 và 1.000.000 bản ghi vì thời gian thực thi quá lâu.

Chúng ta sẽ sử dụng kết quả này như một ví dụ cho “cách không nên làm với bulk insert”.

## Dapper – Chèn Dữ Liệu Đơn Giản

Dapper là một `SQL-to-object mapper` đơn giản cho nền tảng .NET. Nó cho phép chúng ta dễ dàng insert một tập hợp các đối tượng vào cơ sở dữ liệu.

Ở đây, tôi sử dụng tính năng của Dapper - “unwrap” (giải nén) một collection thành các câu lệnh `INSERT` tương ứng.

```
using var connection = new SqlConnection(connectionString);
connection.Open();

const string sql =
    @"
    INSERT INTO Users (Email, FirstName, LastName, PhoneNumber)
    VALUES (@Email, @FirstName, @LastName, @PhoneNumber);
    ";

await connection.ExecuteAsync(sql, GetUsers());
```

Kết quả cải thiện rõ rệt so với ví dụ ban đầu:

- Insert range, với 100 users: ~10 ms

- Insert range, với 1.000 users: ~113 ms

- Insert range, với 10.000 users: ~1.028 ms

- Insert range, với 100.000 users: ~10.916 ms

- Insert range, với 1.000.000 users: ~109.065 ms

## EF Core – Add và Save (Theo Cách Tốt Hơn)

Tuy nhiên, EF Core vẫn chưa “chịu thua”. Ví dụ đầu tiên được viết theo cách kém tối ưu một cách có chủ đích. Trên thực tế, EF Core có khả năng `batch` (gom nhóm) nhiều câu lệnh SQL lại với nhau — và chúng ta sẽ tận dụng điều đó.

Nếu chúng ta thực hiện một thay đổi đơn giản, hiệu năng có thể tốt hơn đáng kể. Đầu tiên, chúng ta thêm toàn bộ các đối tượng vào `ApplicationDbContext`. Sau đó, chỉ gọi `SaveChangesAsync` một lần duy nhất.

EF Core sẽ tạo ra các câu lệnh SQL dạng batch — tức là gom nhiều lệnh `INSERT` lại — và gửi chúng cùng lúc tới database. Điều này giúp giảm số lần `round trip` tới database và cải thiện hiệu năng đáng kể.

```
using var context = new ApplicationDbContext();

foreach (var user in GetUsers())
{
    context.Users.Add(user);
}

await context.SaveChangesAsync();
```

Dưới đây là kết quả benchmark cho cách triển khai này:

- Add all và save, với 100 users: ~2 ms

- Add all và save, với 1.000 users: ~18 ms

- Add all và save, với 10.000 users: ~203 ms

- Add all và save, với 100.000 users: ~2.129 ms

- Add all và save, với 1.000.000 users: ~21.557 ms

Hãy nhớ rằng: với Dapper, việc insert 1.000.000 bản ghi mất ~109 giây.

Còn với EF Core và batched queries, ta có thể làm điều đó chỉ trong khoảng ~21 giây.

## EF Core AddRange and Save

Đây là một lựa chọn thay thế cho ví dụ trước. Thay vì gọi `Add` cho từng đối tượng, chúng ta có thể gọi `AddRange` và truyền vào một `collection` (tập hợp).

Tôi muốn trình bày cách triển khai này vì tôi thích nó hơn so với cách làm trước.

```
using var context = new ApplicationDbContext();

context.Users.AddRange(GetUsers());

await context.SaveChangesAsync();
```

Kết quả rất tương tự với ví dụ trước:

- EF Core – Add range và save, với 100 users: ~2 ms

- EF Core – Add range và save, với 1.000 users: ~18 ms

- EF Core – Add range và save, với 10.000 users: ~204 ms

- EF Core – Add range và save, với 100.000 users: ~2.111 ms

- EF Core – Add range và save, với 1.000.000 users: ~21.605 ms

Cách sử dụng `AddRange` giúp mã gọn gàng và dễ quản lý hơn, đồng thời vẫn giữ được hiệu năng tốt

## EF Core – Bulk Extensions

Có một thư viện tuyệt vời gọi là `EF Core Bulk Extensions` mà chúng ta có thể sử dụng để tối ưu hiệu năng hơn nữa. Thư viện này không chỉ hỗ trợ các thao tác `bulk insert`, mà còn nhiều tính năng khác mà bạn có thể khám phá thêm. Thư viện này là mã nguồn mở và có giấy phép cộng đồng miễn phí nếu bạn đáp ứng các tiêu chí sử dụng miễn phí.

Đối với trường hợp của chúng ta, phương thức `BulkInsertAsync` là một lựa chọn tuyệt vời. Chúng ta chỉ cần truyền vào một `collection` các đối tượng, và nó sẽ thực hiện thao tác `bulk insert` bằng SQL.

Hiệu suất cực kỳ ấn tượng:

- EF Core – Bulk Extensions, với 100 users: ~1.9 ms

- EF Core – Bulk Extensions, với 1.000 users: ~8 ms

- EF Core – Bulk Extensions, với 10.000 users: ~76 ms

- EF Core – Bulk Extensions, với 100.000 users: ~742 ms

- EF Core – Bulk Extensions, với 1.000.000 users: ~8.333 ms

Để so sánh, chúng ta đã cần ~21 giây để `insert` 1.000.000 bản ghi với các câu lệnh `batched queries` của EF Core. Tuy nhiên, với thư viện `Bulk Extensions`, chúng ta có thể làm điều đó chỉ trong 8 giây.

## SQL Bulk Copy

Cuối cùng, nếu chúng ta không đạt được hiệu suất mong muốn từ EF Core, chúng ta có thể thử sử dụng `SqlBulkCopy`. SQL Server hỗ trợ các thao tác `bulk copy` (sao chép hàng loạt) một cách tự nhiên, vì vậy chúng ta sẽ sử dụng tính năng này.

Cách triển khai này có phần phức tạp hơn so với các ví dụ sử dụng EF Core. Chúng ta cần cấu hình một instance của `SqlBulkCopy` và tạo một `DataTable` chứa các đối tượng mà chúng ta muốn insert.

```
using var bulkCopy = new SqlBulkCopy(ConnectionString);

bulkCopy.DestinationTableName = "dbo.Users";

bulkCopy.ColumnMappings.Add(nameof(User.Email), "Email");
bulkCopy.ColumnMappings.Add(nameof(User.FirstName), "FirstName");
bulkCopy.ColumnMappings.Add(nameof(User.LastName), "LastName");
bulkCopy.ColumnMappings.Add(nameof(User.PhoneNumber), "PhoneNumber");

await bulkCopy.WriteToServerAsync(GetUsersDataTable());
```

Tuy nhiên, hiệu suất là cực kỳ nhanh:

- SQL Bulk Copy, với 100 users: ~1.7 ms

- SQL Bulk Copy, với 1.000 users: ~7 ms

- SQL Bulk Copy, với 10.000 users: ~68 ms

- SQL Bulk Copy, với 100.000 users: ~646 ms

- SQL Bulk Copy, với 1.000.000 users: ~7.339 ms

Dưới đây là cách bạn có thể tạo một `DataTable` và điền dữ liệu vào nó từ một danh sách các đối tượng:

```
DataTable GetUsersDataTable()
{
    var dataTable = new DataTable();

    dataTable.Columns.Add(nameof(User.Email), typeof(string));
    dataTable.Columns.Add(nameof(User.FirstName), typeof(string));
    dataTable.Columns.Add(nameof(User.LastName), typeof(string));
    dataTable.Columns.Add(nameof(User.PhoneNumber), typeof(string));

    foreach (var user in GetUsers())
    {
        dataTable.Rows.Add(
            user.Email, user.FirstName, user.LastName, user.PhoneNumber);
    }

    return dataTable;
}
```

## Kết quả

Dưới đây là kết quả cho tất cả các phương pháp `bulk insert`:

| Bản ghi   | EF_OneByOne  | Dapper_Insert  | EF_AddAll     | EF_AddRange   | BulkExtensions | BulkCopy     |
| --------- | ------------ | -------------- | ------------- | ------------- | -------------- | ------------ |
| 100       | 19.800 ms    | 10.650 ms      | 2.064 ms      | 2.035 ms      | 1.922 ms       | 1.721 ms     |
| 1,000     | 259.870 ms   | 113.137 ms     | 17.906 ms     | 17.857 ms     | 7.943 ms       | 7.380 ms     |
| 10,000    | 8,860.790 ms | 1,027.979 ms   | 202.975 ms    | 204.029 ms    | 76.406 ms      | 68.364 ms    |
| 100,000   | N/A          | 10,916.628 ms  | 2,129.370 ms  | 2,111.106 ms  | 742.325 ms     | 646.219 ms   |
| 1,000,000 | N/A          | 109,064.815 ms | 21,557.136 ms | 21,605.668 ms | 8,333.950 ms   | 7,339.298 ms |

## Kết luận

`SqlBulkCopy` giành ngôi vị quán quân về tốc độ thuần túy. Tuy nhiên, `EF Core Bulk Extensions` mang lại hiệu suất tuyệt vời trong khi vẫn duy trì sự dễ sử dụng mà Entity Framework Core nổi tiếng.

Lựa chọn tốt nhất phụ thuộc vào yêu cầu cụ thể của dự án của bạn:

- Nếu hiệu suất là yếu tố quan trọng nhất, `SqlBulkCopy` là giải pháp cho bạn.

- Nếu bạn cần tốc độ tuyệt vời và phát triển mượt mà, EF Core là lựa chọn thông minh.

Cuối cùng, tôi để bạn quyết định phương án nào phù hợp nhất với trường hợp của bạn.

Hy vọng bài viết này hữu ích.
