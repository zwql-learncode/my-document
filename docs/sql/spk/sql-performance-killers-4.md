---
id: sql-performance-killers-4
title: Views
---

# SQL Performance Killers - VIEWS

Nguồn: Bài viết "SQL Performance Killers - Views" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-views-c03b88a0fdfd)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Tiếp tục chuỗi bài viết về `SQL performance killers`, trong phần thứ 4 này, chúng ta sẽ cùng tìm hiểu cách cơ sở dữ liệu xử lý các VIEW và tác động của chúng đến hiệu năng ứng dụng.

Về cơ bản, `VIEWS` được xử lý bằng thuật toán `MERGE` hoặc `TEMPTABLE`.

## MERGE algorithm

Khi `VIEW` được xử lý bằng thuật toán MERGE, `optimizer` (bộ tối ưu hóa) sẽ viết lại query bằng cách merging code của `VIEW` với `code` từ query. Trong hầu hết các trường hợp, kết quả của `query plan` sẽ giống như khi query trực tiếp vào các table mà không cần sử dụng view. Trong trường hợp này, việc sử dụng view không gây ra bất kỳ ảnh hưởng hiệu năng nào.

## TEMPTABLE algorithm

Vấn đề xảy ra khi thuật toán TEMPTABLE được sử dụng để xử lý VIEW. Khi sử dụng thuật toán TEMPTABLE (bảng tạm), `optimizer` (bộ tối ưu hóa) sẽ thực thi code của `VIEW` trước và tạo một `temporary table` (bảng tạm) với `resultset` (tập kết quả) từ `VIEW`, và just sau đó nó thực truy vấn trên bảng tạm đó.

## Ví dụ thực tế

### MERGE algorithm

Giả sử bạn có một bảng `address` (địa chỉ) với khoảng 30 triệu rows và bạn tạo một VIEW `vw_address_brazil` với các địa chỉ chỉ từ Brazil.

Create view vw_address_brazil:

```sql
CREATE VIEW vw_address_brazil AS
SELECT *
FROM address
WHERE country = 'Brazil';
```

Sau đó, bạn viết truy vấn để đếm có bao nhiêu địa chỉ từ Brazil nằm trong tiểu bang PERNAMBUCO bằng cách sử dụng view `vw_address_brazil`.

Query on vw_address_brazil view:

```sql
SELECT Count(*)
FROM vw_address_brazil
WHERE state = 'PE';
```

```
mysql> select count(*) from vw_address_brazil where state = 'PE';
+----------+
| count(*) |
+----------+
|    79223 |
+----------+
1 row in set (0.08 sec)

mysql> explain select count(*) from vw_address_brazil where state = 'PE';
+----+-------------+-------------------+-------+-------------------------------------------------+---------------------------------------+---------+-------+-------+-------------+----------+--------------------------+
| id | select_type | table             | type  | possible_keys                                   | key                                   | key_len | ref   | rows  | filtered    | Extra    |
+----+-------------+-------------------+-------+-------------------------------------------------+---------------------------------------+---------+-------+-------+-------------+----------+--------------------------+
|  1 | SIMPLE      | address           | ref   | ix_razor_address_country,ix_razor_address_state | ix_razor_address_country_country_state | 66      | const | 156040 |   100.00    | Using where; Using index |
+----+-------------+-------------------+-------+-------------------------------------------------+---------------------------------------+---------+-------+-------+-------------+----------+--------------------------+
1 row in set (0.08 sec)
```

Đối với query trên, `optimizer` (bộ tối ưu hóa) sử dụng thuật toán `MERGE` và query sẽ có cùng `execution time` (thời gian thực thi) và `execution plan` (chiến lược thực thi) như thể nó đã truy cập trực tiếp vào bảng address mà không cần sử dụng `VIEW`.

Query accessing the table address directly:

```sql
SELECT Count(*)
FROM address
WHERE country = 'Brazil'
  AND state = 'PE';
```

