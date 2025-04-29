---
id: cursor-pagination
title: Tìm hiểu về Cursor Pagination
---

# Tìm hiểu về Cursor Pagination và Vì sao nó nhanh (Phân tích chuyên sâu)

Nguồn: Bài viết "Understanding Cursor Pagination and Why It's So Fast (Deep Dive)" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/understanding-cursor-pagination-and-why-its-so-fast-deep-dive)

Pagination (phân trang) là yếu tố quan trọng trong việc xử lý hiệu quả các tập dữ liệu lớn. Trong khi `offset pagination`(phân trang dựa trên số thứ tự) là phương pháp phổ biến và đáp ứng được nhu cầu cơ bản, `cursor-based pagination`(phân trang dạng con trỏ) lại mang đến một số lợi thế đáng kể trong những kịch bản nhất định.

Phương pháp này đặc biệt hữu ích cho các luồng dữ liệu thời gian thực (real-time feeds), giao diện cuộn vô tận (infinite scroll), và các API nơi hiệu năng ở quy mô lớn là yếu tố then chốt — như dòng thời gian mạng xã hội, nhật ký hoạt động, hoặc các luồng sự kiện nơi người dùng thường xuyên phân trang qua các tập dữ liệu lớn.

Hãy cùng khám phá cả hai phương pháp thông qua một bảng UserNotes đơn giản và xem cách chúng hoạt động với một triệu bản ghi.

Chúng ta sẽ đi sâu vào chi tiết cài đặt, so sánh hiệu năng truy vấn và bàn về bối cảnh phù hợp của từng phương pháp.

Tôi sẽ đính kèm các execution plan thực tế từ PostgreSQL để minh họa sự khác biệt rõ rệt về hiệu suất giữa hai cách tiếp cận này.

## Database Schema

Tôi tạo một bảng đơn giản để minh họa các kỹ thuật pagination. Bảng này được seed với 1.000.000 bản ghi để kiểm thử, đủ để cho thấy sự chênh lệch về hiệu năng giữa offset và cursor pagination.

Chúng ta sẽ sử dụng schema SQL sau cho các ví dụ:

```sql
CREATE TABLE user_notes (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    note character varying(500),
    date date NOT NULL,
    CONSTRAINT pk_user_notes PRIMARY KEY (id)
);
```

Và đây là lớp C# đại diện cho thực thể UserNote:

```c#
public class UserNote
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? Note { get; set; }
    public DateOnly Date { get; set; }
}
```

Tôi sẽ sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu, nhưng các khái niệm trình bày ở đây cũng áp dụng với các hệ cơ sở dữ liệu khác.

## Offset Pagination: Phương pháp truyền thống

`Offset pagination` sử dụng các thao tác `Skip` và `Take`. Chúng ta bỏ qua một số lượng bản ghi nhất định và lấy ra một số lượng cố định bản ghi tiếp theo. Điều này thường được chuyển thành `OFFSET` và `LIMIT` trong truy vấn SQL.

Ví dụ về `offset pagination` trong ASP.NET Core:

```c#
app.MapGet("/offset", async (
    AppDbContext dbContext,
    int page = 1,
    int pageSize = 10,
    CancellationToken cancellationToken = default) =>
{
    if (page < 1) return Results.BadRequest("Page must be greater than 0");
    if (pageSize < 1) return Results.BadRequest("Page size must be greater than 0");
    if (pageSize > 100) return Results.BadRequest("Page size must be less than or equal to 100");

    var query = dbContext.UserNotes
        .OrderByDescending(x => x.Date)
        .ThenByDescending(x => x.Id);

    var totalCount = await query.CountAsync(cancellationToken);
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(cancellationToken);

    return Results.Ok(new
    {
        Items = items,
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount,
        TotalPages = totalPages,
        HasNextPage = page < totalPages,
        HasPreviousPage = page > 1
    });
});
```

Lưu ý rằng tôi sắp xếp kết quả theo Date và Id theo thứ tự giảm dần. Điều này giúp đảm bảo kết quả nhất quán khi phân trang.

