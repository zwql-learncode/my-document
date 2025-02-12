---
id: microservices
title: 1.Microservices
---

# Microservices Document

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
