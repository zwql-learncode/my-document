---
id: message-broker_200lab
title: Message Broker
---

# Message Broker là gì? Giới Thiệu về Message Broker

Nguồn: [200Lab](https://200lab.io/blog/message-broker-la-gi)

Hiện nay, trong lĩnh vực phần mềm, việc phát triển các ứng dụng phức tạp và được phân tán đã trở thành một xu hướng thịnh hành. Điều này tạo ra những thách thức không nhỏ trong việc điều phối giao tiếp và chia sẻ dữ liệu giữa các bộ phận của hệ thống.

Để giải quyết thách thức trên, người ta đã sáng tạo ra nhiều công nghệ, trong đó có message broker. Bài viết này sẽ giúp bạn có cái nhìn tổng quan về message broker và cách ứng dụng nó trong thực tế.

## 1. Message broker là gì?

Message broker là một ứng dụng phần mềm đóng vai trò là trung gian trong việc truyền đạt thông điệp giữa các ứng dụng, hệ thống, hoặc thành phần. Nó cho phép các ứng dụng gửi và nhận thông điệp mà không cần biết về sự tồn tại lẫn nhau, từ đó giảm thiểu sự phụ thuộc và tăng cường khả năng mở rộng và linh hoạt của hệ thống.

## 2. Các loại mô hình Message broker

Có nhiều loại mô hình Message Broker, mỗi loại phục vụ cho các mục đích giao tiếp khác nhau.

Dưới đây là 3 mô hình Message broker phổ biến:

- Mô hình Point-to-Point (P2P)
- Mô hình Publish/Subscribe (Pub/Sub)
- Mô hình Hybrid giữa Pub/Sub và P2P

### 2.1. Mô hình Point-to-Point (P2P)

Buổi sáng, tôi đặt gửi một món hàng cho bạn A từ Hà Nội tới Sài Gòn trên ứng dụng của Giao hàng nhanh (GHN). Buổi chiều, shipper của GHN tới nhà tôi để lấy món hàng và đưa tôi một mã giao hàng. Hai ngày sau, bạn tôi nhận được hàng tại nhà. Bên GHN làm hết mọi thứ cho tôi, còn tôi chỉ việc ngồi nhà và check trạng thái của gói hàng trên ứng dụng.

Đây là ví dụ điển hình cho mô hình Point-to-point (P2P). GHN đóng vai trò cơ chế giao nhận, đảm bảo gói hàng của tôi chỉ được giao đúng 1 lần và sẽ giao hàng lại (retry) cho tới khi bạn tôi nhận được hàng (tối đa 3 lần).

P2P thường được triển khai dưới dạng queue. Queue thường sẽ cố gắng phân phối message một cách công bằng giữa những consumer, cho phép chỉ có một consumer nhận được một message nhất định.

Queue được dùng trong trường hợp yêu cầu các message chỉ được xử lý một lần. Ví dụ, yêu cầu thanh toán, gửi tiền vào tài khoản, chuyển tiền, giao hàng, ...

### 2.2. Mô hình Publish/Subscribe (Pub/Sub)

Khi tôi tham gia lớp học online của 200Lab trên Google Meet, mỗi lần tôi vào link trong thời điểm khoá học diễn ra, tôi sẽ nghe được giảng viên và học viên nói chuyện. Nếu tôi bị mất mạng hoặc tắt meet thì tôi sẽ không thể nghe/nhìn thấy gì nữa. Còn khi tôi vào lại meet thì tôi lại nghe được bài giảng nếu vẫn còn người giao tiếp trong Meet.

Đây là ví dụ điển hình cho mô hình Publish/Subcrible (gọi tắt là Pub/Sub). Google Meet hoạt động như một cơ chế phát sóng (broadcast mechanism). Tôi và những người trong Meet đóng vai vừa là publisher, vừa là subcriber. Những người trong meet không quan tâm có bao nhiêu người trong hội thoại. Hệ thống đảm bảo bất kỳ ai trong Meet đều nghe/nhìn thấy những gì được chia sẻ.

Pub/Sub thường được triển khai thông qua topic. Topic cung cấp cùng một loại cơ chế phát sóng như Meet. Khi một message được gửi từ publisher vào một topic, nó sẽ được phân phối đến tất cả những consumer đã đăng ký. Các consumer sẽ bỏ lỡ message khi chúng offline. Vậy nên, Pub/Sub chỉ đảm bảo mỗi message được gửi tối đa một lần cho mỗi consumer đã đăng ký.

Pub/Sub được dùng trong trường hợp mất tin nhắn là không đáng kể. Ví dụ, máy cảm biến nhiệt có thể gửi rất nhiều chỉ số nhiệt tới topic mỗi giây, việc topic bỏ sót một vài chỉ số nhiệt sẽ ảnh hưởng không đáng kể tới hệ thống.

### 2.3. Mô hình Hybrid giữa Pub/Sub và P2P

Một trang web bán hàng format order thành message và gửi vào một queue. Consumer chính của các message kia là hệ thống thực hiện đơn hàng. Bên cạnh đó, hệ thống kiểm toán cần có bản sao của các order để theo dõi sau này. Cả hai hệ thống đều không thể bỏ lỡ bất kỳ order nào, ngay cả khi hệ thống gặp lỗi. Trang web hoạt động bình thường mà không cần biết về các hệ thống khác hoạt động như nào.

Đây là ví dụ điển hình của mô hình hybrid giữa Pub/Sub và P2P. Hybrid tận dụng ưu điểm và khắc phục nhược điểm của cả 2 mô hình. Ví dụ, khi consumer ngắt kết nối, message sẽ được giữ trong queue và sẽ được gửi khi consumer kết nối lại.

Vì những ưu điểm trên nên mô hình Hybrid được tận dụng trong các công nghệ nổi tiếng như ActiveMQ và Kafka.

## 3. Ưu điểm của message broker

- Giảm sự phụ thuộc: Message broker giúp tách biệt giữa người gửi và người nhận, giảm sự phụ thuộc trực tiếp giữa các thành phần hệ thống.

- Đảm bảo tính tin cậy: Nó có thể lưu trữ thông điệp tạm thời nếu người nhận không sẵn sàng, đảm bảo thông điệp không bị mất.

- Tăng khả năng mở rộng: Hệ thống có thể dễ dàng mở rộng bằng cách thêm các thành phần mới mà không ảnh hưởng đến các thành phần hiện tại.

- Đơn giản hóa giao tiếp: Cung cấp một giao diện giao tiếp đơn giản, giúp dễ dàng tích hợp các ứng dụng khác nhau.

## 4. Nhược điểm của message broker

- Tăng độ trễ: Do có một trung gian, thời gian để thông điệp được chuyển từ nguồn đến đích có thể lâu hơn so với giao tiếp trực tiếp. Điều này có thể không phù hợp với các ứng dụng cần xử lý thời gian thực hoặc yêu cầu độ trễ thấp.

- Tăng độ phức tạp của hệ thống: Việc triển khai và quản lý một Message Broker có thể làm tăng độ phức tạp của hệ thống, đòi hỏi kỹ thuật và kiến thức chuyên môn cao để đảm bảo hệ thống hoạt động ổn định và hiệu quả.

- Chi phí cơ sở hạ tầng: Việc duy trì Message Broker có thể yêu cầu thêm cơ sở hạ tầng và tài nguyên, từ đó tăng chi phí cho dự án, đặc biệt là đối với các dự án lớn hoặc các hệ thống phân tán rộng rãi.

- Rủi ro nút thắc cổ chai: Trong một số trường hợp, Message Broker có thể trở thành điểm nghẽn của hệ thống nếu không được thiết kế hoặc cấu hình đúng cách, đặc biệt khi xử lý lượng lớn thông điệp hoặc trong các tình huống giao tiếp cần độ tin cậy cao.

## 5. Sử dụng Message broker trong thực tế

Một số công nghệ phổ biến sử dụng message broker bao gồm:

- RabbitMQ: Một message broker mã nguồn mở rất phổ biến, hỗ trợ nhiều giao thức giao tiếp.
- Apache Kafka: Được thiết kế cho việc xử lý dữ liệu dòng với khả năng mở rộng và độ tin cậy cao.
- AWS SNS/SQS: Dịch vụ message của Amazon Web Services, hỗ trợ việc giao tiếp linh hoạt trong hệ thống đám mây.

## 6. Kết luận

Message broker là một phần không thể thiếu trong kiến trúc hệ thống phần mềm hiện đại. Nó không chỉ giúp giảm sự phụ thuộc giữa các thành phần, mà còn tăng cường khả năng mở rộng và độ tin cậy của hệ thống.

Trong thực tế, việc triển khai Message broker dựa trên 3 mô hình phổ biến: Point-to-Point (P2P), Pub/Sub và Hybrid giữa P2P và Pub/Sub. Mỗi mô hình Message Broker có những ưu và nhược điểm riêng, tùy thuộc vào yêu cầu cụ thể của hệ thống và môi trường hoạt động. Lựa chọn mô hình phù hợp là bước quan trọng để đảm bảo hiệu quả giao tiếp và tích hợp giữa các ứng dụng và dịch vụ.
