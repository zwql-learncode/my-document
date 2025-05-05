---
id: sql-server-connection-pooling
title: SQL Server connection pooling
---

# SQL Server connection pooling

Nguồn: Bài viết "SQL Server connection pooling" của [Microsoft](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling)

Kết nối đến một database server thường bao gồm nhiều bước tốn thời gian. Một `physical channel` (kênh vật lý) chẳng hạn như socket hoặc named pipe, cần được thiết lập, quá trình bắt tay ban đầu với máy chủ phải được thực hiện, thông tin connection string phải được parsed, kết nối phải được xác thực bởi máy chủ, các kiểm tra phải được thực hiện để đăng ký giao dịch hiện tại, và vân vân.

Trên thực tế, hầu hết các ứng dụng chỉ sử dụng một hoặc một vài cấu hình kết nối khác nhau. Điều này có nghĩa là trong quá trình thực thi ứng dụng, nhiều kết nối giống hệt nhau sẽ được mở và đóng lại nhiều lần. Để giảm thiểu chi phí mở kết nối, ADO.NET sử dụng một kỹ thuật tối ưu hóa gọi là `connection pooling` (Hồ kết nối).

`Connection pooling` giúp giảm số lần cần mở kết nối mới. `Pooler` (quản lý hồ kết nối) duy trì quyền sở hữu của kết nối vật lý. Nó quản lý các kết nối bằng cách duy trì một bộ kết nối hoạt động cho mỗi `connection configuration` cụ thể. Mỗi khi người dùng gọi phương thức `Open` trên một kết nối, `Pooler` sẽ tìm một kết nối có sẵn trong `connection pooling`. Nếu pool đã có sẵn một kết nối (connection), nó sẽ trả lại kết nối đó thay vì mở một kết nối mới.Khi ứng dụng gọi phương thức `Close` trên kết nối, pooler sẽ trả lại connection vào pool thay vì đóng nó. Khi connection được trả lại vào pool, nó sẵn sàng để tái sử dụng khi có yêu cầu `Open` tiếp theo.

Chỉ các kết nối có cùng configuration mới có thể được đưa vào pool. ADO.NET giữ pool đồng thời, mỗi pool dành cho một configuration. Các configuration được phân tách vào các pool theo connection string, và theo `Windows identity` khi sử dụng bảo mật tích hợp (integrated security). Các connection cũng được phân loại vào pool dựa trên việc chúng có tham gia vào transaction hay không. Khi sử dụng `ChangePassword`, instance `SqlCredential` ảnh hưởng đến `connection pool`. Các instances khác nhau của `SqlCredential` sẽ sử dụng các `connection pool` khác nhau, ngay cả khi user ID và password giống nhau.

`Connection pooling` có thể nâng cao đáng kể hiệu suất và khả năng mở rộng của ứng dụng. Mặc định, `connection pooling` được kích hoạt trong ADO.NET. Trừ khi bạn tắt nó một cách rõ ràng, `Pooler` sẽ tối ưu hóa các kết nối khi chúng được mở và đóng trong ứng dụng của bạn. Bạn cũng có thể cung cấp một số Connection String Keywords để điều khiển hành vi của `connection pooling`.

## Tạo và phân bổ Pool

Khi một kết nối được mở lần đầu tiên, một connection pool sẽ được tạo ra dựa trên thuật toán exact matching, liên kết `pool` với `connection string` trong kết nối đó. Mỗi `connection pool` được liên kết với một `connection string` riêng biệt. Khi một kết nối mới được mở, nếu `connection string` không khớp chính xác với một hồ kết nối hiện có, một pool mới sẽ được tạo ra. Các connection được phân bổ (pooled) với mỗi processt (tiến trình), application domain, connection string hay khi integrated security (bảo mật tích hợp) được sử dụng, hay theo Windows identity. `Connection string` phải hoàn toàn khớp; các từ khóa được cung cấp theo thứ tự khác nhau cho cùng một kết nối sẽ tạo ra các pool riêng biệt.

Trong ví dụ C# sau, ba đối tượng SqlConnection mới được tạo ra, nhưng chỉ cần hai hồ kết nối để quản lý chúng. Lưu ý rằng chuỗi kết nối thứ nhất và thứ hai khác nhau ở giá trị được gán cho `Initial Catalog`.

```c#
using (SqlConnection connection = new SqlConnection(
  "Integrated Security=SSPI;Initial Catalog=Northwind"))
{
    connection.Open();
    // Pool A được tạo ra.
}

using (SqlConnection connection = new SqlConnection(
  "Integrated Security=SSPI;Initial Catalog=pubs"))
{
    connection.Open();
    // Pool B được tạo ra vì connection string khác nhau.
}

using (SqlConnection connection = new SqlConnection(
  "Integrated Security=SSPI;Initial Catalog=Northwind"))
{
    connection.Open();
    // connection string khớp với pool A.
}

```

