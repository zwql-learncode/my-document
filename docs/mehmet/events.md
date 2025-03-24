---
id: domain-event-integration-event_mehmet
title: 9. Domain Events & Integration Events
---

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

# Domain Events & Integration Events Document

## 1. Domain Events là gì?

Domain Events đại diện cho một sự kiện đã xảy ra trong quá khứ, và các phần khác trong cùng một service boundary (ranh giới dịch vụ) cũng như cùng một domain cần phản ứng với những thay đổi này.

Domain Events là một business event (sự kiện nghiệp vụ) xảy ra trong domain model. Nó thường thể hiện một side-effect (tác dụng phụ) hoặc là kết quả của một domain operation (thao tác trong domain).

Đây là một kỹ thuật được sử dụng để đảm bảo tính nhất quán giữa các aggregates trong cùng một domain. Khi một đơn hàng được đặt, một event OrderPlaced có thể được kích hoạt. Những event này rất quan trọng trong việc ghi nhận ý định và kết quả của các hành động trong domain, đồng thời có thể được sử dụng để kích hoạt các side-effects (tác dụng phụ) hoặc thông báo cho các phần khác của hệ thống về các thay đổi trong domain.

Domain Events được sử dụng để đóng gói event details và gửi chúng đến các interested parties (thành phần quan tâm). Chúng thường được sử dụng để thông báo (communicate) các thay đổi trong domain đến các external handlers (bộ xử lý bên ngoài), những handlers này có thể thực hiện các hành động dựa trên các event được published.

## 2. Domain Events và Integration Events

### Domain Events

Được published (phát hành) và consumed (tiêu thụ) trong cùng một domain. Nghĩa là, khi event được published và subscribe trong cùng một phiên bản ứng dụng. Chúng chỉ nằm trong ranh giới của một microservice hoặc một domain context.

Thông thường, chúng thể hiện một event đã xảy ra trong một aggregate. Domain Events xảy ra in-process (bên trong tiến trình) hoặc được synchronously sent (gửi đồng bộ) bằng một in-memory message bus.

### Integration Event

Được sử dụng để thông báo (communicate) các thay đổi trạng thái hoặc events giữa các bounded context hoặc giữa các microservices khác nhau. Chúng phản ánh cách toàn bộ hệ thống phản ứng với một số Domain Events nhất định.

Integration Event nên được asynchronously sent (gửi bất đồng bộ) thông qua một message broker bằng cách sử dụng queue. Các event này sẽ được consumed (tiêu thụ) bởi các sub-systems (hệ thống con) khác.

Ví dụ, sau khi handling (xử lý) Domain Event OrderPlaced, một Integration Event OrderPlaced có thể được published (phát hành) tới một message broker như RabbitMQ, từ đó các microservices khác có thể consumed (tiêu thụ) và handling (xử lý) event này.
