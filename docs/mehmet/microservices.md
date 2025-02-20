---
id: microservices
title: 1.Microservices
---

# Microservices Document

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

## 1.Microservices là gì?

`Microservices` là các service nhỏ, độc lập và `loosely couple` (liên kết lỏng lẻo), có thể hoạt động cùng nhau

**Loosely couple**: Hiểu đơn giản là các thành phần ít phụ thuộc và nhau

Mỗi service có một `codebase riêng biệt`, có thể được quản lý bởi một development team nhỏ. Một nhóm nhỏ các developer có thể tạo và bảo trì từng microservice cụ thể.

Các microservices giao tiếp với nhau thông qua các `well-defined APIs` (API được định nghĩa rõ ràng). Chi tiết triển khai của mỗi service được ẩn đi và các service khác sẽ không được biết.

Microservices có thể được triển khai (deploy) một cách `độc lập` và `tự động`. Một nhóm có thể cập nhật một microservice mà không cần rebuild và redeploy toàn bộ ứng dụng.

Microservices không cần sử dụng chung stack công nghệ, thư viện hoặc framework. Chúng có thể hoạt động với nhiều stack công nghệ khác nhau, giúp hệ thống linh hoạt và không bị ràng buộc vào một công nghệ cụ thể (technology agnostic).

Mỗi microservice có cơ sở dữ liệu hoặc tầng lưu trữ riêng (persistence layer), không chia sẻ với các service khác. Điều này khác với mô hình truyền thống, nơi một tầng dữ liệu chung đảm nhiệm việc lưu trữ dữ liệu cho toàn bộ hệ thống

## 2.Kiến trúc Microservices là gì?

Theo Martin Fowler: “Phong cách kiến trúc microservices là một cách tiếp cận phát triển ứng dụng dưới dạng `suite of small services` (một tập hợp các service nhỏ), mỗi service chạy trong một `tiến trình riêng biệt` và `giao tiếp` với nhau thông qua API HTTP hoặc gRPC”.

Microservices được xây dựng xoay quanh các `business capabilities` (năng lực nghiệp vụ) và có thể `triển khai độc lập` thông qua quy trình triển khai `tự động hoàn toàn`. Việc quản lý tập trung ở mức tối thiểu, cho phép các service được viết bằng nhiều ngôn ngữ lập trình khác nhau và sử dụng các công nghệ lưu trữ dữ liệu khác nhau.

Kiến trúc Microservices là một cách tiếp cận thiết kế phần mềm, trong đó ứng dụng được `phân tách` thành các `service độc lập nhỏ` giao tiếp với nhau thông qua các `well-defined APIs` (API được định nghĩa rõ ràng). Mỗi service có thể được phát triển và bảo trì bởi một `nhóm tự quản`, đây là phương pháp phát triển phần mềm có khả năng mở rộng cao nhất. Các service này thuộc sở hữu của các nhóm nhỏ, độc lập. Kiến trúc Microservices giúp ứng dụng dễ dàng mở rộng, phát triển nhanh hơn, thúc đẩy đổi mới và tăng tốc độ triển khai.

Kiến trúc Microservices là một `mô hình kiến trúc cloud-native`, trong đó các dịch vụ được tạo thành từ nhiều thành phần nhỏ, `loosely couple` (liên kết lỏng lẻo) và có thể triển khai (deploy) độc lập.

Mỗi microservice có stack công nghệ riêng và giao tiếp với nhau thông qua sự kết hợp của `REST API`, `event streaming` và `message broker`. Microservices được tổ chức theo từng `business capability` (năng lực nghiệp vụ) với ranh giới dịch vụ rõ ràng, thường được gọi là `bounded context`.

## 3.Đặc điểm của microservices

`Phân tách thành các dịch vụ` (Componentization via Services): Mỗi component là một đơn vị phần mềm có thể thay thế và nâng cấp độc lập.

`Tổ chức theo năng lực nghiệp vụ` (Organized around Business Capabilities):
Cách tiếp cận microservices phân tách hệ thống thành các dịch vụ dựa trên từng năng lực nghiệp vụ cụ thể.

`Sản phẩm, không phải dự án` (Products not Projects): Đội ngũ phát triển chịu toàn bộ trách nhiệm cho phần mềm từ khâu phát triển đến khi đưa vào vận hành thực tế.

