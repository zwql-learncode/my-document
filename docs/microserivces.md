---
id: microservices_doc
title: Microservices
---

# Tìm hiểu về Microservices

Tổng hợp từ Mehmet Ozkaya

## 1. Monolithic Architecture

Monolithic Architecture ám chỉ một kiến trúc hệ thống mà tất cả các thành phần của ứng dụng đều nằm trong một source code duy nhất. Chính vì tất cả là một khối nên nó có một số đặc điểm chung đó là:

- Kiến trúc đơn giản, dễ triển khai lên production
- Mọi thứ được phát triển, deploy và scale trên 1 code base duy nhất
- Ứng dụng được viết với 1 technical stack duy nhất

### Vấn đề của Monolithic

- Khó mở rộng & bảo trì:

  - Muốn nâng cấp một service, phải nâng cấp cả khối ứng dụng. Gây khó khăn nếu có các yêu cầu về tài nguyên khác nhau.
  - Phải triển khai lại toàn bộ hệ thống dù chỉ cập nhật hay nâng cấp một phần ứng dụng.
  - Các thành phần trong ứng dụng phụ thuộc lộn xộn với nhau. Thay đổi một thành phần có thể gây tác dụng phụ (side effect) lên thành phần khác. Dẫn đến việc ảnh hưởng việc phát triển giữa các develop team. Mỗi develop team sẽ phải cẩn thận để không làm ảnh hưởng tới develop team khác.
  - Về lâu dài, số lượng code càng phình to, ứng dụng càng khó bảo trì & mở rộng.

- Khả năng chịu lỗi kém: Một service không ổn định có thể làm sập cả hệ thống.

- Khó đổi mới: Ứng dụng Monolithic bị bó buộc trong một technical stack duy nhất. Dẫn đến khó thay đổi hay áp dụng công nghệ mới.

Những hạn chế của Monolithic dẫn tới sự ra đời của kiến trúc Microservices.

## 2. Microservices Architecture

Về cơ bản, Microservices Architecture là kiểu kiến trúc mà ứng dụng sẽ được phân tách thành các dịch vụ nhỏ và độc lập gọi là service. Mỗi service có thể được phát triển và bảo trì bởi một develop team tự quản, đây là phương pháp phát triển phần mềm có khả năng mở rộng cao nhất.

Microservices được xây dựng xoay quanh các `business capabilities` (năng lực nghiệp vụ). Mỗi service thực hiện một tập các chức năng chuyên biệt. Mỗi vùng chức năng giờ được thực thi bởi một service. Ứng dụng có thể chuyên biệt hơn cho từng usecase. Mỗi service có thể sử dụng nhiều technical stack khác nhau (Polyglot Microservices) để phục vụ cho từng mục đích cụ thể.

Kiến trúc Microservices là một mô hình kiến trúc cloud-native, trong đó các dịch vụ được tạo thành từ nhiều thành phần nhỏ, loosely couple (liên kết lỏng lẻo) và có thể triển khai (deploy) độc lập.

Mỗi microservice có stack công nghệ riêng và giao tiếp với nhau RESTful API, gRPC hoặc message broker. Microservices được tổ chức theo từng `business capability` (năng lực nghiệp vụ) với ranh giới dịch vụ rõ ràng, thường được gọi là `bounded context`.

Điều quan trọng chính là nhìn vào các tính năng trong một ứng dụng. Ta có thể nhận biết, xác định các yêu cầu và khả năng cần thiết để đáp ứng một nghiệp vụ. Sau đó từng nghiệp vụ sẽ được xây dựng thành những service nhỏ, độc lập.

## 3. Đặc điểm của Microservices

`Phân tách thành các dịch vụ` (Componentization via Services): Mỗi component là một đơn vị phần mềm có thể thay thế và nâng cấp độc lập.

