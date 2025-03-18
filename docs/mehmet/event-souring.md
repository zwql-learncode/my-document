---
id: event-sourcing_mehmet
title: 8. Event Sourcing
---

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

# Event Sourcing Document

## 1. Event Sourcing là gì?

Thông thường, hầu hết các ứng dụng lưu dữ liệu vào database bằng cách lưu trạng thái hiện tại của entity.

- Ví dụ, nếu người dùng thay đổi địa chỉ email, trường email trong bảng người dùng sẽ bị ghi đè bằng giá trị mới. Cách này giúp ta luôn có được trạng thái mới nhất của dữ liệu, nhưng dữ liệu cũ sẽ bị mất. Đây là mô hình truyền thống hoạt động ổn khi chỉ cần cập nhật dữ liệu hiện tại.

Tuy nhiên, trong các hệ thống lớn, việc cập nhật dữ liệu thường xuyên có thể ảnh hưởng tiêu cực đến hiệu suất (performance), tính phản hồi (responsiveness) , và khả năng mở rộng (limits of scalability) của cơ sở dữ liệu.

Event sourcing pattern đưa ra một giải pháp khác: Mỗi thay đổi đối với dữ liệu được lưu trữ dưới dạng một event (sự kiện) trong Event Store. Thay vì lưu trữ trạng thái mới nhất của dữ liệu vào database, mô hình Event Sourcing đề xuất lưu trữ tất cả các event (sự kiện) vào database theo thứ tự tuần tự của các data events (sự kiện dữ liệu). Và database lưu trữ các sự kiện này được gọi là Event Store.

Điều này có nghĩa là, thay vì ghi đè dữ liệu trong bảng, hệ thống sẽ tạo một bản ghi mới cho mỗi lần dữ liệu thay đổi, và tập hợp các bản ghi này sẽ trở thành một danh sách các event (sự kiện) trong quá khứ theo thứ tự tuần tự. Bằng cách này, Event Store trở thành source-of-truth của hệ thống.

- source-of-truth: Có thể hiểu là nguồn dữ liệu gốc. Là nguồn dữ liệu duy nhất và đáng tin cậy nhất của hệ thống.

Thay vì lưu trữ chỉ trạng thái cuối cùng của dữ liệu (như trong mô hình truyền thống), Event Sourcing toàn bộ lịch sử các thay đổi dưới dạng các event (sự kiện). Nhờ đó, ta có thể:

- Truy vết lại mọi thay đổi trong quá khứ.
- Tái dựng lại trạng thái của dữ liệu tại bất kỳ thời điểm nào.
- Đảm bảo tính nhất quán và độ tin cậy của dữ liệu trong hệ thống phân tán.

Danh sách các sự kiện tuần tự này được sử dụng để tạo ra Materialized Views, đại diện cho trạng thái cuối cùng của dữ liệu nhằm phục vụ cho các queries (truy vấn). Điều đó có nghĩa là Event Store sẽ được chuyển đổi thành một read database, tuân theo mô hình Materialized Views.

- Materialized View: Tương tự như View, nhưng điểm khác biệt chính là nó lưu trữ sẵn kết quả của query. Vì vậy, khi truy vấn một Materialized View, database không cần query lại mà chỉ đơn giản lấy dữ liệu đã có sẵn. Tuy nhiên, Materialized View không tự động cập nhật theo thời gian thực như View, mà cần một cơ chế refresh để cập nhật dữ liệu.

Quá trình chuyển đổi này có thể được xử lý bằng mô hình pub/sub, trong đó các event (sự kiện) được phát đi thông qua hệ thống message broker.

Ngoài ra, danh sách các sự kiện này còn cho phép replay (phát lại) các sự kiện tại một thời điểm nhất định trong quá khứ. Bằng cách này, hệ thống có thể tái tạo trạng thái mới nhất (re-build latest status) của dữ liệu bằng cách phát lại các sự kiện.

## 2. CQRS kết hợp với Event Sourcing Pattern

Mô hình CQRS thường được sử dụng cùng với Event Sourcing. Ý tưởng chính là lưu trữ các events (sự kiện) vào write database, và đây sẽ là source-of-truth (nguồn dữ liệu gốc) của hệ thống.

Read database sẽ tạo ra các Materialized Views từ dữ liệu dưới dạng de-normalized tables (bảng phi chuẩn hóa). Những Materialized Views này sẽ consume (sử dụng) các sự kiện từ write database và chuyển chúng thành các de-normalized views.

Write database không lưu trạng thái dữ liệu, mà chỉ lưu các event actions (hành động sự kiện). Bằng cách chỉ lưu trữ các sự kiện vào cơ sở dữ liệu ghi, hệ thống có thể lưu lại toàn bộ lịch sử dữ liệu và phát lại (replay) bất kỳ thời điểm nào để tái tạo trạng thái dữ liệu.

Khi áp dụng Event Sourcing pattern, hệ thống có thể cải thiện hiệu suất truy vấn và mở rộng cơ sở dữ liệu một cách độc lập.