`Endpoint thông minh, pipeline đơn giản` (Smart Endpoints and Dumb Pipes):
Microservices hướng đến việc tách rời (decoupled) và gắn kết nội bộ (cohesive) tối đa. Mỗi service sở hữu logic nghiệp vụ riêng, xử lý yêu cầu và phản hồi thông qua RESTful API, thay vì phụ thuộc vào các hệ thống trung gian phức tạp.

`Quản trị phi tập trung` (Decentralized Governance): Ví dụ điển hình là Netflix, nơi áp dụng triết lý này. Thay vì áp đặt quy tắc cứng nhắc, họ khuyến khích việc chia sẻ thư viện mã nguồn đã được kiểm thử, giúp các developer giải quyết vấn đề theo cách nhất quán nhưng vẫn linh hoạt.

`Quản lý dữ liệu phi tập trung` (Decentralized Data Management):
Cách tiếp cận này thường được gọi là polyglot persistence hoặc polyglot database, nghĩa là mỗi microservice tự quản lý cơ sở dữ liệu riêng. Mỗi service có thể sử dụng các instance khác nhau của cùng một công nghệ database hoặc thậm chí các hệ quản trị dữ liệu hoàn toàn khác nhau, tùy theo nhu cầu nghiệp vụ.

`Tự động hóa hạ tầng` (Infrastructure Automation):
Việc triển khai microservices được tự động hóa, đảm bảo mỗi service có thể được deploy độc lập trên từng môi trường mới mà không cần can thiệp thủ công.

`Thiết kế để chịu lỗi` (Design for Failure):
Microservices được thiết kế để xử lý lỗi một cách chủ động, bằng cách quản lý lỗi với các cơ chế xử lý thích hợp và tự phục hồi (self-healing mechanisms) nhằm đảm bảo hệ thống vẫn hoạt động ngay cả khi một số service gặp sự cố.

## 4.Lợi ích của kiến trúc Microservices

`Nhanh nhạy, đổi mới và rút ngắn thời gian ra thị trường` (Agility, Innovation and Time-to-Market):Kiến trúc microservices giúp ứng dụng dễ mở rộng, phát triển nhanh hơn, thúc đẩy đổi mới và tăng tốc triển khai tính năng mới.

- Mỗi microservice nhỏ gọn và có thể triển khai độc lập, giúp dễ dàng quản lý sửa lỗi (bug fix) và phát hành tính năng mới.
- Có thể cập nhật từng service riêng lẻ mà không cần triển khai lại toàn bộ ứng dụng. Nếu có lỗi xảy ra, chỉ cần rollback service đó mà không ảnh hưởng đến toàn hệ thống.
- Trong kiến trúc monolithic, nếu có lỗi trong một phần của ứng dụng, nó có thể chặn toàn bộ quá trình phát hành. Trong khi đó, microservices giúp tách biệt quá trình sửa lỗi và triển khai tính năng mới, giúp hệ thống linh hoạt và hiệu quả hơn.

`Khả năng mở rộng linh hoạt` (Flexible Scalability):

- Microservices có thể mở rộng độc lập, nghĩa là chỉ cần scale những service cần nhiều tài nguyên hơn mà không cần mở rộng toàn bộ ứng dụng.
- Kiến trúc này tiết kiệm hạ tầng hơn so với mô hình monolithic, vì chỉ cần mở rộng những service thực sự cần thiết thay vì phải scale toàn bộ hệ thống.
- Việc mở rộng trở nên dễ dàng hơn khi sử dụng công cụ điều phối container như Kubernetes. Nhờ đó, có thể tối ưu hóa việc sử dụng tài nguyên phần cứng, cho phép chạy nhiều service hơn trên cùng một máy chủ mà vẫn đảm bảo hiệu suất.

`Nhóm nhỏ, tập trung` (Small, Focused Team):

- Microservices đủ nhỏ để một nhóm phát triển có thể xây dựng, kiểm thử và triển khai mà không gặp khó khăn.
- Mô hình này cho phép tổ chức tạo ra các nhóm liên chức năng nhỏ tập trung vào một service hoặc một tập hợp microservices cụ thể, hoạt động theo phương pháp agile.
- Nhóm nhỏ giúp tăng tốc độ phát triển, vì:
  - 1.Giảm thiểu thời gian giao tiếp giữa các thành viên.
  - 2.Giảm gánh nặng quản lý.
  - 3.Tránh sự trì trệ do các nhóm lớn thường gặp phải.