`Tổ chức theo năng lực nghiệp vụ` (Organized around Business Capabilities): Cách tiếp cận microservices phân tách hệ thống thành các dịch vụ dựa trên từng năng lực nghiệp vụ cụ thể.

`Sản phẩm, không phải dự án` (Products not Projects): Đội ngũ phát triển chịu toàn bộ trách nhiệm cho phần mềm từ khâu phát triển đến khi đưa vào vận hành thực tế.

`Endpoint thông minh, pipeline đơn giản` (Smart Endpoints and Dumb Pipes): Microservices hướng đến việc tách rời (decoupled) và gắn kết nội bộ (cohesive) tối đa. Mỗi service sở hữu logic nghiệp vụ riêng, xử lý yêu cầu và phản hồi thông qua RESTful API, thay vì phụ thuộc vào các hệ thống trung gian phức tạp.

`Quản trị phi tập trung` (Decentralized Governance): Ví dụ điển hình là Netflix, nơi áp dụng triết lý này. Thay vì áp đặt quy tắc cứng nhắc, họ khuyến khích việc chia sẻ thư viện mã nguồn đã được kiểm thử, giúp các developer giải quyết vấn đề theo cách nhất quán nhưng vẫn linh hoạt.

`Quản lý dữ liệu phi tập trung` (Decentralized Data Management): Cách tiếp cận này thường được gọi là polyglot persistence hoặc polyglot database, nghĩa là mỗi microservice tự quản lý cơ sở dữ liệu riêng. Mỗi service có thể sử dụng các instance khác nhau của cùng một công nghệ database hoặc thậm chí các hệ quản trị dữ liệu hoàn toàn khác nhau, tùy theo nhu cầu nghiệp vụ.

`Tự động hóa hạ tầng` (Infrastructure Automation): Việc triển khai microservices được tự động hóa, đảm bảo mỗi service có thể được deploy độc lập trên từng môi trường mới mà không cần can thiệp thủ công.

`Thiết kế để chịu lỗi` (Design for Failure): Microservices được thiết kế để xử lý lỗi một cách chủ động, bằng cách quản lý lỗi với các cơ chế xử lý thích hợp và tự phục hồi (self-healing mechanisms) nhằm đảm bảo hệ thống vẫn hoạt động ngay cả khi một số service gặp sự cố.

## 4. Ưu điểm của Microservices

### Việc phát triển, deploy và scale các service sẽ không bị phụ thuộc lẫn nhau

- Mỗi service nhỏ gọn và có thể triển khai độc lập, giúp dễ dàng quản lý và phát hành tính năng mới.
- Cho phép các services được phát triển bởi những team khác nhau. Mỗi team có thể phát triển, thử nghiệm, triển khai và mở rộng quy mô dịch vụ của mình một cách độc lập với tất cả các team khác.

### Dễ dàng CI/CD các ứng dụng lớn, phức tạp

- Maintainable: Mỗi service có thể cập nhật riêng lẻ mà không cần triển khai lại toàn bộ ứng dụng. Nếu có lỗi xảy ra, chỉ cần rollback service đó mà không ảnh hưởng đến toàn hệ thống.
- Scalable:
  - Mỗi service có thể scale độc lập. Chỉ cần scale những service cần nhiều tài nguyên hơn mà không cần cale toàn bộ hệ thống.
  - Việc mở rộng trở nên dễ dàng hơn khi sử dụng công cụ điều phối container như Kubernetes. Nhờ đó, có thể tối ưu hóa việc sử dụng tài nguyên phần cứng, cho phép chạy nhiều service hơn trên cùng một máy chủ mà vẫn đảm bảo hiệu suất.
- Testing: Mỗi service đủ nhỏ để một nhóm phát triển có thể xây dựng, kiểm thử và triển khai mà không gặp khó khăn.
- Deployment: Các services có thể được triển khai độc lập.

### Tăng tốc độ phát triển