```
mysql> select count(*) from address where country = 'Brazil' and state = 'PE';
+----------+
| count(*) |
+----------+
|    79223 |
+----------+
1 row in set (0.03 sec)

mysql> explain select count(*) from address where country = 'Brazil' and state = 'PE';
+----+-------------+---------+-------+-------------------------------------------------+---------------------------------------+---------+-------------+-------+-------------+----------+--------------------------+
| id | select_type | table   | type  | possible_keys                                   | key                                   | key_len | ref         | rows  | filtered    | Extra    |
+----+-------------+---------+-------+-------------------------------------------------+---------------------------------------+---------+-------------+-------+-------------+----------+--------------------------+
|  1 | SIMPLE      | address | ref   | ix_razor_address_country,ix_razor_address_state | ix_razor_address_country_country_state | 66      | const,const | 156040 |   100.00    | Using where; Using index |
+----+-------------+---------+-------+-------------------------------------------------+---------------------------------------+---------+-------------+-------+-------------+----------+--------------------------+
1 row in set (0.06 sec)
```

### TEMPTABLE algorithm

Bây giờ, chúng ta hãy tạo VIEW `vw_address_country_state` với tổng số địa chỉ từ mỗi tiểu bang ở mỗi quốc gia.

```sql
CREATE VIEW vw_address_country_state AS
SELECT country, state, Count(*)
FROM address
GROUP BY country, state;
```

Sau đó, chúng ta sẽ sử dụng VIEW `vw_address_country_state` để truy vấn tổng số địa chỉ từ Brazil thuộc tiểu bang PERNAMBUCO.

Query on vw_address_country_state view:

```sql
SELECT country, state, total
FROM vw_address_country_state
WHERE country = 'Brazil'
  AND state = 'PE';
```

```
mysql> select country, state, total from vw_address_country_state where country = 'Brazil' and state = 'PE';
+---------+-------+-------+
| country | state | total |
+---------+-------+-------+
| Brazil  | PE    | 79223 |
+---------+-------+-------+
1 row in set (0.11 sec)

mysql> explain select country, state, total from vw_address_country_state where country = 'Brazil' and state = 'PE';
+----+-------------+--------------------+------+---------------+------+---------+------+-------+-------------+
| id | select_type | table              | type | possible_keys | key  | key_len | ref  | rows  | Extra       |
+----+-------------+--------------------+------+---------------+------+---------+------+-------+-------------+
|  1 | PRIMARY     | <derived2>         | ALL  | NULL          | NULL | NULL    | NULL | 8911  | Using where |
|  2 | DERIVED     | address            | index| NULL          | ix_n | 66      | NULL | 34895820| Using index |
+----+-------------+--------------------+------+---------------+------+---------+------+-------+-------------+
2 rows in set (0.30 sec)
```

Lần này, `optimizer` (bộ tối ưu hóa) đã sử dụng thuật toán `TEMPTABLE` (bảng tạm), khiến query truy vấn được thực thi trong 8 giây so với 0.03 giây khi sử dụng thuật toán `MERGE` (hợp nhất). Nguyên nhân của sự chậm trễ này là do lần này, database phải thực thi code từ `VIEW` trước (tính toán tổng số địa chỉ từ mỗi tiểu bang trong mỗi quốc gia) và lưu trữ nó trên một `temporary table` (bảng tạm), và sau đó mới áp dụng filter (bộ lọc) `country = ‘Brazil’` và `state = ‘PE’`.

Thuật toán `MERGE` không thể được sử dụng vì có `count(*)` trong code của `VIEW`. Trong hầu hết các cơ sở dữ liệu quan hệ, nếu 'VIEW' chứa bất kỳ construct (cấu trúc) nào sau đây, thuật toán `MERGE` không thể được sử dụng:

- Aggregate functions (SUM(), MIN(), MAX(), COUNT()…)
- DISTINCT
- GROUP BY
- HAVING
- LIMIT
- UNION or UNION ALL
- Subquery in the select list
- Set operations (Iintersect, Minus…)
- Outer joins

```
“80% các vấn đề về hiệu năng đều xuất phát từ các ứng dụng cơ sở dữ liệu được viết sai cách.” — Craig S. Mullins
```
