---
id: clustered-and-nonclustered-indexes
title: Clustered và nonclustered indexes
---

# Clustered và nonclustered indexes

Nguồn: Bài viết "Clustered and nonclustered indexes" của [Microsoft](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described?view=sql-server-2017)

Một index là một cấu trúc `on-disk` liên kết với một table hoặc view nhằm tăng tốc độ truy xuất các row từ table hoặc view đó. Một index chứa các key được tạo từ một hoặc nhiều column trong table hoặc view. Những key này được lưu trữ trong một cấu trúc `B-tree`, cho phép SQL Server tìm kiếm row tương ứng với giá trị key một cách nhanh chóng và hiệu quả.

Ghi chú:

Tài liệu thường sử dụng thuật ngữ `B-tree `để chỉ chung các index. Trong các `rowstore indexes`, Database Engine triển khai một cấu trúc `B+ tree`. Điều này không áp dụng cho `columnstore indexes` hoặc các index trên các bảng `memory-optimized`.

Tham khảo thêm tại: [SQL Server and Azure SQL index architecture and design guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-2017).

Một bảng hoặc view có thể chứa các loại index sau:

## Clustered Index

`Clustered index` sắp xếp và lưu trữ các data rows trong table hoặc view dựa trên giá trị key của chúng. Các giá trị key này chính là các column được chỉ định trong định nghĩa của index.
Mỗi bảng chỉ có duy nhất một clustered index, vì các data rows chỉ có thể được lưu trữ theo một thứ tự duy nhất.

Dữ liệu trong table chỉ được lưu trữ theo thứ tự sắp xếp khi bảng đó có `clustered index`. Khi một bảng có `clustered index`, nó được gọi là `clustered table`. Nếu không có `clustered index`, các hàng dữ liệu sẽ được lưu trong một cấu trúc không có thứ tự gọi là `heap`.

## Nonclustered Index

`Nonclustered index` có một cấu trúc tách biệt với các hàng dữ liệu. Nó chứa các giá trị `non-clustered index key`, và mỗi mục key có một con trỏ tới data rows chứa giá trị đó.

Con trỏ từ một hàng trong `non-clustered index` tới một data rows được gọi là `row locator`. Cấu trúc của `row locator` phụ thuộc vào việc dữ liệu được lưu trong `heap` hay `clustered table`.

- Với heap, row locator là một con trỏ trực tiếp tới hàng dữ liệu.
- Với clustered table, row locator là giá trị clustered index key.

Cả clustered và nonclustered indexes đều có thể là unique. Với một unique index, không có hai hàng nào có cùng giá trị index key. Nếu không phải unique, nhiều hàng có thể chia sẻ cùng một giá trị key.

Các index được hệ thống tự động duy trì khi dữ liệu của bảng hoặc view bị thay đổi.

## Indexes và constraints

SQL Server tự động tạo index khi các PRIMARY KEY và UNIQUE constraints được định nghĩa trên các column của table.

- Ví dụ: khi bạn tạo một bảng với UNIQUE constraint, Database Engine tự động tạo một non-clustered index.

Nếu bạn cấu hình một PRIMARY KEY, Database Engine sẽ tạo một clustered index, trừ khi table đó đã có sẵn một clustered index. Nếu bạn áp dụng một PRIMARY KEY constraint trên một bảng đã có sẵn clustered index, SQL Server sẽ thực thi khóa chính bằng cách dùng một non-clustered index.

## Cách query optimizer sử dụng index

Các index được thiết kế tốt có thể giúp giảm số lượng thao tác I/O trên disk và sử dụng ít tài nguyên hệ thống hơn, nhờ đó cải thiện hiệu năng truy vấn.

Index có thể hỗ trợ tốt cho các truy vấn chứa `SELECT`, `UPDATE`, `DELETE` hoặc `MERGE`.

```sql
SELECT JobTitle, HireDate
FROM HumanResources.Employee
WHERE BusinessEntityID = 250
```

trong cơ sở dữ liệu `AdventureWorks2022`.

Khi truy vấn này được thực thi, query optimizer sẽ đánh giá tất cả các phương pháp có thể để truy xuất dữ liệu và chọn ra phương pháp hiệu quả nhất. Phương pháp đó có thể là `table scan`, hoặc scan một hay nhiều index nếu có.

Trong table scan, query optimizer đọc toàn bộ các rows trong bảng và chọn ra những rows thỏa mãn điều kiện của truy vấn. Đây là thao tác tốn nhiều I/O và tài nguyên hệ thống. Tuy nhiên, nếu kết quả trả về là một phần lớn dữ liệu trong table, `table scan` có thể lại là phương pháp tối ưu nhất.

Khi query optimizer sử dụng index, nó sẽ tìm kiếm các cột index key, xác định vị trí lưu trữ của các hàng cần truy vấn, và lấy dữ liệu từ đó.

Thông thường, tìm kiếm trong index nhanh hơn nhiều so với tìm trực tiếp trong bảng, vì:

- Index chứa ít cột hơn mỗi hàng
- Các hàng trong index được sắp xếp sẵn

Query optimizer sẽ tự động chọn ra phương pháp hiệu quả nhất khi thực thi truy vấn. Nhưng nếu không có index nào tồn tại, nó buộc phải dùng `table scan`. Nhiệm vụ của bạn là thiết kế và tạo các index phù hợp với môi trường của bạn, để query optimizer có nhiều lựa chọn tốt.
