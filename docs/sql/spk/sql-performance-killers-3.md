---
id: sql-performance-killers-3
title: Implicit Conversions
---

# SQL Performance Killers - Implicit Conversions (Ép kiểu ngầm định)

Nguồn: Bài viết "SQL Performance Killers - Implicit Conversions" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-implicit-conversions-37245a91b51b)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Đây là bài viết thứ ba trong chuỗi `SQL performance killers`, hai bài trước là `Functions to column data]`và `IN vs EXISTS`.

Lần này, tôi muốn chỉ cho bạn thấy việc để cơ sở dữ liệu tự động xử lý chuyển đổi kiểu dữ liệu - còn gọi là `mplicit conversion` (ép kiểu ngầm định) - có thể ảnh hưởng đến hiệu năng của cơ sở dữ liệu/ứng dụng như thế nào.

Khi tham số truyền vào có kiểu dữ liệu khác với kiểu của cột mà bạn đang so sánh, cơ sở dữ liệu sẽ cố gắng tự chuyển đổi kiểu dữ liệu một cách ngầm định để câu lệnh không bị lỗi. Ví dụ, khi so sánh một number với một string, nó sẽ cố gắng chuyển đổi chuỗi đó thành số một cách tự động.

Mặc dù việc này giúp thuận tiện hơn cho lập trình viên, nhưng nó có thể gây ảnh hưởng nghiêm trọng đến hiệu năng.

## Ví dụ thực tế

Một trong những sự cố về hiệu năng như vậy đã xảy ra với một khách hàng của chúng tôi, người vừa mới phân vùng (partition) một bảng rất lớn. Đây là central part (phần trung tâm) trong cơ sở dữ liệu của họ và được truy cập bởi hầu hết các "slow queries". Sau khi phân vùng (partition), họ kỳ vọng hiệu năng sẽ cải thiện rõ rệt nhưng điều đó đã không xảy ra.

Sau khi phân tích các truy vấn và `execution plan` (chiến lược thực thi), chúng tôi nhận thấy rằng không có `partition elimination` (sự loại bỏ phân vùng) nào diễn ra cả, và các truy vấn đang truy cập toàn bộ các phân vùng của bảng. Vấn đề nằm ở chỗ: column được sử dụng để làm khóa phân vùng là kiểu `timestamp with time zone`, trong khi tham số mà truy vấn nhận được lại là một chuỗi (string).

Query with implicit convertion:

```sql
SELECT id,
       file_name,
       updated_at
FROM attachment_files
WHERE updated_at BETWEEN '2018-06-10 00:00:00' AND '2018-06-10 23:59:59';
```

Trong tình huống này, PostgreSQL đã chuyển chuỗi (string) thành kiểu `timestamp without time zone`, điều này ngăn cản partition elimination `cơ chế loại bỏ phân vùng` được thực thi.

Query with explicit conversiton:

```sql
SELECT id,
       file_name,
       updated_at
FROM attachment_files
WHERE updated_at BETWEEN '2018-06-10 00:00:00'::timestamp WITH time zone AND '2018-06-10 23:59:59'::timestamp WITH time zone;
```

Sau khi áp dụng `explicit conversion` (ép kiểu tường minh) vào các query, PostgreSQL bắt đầu thực hiện `partition elimination`(loại bỏ phân vùng) và hiệu năng mong đợi cuối cùng cũng đạt được!

```
“80% các vấn đề về hiệu năng đều xuất phát từ các ứng dụng cơ sở dữ liệu được viết sai cách.” — Craig S. Mullins
```