Mô hình này cho phép tổ chức tạo ra các nhóm liên chức năng nhỏ tập trung vào một service hoặc một tập hợp microservices cụ thể, hoạt động theo phương pháp Agile. Nhóm nhỏ giúp tăng tốc độ phát triển, vì:

- Giảm thiểu thời gian giao tiếp giữa các thành viên.
- Giảm gánh nặng quản lý.
- Tránh sự trì trệ do các nhóm lớn thường gặp phải.

### Tăng khả năng chịu lỗi của hệ thống

Nếu một service bị lỗi thì chỉ có service đó bị ảnh hưởng. Các services khác vẫn sẽ tiếp tục xử lý các request.

### Dễ dàng thay đổi sử dụng các công nghệ mới

Mỗi team có thể lựa chọn được technical stack riêng sao cho tối ưu cho service cần phát triển.

## 5. Thách thức của Microservices

### Phức tạp trong quá trình quản lý

Mỗi service riêng lẻ có thể đơn giản, nhưng toàn bộ hệ thống lại phức tạp hơn vì phải xử lý: - Triển khai nhiều phiên bản khác nhau của các service. - Quản lý sự tương thích giữa các service khi cập nhật hoặc thay đổi.

Trong microservices, giao tiếp phải qua network (REST, gRPC, message queues...), thậm chí giữa các data center khác nhau, gây ra độ phức tạp trong quản lý.

Monitoring khó khăn hơn vì sẽ rất nhiều container và phân tán trên nhiều servers. Nếu làm không tốt ngay từ đầu sẽ dẫn tới hệ lụy rằng khó truy vết, xác định lỗi trong cả trăm service.

### Phức tạp trong quá trình kiểm thử

Phát triển và kiểm thử end-to-end trong microservices phức tạp hơn monolithic vì:

- Một yêu cầu có thể liên quan đến nhiều microservices, khiến việc kiểm thử toàn bộ quy trình trở nên khó khăn.
- Các công cụ kiểm thử truyền thống không phải lúc nào cũng hỗ trợ tốt việc kiểm thử với nhiều service phụ thuộc.
- Việc refactor (tái cấu trúc) giữa các service gặp nhiều hạn chế do `ranh giới dịch vụ tách biệt` (across service boundaries).

Giải pháp kiểm thử hiệu quả trong microservices:

- Kiểm thử tích hợp (Integration Testing): Đảm bảo từng service hoạt động đúng khi tích hợp với các service khác.
- Kiểm thử end-to-end (E2E Testing): Mô phỏng toàn bộ luồng nghiệp vụ, đảm bảo hệ thống hoạt động thống nhất.
- Mocking & Service Virtualization: Giả lập phản hồi từ các microservices để kiểm thử độc lập từng service.
- CI/CD & Test Automation: Tự động hóa kiểm thử để phát hiện lỗi sớm trong quá trình triển khai.

### Vấn đề mạng và độ trễ

Trong microservices, giao tiếp phải qua network (REST, gRPC, message queues...), thậm chí giữa các data center khác nhau, dẫn đến rủi ro về mạng và độ trễ. Khi một request cần gọi chuỗi nhiều services liên tiếp, nó có thể làm tăng độ trễ đáng kể.

Việc communication giữa rất nhiều các services sẽ làm tăng lưu lượng mạng nội bộ lên gấp nhiều lần, đòi hỏi phải có các giải pháp để các service gửi ít dữ liệu hơn và nhanh hơn.

Giải pháp giảm độ trễ & tối ưu giao tiếp:

- Tránh gọi API quá thường xuyên (chatty API calls) → Hạn chế số lần request không cần thiết.
- Ưu tiên giao tiếp bất đồng bộ (asynchronous communication) với message broker (RabbitMQ, Kafka, Redis Pub/Sub...) để giảm tải mạng.
- Sử dụng mô hình Publish-Subscribe để các service nhận dữ liệu một cách hiệu quả mà không cần liên tục gửi request.