- Nhờ đó, tính linh hoạt (agility) được duy trì, giúp microservices phát huy tối đa hiệu quả.

`Codebase nhỏ và tách biệt` (Small and Separated Codebase):

- Trong ứng dụng monolithic, codebase sẽ ngày càng phình to theo thời gian, làm tăng sự phụ thuộc chồng chéo giữa các module. Việc thêm một tính năng mới thường đòi hỏi refactor lại nhiều phần code hiện có, gây phức tạp và mất thời gian.
- Microservices không chia sẻ code hoặc database với các service khác, giúp giảm thiểu sự phụ thuộc.
- Nhờ đó, việc thêm tính năng mới dễ dàng hơn, không cần chỉnh sửa toàn bộ ứng dụng mà chỉ cần cập nhật service liên quan.

## 5.Thách thức của Kiến trúc Microservices

`Độ phức tạp` (Complexity):

- Ứng dụng microservices bao gồm nhiều service hoạt động cùng nhau, làm tăng số lượng thành phần cần quản lý so với monolithic.
- Mỗi service riêng lẻ có thể đơn giản, nhưng toàn bộ hệ thống lại phức tạp hơn vì phải xử lý:
  - Triển khai nhiều phiên bản khác nhau của các service.
  - Quản lý sự tương thích giữa các service khi cập nhật hoặc thay đổi.
- Giao tiếp giữa các service là một thách thức lớn:
  - Trong monolithic, các module giao tiếp qua inter-process communication (IPC) trong cùng một máy chủ.
  - Trong microservices, giao tiếp phải qua network (REST, gRPC, message queues...), thậm chí giữa các data center khác nhau, gây ra độ trễ và độ phức tạp trong quản lý.
- Do đó, cần một chiến lược để quản lý giao tiếp giữa các microservices hiệu quả.

`Vấn đề mạng và độ trễ` (Network Problems & Latency)

- Microservices phải giao tiếp với nhau qua mạng, thay vì gọi trực tiếp trong cùng một tiến trình như monolithic, dẫn đến rủi ro về mạng và độ trễ.
- Khi một request cần gọi chuỗi nhiều services liên tiếp, nó có thể làm tăng độ trễ đáng kể.
- Giải pháp giảm độ trễ & tối ưu giao tiếp:
  - Tránh gọi API quá thường xuyên (chatty API calls) → Hạn chế số lần request không cần thiết.
  - Ưu tiên giao tiếp bất đồng bộ (asynchronous communication) với message broker (RabbitMQ, Kafka, Redis Pub/Sub...) để giảm tải mạng.
  - Sử dụng mô hình Publish-Subscribe để các service nhận dữ liệu một cách hiệu quả mà không cần liên tục gửi request.

`Phát triển và kiểm thử` (Development & Testing):

- Phát triển và kiểm thử end-to-end trong microservices phức tạp hơn monolithic vì:

  - Một yêu cầu có thể liên quan đến nhiều microservices, khiến việc kiểm thử toàn bộ quy trình trở nên khó khăn.
  - Các công cụ kiểm thử truyền thống không phải lúc nào cũng hỗ trợ tốt việc kiểm thử với nhiều service phụ thuộc.
  - Việc refactor (tái cấu trúc) giữa các service gặp nhiều hạn chế do ranh giới dịch vụ tách biệt (across service boundaries).

- Giải pháp kiểm thử hiệu quả trong microservices:
  - Kiểm thử tích hợp (Integration Testing): Đảm bảo từng service hoạt động đúng khi tích hợp với các service khác.
  - Kiểm thử end-to-end (E2E Testing): Mô phỏng toàn bộ luồng nghiệp vụ, đảm bảo hệ thống hoạt động thống nhất.
  - Mocking & Service Virtualization: Giả lập phản hồi từ các microservices để kiểm thử độc lập từng service.
  - CI/CD & Test Automation: Tự động hóa kiểm thử để phát hiện lỗi sớm trong quá trình triển khai.

`Toàn vẹn dữ liệu` (Data Integrity)

