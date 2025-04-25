---
id: sql-performance-killers-5
title: Stale Statistics
---

# SQL Performance Killers - STALE STATISTICS (Thống kế cũ)

Nguồn: Bài viết "SQL Performance Killers - Stale statistics" của tác giả [Matheus Oliveira](https://medium.com/nazar-io/sql-performance-killers-stale-statistics-f735411facc8)

Một phần quan trọng trong công việc hằng ngày của tôi là hỗ trợ developer, database administrator, devops, sysadmin và project manager xác định và xử lý các đoạn SQL code kém hiệu năng - sử dụng [Nazar.io](https://www.nazar.ai/). Mục tiêu của chuỗi bài viết `SQL Performance Killers` là chia sẻ các ví dụ thực tiễn về tối ưu SQL (SQL tuning).

Tiếp tục chuỗi bài viết `SQL performance killers`, trong bài viết thứ năm này, tôi sẽ giải thích lý do tại sao bạn nên duy trì `database statistics` (thống kê cơ sở dữ liệu) được cập nhật.

Khi một câu lệnh SQL hợp lệ được gửi đến database server, lần đầu tiên `query optimizer` (bộ tối ưu hóa truy vấn) sẽ chọn `execution plan` (chiến lược thực thi) tốt nhất cho câu lệnh SQL đó. Về cơ bản có hai loại `optimizer` (bộ tối ưu hóa): `Rule Based Optimizer (RBO)` (bộ tối ưu hóa dựa trên quy tắc) và `Cost-based Optimizer (CBO)` (bộ tối ưu hóa dựa trên chi phí).

## RBO - Rule Based Optimizer

RBO là phương pháp `optimization` (tối ưu hóa) đầu tiên và như tên gọi của nó, về cơ bản là một danh sách các quy tắc mà cơ sở dữ liệu phải tuân theo để generate ra một `execution plan` (chiến lược thực thi).

## CBO - Cost-based Optimizer

CBO là một sự phát triển của `RBO optimizer` và nó examines xem xét tất cả các `possible plans` (kế hoạch khả thi) cho một câu lệnh SQL và chọn ra kế hoạch có `lowest cost` (mức chi phí thấp nhất), trong đó `cost` (chi phí) đại diện cho `estimated resource usage` (ước tính mức sử dụng tài nguyên) cho một kế hoạch cụ thể. Để ước tính tài nguyên cần thiết cho mỗi `execution plan` (kế hoạch thực thi), CBO phải có thông tin về tất cả các đối tượng được truy cập trong câu lệnh SQL. Thông tin này chính là `database statistics` (thống kê cơ sở dữ liệu).

## Ví dụ thực tế

Tuần trước, chúng tôi đã bắt đầu một dự án tư vấn với thử thách là xác định nguyên nhân gốc rễ của `poor performance` (hiệu năng kém) và `instability` (tính không ổn định) của một Oracle RDS (Relational Database Service - Dịch vụ Cơ sở dữ liệu Quan hệ) trong một ứng dụng cực kỳ quan trọng. Các triệu chứng là mức tiêu thụ bộ nhớ cao, tăng số lần ghi vào disk, tăng số lượng kết nối database và nhiều phiên bị treo. Mỗi khi vấn đề xảy ra, team chỉ có vài phút để bắt đầu hủy các phiên bị treo, nếu không `database instance` (phiên bản cơ sở dữ liệu) sẽ bị `abnormally terminated` (kết thúc bất thường).

Bằng cách giám sát vấn đề khi nó xảy ra, chúng tôi có thể thấy rằng tất cả các phiên bị treo đều đang thực thi cùng một truy vấn và tất cả chúng đều đang chờ đợi event `DIRECT PATH WRITE TEMP` với các `HASH` segments (phân đoạn) trên `TEMP tablespace` (không gian bảng tạm).

“HASH” segments on TEMP tablespace:

```
TABLESPACE | HASH_VALUE            | SEGTYPE  | CONTENTS  | BLOCKS
-----------|-----------------------|----------|-----------|--------
TEMP       | 0/2386662101          | LOB_DATA | TEMPORARY |    128
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY |  33792
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY | 141952
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY | 239744
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY | 292224
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY | 360832
TEMP       | 3331384381/2866845384 | HASH     | TEMPORARY | 476160
```

Phân tích các `query plan` (kế hoạch truy vấn), chúng tôi xác nhận rằng chúng đang sử dụng `HASH JOINS` (phép nối băm), đây là một kiểu `JOIN` dựa trên bộ nhớ, rất hiệu quả khi tập dữ liệu phù hợp với bộ nhớ. Nếu các tập dữ liệu không vừa bộ nhớ, thì nó sẽ sử dụng rất nhiều `sort area memory` (vùng nhớ sắp xếp) và I/O đến `temporary tablespace` (không gian bảng tạm).

Đào sâu hơn vào quá trình phân tích, chúng tôi phát hiện ra rằng thống kê trên database đã cũ. Một trong những bảng chính có khoảng 1.5 triệu rows trong khi thống kê chỉ hiển thị 55 nghìn rows. Sau đó, chúng tôi thu thập thống kê cho các bảng chính được sử dụng bởi các queries và tất cả `HASH JOIN` (phép nối băm) đã được thay thế bằng `NESTED LOOPS` (vòng lặp lồng nhau).

`Optimizer` (bộ tối ưu hóa) đã đưa ra các quyết định sai lầm dựa trên thống kê cũ. Nó quyết định rằng data được sử dụng bởi `HASH JOIN` (phép nối băm) sẽ vừa bộ nhớ nhưng thực tế nó đã không vừa, gây ra mức sử dụng cao ở `sort area memory` (vùng nhớ sắp xếp) và `temporary tablespace` (không gian bảng tạm).

## Kết luận

Duy trì thống kê chính xác đảm bảo rằng `Optimizer` (bộ tối ưu hóa) sẽ có nguồn thông tin tốt nhất có thể để determine xác định `execution plan` (chiến lược thực thi) tốt nhất.

```
“Không phải thiếu phần cứng,
Không phải do network traffic,
Không phải do front-end chậm,
Vấn đề hiệu năng lớn nhất trong đa số ứng dụng database là do SQL code kém.”
— Joe Celko
```