### Tính toàn vẹn dữ liệu

Mỗi Service có một cơ sở dữ liệu riêng. Do đó:

- Không thể dùng cơ chế giao dịch (ACID Transactions) như trong Monolithic.
- Không thể đảm bảo tính nhất quán dữ liệu (Data Consistency) khi một request ảnh hưởng đến nhiều service.
- Không thể sử dụng giao dịch phân tán (Distributed Transactions) một cách dễ dàng do mỗi service có database riêng.

Giải pháp:

- Eventual Consistency: Chấp nhận dữ liệu không đồng bộ ngay lập tức, nhưng đảm bảo sẽ đồng bộ sau đó.
- Sử dụng Saga Pattern: Chia giao dịch lớn thành chuỗi các giao dịch nhỏ, có khả năng rollback nếu lỗi.
- Event-Driven Architecture: Dùng message broker (Kafka, RabbitMQ) để cập nhật trạng thái dữ liệu giữa các dịch vụ.
- CQRS (Command Query Responsibility Segregation): Tách phần ghi và phần đọc dữ liệu để tăng hiệu suất.

Đảm bảo toàn vẹn dữ liệu trong microservices không đơn giản như trong kiến trúc Monolithic, nhưng có thể giải quyết bằng các mô hình xử lý bất đồng bộ và kiến trúc hướng sự kiện.

## 6.Khi nào nên sử dụng kiến trúc Microservices?

`Chỉ áp dụng khi thực sự cần thiết`: Không phải mọi ứng dụng đều cần microservices.

- Ứng dụng cần mở rộng độc lập (Scalability):
  - Khi có nhiều thành phần cần mở rộng theo nhu cầu riêng (ví dụ: dịch vụ thanh toán cần nhiều tài nguyên hơn dịch vụ báo cáo).
  - Khi cần triển khai các phần của ứng dụng một cách độc lập mà không ảnh hưởng đến toàn hệ thống.
- Yêu cầu cập nhật liên tục, triển khai không downtime (Agility & Zero-downtime Deployment):
  - Cần đẩy nhanh thời gian phát triển, triển khai nhanh các tính năng mới mà không làm gián đoạn hệ thống.
  - Cần hỗ trợ CI/CD để mỗi nhóm có thể triển khai dịch vụ riêng mà không ảnh hưởng đến nhóm khác.
- Ứng dụng có nhiều nhóm phát triển độc lập (Team Autonomy)
  - Khi tổ chức có nhiều nhóm làm việc trên các phần khác nhau của hệ thống và cần sự tách biệt trong phát triển, triển khai.
  - Giúp nhóm chịu trách nhiệm hoàn toàn về dịch vụ của mình (You build it, you run it).
- Ứng dụng phức tạp, yêu cầu linh hoạt công nghệ (Technology Flexibility): Mỗi microservice có thể sử dụng công nghệ phù hợp thay vì bị ràng buộc vào một stack duy nhất như trong monolithic.

Microservices mạnh mẽ nhưng không phải là "viên đạn bạc", cần xem xét nhu cầu thực tế trước khi áp dụng.

`Bắt đầu với Monolithic và chuyển đổi dần sang Microservices`:

- Sam Newman và Martin Fowler đề xuất cách tiếp cận Monolithic-First. Vì kiến trúc module cũng mang lại nhiều lợi ích của microservices mà không có độ phức tạp cao như microservices. Do đó, một ứng dụng đơn tiến trình (monolithic) có sơ đồ triển khai đơn giản hơn.

- Sam Newman và Martin Fowler khuyến nghị bắt đầu với những thay đổi nhỏ và giữ monolithic đơn tiến trình làm mặc định. Họ khuyên rằng ngay cả khi chuyển sang microservices, ta cũng nên bắt đầu với kiến trúc monolithic dạng module và chỉ đơn giản là refactor dần bằng cách tách từng module khỏi monolithic để trở thành một microservice riêng lẻ, rồi xem cách nó hoạt động.

