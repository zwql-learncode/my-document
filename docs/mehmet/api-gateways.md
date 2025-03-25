---
id: api-gateways_mehmet
title: 10. API Gateways
---

# API Gateways Document

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

## 1. Gateway Routing Pattern

Gateway Routing Pattern (Mô hình định tuyến qua cổng) giúp định tuyến các request đến nhiều microservices khác nhau nhưng chỉ thông qua một endpoint duy nhất. Mô hình này hữu ích khi ta muốn gộp nhiều dịch vụ lại dưới một endpoint duy nhất, sau đó dựa vào nội dung request để chuyển tiếp đến các microservices backend tương ứng. Khi client cần gọi nhiều microservices, mô hình này cho phép tạo ra một endpoint trung gian, xử lý yêu cầu và định tuyến chúng đến từng dịch vụ phù hợp.

- Ví dụ: Trong một hệ thống ECommerce, ta có các dịch vụ như giỏ hàng, giảm giá và lịch sử đơn hàng. Gateway Routing Pattern sẽ cung cấp một endpoint duy nhất cho client application. Khi client gửi request đến endpoint này, mô hình sẽ định tuyến request đến các microservices nội bộ tương ứng, bao gồm giỏ hàng, giảm giá và đơn hàng.

Điều đó có nghĩa là Gateway Routing Pattern rất hữu ích trong trường hợp client cần tương tác với nhiều microservices. Nếu một trong các microservices bị thay đổi hoặc được thay thế bằng một microservice khác, client sẽ không cần biết và cũng không phải chỉnh sửa bất kỳ đoạn code nào phía client. Client vẫn có thể gửi yêu cầu đến API Gateway, và thay đổi duy nhất chỉ là cấu hình định tuyến trong Gateway.

Bằng cách này, API Gateway đóng vai trò như một lớp trung gian giúp tách biệt các microservices backend khỏi ứng dụng client, cho phép bạn giữ code phía client đơn giản ngay cả khi các dịch vụ backend thay đổi phía sau API Gateway.

Ngoài ra, mô hình này đặc biệt hữu ích khi bạn có nhiều phiên bản API khác nhau của cùng một microservice. Điều đó có nghĩa là nếu bạn triển khai API microservices theo mô hình Blue-Green hoặc Canary deployments, bạn có thể dần dần chuyển hướng các yêu cầu sang phiên bản API mới thông qua Gateway Routing Pattern.

Mô hình Gateway Routing mang lại sự linh hoạt trong việc sử dụng các phiên bản API khác nhau để xử lý yêu cầu. Nếu phiên bản API mới gặp lỗi, bạn có thể nhanh chóng rollback về phiên bản cũ chỉ bằng cách thay đổi cấu hình trên API Gateway mà không cần chỉnh sửa code phía client.

## 2. API Gateways Pattern

API Gateway là single point of entry (điểm truy cập duy nhất) cho các ứng dụng client, đóng vai trò trung gian giữa client và nhiều dịch vụ backend. Nó quản lý việc định tuyến yêu cầu đến các microservices nội bộ và có khả năng tổng hợp nhiều response từ các microservices thành một response duy nhất. Ngoài ra, API Gateway cũng xử lý các cross-cutting concerns như authentication & authorization (xác thực & phân quyền), protocol translation (chuyển đổi giao thức), rate limiting (giới hạn tốc độ), ghi log, , monitoring (giám sát), load balancing (cân bằng tải), v.v.

API Gateway Pattern được sử dụng cho thiết kế và xây dựng hệ thống microservice phức tạp với nhiều client application. API Gateway có nét tương đồng với Facade Pattern trong object-oriented design (thiết kế hướng đối tượng), nhưng nó là một phần của distributed system (hệ thống phân tán), hoạt động như một reverse proxy hoặc gateway routing để xử lý synchronous communication model (mô hình giao tiếp đồng bộ). Vì có sự tương đồng với Facade Pattern, API Gateway cung cấp một điểm truy cập duy nhất vào các API, đồng thời đóng gói và che giấu kiến trúc hệ thống bên dưới.

Mô hình API Gateway cung cấp một reverse proxy để chuyển hướng hoặc định tuyến các request đến các endpoint của microservices nội bộ. Nó cung cấp một single point of entry (điểm truy cập duy nhất) cho client application và bên trong nó sẽ ánh xạ các yêu cầu đến các microservices nội bộ.

