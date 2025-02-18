---
id: cqrs
title: 4.CQRS
---

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

# CQRS Document

## 1. CQRS là gì?

CQRS (Command Query Responsibility Segregation) là một design pattern `phân tách các hoạt động đọc và ghi` thông qua việc `tách biệt cơ sở dữ liệu`. Ý tưởng chính là chúng ta có thể chia hoạt động của ứng dụng thành hai loại riêng biệt:

- Command (Ghi): Thực hiện các thay đổi trạng thái của dữ liệu.
- Queries (Đọc): Xử lý các thao tác kết hợp phức tạp và trả về kết quả mà không thay đổi trạng thái của dữ liệu.
  Chúng ta sử dụng CQRS để tránh các truy vấn phức tạp và loại bỏ những phép nối (joins) không hiệu quả. Trong các ứng dụng microservices quy mô lớn, việc sử dụng các phương pháp monolithic như dùng một database duy nhất cho tất cả service có thể gây ra tắc nghẽn cho các hệ thống phức tạp và quy mô lớn. Do đó, cần phải quản lý các yêu cầu về dữ liệu có khối lượng lớn cho các trường hợp sử dụng như thế này. Sử dụng CQRS cung cấp việc phân tách dữ liệu đọc và ghi, giúp tối ưu hóa hiệu suất truy vấn và khả năng mở rộng.

## 2. Tại sao nên sử dụng CQRS?

Với các ứng dụng monolithic có một cơ sở dữ liệu duy nhất thực hiện thao tác đọc (queries) và ghi (command). Tuy nhiên, khi ứng dụng trở nên phức tạp hơn, các thao tác truy vấn và CRUD cũng sẽ trở nên khó quản lý.

- Nếu ứng dụng yêu cầu một truy vấn cần join tới hơn 10 bảng, database sẽ bị lock do độ trễ trong việc tính toán truy vấn.
- Thực hiện các lệnh command cần phải thực hiện các validation phức tạp và xử lý các long busisness logic, sẽ gây tắc nghẽn database.
  Việc đọc và ghi vào database có những phương pháp khác nhau và yêu cầu các chiến lược khác nhau. Để làm được điều này, nên sử dụng nguyên tắc `separation of concerns`bằng cách tách thành 2 database riêng biệt cho việc đọc và ghi. Bằng cách này, chúng ta có thể sử dụng các loại cơ sở dữ liệu khác nhau cho việc đọc và ghi. Ví dụ:
- Sử dụng NoSQL với `de-normalized data`(dữ liệu phi chuẩn hóa) cho read database
- Sử dụng RDBMS với `normalized data`(dữ liệu chuẩn hóa) đảm bảo tính toàn vẹn dữ liệu cho write database.

## 3. Triển khai CQRS

CQRS có thể được triển khai theo hai cách chính: Triển khai logic (Logical Implementation) và Triển khai vật lý (Physical Implementation).

### 3.1. Triển khai logic

- Tách biệt các thao tác đọc (query) và ghi (command) ở cấp độ mã nguồn, nhưng không bắt buộc phải tách biệt cơ sở dữ liệu.
- Cả hai loại thao tác đọc (query) và ghi (command) vẫn tương tác với cùng một cơ sở dữ liệu, nhưng theo những luồng xử lý khác nhau. Điều này có nghĩa là dù vẫn sử dụng cùng một cơ sở dữ liệu, các đường dẫn (paths) để đọc và ghi dữ liệu sẽ không giống nhau.
- Có thể sử dụng các mô hình hoặc phương pháp khác nhau để truy vấn và cập nhật dữ liệu nhằm tối ưu hóa hiệu suất. Ví dụ như:
  - Các thao tác đọc (query) có thể sử dụng DTO (Data Transfer Object) đơn giản, được tối ưu để truy xuất dữ liệu nhanh chóng.
  - Các thao tác ghi (command) có thể sử dụng mô hình domain phức tạp hơn, nhằm đảm bảo các quy tắc nghiệp vụ và ràng buộc dữ liệu được thực thi đúng.

### 3.2. Triển khai vật lý

- Tách riêng thao tác đọc (query) và ghi (command) không chỉ ở cấp độ mã nguồn, mà còn ở cấp độ vật lý, bằng cách sử dụng hai cơ sở dữ liệu riêng biệt.
- Cách tiếp cận này thường xuất hiện trong các hệ thống phức tạp hơn, đặc biệt là khi yêu cầu mở rộng hệ thống trở thành một vấn đề quan trọng. Tuy nhiên, khi tách biệt cơ sở dữ liệu, ta phải đối mặt với thách thức đồng bộ hóa dữ liệu giữa hai hệ thống.
- Mặc dù triển khai vật lý mang lại hiệu suất tốt hơn và khả năng mở rộng cao hơn, nhưng nó cũng làm tăng độ phức tạp, đặc biệt là trong việc duy trì tính nhất quán và đồng bộ dữ liệu giữa hai cơ sở dữ liệu. Do đó, khi tách biệt hoàn toàn cơ sở dữ liệu đọc và ghi, ta cần đặc biệt quan tâm đến cơ chế đồng bộ hóa dữ liệu.
- Chính vì thế, triển khai logic CQRS thường là bước đi đầu tiên khi áp dụng mô hình CQRS, đặc biệt đối với các ứng dụng mà chi phí quản lý hai cơ sở dữ liệu riêng biệt là không đáng kể so với lợi ích mang lại.
- Cách tiếp cận logic giúp tận dụng nhiều lợi ích của CQRS, chẳng hạn như tách biệt rõ ràng các luồng xử lý và tối ưu hóa hiệu suất truy vấn, mà không phải đối mặt với độ phức tạp gia tăng của việc quản lý hai cơ sở dữ liệu riêng biệt.