- Cách chuyển từ Monolithic sang Microservices:

  - 1.Bắt đầu với Monolithic: Viết ứng dụng với kiến trúc đơn giản, dễ quản lý. Chia thành các module rõ ràng theo business domains.
  - 2.Tách dần thành Microservices: Chuyển từng module quan trọng ra thành một microservice độc lập. Theo dõi hiệu suất và mức độ phức tạp trước khi tiếp tục tách module khác.
  - 3.Đánh giá hiệu quả: Kiểm tra xem microservices có thực sự mang lại lợi ích không. Nếu microservices gây quá nhiều phức tạp, có thể dừng lại hoặc kết hợp giữa monolithic và microservices (Hybrid Architecture).

Không nên chạy theo xu hướng microservices một cách mù quáng. Hãy bắt đầu với monolithic, tối ưu hóa kiến trúc module, sau đó chuyển đổi từng phần khi cần thiết.

`Triển khai tính năng mới một cách độc lập mà không có downtime`

- Khi một tổ chức cần thay đổi hoặc bổ sung một chức năng và triển khai nó mà không ảnh hưởng đến phần còn lại của hệ thống. Đây chính là sức mạnh của microservices, cho phép triển khai tính năng mới mà không gây gián đoạn hệ thống.
  - Các microservices hoạt động độc lập: Mỗi service có thể được triển khai và cập nhật riêng lẻ, giúp hệ thống linh hoạt hơn.
  - Lỗi trong một microservice chỉ ảnh hưởng đến chính nó: Không làm gián đoạn toàn bộ ứng dụng.
  - Thêm tính năng mới vào ứng dụng microservices dễ dàng hơn so với monolithic: Dù ứng dụng lớn hay nhỏ, việc mở rộng hoặc bảo trì cũng thuận tiện hơn vì chỉ cần thay đổi trong service liên quan thay vì chỉnh sửa toàn bộ ứng dụng.

`Yêu cầu mở rộng một phần của ứng dụng một cách độc lập`:

- Khi một tổ chức cần mở rộng một phần cụ thể của ứng dụng mà không ảnh hưởng đến toàn bộ hệ thống.
  - Microservices cho phép scale từng service độc lập: Nếu một tính năng hoặc module cần tài nguyên lớn hơn, ta có thể mở rộng riêng lẻ mà không cần nhân bản toàn bộ ứng dụng như trong kiến trúc monolithic.
  - Tối ưu tài nguyên và hiệu suất: Thay vì phải mở rộng toàn bộ hệ thống, chỉ những thành phần có nhu cầu cao mới được scale lên, giúp tiết kiệm chi phí và cải thiện hiệu suất.

## 7.Khi nào không nên sử dụng kiến trúc Microservices? (Anti-Patterns of Microservices)

- `Tránh biến Microservices thành Distributed Monolith`: Nếu không tách dịch vụ đúng cách, hệ thống có thể trở thành một distributed monolith – một khối monolithic bị chia nhỏ nhưng vẫn phụ thuộc lẫn nhau chặt chẽ. Điều này chỉ làm tăng độ phức tạp mà không mang lại lợi ích thực sự của microservices.

  - Hãy tách service theo bounded context và các business capabilities độc lập.
  - Hạn chế tình trạng service này cần gọi API của serivce khác quá nhiều.
  - Đảm bảo mỗi microservice có thể hoạt động độc lập mà không bị ràng buộc với các service khác.

- `Không Nên Dùng Microservices Nếu Thiếu DevOps hoặc Cloud Services`: Microservices được thiết kế để hoạt động tốt nhất trong môi trường cloud-native và đi kèm với các công cụ hỗ trợ triển khai, quản lý. Nếu không áp dụng DevOps hoặc không tận dụng các dịch vụ cloud, bạn sẽ gặp rất nhiều khó khăn trong vận hành và không khai thác hết tiềm năng của microservices.