- Mỗi microservice có cơ sở dữ liệu riêng → Không thể dùng cơ chế giao dịch (ACID Transactions) như trong monolithic.
- Thách thức:
  - Đảm bảo tính nhất quán dữ liệu (Data Consistency) khi một yêu cầu ảnh hưởng đến nhiều dịch vụ.
  - Không thể sử dụng giao dịch phân tán (Distributed Transactions) một cách dễ dàng do mỗi service có database riêng.
- Giải pháp:
  - Eventual Consistency: Chấp nhận dữ liệu không đồng bộ ngay lập tức, nhưng đảm bảo sẽ đồng bộ sau đó.
  - Sử dụng Saga Pattern: Chia giao dịch lớn thành chuỗi các giao dịch nhỏ, có khả năng rollback nếu lỗi.
  - Event-Driven Architecture: Dùng message broker (Kafka, RabbitMQ) để cập nhật trạng thái dữ liệu giữa các dịch vụ.
  - CQRS (Command Query Responsibility Segregation): Tách phần ghi và phần đọc dữ liệu để tăng hiệu suất.
- Kết luận: Đảm bảo toàn vẹn dữ liệu trong microservices không đơn giản như trong kiến trúc monolithic, nhưng có thể giải quyết bằng các mô hình xử lý bất đồng bộ và kiến trúc hướng sự kiện.

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

- Kết luận: Microservices mạnh mẽ nhưng không phải là "viên đạn bạc", cần xem xét nhu cầu thực tế trước khi áp dụng.

`Bắt đầu với Monolithic và chuyển đổi dần sang Microservices`:

- Sam Newman và Martin Fowler đề xuất cách tiếp cận Monolithic-First. Vì kiến trúc module cũng mang lại nhiều lợi ích của microservices mà không có độ phức tạp cao như microservices. Do đó, một ứng dụng đơn tiến trình (monolithic) có sơ đồ triển khai đơn giản hơn.

- Sam Newman và Martin Fowler khuyến nghị bắt đầu với những thay đổi nhỏ và giữ monolithic đơn tiến trình làm mặc định. Họ khuyên rằng ngay cả khi chuyển sang microservices, ta cũng nên bắt đầu với kiến trúc monolithic dạng module và chỉ đơn giản là refactor dần bằng cách tách từng module khỏi monolithic để trở thành một microservice riêng lẻ, rồi xem cách nó hoạt động.

- Cách chuyển từ Monolithic sang Microservices:

  - 1.Bắt đầu với Monolithic: Viết ứng dụng với kiến trúc đơn giản, dễ quản lý. Chia thành các module rõ ràng theo business domains.
  - 2.Tách dần thành Microservices: Chuyển từng module quan trọng ra thành một microservice độc lập. Theo dõi hiệu suất và mức độ phức tạp trước khi tiếp tục tách module khác.
  - 3.Đánh giá hiệu quả: Kiểm tra xem microservices có thực sự mang lại lợi ích không. Nếu microservices gây quá nhiều phức tạp, có thể dừng lại hoặc kết hợp giữa monolithic và microservices (Hybrid Architecture).

- Kết luận: Không nên chạy theo xu hướng microservices một cách mù quáng. Hãy bắt đầu với monolithic, tối ưu hóa kiến trúc module, sau đó chuyển đổi từng phần khi cần thiết.

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

## 8. So sánh Monolithic vs Microservices

| Tiêu chí                       | Monolithic Architecture                                          | Microservices Architecture                                     |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Kiến trúc ứng dụng**         | Cấu trúc đơn giản, một khối duy nhất.                            | Gồm nhiều dịch vụ nhỏ, độc lập, sử dụng cơ sở dữ liệu riêng.   |
| **Khả năng mở rộng**           | Phải mở rộng toàn bộ ứng dụng cùng lúc.                          | Có thể mở rộng từng dịch vụ riêng lẻ.                          |
| **Triển khai**                 | Dễ triển khai toàn bộ hệ thống.                                  | Hỗ trợ triển khai liên tục (CI/CD) với zero-downtime.          |
| **Quản lý đội ngũ phát triển** | Phù hợp với team nhỏ, ít kinh nghiệm về container/microservices. | Yêu cầu team có kinh nghiệm với container, DevOps, Kubernetes. |

- Kết luận: Monolithic phù hợp với dự án nhỏ hoặc khi đội ngũ chưa có kinh nghiệm về microservices. Microservices phù hợp khi hệ thống cần mở rộng linh hoạt, có yêu cầu triển khai liên tục mà không gây gián đoạn.

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