Nếu `Min Pool Size` không được chỉ định trong connection string hoặc được chỉ định là số 0, các kết nối trong pool sẽ bị đóng sau một thời gian không hoạt động. Tuy nhiên, nếu `Min Pool Size` được chỉ định lớn hơn 0, connection pool sẽ không bị hủy cho đến khi `AppDomain` bị unload và tiến trình (process) kết thúc. Việc duy trì các pool không hoạt động hoặc trống chỉ tiêu tốn một ít tài nguyên hệ thống.

Chú ý: `Connection pool` sẽ tự động được dọn sạch khi một lỗi nghiêm trọng xảy ra, chẳng hạn như khi xảy ra failover.

## Thêm kết nối

Một `connection pool` được tạo ra cho một connection string duy nhất. Khi một `connection pool` được tạo, nhiều đối tượng kết nối sẽ được tạo ra và thêm vào pool để đáp ứng yêu cầu kích thước pool tối thiểu. Các kết nối được thêm vào pool khi cần thiết, lên đến kích thước tối đa của `connection pool` được chỉ định (mặc định là 100). Các kết nối sẽ được trả lại vào pool khi chúng bị close hoặc dispose.

Khi một đối tượng `SqlConnection` được yêu cầu, nó sẽ được lấy từ pool nếu có kết nối sử dụng được. Để có thể sử dụng được, một kết nối phải chưa được sử dụng, có transaction context phù hợp hoặc không liên kết với bất kỳ transaction context nào, và phải có liên kết hợp lệ với máy chủ.

`Pooler` sẽ thỏa mãn các yêu cầu kết nối bằng cách tái phân bổ kết nối khi chúng được trả lại vào pool. Nếu kích thước `connection pool` đã đạt tối đa và không có kết nối nào có thể sử dụng được, yêu cầu sẽ bị queue (xếp hàng). `Pooler` sau đó sẽ cố gắng thu hồi bất kỳ kết nối nào cho đến khi thời gian chờ (timeout) được đáp ứng (mặc định là 15 giây). Nếu `pooler` không thể thỏa mãn yêu cầu trước khi kết nối hết thời gian chờ, một ngoại lệ sẽ được ném ra.

Cảnh báo:
Chúng tôi khuyến nghị bạn luôn close kết nối khi không sử dụng nó để kết nối sẽ được trả lại pool. Bạn có thể làm điều này bằng cách sử dụng phương thức `Close` hoặc `Dispose` của đối tượng `Connectio`n, hoặc bằng cách mở tất cả kết nối trong một câu lệnh `using` trong C#, hoặc `Using` trong Visual Basic. Các kết nối không được đóng rõ ràng có thể không được thêm hoặc trả lại vào `connection pool`. Để biết thêm thông tin, xem [using statement](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using) hoặc [How to: Dispose of a System Resource (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/control-flow/how-to-dispose-of-a-system-resource)

## Xoá kết nối

`Pooler` sẽ xoá một kết nối khỏi pool sau khi nó không hoạt động trong khoảng 4–8 phút, hoặc nếu `pooler` phát hiện kết nối đến máy chủ đã bị cắt(severed). Lưu ý rằng một kết nối bị cắt chỉ có thể được phát hiện sau khi cố gắng giao tiếp với máy chủ. Nếu phát hiện một kết nối không còn liên kết với máy chủ, kết nối đó sẽ được đánh dấu là không hợp lệ. Các kết nối không hợp lệ chỉ bị xoá khỏi pool khi chúng bị đóng hoặc bị thu hồi.

Nếu tồn tại một kết nối đến máy chủ đã biến mất, kết nối này vẫn có thể được rút ra từ pool ngay cả khi bộ quản lý chưa phát hiện ra kết nối bị cắt và đánh dấu là không hợp lệ. Điều này xảy ra vì việc kiểm tra tính hợp lệ của kết nối sẽ làm mất lợi ích của `connection pool` do phải thực hiện thêm một lượt truy vấn đến máy chủ. Trong trường hợp này, lần đầu tiên sử dụng kết nối sẽ phát hiện ra kết nối đã bị cắt, và một ngoại lệ sẽ được ném ra.

## Xoá pool

ADO.NET 2.0 đã giới thiệu hai phương thức mới để xoá pool: `ClearAllPools` và `ClearPool`. `ClearAllPools` xoá tất cả các connection pool cho một provider nhất định, còn `ClearPool` xoá pool liên quan đến một kết nối cụ thể. Nếu có các kết nối đang được sử dụng tại thời điểm gọi hàm, chúng sẽ được đánh dấu phù hợp. Khi bị đóng, chúng sẽ bị loại bỏ thay vì được đưa trở lại pool.

