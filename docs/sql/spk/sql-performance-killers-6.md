---
id: sql-performance-killers-6
title: Individual inserts vs Bulk inserts
---

# SQL Performance Killers - Individual inserts vs Bulk inserts

Nguồn: Bài viết "SQL Performance Killers - Individual inserts vs Bulk inserts" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-individual-inserts-vs-bulk-inserts-14176c201673)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Tiếp tục chuỗi `SQL performance killers` (sau một thời gian dài), trong bài viết này tôi sẽ giải thích vì sao `bulk insert` thường nhanh hơn nhiều so với việc thực hiện nhiều `individual insert` riêng lẻ.

Bulk insert nhanh hơn individual insert vì một số lý do sau:

## 1. Reduced network traffic - Giảm traffic mạng

Bulk insert giúp giảm lượng dữ liệu truyền giữa ứng dụng và database server. Trong nhiều trường hợp, độ trễ mạng (network latency) là một nút thắt cổ chai ảnh hưởng đến hiệu năng database. Bằng cách gửi một batch dữ liệu duy nhất, bạn có thể giảm ảnh hưởng của network latency và tăng hiệu suất.

Xem thêm: [Batching là gì? Tại sao Batching lại quan trọng?](/docs/random/batching-performance.md)

## 2. Reduced transaction overhead - Giảm transaction overhead

Mỗi individual insert thường được bao bọc trong một transaction riêng biệt, điều này gây ra overhead do phải quản lý transaction. Bulk insert có thể thực hiện trong một transaction duy nhất, từ đó giảm overhead liên quan đến quản lý transaction và đảm bảo tính nhất quán dữ liệu (data consistency).

## 3. Locking & concurrency

Khi bạn thực hiện nhiều individual insert, mỗi insert có thể yêu cầu lock trên các `affected row` (các row bị ảnh hưởng), dẫn đến `contention` (tranh chấp) và `concurrency`(vấn đề đồng thời) trong `multi-user environment` (môi trường nhiều người dùng). `Bulk insert` thường lock toàn bộ table hoặc một tập rows nhất định, giúp giảm `contention` và tăng khả năng xử lý đồng thời (improving concurrency).

## 4. Logging & Indexing

Các database thường duy trì `transaction log` và `index` để đảm bảo tính nhất quán và hiệu suất truy vấn. `Bulk insert` hiệu quả hơn về mặt logging và indexing vì nó liên quan đến ít transaction hơn và cập nhật index ít hơn.

## Ví dụ thực tế

Tôi thực hiện insert 40,000 rows vào một bảng mẫu, trước tiên bằng cách sử dụng `individual inserts`, sau đó dùng `bulk insert`.

### Individual inserts

```sql
INSERT INTO TB_INSERT(NAME) VALUES ('AF9CB08DF4F7B71F033CC857ECF30C21');
INSERT INTO TB_INSERT(NAME) VALUES ('B16D3C99C04F223E362BC0E1B4FFE7CD');
...
INSERT INTO TB_INSERT(NAME) VALUES ('BEDB35BC448FD5F32F37B86BECFDF225');
INSERT INTO TB_INSERT(NAME) VALUES ('4436A24C954EA17AEE9E92D4F16FAD20');
```

- UPDATED ROWS: 40000

- START TIME: MON NOV 06 14:52:02 PST 2023

- FINISH TIME: MON NOV 06 14:52:22 PST 2023

➡️ Total Execution Time: ~20s

### Bulk insert

```sql
INSERT INTO TB_INSERT(NAME) VALUES
('AF9CB08DF4F7B71F033CC857ECF30C21'),
('B16D3C99C04F223E362BC0E1B4FFE7CD'),
...
('BEDB35BC448FD5F32F37B86BECFDF225'),
('4436A24C954EA17AEE9E92D4F16FAD20');
```

- UPDATED ROWS: 40000

- START TIME: MON NOV 06 14:56:32 PST 2023

- FINISH TIME: MON NOV 06 14:56:34 PST 2023

➡️ Total Execution Time: ~2s

## Tổng kết

Như bạn thấy, việc insert 40,000 rows vào table bằng `bulk insert` nhanh hơn gấp 10 lần so với việc thực hiện các `individual insert`. `Individual insert` mất 20 giây để hoàn thành, trong khi `bulk insert` chỉ mất 2 giây.

Tuy nhiên, Hiệu quả của `bulk insert` còn phụ thuộc vào DBMS (database management system) mà bạn sử dụng cũng như use case cụ thể. Hãy luôn cân nhắc đặc điểm của database và yêu cầu của ứng dụng trước khi quyết định nên dùng `bulk insert` hay `individual insert`.

```
“Không phải thiếu phần cứng,
Không phải do network traffic,
Không phải do front-end chậm,
Vấn đề hiệu năng lớn nhất trong đa số ứng dụng database là do SQL code kém.”
— Joe Celko
```