Tuy nhiên, khi có nhiều ứng dụng kết nối đến một API Gateway duy nhất. Nếu chỉ có một API Gateway, hệ thống sẽ đối mặt với rủi ro single point of failure (điểm lỗi đơn). Khi số lượng ứng dụng client tăng lên hoặc business logic trong API Gateway trở nên phức tạp hơn, đây sẽ trở thành một anti-pattern. Vì vậy, cách tốt nhất là tách nhỏ API Gateway thành nhiều dịch vụ hoặc sử dụng nhiều API Gateway có chức năng tương tự nhau. Chúng ta sẽ tìm hiểu về mô hình BFF Pattern (Backend-for-Frontend Pattern) sau.

Tóm lại, API Gateway nằm giữa client application và các microservices nội bộ. Nó hoạt động như một reverse proxy, định tuyến yêu cầu từ client đến các dịch vụ backend. Ngoài ra, API Gateway còn hỗ trợ các vấn đề cross-cutting concerns như authentication & authorization (xác thực & phân quyền), monitoring (giám sát), load balancing (cân bằng tải), v.v. Và chúng ta cần cẩn trọng khi sử dụng một API Gateway duy nhất. API Gateway nên được phân tách dựa trên business boundaries (ranh giới nghiệp vụ) của từng ứng dụng client, thay vì trở thành một bộ tổng hợp duy nhất cho tất cả microservices nội bộ.

## 3. Lợi ích của API Gateway Pattern

### Reverse Proxy & Gateway Routing

API Gateway hoạt động như một reverse proxy, giúp redirect requests (chuyển hướng các yêu cầu) đến các endpoint của microservices nội bộ.

Thông thường, API Gateway sử dụng định tuyến tầng 7 (Layer 7 routing) để xử lý các yêu cầu HTTP. Điều này giúp tách biệt ứng dụng client với hệ thống microservices, tạo ra sự phân tách trách nhiệm ở cấp mạng (network layer).

Một lợi ích quan trọng khác là obstructing internal operations (ẩn đi các hoạt động nội bộ). API Gateway cung cấp một lớp trừu tượng giữa client và backend, giúp client không bị ảnh hưởng ngay cả khi có thay đổi trong hệ thống backend. Khi backend microservices thay đổi, thay vì phải cập nhật client, API Gateway chỉ cần thay đổi configuration file để định tuyến đến service mới.

### Requests Aggregation & Gateway Aggregation

API Gateway có khả năng tổng hợp nhiều microservices nội bộ thành một request duy nhất từ phía client.

Với cách tiếp cận này, client application chỉ cần gửi một request đến API Gateway. Sau đó, API Gateway sẽ gửi nhiều request đến các microservices nội bộ, tổng hợp kết quả và trả về một response duy nhất cho client.

Lợi ích chính của mô hình này là giảm thiểu số lượng chattiness communication (giao tiếp qua lại) giữa client và các dịch vụ backend, giúp tối ưu hiệu suất và giảm độ trễ mạng.

### Cross-cutting Concerns & Gateway Offloading

Vì API Gateway xử lý tất cả các request từ client tại một điểm tập trung, việc triển khai các Cross-cutting Concerns (dịch vụ chung) tại API Gateway là một giải pháp tối ưu.

Các dịch vụ chung có thể bao gồm:

- Xác thực (Authentication) & Phân quyền (Authorization)
- Service Discovery & Integration
- Caching & Retry Policy
- Circuit Breaker (Chống lỗi lan truyền)
- Rate Limiting (Giới hạn tốc độ) & Throttling (Điều tiết lưu lượng)
- Cân bằng tải (Load Balancing)
- Logging, Tracing (Theo dõi), Correlation (Tương quan dữ liệu)
- IP Allowlisting

Và nhiều tính năng khác giúp tăng độ ổn định và khả năng phục hồi của hệ thống.

## 4. BFF Pattern (Backend for Frontend Pattern)

Trong hệ thống, có nhiều dịch vụ backend được các ứng dụng frontend sử dụng. API Gateway được đặt ở giữa để routing (xử lý điều phối) và aggregation (tổng hợp dữ liệu). Tuy nhiên, cách này có thể dẫn đến rủi ro single point of failure (điểm lỗi duy nhất). Khi mà một API Gateway đơn lẻ và quá phức tạp có thể gây rủi ro và trở thành nút thắt cổ chai trong kiến trúc hệ thống.

Do đó, mô hình Backend for Frontend (BFF) đề xuất nên tách API Gateway theo từng frontend application cụ thể. Chúng ta sẽ triển khai nhiều API Gateway bằng cách nhóm theo loại client theo từng phạm vi cụ thể như mobile, web và desktop. Hữu ích khi bạn muốn tránh phải tùy chỉnh một backend duy nhất cho nhiều giao diện khác nhau.