SQL được sinh ra từ ví dụ trên:

```sql
-- Truy vấn tổng số lượng bản ghi
SELECT count(*)::int FROM user_notes AS u;

-- Truy vấn lấy dữ liệu thực tế
SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
ORDER BY u.date DESC, u.id DESC
LIMIT @pageSize OFFSET @offset;
```

Hạn chế của Offset Pagination:

- Hiệu năng giảm rõ rệt khi offset tăng do cơ sở dữ liệu phải quét và loại bỏ toàn bộ các bản ghi trước offset
- Nguy cơ bị thiếu hoặc lặp bản ghi nếu dữ liệu thay đổi giữa các lần phân trang
- Kết quả không nhất quán nếu có cập nhật đồng thời (concurrent updates)

Using Index Scan on table "senha":

## Cursor-Based Pagination: Phương pháp nhanh hơn

`Cursor pagination` sử dụng một điểm tham chiếu (cursor) để truy xuất bộ kết quả tiếp theo. Điểm này thường là một định danh duy nhất hoặc một tập hợp trường xác định thứ tự sắp xếp.

Tôi sẽ sử dụng trường `Date` và `Id `để tạo cursor cho bảng `UserNotes`. Cursor là một cặp kết hợp hai trường này, cho phép phân trang hiệu quả.

Ví dụ về `cursor pagination` trong ASP.NET Core:

```c#
app.MapGet("/cursor", async (
    AppDbContext dbContext,
    DateOnly? date = null,
    Guid? lastId = null,
    int limit = 10,
    CancellationToken cancellationToken = default) =>
{
    if (limit < 1) return Results.BadRequest("Limit must be greater than 0");
    if (limit > 100) return Results.BadRequest("Limit must be less than or equal to 100");

    var query = dbContext.UserNotes.AsQueryable();

    if (date != null && lastId != null)
    {
        // Sử dụng cursor để lấy tập kết quả tiếp theo
        // Nếu sắp xếp theo ASC, ta sẽ dùng > thay vì <
        query = query.Where(x => x.Date < date || (x.Date == date && x.Id <= lastId));
    }

    var items = await query
        .OrderByDescending(x => x.Date)
        .ThenByDescending(x => x.Id)
        .Take(limit + 1)
        .ToListAsync(cancellationToken);

    bool hasMore = items.Count > limit;
    DateOnly? nextDate = hasMore ? items[^1].Date : null;
    Guid? nextLastId = hasMore ? items[^1].Id : null;

    if (hasMore)
    {
        items.RemoveAt(items.Count - 1);
    }

    return Results.Ok(new
    {
        Items = items,
        NextDate = nextDate,
        NextLastId = nextLastId,
        HasMore = hasMore
    });
});
```

Thứ tự sắp xếp vẫn giống như trong ví dụ `offset pagination`. Tuy nhiên, việc duy trì thứ tự sắp xếp nhất quán là rất quan trọng trong `cursor pagination`. Bởi vì trường `Date` không phải là duy nhất, chúng ta cần kết hợp thêm trường `Id` để xác định chính xác điểm dừng.

Dưới đây là truy vấn SQL được tạo ra cho `cursor pagination`:

```sql
SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
WHERE u.date < @date OR (u.date = @date AND u.id <= @lastId)
ORDER BY u.date DESC, u.id DESC
LIMIT @limit;
```

Lưu ý rằng truy vấn không sử dụng `OFFSET`. Thay vào đó, nó truy vấn trực tiếp các dòng dựa trên con trỏ, điều này hiệu quả hơn nhiều so với offset pagination..

Truy vấn `COUNT` thường bị loại bỏ trong `cursor pagination` vì chúng ta không đếm tổng số mục. Đây có thể là một hạn chế nếu bạn cần hiển thị tổng số trang từ đầu. Tuy nhiên, lợi ích về hiệu suất của phân trang con trỏ thường vượt xa hạn chế này.

Hạn chế của Cursor Pagination:

- Nếu người dùng cần thay đổi các trường sắp xếp một cách linh hoạt, `cursor pagination` sẽ phức tạp hơn nhiều vì con trỏ cần phải bao gồm tất cả các điều kiện sắp xếp.
- Người dùng không thể nhảy đến một số trang cụ thể — họ phải duyệt tuần tự qua từng trang.
- Phức tạp hơn khi triển khai chính xác so với `offset pagination`, đặc biệt là khi xử lý các giá trị trùng (ties) và đảm bảo thứ tự ổn định.

## Phân tích Execution Plans (chiến lược thực thi)

Tôi muốn so sánh kế hoạch thực thi của phân trang offset và cursor. Tôi đã dùng lệnh `EXPLAIN ANALYZE` trong PostgreSQL để xem các kế hoạch truy vấn.

Truy vấn dùng offset pagination:

```sql
SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
ORDER BY u.date DESC, u.id DESC
LIMIT 1000 OFFSET 900000;
```

Tôi cố tình bỏ qua 900.000 dòng để phóng đại tác động hiệu suất. Sau đó, tôi lấy tiếp 1.000 dòng tiếp theo.

query plan:

```sql
EXPLAIN ANALYZE SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
ORDER BY u.date DESC, u.id DESC
LIMIT 1000 OFFSET 900000;

---
Limit  (cost=165541.59..165541.71 rows=1 width=52) (actual time=695.026..701.406 rows=1000 loops=1)
  ->  Gather Merge  (cost=68312.50..165541.59 rows=833334 width=52) (actual time=342.475..684.567 rows=901000 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        ->  Sort  (cost=67312.48..68354.15 rows=416667 width=52) (actual time=327.846..450.295 rows=300841 loops=3)
              Sort Key: date DESC, id DESC
              Sort Method: external merge  Disk: 20440kB
              Worker 0:  Sort Method: external merge  Disk: 18832kB
              Worker 1:  Sort Method: external merge  Disk: 18912kB
              ->  Parallel Seq Scan on user_notes u  (cost=0.00..14174.67 rows=416667 width=52) (actual time=1.035..22.876 rows=333333 loops=3)
Planning Time: 0.050 ms
JIT:
  Functions: 8
  Options: Inlining false, Optimization false, Expressions true, Deforming true
  Timing: Generation 0.243 ms (Deform 0.111 ms), Inlining 0.000 ms, Optimization 0.270 ms, Emission 4.085 ms, Total 4.598 ms
Execution Time: 704.217 ms
```

Tổng thời gian thực thi cho offset pagination là 704.217 ms.

Truy vấn tương tự dùng cursor pagination:

```sql
SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
WHERE u.date < @date OR (u.date = @date AND u.id <= @lastId)
ORDER BY u.date DESC, u.id DESC
LIMIT 1000;
```

query plan:

```sql
Limit  (cost=20605.63..20722.31 rows=1000 width=52) (actual time=37.993..40.958 rows=1000 loops=1)
  ->  Gather Merge  (cost=20605.63..30419.62 rows=84114 width=52) (actual time=37.992..40.921 rows=1000 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        ->  Sort  (cost=19605.61..19710.75 rows=42057 width=52) (actual time=24.611..24.630 rows=811 loops=3)
              Sort Key: date DESC, id DESC
              Sort Method: top-N heapsort  Memory: 240kB
              Worker 0:  Sort Method: top-N heapsort  Memory: 239kB
              Worker 1:  Sort Method: top-N heapsort  Memory: 238kB
              ->  Parallel Seq Scan on user_notes u  (cost=0.00..17299.67 rows=42057 width=52) (actual time=0.009..21.462 rows=33333 loops=3)
                    Filter: ((date < @date::date) OR ((date = @date::date) AND (id <= @lastId::uuid)))
                    Rows Removed by Filter: 300000
Planning Time: 0.063 ms
Execution Time: 40.993 ms

```

Tổng thời gian thực thi cho cursor pagination là 40.993 ms.

Một sự cải thiện hiệu suất gấp 17 lần khi dùng cursor pagination so với offset pagination!