## Hỗ trợ transaction

Các kết nối được lấy từ pool và gán dựa trên `transaction context`. Trừ khi bạn chỉ định `Enlist=false` trong connection string, pool sẽ đảm bảo rằng kết nối được ghi danh (enlist) vào `transaction context` hiện tại (`System.Transactions.Transaction.Current`). Khi một kết nối được đóng và trả lại pool với một transaction đang ghi danh, nó sẽ được đặt riêng để khi có yêu cầu tiếp theo cho cùng một transaction, pool sẽ trả lại đúng kết nối đó nếu nó còn khả dụng. Nếu không có kết nối nào còn khả dụng trong phần đã ghi danh, một kết nối sẽ được lấy từ phần không có trong transaction và ghi danh vào transaction. Nếu không có kết nối nào trong cả hai phần, một kết nối mới sẽ được tạo và ghi danh.

Khi một kết nối bị đóng, nó sẽ được trả lại pool và được đưa vào phân vùng phù hợp dựa trên ngữ cảnh giao dịch của nó. Vì vậy, bạn có thể đóng kết nối mà không tạo ra lỗi, ngay cả khi giao dịch phân tán vẫn đang chờ xử lý. Điều này cho phép bạn commit hoặc huỷ bỏ giao dịch sau đó.

## Kiểm soát connection pool bằng các connection string keywords

Thuộc tính `ConnectionString` của đối tượng `SqlConnection` hỗ trợ các cặp key/value trong connection string có thể được dùng để điều chỉnh hành vi của connection pool. Để biết thêm thông tin, hãy xem phần [ConnectionString](https://learn.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection.connectionstring?view=net-9.0-pp).

## Phân mảnh pool (Pool fragmentation)

Phân mảnh pool là một vấn đề phổ biến trong nhiều ứng dụng Web khi ứng dụng có thể tạo ra một số lượng lớn pool mà không được giải phóng cho đến khi tiến trình kết thúc. Điều này dẫn đến một số lượng lớn kết nối được mở và tiêu tốn bộ nhớ, làm giảm hiệu năng hệ thống.

### Phân mảnh pool do sử dụng bảo mật tích hợp (Integrated Security)

Các kết nối được quản lý theo chuỗi kết nối và danh tính người dùng. Do đó, nếu bạn sử dụng xác thực Basic hoặc Windows trên website cùng với đăng nhập bảo mật tích hợp, bạn sẽ có một pool cho mỗi người dùng. Dù điều này giúp cải thiện hiệu suất truy vấn cơ sở dữ liệu cho một người dùng, nhưng người dùng đó không thể tận dụng các kết nối của người khác. Đồng thời, điều này cũng khiến mỗi người dùng có ít nhất một kết nối riêng đến máy chủ. Đây là tác dụng phụ của một kiến trúc ứng dụng Web nhất định mà lập trình viên cần cân nhắc với các yêu cầu về bảo mật và kiểm toán.

### Phân mảnh pool do sử dụng nhiều cơ sở dữ liệu

Nhiều nhà cung cấp dịch vụ Internet lưu trữ nhiều website trên cùng một máy chủ. Họ có thể sử dụng một cơ sở dữ liệu để xác thực đăng nhập qua Forms và sau đó mở kết nối đến cơ sở dữ liệu riêng cho từng người dùng hoặc nhóm người dùng. Kết nối đến cơ sở dữ liệu xác thực được quản lý dùng chung, nhưng sẽ có một pool riêng cho mỗi cơ sở dữ liệu khác, điều này làm tăng số lượng kết nối đến máy chủ.

Đây cũng là một tác dụng phụ của thiết kế ứng dụng. Có một cách đơn giản để tránh tác dụng phụ này mà không ảnh hưởng đến bảo mật khi kết nối đến SQL Server. Thay vì kết nối đến cơ sở dữ liệu riêng biệt cho mỗi người dùng hay nhóm, bạn có thể kết nối đến cùng một cơ sở dữ liệu (ví dụ như master), rồi thực thi câu lệnh `USE` để chuyển sang cơ sở dữ liệu mong muốn. Đoạn mã C# sau đây minh họa cách thực hiện:

```c#
// Giả định rằng 'command' là một đối tượng SqlCommand.
command.Text = "USE DatabaseName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();
    command.ExecuteNonQuery();
}
```

## Vai trò ứng dụng và connection pooling

Sau khi vai trò ứng dụng của SQL Server được kích hoạt bằng cách gọi thủ tục hệ thống `sp_setapprole`, ngữ cảnh bảo mật của kết nối đó không thể được thiết lập lại. Tuy nhiên, nếu tính năng pooling được bật, kết nối vẫn sẽ được trả về pool, và lỗi sẽ xảy ra nếu kết nối từ pool này được tái sử dụng.
