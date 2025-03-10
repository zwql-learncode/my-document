---
id: proxy-guru
title: Proxy
---

# Proxy Pattern

Còn được gọi là: Surrogate

Dịch từ bài viết [Proxy](https://refactoring.guru/design-patterns/proxy) của Refactoring Guru

Proxy là một `structural design pattern` (mẫu thiết kế cấu trúc) cho phép bạn cung cấp một đối tượng thay thế (substitute) hoặc trung gian (placeholder) cho một đối tượng khác. Proxy kiểm soát quyền truy cập vào đối tượng gốc, cho phép bạn thực hiện một số hành động trước hoặc sau khi request được chuyển đến đối tượng gốc.

![Ảnh minh họa Proxy Pattern](/img/guru/proxy.png)

## 1. Vấn đề

Tại sao bạn lại cần kiểm soát quyền truy cập vào một đối tượng? Ví dụ: bạn có một đối tượng khổng lồ (massive object) tiêu tốn rất nhiều tài nguyên hệ thống. Bạn chỉ cần sử dụng nó thỉnh thoảng, chứ không phải lúc nào cũng cần.

Giải pháp khả thi là `lazy initialization` (khởi tạo chậm): Chỉ tạo đối tượng này khi thực sự cần thiết. Tuy nhiên, điều này sẽ khiến mọi client sử dụng đối tượng đó phải tự xử lý việc khởi tạo chậm, dẫn đến trùng lặp mã nguồn.

Lý tưởng nhất, ta có thể đặt logic khởi tạo chậm này vào chính lớp của đối tượng đó. Nhưng đôi khi điều này không khả thi, chẳng hạn khi lớp đó thuộc một thư viện bên thứ ba mà bạn không thể chỉnh sửa.

## 2. Giải pháp

Proxy Pattern đề xuất rằng bạn tạo một proxy class mới có cùng interface với original service object (đối tượng dịch vụ gốc). Sau đó, bạn cập nhật ứng dụng để tất cả client sử dụng đối tượng proxy thay vì đối tượng gốc. Khi nhận được yêu cầu từ client, proxy tạo đối real service object (tượng dịch vụ thực) và ủy quyền công việc cho nó.

Lợi ích của cách tiếp cận này là gì?

- Nếu bạn cần thực thi một số logic trước hoặc sau logic gốc (primary logic), proxy giúp bạn làm điều đó mà không cần thay đổi lớp gốc.
- Do proxy triển khai cùng một interface với đối tượng gốc, nó có thể thay thế hoàn toàn đối tượng gốc trong mọi client sử dụng nó.

## 3. Ví dụ thực tế

![Ảnh minh họa: Proxy Pattern](/img/guru/proxy-live-example.png)

> _Thẻ tín dụng có thể được sử dụng để thanh toán giống như tiền mặt._

Một thẻ tín dụng chính là một proxy cho tài khoản ngân hàng, và tài khoản ngân hàng lại là một proxy cho tiền mặt. Tất cả chúng đều có cùng một interface: được dùng để thanh toán.

- Người tiêu dùng thích thú vì không cần mang theo nhiều tiền mặt.
- Chủ cửa hàng cũng hài lòng vì tiền giao dịch được chuyển vào tài khoản ngân hàng một cách tự động, không lo bị mất tiền hoặc bị cướp trên đường đến ngân hàng.

## 4. Cấu trúc của Proxy Pattern

![Cấu trúc của Proxy Pattern](/img/guru/proxy-structure.png)

### 4.1. Service Interface

- Khai báo các phương thức chung của dịch vụ.
- Proxy phải tuân theo inferface này để có thể ngụy trang thành một service object ( to be able to disguise itself as a service object ).

### 4.2. Service

- Là lớp chứa bussiness logic chính.

### 4.3. Proxy - Đại diện cho Service

- Chứa một tham chiếu trỏ đến đối tượng dịch vụ thực.
- Xử lý các tác vụ bổ sung như: lazy initialization, logging, access control, caching.
- Sau khi hoàn thành công việc của mình, proxy chuyển request đến đối tượng service object.

### 4.4. Client

- Là phần làm việc với cả services và proxy thông qua cùng một interface.
- Nhờ đó, ta có thể truyền proxy vào bất kỳ đoạn mã nào đang mong đợi một service object, mà không cần thay đổi logic của nó.

## 5. Ứng dụng của Decorator Pattern

### Virtual Proxy: Lazy Initialization

- Khi bạn có một đối tượng dịch vụ nặng (heavyweight service object) tiêu tốn tài nguyên hệ thống ngay cả khi không thực sự cần thiết.
- Thay vì khởi tạo đối tượng ngay khi ứng dụng chạy, ta trì hoãn quá trình khởi tạo cho đến khi nó thực sự cần thiết.

### Protection Proxy: Access Control( Kiểm soát truy cập )

- Khi chỉ một số client nhất định được phép truy cập vào đối tượng dịch vụ.
  - Ví dụ: bảo vệ các thành phần quan trọng của hệ điều hành trước những ứng dụng nguy hiểm.
- Proxy kiểm tra xác thực của client trước khi chuyển yêu cầu đến dịch vụ.

### Remote Proxy: Thực thi cục bộ cho dịch vụ từ xa

- Khi service object nằm trên một máy chủ từ xa.
- Proxy gửi yêu cầu qua mạng và xử lý các vấn đề liên quan như giao tiếp mạng, kết nối, lỗi,...

### Logging Proxy: Logging requests

- Khi cần lưu lại lịch sử các request gửi đến service object.
- Proxy có thể ghi log từng request trước khi chuyển đến service.

### Caching Proxy: Caching request results

- Khi cần cache kết quả của những request lặp lại.
- Proxy quản lý vòng đời của cache, đặc biệt hữu ích với lượng dữ liệu lớn hoặc tính toán phức tạp.
- Proxy có thể dùng tham số của request làm key để kiểm tra cache.

### Tham chiếu thông minh

- Khi cần giải phóng bộ nhớ bằng cách hủy đối tượng khi không còn client nào sử dụng.
- Proxy có thể theo dõi số lượng client đang sử dụng dịch vụ và giải phóng tài nguyên khi không còn ai dùng.
- Nếu đối tượng chưa bị sửa đổi, proxy có thể chia sẻ lại nó với các client khác thay vì tạo mới.

## 6. Ưu và nhược điểm

### Ưu điểm

1. Tuân theo nguyên tắc Open/Closed Principle (OCP)

- Có thể thêm proxy mới mà không cần thay đổi code của service hoặc client.

2. Kiểm soát service object mà client không cần biết về nó

3. Quản lý vòng đời của đối tượng dịch vụ

4. Service vẫn hoạt động ngay cả khi chưa sẵn sàng hoặc không khả dụng

- Nếu dịch vụ thực đang load hoặc hoặc bị lỗi, proxy có thể hoãn yêu cầu hoặc trả về dữ liệu dự phòng.

### Nhược điểm

- Mã nguồn trở nên phức tạp hơn.
- Có thể gây delay khi xử lý request.
