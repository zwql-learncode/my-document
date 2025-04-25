---
id: sql-performance-killers-1
title: Functions to column data
---

# SQL Performance Killers - Functions to column data

Nguồn: Bài viết "SQL Performance Killers - Functions to column data" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-functions-to-column-data-8efff6582ba4)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Trong bài viết đầu tiên, tôi chọn một `SQL performance killer` rất phổ biến: `Functions to column data` - Áp dụng function trực tiếp lên column data. Khi một function được áp dụng lên column data, phần lớn trường hợp sẽ khiến database không thể sử dụng index (nếu index có tồn tại).

Khuyến nghị trong trường hợp này là cố gắng viết lại câu truy vấn SQL (SQL query) sao cho các function được áp dụng lên tham số (parameter) của query thay vì áp dụng trực tiếp lên dữ liệu của cột (column data).

Khi không thể viết lại truy vấn theo cách đó, một lựa chọn thay thế là tạo `function-based index` (chỉ mục dựa trên hàm), nếu hệ quản trị cơ sở dữ liệu (DBMS) mà bạn đang sử dụng có hỗ trợ tính năng này.

## Ví dụ thực tế

Câu truy vấn bên dưới áp dụng các hàm `TO_CHAR` và `DATE_PART` lên cột `senha.dataemissao`, điều này ngăn không cho chỉ mục (index) trên cột đó được sử dụng.

Kết quả là cơ sở dữ liệu (PostgreSQL) thực hiện một phép `Sequential Table Scan` (full table scan - quét tuần tự toàn bộ bảng) trên bảng `senha`, vốn chứa 12.291.867 dòng, khiến cho truy vấn mất gần 8 giây để thực thi.

Query applying functions to column data:

```sql
SELECT
    branch."name" AS branch_name,
    (100 - (((Sum(CASE WHEN senha.tempespera > '1800' THEN 1 ELSE 0 END)) * 100) / (Count(senha."id")))) AS sla,
    Count(senha."id"),
    Avg(senha.tempespera) AS tme,
    Now() AS data_agora
FROM
    "atendimento"."senha" senha
LEFT JOIN
    "atendimento"."atendimento" atendimento ON senha."id" = atendimento."id"
INNER JOIN
    "empresa"."branch" branch ON senha."branch" = branch."id"
WHERE
    To_char(senha."datemissao", 'YYYY-MM-DD') = To_char(Now(), 'YYYY-MM-DD')
AND
    Date_part('hour', senha."datemissao") < Date_part('hour', Now())
GROUP BY
    branch."name"
ORDER BY
    sla DESC
LIMIT 16;
```

Sequential scan on table "senha":

```
Limit (cost=671444.38..671444.43 rows=16 width=78)
  -> Sort (cost=671444.38..671444.31 rows=48 width=78)
        Sort Key: (((sum(CASE WHEN (senha.tempespera > '1800'::text) THEN 1 ELSE 0 END)) * 100) / count(senha.id)) DESC
        -> HashAggregate (cost=671442.85..671443.36 rows=48 width=78)
              Group Key: branch.name
              -> Nested Loop (cost=0.14..671124.78 rows=28465 width=28)
                    -> Seq Scan on senha (cost=0.00..667649.33 rows=28465 width=28)
                          Filter: (((date_part('hour'::text, datemissao) < date_part('hour'::text, now())) AND (to_char(datemissao, 'YYYY-MM-DD'::text))::date = (to_char(now(), 'YYYY-MM-DD'::text))::date) AND (tempespera IS NOT NULL))
                    -> Index Scan using branch_pkey on branch (cost=0.14..0.16 rows=1 width=10)
                          Index Cond: (id = senha.branch)
(16 rows)
```

## Giải pháp

Bằng cách viết lại câu truy vấn và thực hiện việc `transformation` (biến đổi) parameters, thay vì áp dụng function trực tiếp lên column data, cơ sở dữ liệu có thể sử dụng được chỉ mục `ix_senha_dataemissao` để truy cập bảng `senha`.

Khi sử dụng index, thời gian thực thi truy vấn đã giảm từ gần 8 giây xuống còn 382 mili-giây, tức chỉ còn dưới 5% so với thời gian ban đầu.

Một điểm quan trọng khác cần lưu ý là `query cost` (chi phí thực thi truy vấn) cũng đã giảm mạnh, từ 671.444,38 xuống còn 10,21.

Query applying the data “transformation” on the parameters:

```sql
SELECT
    branch."name" AS branch_name,
    (100 - (((SUM(CASE WHEN senha.tempespera > '1800' THEN 1 ELSE 0 END)) * 100) / (Count(senha."id")))) AS sla,
    Count(senha."id"),
    Avg(senha.tempespera) AS tme,
    Now() AS data_agora
FROM
    "atendimento"."senha" senha
LEFT JOIN
    "atendimento"."atendimento" atendimento
ON
    senha."id" = atendimento."id"
INNER JOIN
    "empresa"."branch" branch
ON
    senha."branch" = branch."id"
WHERE
    senha."datemissao" BETWEEN Date_trunc('day', Now()) AND Date_trunc('hour', Now())
GROUP BY
    branch."name"
ORDER BY
    sla DESC
LIMIT 16;
```

Using Index Scan on table "senha":

```
Limit (cost=10.21..10.21 rows=1 width=28)
  -> Sort (cost=10.21..10.21 rows=1 width=28)
        Sort Key: ((100 - (((sum(CASE WHEN (senha.tempespera > '1800'::text) THEN 1 ELSE 0 END)) * 100) / count(senha.id))))
        -> HashAggregate (cost=10.18..10.20 rows=1 width=28)
              Group Key: branch.name
              -> Hash Join (cost=0.48..10.16 rows=1 width=28)
                    Hash Cond: (branch.id = senha.branch)
                    -> Seq Scan on branch (cost=0.00..1.49 rows=49 width=28)
                    -> Hash (cost=0.46..0.46 rows=1 width=24)
                          -> Index Scan using ix_senha_datemissao on senha (cost=0.08..0.45 rows=1 width=24)
                                Index Cond: ((datemissao >= date_trunc('day'::text, now())) AND (datemissao <= date_trunc('hour'::text, now())))
(1 rows)
```

```
“Không phải thiếu phần cứng,
Không phải do network traffic,
Không phải do front-end chậm,
Vấn đề hiệu năng lớn nhất trong đa số ứng dụng database là do SQL code kém.”
— Joe Celko
```