Hiệu suất của phân trang con trỏ ổn định bất kể độ sâu của trang. Điều này là nhờ việc truy vấn trực tiếp các dòng dựa trên con trỏ, vượt trội hơn rất nhiều so với việc phải bỏ qua hàng trăm ngàn dòng như offset pagination. Đây là một lợi thế rất lớn, đặc biệt khi làm việc với tập dữ liệu lớn.

## Thêm index cho cursor pagination

Tôi cũng đã thử kiểm tra tác động của các index đối với cursor pagination. Tôi tạo một chỉ mục tổng hợp trên hai trường `Date` và `Id` để tăng tốc truy vấn — hoặc ít nhất là tôi nghĩ vậy...

Dưới đây là câu lệnh SQL để tạo chỉ mục tổng hợp:

```sql
CREATE INDEX idx_user_notes_date_id ON user_notes (date DESC, id DESC);
```

Index được tạo theo thứ tự giảm dần để khớp với thứ tự sắp xếp trong truy vấn.

Hãy xem query plan khi sử dụng cursor pagination với `composite index` (chỉ mục tổng hợp):

```sql
EXPLAIN ANALYZE SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
WHERE u.date < @date OR (u.date = @date AND u.id <= @lastId)
ORDER BY u.date DESC, u.id DESC
LIMIT 1000;
```

Kết quả:

```sql
Limit  (cost=0.42..816.55 rows=1000 width=52) (actual time=298.534..298.924 rows=1000 loops=1)
  ->  Index Scan using idx_user_notes_date_id on user_notes u  (cost=0.42..82376.42 rows=100936 width=52) (actual time=298.532..298.888 rows=1000 loops=1)
        Filter: ((date < @date::date) OR ((date = @date::date) AND (id <= @lastId::uuid)))
        Rows Removed by Filter: 900000
Planning Time: 0.068 ms
Execution Time: 298.955 ms
```

Chúng ta thấy có sử dụng `Index Scan` với `composite index`. Tuy nhiên, thời gian thực thi là 298.955 ms, chậm hơn truy vấn trước đó không dùng chỉ mục.

Điều này có thể do bộ dữ liệu quá nhỏ để tận dụng được lợi thế từ index. Bảng chỉ có 1 triệu bản ghi, có thể chưa đủ lớn để thấy rõ sự cải thiện.

Nhưng còn một điều nữa!

## Nếu chúng ta sử dụng so sánh tuple trong SQL thì sao?

```sql
EXPLAIN ANALYZE SELECT u.id, u.date, u.note, u.user_id
FROM user_notes AS u
WHERE (u.date, u.id) <= (@date, @lastId)
ORDER BY u.date DESC, u.id DESC
LIMIT 1000;
```

Kết quả:

```sql
Limit  (cost=0.42..432.81 rows=1000 width=52) (actual time=0.020..0.641 rows=1000 loops=1)
  ->  Index Scan using idx_user_notes_date_id on user_notes u  (cost=0.42..43817.85 rows=101339 width=52) (actual time=0.019..0.606 rows=1000 loops=1)
        Index Cond: (ROW(date, id) <= ROW(@date::date, @lastId::uuid))
Planning Time: 0.060 ms
Execution Time: 0.668 ms
```

Cuối cùng thì chỉ mục đã phát huy tác dụng. Thời gian thực thi chỉ còn 0.668 ms, nhanh hơn rất nhiều.

Trình tối ưu hóa truy vấn không thể xác định rõ `composite index` có thể được dùng cho so sánh theo hàng (row-level comparison) hay không. Nhưng nếu dùng so sánh tuple như trên thì chỉ mục sẽ được tận dụng hiệu quả.

Làm sao chuyển điều này sang EF Core?

Provider PostgreSQL trong EF Core có hàm `EF.Functions.LessThanOrEqual`, chấp nhận một `ValueTuple` làm tham số. Ta có thể dùng nó để tạo biểu thức kiểu `(u.date, u.id) <= (@date, @lastId)` trong truy vấn LINQ, giúp tận dụng được chỉ mục tổng hợp.

```c#
query = query.Where(x => EF.Functions.LessThanOrEqual(
    ValueTuple.Create(x.Date, x.Id),
    ValueTuple.Create(date, lastId)));
```

