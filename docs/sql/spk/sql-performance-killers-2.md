---
id: sql-performance-killers-2
title: IN vs EXISTS
---

# SQL Performance Killers - IN vs EXISTS

Nguồn: Bài viết "SQL Performance Killers - IN vs EXISTS" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-in-vs-exists-c19da0a99ce1)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Bên cạnh việc áp dụng function trực tiếp lên column data, việc sử dụng sai toán tử `IN` và `EXISTS` cũng là một trong những `SQL performance killer` phổ biến nhất. Mặc dù trong nhiều trường hợp, sử dụng một trong hai đều cho kết quả truy vấn giống nhau, nhưng cách thức xử lý bên trong lại rất khác biệt, và hiểu rõ sự khác biệt này chính là chìa khóa để tránh làm suy giảm hiệu năng truy vấn.

## IN

Cách IN thường được xử lý là:

- Truy vấn con (subquery) sẽ được thực thi trước và kết quả được loại bỏ `DISTINCT` trùng lặp

- Sau đó, kết quả sẽ được join với bảng bên ngoài

Ví dụ sử dụng IN:

```sql
SELECT *
FROM table_y
WHERE column_a IN (SELECT column_c FROM table_y);
```

Thông thường sẽ được xử lý như sau:

```sql
SELECT *
FROM table_x tx,
     (SELECT DISTINCT column_c
      FROM table_y) ty
WHERE tx.column_a = ty.column_c;
```

## EXISTS

Trong khi đó, toán tử `EXISTS` thường được xử lý như sau:

Với mỗi dòng trong bảng bên ngoài (thường là quét toàn bộ bảng - full table scan), truy vấn con (subquery) sẽ được thực thi một lần để kiểm tra điều kiện có đúng hay không.

```sql
SELECT *
FROM table_x tx
WHERE EXISTS (SELECT NULL
              FROM table_y ty
              WHERE ty.column_c = tx.column_a);
```

Thông thường sẽ được xử lý như sau:

```sql
FOR column_a IN (SELECT * FROM table_x tx) LOOP
    IF (EXISTS (SELECT NULL
                 FROM table_y ty
                 WHERE ty.column_c = tx.column_a)) THEN
        RETURN record;
    END IF;
END LOOP;
```

## Tổng kết

Vậy khi nào nên dùng `IN`, và khi nào nên dùng `EXISTS`?

Khi subquery (ví dụ: `SELECT column_c FROM table_y`) chạy chậm và bảng ngoài (table_x) tương đối nhỏ, thì dùng `EXISTS` sẽ nhanh hơn, vì thời gian để quét toàn bộ bảng ngoài và thực thi subquery cho từng dòng sẽ ít hơn so với thời gian chạy subquery một lần rồi thực hiện `DISTINCT` và `JOIN` với bảng ngoài.

Khi subquery chạy nhanh và bảng ngoài có nhiều dòng, thì dùng `IN` sẽ hiệu quả hơn, vì thời gian thực thi subquery một lần, sau đó `DISTINCT` và `JOIN` với bảng ngoài sẽ ít hơn so với việc quét toàn bộ bảng ngoài và gọi subquery cho từng dòng.

Nếu cả subquery và bảng ngoài đều nhỏ, thì IN và EXISTS có hiệu năng tương đương nhau.

Nếu cả subquery và bảng ngoài đều lớn, thì cả hai cách đều có thể tốt như nhau, và lúc này hiệu năng chủ yếu sẽ phụ thuộc vào việc có index phù hợp hay không.

```
“Không phải thiếu phần cứng,
Không phải do network traffic,
Không phải do front-end chậm,
Vấn đề hiệu năng lớn nhất trong đa số ứng dụng database là do SQL code kém.”
— Joe Celko
```