- Để tận dụng tối đa Microservices:
  - CI/CD Pipeline: Tích hợp DevOps để tự động hóa build, test và deploy.
  - Công cụ triển khai & giám sát: Sử dụng các tool như Prometheus, Grafana để theo dõi hệ thống.
  - Cloud Services: Tận dụng các dịch vụ cloud để hỗ trợ hạ tầng (AWS, Azure, GCP).
  - Công nghệ container: Sử dụng Docker, Kubernetes để quản lý microservices hiệu quả.
  - Giao tiếp bất đồng bộ: Áp dụng message queue như Kafka, RabbitMQ để giảm độ phức tạp của việc gọi API đồng bộ.

## 8. So sánh Monolithic với Microservices

| Tiêu chí                       | Monolithic Architecture                                          | Microservices Architecture                                     |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Kiến trúc ứng dụng**         | Cấu trúc đơn giản, một khối duy nhất.                            | Gồm nhiều dịch vụ nhỏ, độc lập, sử dụng cơ sở dữ liệu riêng.   |
| **Khả năng mở rộng**           | Phải mở rộng toàn bộ ứng dụng cùng lúc.                          | Có thể mở rộng từng dịch vụ riêng lẻ.                          |
| **Triển khai**                 | Dễ triển khai toàn bộ hệ thống.                                  | Hỗ trợ triển khai liên tục (CI/CD) với zero-downtime.          |
| **Quản lý đội ngũ phát triển** | Phù hợp với team nhỏ, ít kinh nghiệm về container/microservices. | Yêu cầu team có kinh nghiệm với container, DevOps, Kubernetes. |

Monolithic phù hợp với dự án nhỏ hoặc khi đội ngũ chưa có kinh nghiệm về microservices. Microservices phù hợp khi hệ thống cần mở rộng linh hoạt, có yêu cầu triển khai liên tục mà không gây gián đoạn.

## 9. Lợi ích của mô hình Database-per-Service

- Giảm sự phụ thuộc giữa các service: Mỗi service có cơ sở dữ liệu riêng, không chia sẻ với các service khác. Điều này giúp giảm sự phụ thuộc và tăng tính linh hoạt khi thay đổi dữ liệu.
- Ngăn truy cập trực tiếp giữa các service: Dữ liệu của mỗi service chỉ có thể được truy cập thông qua API thay vì truy cập trực tiếp vào database.
- Dễ thay đổi cấu trúc dữ liệu: Vì mỗi service có database riêng, nên khi thay đổi schema, ta không phải lo ảnh hưởng đến các service khác.
- Mở rộng độc lập: Mỗi database có thể mở rộng (scale) riêng lẻ tùy theo nhu cầu của service.
- Bảo toàn trạng thái trong phạm vi service: Trạng thái của một microservice chỉ nằm trong chính nó, không bị ảnh hưởng bởi các service khác.
- Tăng độ ổn định: Nếu một database gặp sự cố, chỉ service đó bị ảnh hưởng, các service khác vẫn hoạt động bình thường.
- Hỗ trợ nhiều loại database (Polyglot Persistence): Cho phép lựa chọn cơ sở dữ liệu tối ưu nhất cho từng microservice. Ví dụ trong hệ thống e-commerce:
  - Product Service: Sử dụng NoSQL Document (MongoDB) để lưu trữ dữ liệu, thuộc tính, danh mục sản phẩm một cách linh hoạt.
  - Shopping Cart Service: Sử dụng distributed cache (Redis) để lưu giỏ hàng với hiệu suất truy xuất nhanh. (Redis is Key-Value data store)
  - Ordering Service: Dùng cơ sở dữ liệu quan hệ - RDBMS (PostgreSQL/MySQL) để quản lý đơn hàng, do có cấu trúc dữ liệu phức tạp và cần đảm bảo tính toàn vẹn.