## Mã hóa con trỏ

Dưới đây là một lớp tiện ích (utility class) nhỏ để mã hóa và giải mã con trỏ. Ta sẽ sử dụng nó để mã hóa con trỏ trong URL và giải mã khi truy xuất trang tiếp theo.

Client sẽ nhận được con trỏ dưới dạng chuỗi được mã hóa bằng Base64. Họ không cần biết cấu trúc bên trong của con trỏ.

```c#
using Microsoft.AspNetCore.Authentication; // Dùng cho Base64UrlTextEncoder

public sealed record Cursor(DateOnly Date, Guid LastId)
{
    public static string Encode(DateOnly date, string lastId)
    {
        var cursor = new Cursor(date, lastId);
        string json = JsonSerializer.Serialize(cursor);
        return Base64UrlTextEncoder.Encode(Encoding.UTF8.GetBytes(json));
    }

    public static Cursor? Decode(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor))
        {
            return null;
        }

        try
        {
            string json = Encoding.UTF8.GetString(Base64UrlTextEncoder.Decode(cursor));
            return JsonSerializer.Deserialize<Cursor>(json);
        }
        catch
        {
            return null;
        }
    }
}
```

Ví dụ mã hóa và giải mã:

```c#
string encodedCursor = Cursor.Encode(
    new DateOnly(2025, 2, 15),
    Guid.Parse("019500f9-8b41-74cf-ab12-25a48d4d4ab4"));

// Kết quả:
// eyJEYXRlIjoiMjAyNS0wMi0xNSIsIkxhc3RJZCI6IjAxOTUwMGY5LThiNDEtNzRjZi1hYjEyLTI1YTQ4ZDRkNGFiNCJ9

Cursor decodedCursor = Cursor.Decode(encodedCursor);

// Kết quả:
// {
//     "Date": "2025-02-15",
//     "LastId": "019500f9-8b41-74cf-ab12-25a48d4d4ab4"
// }
```

## Tổng kết

Mặc dù `offset paggination` dễ triển khai hơn, nhưng nó gặp phải vấn đề nghiêm trọng về hiệu năng khi dữ liệu lớn. Các thử nghiệm của tôi cho thấy tốc độ truy vấn bị chậm hơn đến 17 lần so với `cursor paggination` khi truy cập các trang sâu hơn.

`Cursor paggination` duy trì hiệu năng ổn định bất kể độ sâu của trang, và hoạt động đặc biệt tốt cho các luồng dữ liệu theo thời gian thực (real-time feeds) hoặc giao diện cuộn vô tận (infinite scroll).

Tuy nhiên, `cursor paggination` cũng có một số điểm đánh đổi. Nó đòi hỏi phải triển khai cẩn thận, đặc biệt là về cách mã hóa con trỏ và xử lý thứ tự sắp xếp. Ngoài ra, nó không cung cấp tổng số trang, nên không phù hợp với những giao diện cần điều hướng theo số trang.

Lựa chọn giữa hai phương pháp này phụ thuộc vào từng trường hợp sử dụng cụ thể:

- Chọn `cursor paggination` nếu bạn cần hiệu năng cao, API thời gian thực, cuộn vô tận, hoặc bất kỳ tình huống nào mà người dùng thường xuyên truy cập vào các trang sâu.
- Giữ `offset paggination` cho các giao diện quản trị, tập dữ liệu nhỏ, hoặc khi bạn cần hiển thị số lượng trang ngay từ đầu.

Một yếu tố khác cần cân nhắc: người dùng của bạn thường truy cập vào trang nào? Nếu hầu hết người dùng chỉ truy cập vào trang đầu tiên và hiếm khi chuyển trang, thì `offset paggination` có thể đã đủ tốt. Điều này đúng với rất nhiều ứng dụng.

Hãy nhớ sử dụng so sánh theo tuple và tạo chỉ mục phù hợp để đạt hiệu suất tối ưu khi dùng `cursor paggination`.

Vậy là hết cho hôm nay.
