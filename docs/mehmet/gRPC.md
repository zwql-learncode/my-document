---
id: grpc_mehmet
title: 6. gRPC
---

# Giao tiếp đồng bộ trong Microservices với gRPCs

Trong dự án này, chúng ta sẽ triển khai Distributed Caching bằng Cache-Aside Pattern với Redis, Proxy Pattern, Decorator Pattern và thư viện Scrutor. Cấu hình Redis làm Distributed Cache trong môi trường Docker multi-container bằng docker-compose.

## 1. Giao tiếp trong Microservices

Trong microservices, client và các service giao tiếp với nhau bằng nhiều phương thức khác nhau. Về cơ bản, các phương thức này có thể được phân loại theo hai cách chính:

- Giao tiếp đồng bộ (Synchronous Communication)
- Giao tiếp bất đồng bộ (Asynchronous Communication)

### 1.1. Giao tiếp đồng bộ trong Microservices

#### Định nghĩa

- Giao tiếp đồng bộ xảy ra khi client gửi request và chờ đợi response từ service.
- Thông thường sử dụng giao thức HTTP hoặc gRPC để trả về phản hồi đồng bộ.
- Trong quá trình này, thread của client bị chặn (blocked) cho đến khi nhận được phản hồi từ server.

#### Cách hoạt động

1. Client gửi request bằng giao thức HTTP/gRPC.
2. Client bị chặn cho đến khi nhận được response từ server.
3. Sau khi nhận được response, client tiếp tục thực thi công việc.

#### Ưu điểm

- Đơn giản, dễ hiểu, dễ triển khai.
- Phù hợp với các tình huống yêu cầu phản hồi ngay lập tức.

#### Nhược điểm

- Nếu server chậm, client sẽ bị chặn, làm giảm hiệu suất.
- Tạo độ phụ thuộc cao giữa các service, gây khó khăn trong việc mở rộng hệ thống.

### 1.2. Giao tiếp bất đồng bộ trong Microservices

#### Định nghĩa

- Client gửi request nhưng không chờ đợi response từ service.
- Thread của client không bị chặn (non-blocking) trong quá trình chờ response. server.

#### Cách hoạt động

Client gửi message thông qua message broker (như Kafka, RabbitMQ). Sử dụng giao thức AMQP - Advanced Message Queuing Protocol.

- Producer (người gửi message) không cần chờ phản hồi từ service.
- Subscriber (người nhận message) xử lý message một cách bất đồng bộ.

#### Ưu điểm

- Không làm chậm hệ thống do client không bị chặn.
- Giảm độ phụ thuộc giữa các service, dễ mở rộng hệ thống.

#### Nhược điểm

- Phức tạp hơn, cần có message broker trung gian.
- Khó debug do không có phản hồi ngay lập tức.

## 2. Best Practices cho Giao tiếp Đồng bộ

Trong giao tiếp đồng bộ (Synchronous Communication), các microservices sử dụng mô hình request/response với giao thức HTTP và REST (mở rộng sang gRPC và GraphQL).

Dựa trên mô hình này, có thể phân loại thành 4 loại giao tiếp chính trong microservices:

### 2.1. RESTful API: when exposing from microservices

Ưu điểm:

- Dễ triển khai, phổ biến, hỗ trợ tốt từ nhiều framework.
- Có thể dễ dàng mở rộng với API Gateway.

Nhược điểm:

- Không tối ưu về performance (do sử dụng text-based JSON/XML).
- Không hỗ trợ streaming data hoặc real-time communication.

REST API phù hợp để `exposing` các service: Cung cấp, công khai giao diện để các hệ thống khác có thể gọi và sử dụng.

Cụ thể là, REST dùng để mở các endpoint API của các back-end services để các front-end application hoặc mobile application có thể lấy dữ liệu có thể truy cập.

### 2.2. gRPC: when communicate internal microservices

gRPC là giao thức gọi thủ tục từ xa (Remote Procedure Call - RPC), sử dụng protobuf thay vì JSON/XML.

Ưu điểm:

- Hiệu suất cao hơn REST do sử dụng binary format (protobuf).
- Hỗ trợ streaming và giao tiếp đa ngôn ngữ.

Nhược điểm:

- Phức tạp hơn RESTful API, cần hiểu rõ về protobuf.
- Không hỗ trợ native trên trình duyệt (cần proxy chuyển đổi sang HTTP).

gRPC phù hợp cho giao tiếp nội bộ giữa các service.

### 2.3. GraphQL API: when structured flexible data in microservices.

Ưu điểm:

- Linh hoạt hơn REST vì client chỉ lấy đúng dữ liệu cần thiết.
- Giảm số lượng request nhờ khả năng truy vấn đa nguồn dữ liệu.

Nhược điểm:

- Phức tạp hơn REST, đòi hỏi client phải hiểu schema.
- Có thể gây tải nặng lên server nếu truy vấn không được tối ưu.

GraphQL API được sử dụng trong microservices khi cần truy vấn dữ liệu có cấu trúc linh hoạt và không cố định.

### 2.4. WebSocket API: when real-time bi-directional communication

WebSocket cho phép kết nối liên tục hai chiều giữa client và server.

Ưu điểm:

- Giao tiếp hai chiều real-time, không cần request liên tục như REST.
- Giảm độ trễ so với HTTP polling.

Nhược điểm:

- Không phù hợp với các API dạng request/response thông thường.
- Cần có cơ chế bảo mật tốt hơn do giữ kết nối mở liên tục.

WebSocket API thích hợp với các giao tiếp thời gian thực hai chiều như: chat, live notification,...

## 3. gRPC là gì?

RPC (Remote Procedure Call) hay `Gọi thủ tục từ xa`, là một mô hình giao tiếp giữa các ứng dụng trên các máy tính khác nhau trong một mạng. Nó cho phép một chương trình trên một máy tính gọi một thủ tục (hàm) trên một máy tính khác như thể thủ tục đó đang chạy trên máy tính cục bộ.

gRPC là một gRPC là một framework RPC mã nguồn mở do Google phát triển. Dùng để kết nối các dịch vụ và xây dựng hệ thống phân tán (distributed system) một cách hiệu quả.

Nó được thiết kế với trọng tâm hàng đầu là hiệu suất cao, một yếu tố then chốt trong các hệ thống phân tán hiện đại. gRPC sử dụng giao thức HTTP/2 làm nền tảng truyền tải, cho phép nhiều luồng dữ liệu được truyền đồng thời trên một kết nối duy nhất. Điều này giảm thiểu độ trễ và tăng thông lượng, đặc biệt quan trọng khi xử lý nhiều yêu cầu đồng thời. Hơn nữa, gRPC truyền tải dữ liệu dưới dạng thông điệp nhị phân, giúp giảm kích thước dữ liệu và tăng tốc độ xử lý so với JSON hay XML.

Để định nghĩa cấu trúc dữ liệu và giao diện dịch vụ, gRPC dựa vào Protocol Buffers (Protobuf), cho phép định nghĩa các hợp đồng dịch vụ một cách rõ ràng và hiệu quả. Điểm đặc biệt của Protobuf là tính độc lập ngôn ngữ, nghĩa là bạn có thể định nghĩa giao diện một lần và sử dụng nó trong bất kỳ ngôn ngữ lập trình nào được gRPC hỗ trợ. Sau khi định nghĩa hợp đồng bằng Protobuf, gRPC có thể tự động tạo mã (bindings) client và server đa nền tảng cho nhiều ngôn ngữ lập trình phổ biến. Điều này giúp đảm bảo tính nhất quán giữa các service.

Trong microservices, các service nội bộ cần giao tiếp với nhau một cách nhanh chóng và hiệu quả. Và gRPC đáp ứng hoàn hảo yêu cầu này, nó cho phép các developer tạo ra các service có thể giao tiếp với nhau một cách hiệu quả và độc lập với đa ngôn ngữ. Chỉ cần định nghĩa hợp đồng dịch vụ bằng Protobuf, gRPC sẽ tự động sinh mã để thiết lập cơ sở hạ tầng giao tiếp, bao gồm việc tuần tự hóa/giải tuần tự hóa dữ liệu, xử lý yêu cầu/phản hồi, và quản lý kết nối. Tính năng này giúp đơn giản hóa đáng kể quá trình phát triển và bảo trì hệ thống microservices.

## 4. gRPC hoạt động như thế nào?

Khác với REST API tập trung vào việc truy xuất và thao tác các tài nguyên thông qua các phương thức. gRPC lại ưu tiên việc `function calls` từ xa.

- Lưu ý: Trong ngữ cảnh giao tiếp nội bộ giữa các service của kiến trúc Microservices, server là service được gọi bằng gRPC, còn client là service dùng gRPC gọi đi (không phải front-end application hay moblie application).

Điều này có nghĩa là thay vì gửi các HTTP request phức tạp, client có khả năng gọi trực tiếp một phương thức nằm trên server như là phương thức đó đang chạy cục trong client. Các định nghĩa này được thực hiện thông qua ngôn ngữ Protocol Buffers (Protobuf), đảm bảo tính nhất quán và hiệu quả trong việc truyền tải dữ liệu.

- Ở phía server-side, server sẽ triển khai giao diện đã được định nghĩa trong Protobuf. Điều này bao gồm việc viết mã để thực hiện logic nghiệp vụ cho từng phương thức. Sau đó, server sẽ chạy một máy chủ gRPC để lắng nghe và xử lý các cuộc gọi từ client. Khi một cuộc gọi đến, máy chủ gRPC sẽ phân tích yêu cầu, thực thi phương thức tương ứng, và trả về kết quả cho client.

- Ở phía client-side, client sẽ có một stub (bộ khung) được tạo ra từ định nghĩa Protobuf. Stub này cung cấp các phương thức giống hệt như các phương thức được định nghĩa trên server. Khi client gọi một phương thức trên stub, stub sẽ chịu trách nhiệm chuyển đổi cuộc gọi thành một yêu cầu gRPC, gửi yêu cầu đến server, nhận phản hồi, và trả về kết quả cho client. Stub hoạt động như một proxy, giúp client tương tác với server một cách dễ dàng và minh bạch.

Một trong những ưu điểm nổi bật của gRPC là khả năng tương thích môi trường đa dạng. Nhờ vào việc sử dụng Protobuf, gRPC có thể hoạt động và giao tiếp giữa các client và server được viết bằng nhiều ngôn ngữ lập trình khác nhau, chạy trên các hệ điều hành khác nhau, và trong các môi trường mạng khác nhau. Điều này tạo ra một nền tảng linh hoạt và mạnh mẽ cho việc xây dựng các hệ thống phân tán phức tạp.