- Ví dụ: Dữ liệu mà giao diện mobile cần có thể khác với dữ liệu mà trình duyệt web sử dụng. Trong trường hợp này, để tối ưu hóa cách hiển thị dữ liệu, có thể sử dụng hai API Gateway riêng biệt, một dành cho web và một dành cho mobile.

Những API Gateway này giúp tối ưu hóa nhu cầu của từng môi trường frontend mà không ảnh hưởng đến các ứng dụng frontend khác. Mô hình BFF cung cấp hướng dẫn để triển khai nhiều API Gateway một cách hiệu quả.

## 5. Reverse Proxy

Reverse Proxy là một máy chủ trung gian đứng trước các web server và chuyển tiếp request từ client đến các web server đó. Nó được sử dụng để triển khai Gateway Routing và các API Gateways Pattern.

Reverse Proxy hoạt động như một bộ trung gian, tiếp nhận request từ client và chuyển tiếp chúng đến các server cung cấp tài nguyên.

### Chức năng

- Load Balancing (Cân bằng tải): Phân phối lưu lượng truy cập đến nhiều máy chủ để tránh tình trạng một máy chủ bị quá tải.

- Offloading: Hỗ trợ thực hiện các tác vụ như xác thực, mã hóa SSL, bộ nhớ đệm (caching), v.v.

- Bảo mật: Tăng cường bảo mật bằng cách tạo một lớp bảo vệ, che giấu thông tin chi tiết của các máy chủ backend khỏi truy cập từ bên ngoài.

## 6. YARP (Yet Another Reverse Proxy)

### YARP là gì?

![YARP Architecture image](/img/mehmet/yarp-architecture.png)

> _YARP Architecture_

YARP là một giải pháp reverse proxy nhẹ, có khả năng tùy chỉnh cao, được Microsoft phát triển dành riêng cho các ứng dụng .NET.

- Tích hợp liền mạch với .NET Core, dễ dàng thêm vào các dự án .NET hiện có.
- Hỗ trợ điều hướng yêu cầu linh hoạt, giúp định tuyến các request đến nhiều dịch vụ backend khác nhau.

YARP cung cấp nhiều tính năng mạnh mẽ, bao gồm:

- Tùy chỉnh quy tắc định tuyến: Cho phép thiết lập chi tiết cách request được điều hướng đến các dịch vụ backend.

- Đa nền tảng: Chạy trên Windows, Linux, macOS nhờ được xây dựng trên .NET Core.

- Hỗ trợ các giao thức mới nhất: gRPC, HTTP/2, WebSockets.

- Hiệu suất cao: Tối ưu hóa cho độ trễ thấp, thông lượng cao, phù hợp với các ứng dụng yêu cầu proxy hiệu suất lớn.

- Health Checks: Theo dõi trạng thái của các backend service, tự động điều hướng lại lưu lượng khi cần thiết.

- Modern HTTP Client: Tận dụng các tính năng HTTP Client mới nhất của .NET để cải thiện hiệu suất.

### YARP Pineline

- Incoming Request (Tiếp nhận Yêu Cầu): Request từ client được tiếp nhận bởi frontend ASP.NET Core. ASP.NET Core đóng vai trò là điểm đầu vào, xử lý các HTTP reuqest.

- Routing (Định Tuyến): YARP sử dụng route table (bảng định tuyến) để so khớp request đến với một tuyến đường cụ thể. Các tuyến đường này được cấu hình thông qua các nguồn như tệp JSON. Sau đó, YARP ánh xạ tuyến đường này đến một cluster, xác định các backend service tiềm năng.

- Request Processing (Xử Lý Yêu Cầu): YARP có thể biến đổi yêu cầu bằng cách sửa đổi URL, header và các thuộc tính khác.

  - Session Affinity: Nếu có, YARP đảm bảo các yêu cầu từ một client nhất quán được định tuyến đến cùng một máy chủ.
  - Load Balancing: YARP sử dụng các thuật toán như "power of 2 choices" để chọn dịch vụ backend phù hợp, phân phối tải đều.
  - Health Checks: YARP kiểm tra trạng thái của các dịch vụ backend (chủ động và thụ động) để đảm bảo chỉ chuyển tiếp yêu cầu đến các dịch vụ khỏe mạnh.

- Forwarding Request (Chuyển Tiếp Yêu Cầu): Yêu cầu đã được xử lý được chuyển tiếp đến dịch vụ backend được chọn thông qua HTTP client (HttpClient được YARP sử dụng để giao tiếp với các backend service).

- Response Processing (Xử Lý Phản Hồi): YARP nhận và có thể xử lí phản hồi từ Backend Server.

- Return Response (Trả Về Phản Hồi): YARP trả phản hồi về cho Client.
