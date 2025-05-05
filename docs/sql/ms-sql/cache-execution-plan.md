---
id: cache-execution-plan
title: Cache Execution Plan
---

# MS SQL - Cache execution plan

Việc cache execution plan trong SQL Server (MSSQL) là một cơ chế tối ưu hóa, giúp tái sử dụng kế hoạch thực thi truy vấn để tiết kiệm chi phí biên dịch. Tuy nhiên, việc cache execution plan cũng có một số nhược điểm như sau:

## Nhược điểm

### Parameter Sniffing

- Khi MSSQL biên dịch một execution plan lần đầu với một giá trị tham số cụ thể, plan đó sẽ được cache lại.

- Những lần gọi sau với giá trị tham số khác vẫn dùng lại execution plan cũ, dẫn đến hiệu năng kém do kế hoạch không còn tối ưu với dữ liệu mới.

### Plan Cache Bloat (Tốn bộ nhớ)

- Nếu có nhiều truy vấn với cú pháp hơi khác nhau (hoặc không dùng tham số hóa tốt), mỗi truy vấn lại cache riêng execution plan.

- Điều này dẫn đến tình trạng cache chứa rất nhiều kế hoạch, gây tốn RAM và ảnh hưởng đến hiệu năng hệ thống.

### Ad-hoc Queries (Truy vấn động)

- Với các truy vấn động không được chuẩn hóa (parameterized), MSSQL có thể cache rất nhiều plan không cần thiết, làm "ô nhiễm" cache.

- Điều này khiến những execution plan quan trọng bị đẩy ra khỏi cache sớm hơn.

### Stale Plans (Lỗi thời)

- Nếu thống kê dữ liệu thay đổi nhưng execution plan vẫn bị tái sử dụng, có thể dẫn đến quyết định không tối ưu.

- Trong một số trường hợp, việc không tái biên dịch sẽ khiến truy vấn chạy chậm hơn.

### Khó kiểm soát & debug

- Việc MSSQL tự quyết định cache và tái sử dụng kế hoạch có thể gây khó khăn khi debug những vấn đề hiệu năng.

- Một plan "tưởng như tốt" nhưng lại không phù hợp với ngữ cảnh hiện tại.

## Ví dụ cụ thể

Tạo bảng Orders:

```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY,
    CustomerId INT,
    OrderDate DATETIME
);

-- Tạo index trên CustomerId
CREATE NONCLUSTERED INDEX IX_Orders_CustomerId ON Orders(CustomerId);
```

Data seeding có:

- `CustomerId = 1`: có 10 đơn hàng (ít)
- `CustomerId = 99999`: có 100.000 đơn hàng (rất nhiều)

Stored Procedure:

```sql
CREATE PROCEDURE GetOrdersByCustomerId
    @CustomerId INT
AS
BEGIN
    SELECT * FROM Orders WHERE CustomerId = @CustomerId;
END
```

Lần gọi đầu tiên:

```sql
EXEC GetOrdersByCustomerId @CustomerId = 1;
```

- MSSQL biên dịch và cache execution plan dựa trên giá trị `@CustomerId = 1`.
- Vì dữ liệu ít nên MSSQL chọn `Index Seek` là nhanh nhất.

Lần gọi thứ hai:

```sql
EXEC GetOrdersByCustomerId @CustomerId = 99999;
```

- MSSQL tái sử dụng execution plan đã cache từ lần đầu.

- Kế hoạch này vẫn dùng `Index Seek`, mặc dù trả về 100.000 rows, lẽ ra nên dùng `Clustered Index Scan` (Table Scan) hoặc `Non-Clustered Index Scan` vào tùy tình huống sẽ tốt hơn.

- MSSQL cache execution plan lần đầu rồi tái sử dụng mà không xét đến dữ liệu mới có phù hợp hay không. Kết quả là truy vấn chậm hơn, do kế hoạch cũ không còn tối ưu với dữ liệu mới. Tình trạng này gọi là `Parameter Sniffing`.

## Parameter Sensitive Plan (PSP)

Trong các phiên bản SQL Server trước đây, mỗi truy vấn chỉ có duy nhất một execution plan được cache — dẫn tới việc một plan không phù hợp với mọi giá trị tham số, gây ra hiện tượng `Parameter Sniffing`.

Từ SQL Server 2022 trở đi, PSP cho phép cache nhiều execution plan khác nhau cho cùng một truy vấn, dựa trên các "range" giá trị tham số.

### PSP hoạt động thế nào?

Khi truy vấn chạy lần đầu:

1. SQL Server biên dịch truy vấn như bình thường (sniff tham số).

2. SQL Server phân tích rằng truy vấn này phụ thuộc mạnh vào giá trị tham số (parameter sensitive).

3. Thay vì chỉ lưu một plan duy nhất, nó tạo nhiều “variants” của plan cho các nhóm giá trị khác nhau.

Ví dụ:

- Nhóm 1: CustomerId = 1 → ít dữ liệu → chọn `Index Seek`
- Nhóm 2: CustomerId = 99999 → nhiều dữ liệu → chọn `Non-Clustered Index Scan`

Khi truy vấn chạy lần sau, SQL Server sẽ chọn đúng plan variant tương ứng với phạm vi giá trị tham số.

### Lợi ích của PSP

- Hạn chế parameter sniffing: Không cần thủ công dùng `OPTION(RECOMPILE)` hoặc `OPTIMIZE FOR UNKNOWN`
- Tái sử dụng kế hoạch tối ưu: Tối ưu với nhiều loại tham số mà vẫn tận dụng cache
- Tự động: SQL Server tự động xác định và xử lý, không cần thay đổi code cũ

### Lưu ý về PSP

- Chỉ hỗ trợ SQL Server 2022 trở lên
- Chỉ áp dụng với một số loại truy vấn nhất định có điều kiện lọc bằng tham số
- Tính năng được bật mặc định nếu bạn không tắt `PARAMETER_SENSITIVE_PLAN_OPTIMIZATION` bằng query hint hoặc config
