---
id: rabbitmq_200lab
title: RabbitMQ
---

# RabbitMQ là gì? RabbitMQ hoạt động như nào?

Nguồn: [200Lab](https://200lab.io/blog/rabbitmq-la-gi)

RabbitMQ là một message broker mã nguồn mở viết bằng Erlang, được phát hành vào năm 2007 bởi Pivotal Software Inc.

Trong kiến trúc phần mềm hiện đại, nơi các hệ thống càng trở nên phân tán, việc giao tiếp hiệu quả giữa các thành phần trong hệ thống là điều cần thiết. RabbitMQ nổi lên như một giải pháp mạnh mẽ để hỗ trợ giao tiếp giữa các ứng dụng và dịch vụ khác nhau.

Trong bài viết này, chúng ta sẽ đi sâu vào thế giới của RabbitMQ, tìm hiểu định nghĩa, khám phá các thành phần cốt lõi khiến RabbitMQ hoạt động, phân tích ưu điểm, nhược điểm và các trường hợp sử dụng của nó.

## 1. RabbitMQ là gì?

RabbitMQ là một message broker (nhà môi giới tin nhắn) mã nguồn mở viết bằng Erlang.

RabbitMQ ban đầu được phát triển với sự hợp tác giữa LShift, LTD và Cohesive FT, hiện thuộc sở hữu của Pivotal Software Inc và được phát hành vào năm 2007 theo giấy phép Mozilla Public License.

RabbitMQ là một trong những message broker đầu tiên triển khai giao thức AMQP (Advanced Message Queuing Protocol).

AMQP là một giao thức mở (open protocol) truyền thông tiêu chuẩn hóa nhằm mục đích gửi message có độ tin cậy cao và hiệu quả giữa các ứng dụng và message broker. AMQP không chỉ xác định giao thức để giao tiếp với RabbitMQ mà còn xác định mô hình logic phát thảo chức năng cốt lõi của RabbitMQ.

## 2. RabbitMQ hoạt động như nào?

![RabbitMQ workflow](/img/200lab/rabbitmq-workflow.png)

> _RabbitMQ workflow_

Luồng message trong RabbitMQ hoạt động như sau:

- Producer gửi một message tới một exchange. Exchange phải được chỉ định type khi được tạo.

- Exchange nhận được message và chịu trách nhiệm định tuyến message. Việc trao đổi sẽ tính đến các thuộc tính của message và loại exchange, chẳng hạn như routing key.

- Giữa exchange và queue phải thiết lập bindings từ trước. Exchange định tuyến message vào queue tùy thuộc vào thuộc tính của message. Trong ví dụ trên, có 2 bindings từ exchange với 2 queue khác nhau.

- Các message vẫn ở trong queue cho đến khi chúng được consumer xử lý.

- Consumer xử lý message.

## 3. Các thành phần chính trong RabbitMQ

![RabbitMQ Architecture](/img/200lab/rabbitmq-architecture.png)

> _RabbitMQ Architecture_

Trong kiến trúc của RabbitMQ, các thành phần chính bao gồm message, producer, exchange, bindings, queue và consumer. Sau đây, tôi sẽ đi vào phân tích chi tiết từng thành phần.

### 3.1. Message

Message (tin nhắn) là đơn vị cơ bản để trao đổi thông tin trong RabbitMQ. Nó bao gồm một body (còn gọi là payload) và các property (thuộc tính) tuỳ chọn khác như header (tiêu đề), routing key (khoá định tuyến), message ID, ...

Message Body: Chứa dữ liệu thực tế cần được gửi, có thể ở nhiều định dạng khác nhau như JSON, XML, binary hoặc bất kỳ cấu trúc nào. Nội dung của message body có thể đại diện cho các lệnh, sự kiện, thông báo hoặc bất kỳ thông tin nào cần trao đổi.

Message Properties(thuộc tính của tin nhắn): bao gồm các atribute và metadata khác nhau đi kèm với message. Một số property điển hình:

- Routing key (Khoá định tuyến): được exchange dùng để xác định cách định tuyến message tới queue (phụ thuộc vào exchange type).
- Message ID: mã định danh duy nhất xác định message.
- Timestamp: thời gian khi message được tạo.
- Headers (Tiêu đề): Tiêu đề tuỳ chỉnh chứa thông tin bổ sung về message.
- Delivery Mode (Chế độ chuyển phát): chỉ định chế độ chuyển phát, liệu có nên lưu message vào đĩa để duy trì độ bền hay không.
- Expiration (Hạn dùng): thời gian message bị loại bỏ nếu không được sử dụng.
- Priority (Độ ưu tiên): mức độ ưu tiên của message.
- Content type (Loại nội dung): mô tả định dạng của nội dung message (ví dụ: application/json).
- Content encoding (Mã hoá nội dung): chỉ định kiêủ mã hoá được sử dụng cho nội dung message (ví dụ: utf-8).

### 3.2. Producers

Producer là một ứng dụng (hoặc phiên bản ứng dụng) gửi message tới RabbitMQ. Đây là điểm khởi đầu trong workflow của RabbitMQ.

Producer thường mở một hoặc nhiều kết nối TCP tới exchange trong quá trình ứng dụng khởi tạo. Các kết nối này thường tồn tại miễn là kết nối của chúng hoặc ứng dụng đang chạy (long-lived connection).

### 3.3. Bindings

Binding là các ràng buộc được thiết lập để xác định mối quan hệ giữa exchange và queue. Chúng chỉ định các quy tắc định tuyến để gửi message từ exchange tới queue thích hợp. Một queue có thể liên kết với nhiều exchange và một exchange có thể có nhiều liên kết tới các queue khác nhau.

### 3.4. Exchanges

Trong RabbitMQ, exchange (sàn giao dịch) đóng vai trò như một bộ định tuyến message. Khi producer gửi message tới RabbitMQ, message sẽ được gửi tới exchange. Sau đó, exchange sẽ định tuyến message đến queue thích hợp.

RabbitMQ có 5 loại exchange khác nhau dùng để định tuyến message. Mỗi loại exchange sẽ có cách sử dụng tham số và thiết lập binding khác nhau. Client có thể tự tạo exchange hoặc sử dụng exchange mặc định khi server khởi tạo.

#### 3.4.1. Direct exchange

Trong direct exchange, message được định tuyến đến queue dựa trên routing key. Nếu routing key của message khớp với routing key của queue, message sẽ được chuyển đến queue đó. Ngược lại, nếu routing key của message không khớp với bất kỳ routing key của queue nào, message sẽ bị loại bỏ.

![Direct Exchange](/img/200lab/rabbitmq-direct-exchange.png)

> _Direct Exchange_

Ở hình trên, chúng ta có

- Exchange: `pdf_events`
- Queue A: `create_pdf_queue`
- Queue B: `create_log_queue`
- Binding key giữa exchange và Queue A: `pdf_create`
- Binding key giữa exchange và Queue B: `pdf_log`

Một message có routing key là `pdf_log` được gửi tới exchange `pdf_events`. Message này sẽ định tuyến tới queue B `pdf_log_queue` vì routing key của message trùng với binding key `pdf_log`.

#### 3.4.2. Default exchange

Default exchange là một direct exchange mặc định, được khai báo trước mà không có tên, cho phép định tuyến message trực tiếp tới queue với tên là routing key của message. Mỗi queue đều tự động liên kết với exchange mặc định bằng một routing key giống tên của queue.

#### 3.4.3. Fanout exchange

Trong fanout exchange, message được định tuyến đến tất cả các queue được liên kết với nó, bất kể chúng có routing key như nào.

![Fanout Exchange](/img/200lab/rabbitmq-fanout-exchange.png)

> _Fanout Exchange_

Ví dụ, ở hình trên, chúng ta có

- Exchange: `sport news`
- Queue A
- Queue B
- Queue C
- Binding: queue A, B, C có cùng binding tới exchange

Message gửi từ exchange `sport news` sẽ được định tuyến tới cả 3 queue A, B, C bất kể chúng có routing key khác nhau do chúng đều được liên kết với exchange.

#### 3.4.4. Topic exchange

Trong topic exchange, message được định tuyến đến queue dựa trên topic, cho phép sử dụng regular expression pattern trong routing key như \* để đại diện cho một ký tự và # đại diện cho không hoặc nhiều ký tự.

![Topic Exchange](/img/200lab/rabbitmq-topic-exchange.png)

> _Topics Exchange_

Ví dụ, ở hình trên, chúng ta có

- Exchange: `aggreements`
- Queue A: `berlin_agreements`
- Queue B: `ali_agreements`
- Queue C: `headstone_agreements`
- Binding key giữa exchange và Queue A: `agreements.eu.berlin.#`
- Binding key giữa exchange và Queue B: `agreements.#`
- Binding key giữa exchange và Queue C: `agreements.*.headstone`

Message có routing key `agreements.eu.berlin` được gửi tới `exchange agreements`. Message này sẽ được định tuyến tới queue A `berlin_agreements` vì routing pattern khớp với binding key `agreements.eu.berlin.#`.

Đồng thời, message này cũng được gửi tới queue B vì khớp với binding key `agreements.#`.

#### 3.4.5. Header exchange

Trong header exchange, message được định tuyến dựa trên thuộc tính header của message thay vì routing key.

![Headers Exchange](/img/200lab/rabbitmq-headers-exchange.png)

> _Headers Exchange_

Ví dụ, ở hình trên, chúng ta có

- Message 1: header có dạng `key: value` là `format: pdf, type: report`
- Message 2: header có dạng `key: value` là `format: pdf`
- Message 3: header có dạng `key: value` là `format: zip, type: log`
- Exchange: `aggreements`
- Queue A
- Queue B
- Queue C
- Binding 1 giữa exchange và Queue A: có dạng `key: value` là `format: pdf, type: report, x-match: all`
- Binding 2 giữa exchange và Queue B: có dạng `key: value` là `format: pdf, type: log, x-match: any`
- Binding 3 giữa exchange và Queue C: có dạng `key: value` là `format: zip, type: report, x-match: all`

Tham số `x-match` trong binding xác định cách so sánh các cặp key/value của header trong message với header của binding. Có 2 giá trị cho tham số `x-match` là `any` và `all`.

- `x-match: any`: chỉ cần một thuộc tính trong header của message phải khớp với header của binding.
- `x-match: all`: tất cả các thuộc tính trong header của message phải khớp với header của binding.

Message 1 sẽ được định tuyến tới queue A vì tất cả cặp key/value trong header của message đều khớp với binding.

Message 1 sẽ được định tuyến tới queue B vì có cặp key/value `format: pdf` trùng và thuộc tính `x-match: any` yêu cầu chỉ cần một thuộc tính trong header khớp dù message 1 có `type: report` không khớp với `type: log` của binding 1.

Message 2 sẽ được định tuyến tới queue B vì khớp `format: pdf`.

Message 3 sẽ được định tuyến tới queue B vì `type: log`.

### 3.5. Queues

Trong RabbitMQ, queue là một danh sách các message được lưu trữ cho tới khi chúng được tiêu thụ bởi consumer.

Message được định tuyến tới queue thông qua bindings từ exchange. RabbitMQ cho phép tạo nhiều queue với các cấu hình khác nhau. Mỗi queue có một tên, ngoài ra còn có các thuộc tính tùy chọn khác như độ bền, thời gian hết hạn của message và độ dài tối đa của message.

### 3.6. Consumers

Consumer là một ứng dụng (hoặc phiên bản ứng dụng) nhận message từ một hay nhiều queue.

Client có thể đóng kết nối tới RabbitMQ. Khi RabbitMQ phát hiện mất kết nối, việc gửi message sẽ dừng lại.

#### Chế độ hoạt động

Khi một message mới đến queue, consumer sẽ tiêu thụ message thông qua 2 cơ chế hoạt động là:

- Cơ chế push: là chế độ hoạt động mặc định, RabbitMQ sẽ push message đến consumer
- Cơ chế pull: consumer chủ động poll message từ queue

1. Cơ chế push (Basic.Consume)

Trong cơ chế push, RabbitMQ push (đẩy) message tới consumer bất cứ khi nào có message mới trong queue. Nhờ vậy, client nhận được dữ liệu real-time hoặc gần real-time với độ trễ thấp và phản ứng với thay đổi một cách tức thì.

Do RabbitMQ là một message broker có mục đích chính là đảm bảo rằng message được gửi đến consumer nhanh chóng và hiệu quả nhất có thể, nên push trở thành chế độ hoạt động mặc định trong RabbitMQ.

Tuy nhiên, vì RabbitMQ kiểm soát tốc độ truyền dữ liệu nên cơ chế push gặp khó khăn trong việc xử lý khi các consumer có tốc độ tiêu thụ khác nhau. Ngoài ra, cơ chế push chỉ hoạt động được khi mà kết nối bidirectional giữa client và server được thiết lập sẵn. Nếu client bị ngắt kết nối khi server push response thì có thể response sẽ bị mất.

2. Cơ chế pull (Basic.Get)

Trong chế độ pull, consumer chủ động poll message từ queue.

Consumer gửi một yêu cầu Basic.Get tới RabbitMQ khi nó trong trạng thái sẵn sàng xử lý message. RabbitMQ sẽ gửi lại message từ queue nếu được.

Chế độ pull thích hợp dùng cho các trường hợp consumer muốn truy xuất message theo yêu cầu thay vì liên tục được push message.

Chế độ pull có thể kém hiệu quả hơn chế độ push đặc biệt nếu tần suất polling không được điều chỉnh tốt. Nếu consumer thường xuyên polling trong khi không có message nào trong queue thì sẽ dẫn tới lãng phí tài nguyên. Nếu consumer ít polling thì có thể thời gian nhàn rỗi của nó sẽ tăng.

#### Delivery acknowledgment mode (Chế độ xác nhận chuyển phát)

Consumer có thể chọn giữa 2 chế độ xác nhận chuyển phát message (delivery acknowledgment mode) để queue biết cách xử lý các message đã gửi cho consumer:

- Automatic: không yêu cầu xác nhận của consumer, còn gọi là "fire and forget"[1]
  - "Fire and forget" là một thuật ngữ thường được sử dụng trong lĩnh vực công nghệ thông tin và truyền thông để mô tả một hành động hoặc một phương thức giao tiếp mà người gửi thông điệp hoặc yêu cầu không chờ đợi một phản hồi, xác nhận hoặc kết quả từ người nhận.
- Manual: yêu cầu xác nhận của consumer

## 4. Ưu điểm của RabbitMQ

### Open source (Mã nguồn mở)

RabbitMQ dược viết bằng mã nguồn mở nên các nhà phát triển và kỹ sư trong cộng đồng RabbitMQ có thể đóng góp cải tiến và tiện ích bổ sung, đồng thời tận dụng được sự hỗ trợ tài chính của công ty Pivotal.

### Lightweight (Nhẹ)

RabbitMQ rất nhẹ, cần ít hơn 40 MB RAM để chạy ứng dụng RabbitMQ cùng với các plugin khác như giao diện quản lý.

### Reliability (Độ tin cậy)

RabbitMQ cung cấp độ tin cậy và khả năng mở rộng để quản lý việc phân phối message trên mạng lưới các nodes, đảm bảo rằng message được gửi theo thứ tự mong muốn và không bị thất lạc.

### Message Prioritization (Ưu tiên tin nhắn)

RabbitMQ cho phép các message được chỉ định mức độ ưu tiên khác nhau. Điều này đảm bảo rằng các message có mức độ ưu tiên cao sẽ được xử lý trước các message có mức độ ưu tiên thấp hơn.

### Flexibility in controlling messaging trade-offs (Tính linh hoạt trong kiểm soát cân bằng tin nhắn)

RabbitMQ cung cấp các mức QoS khác nhau như "At Most Once" (Tối đa một lần), "At Least Once" (Tối thiểu một lần) và "Exactly Once" (Đúng một lần), cho phép bạn kiểm soát sự cân bằng giữa reliability (độ tin cậy) và performance (hiệu suất).

Các message trong RabbitMQ có thể được lưu vào vào ổ đĩa, đảm bảo message không bị mất khi khởi động lại broker. Tuy nhiên, điều này có thể làm tăng chi phí I/O, ảnh hưởng tới hiệu năng. Bạn có thể chọn đánh đổi durability (độ bền) để có throughput (thông lượng) cao hơn.

RabbitMQ cung cấp sự linh hoạt trong phân phối message và tiêu thụ message thông qua việc chọn hình thức exchange phù hợp (direct, topic, fanout, headers) và chọn routing key (khoá định tuyến) phù hợp.

### Plugins for higher-latency environments (Plugin dành cho môi trường có độ trễ cao)

Do các cấu trúc liên kết và kiến trúc mạng không giống nhau nên RabbitMQ cung cấp tính năng trao đổi message trong môi trường có cả độ trễ thấp và cao, chẳng hạn Internet. Điều này cho phép RabbitMQ được phân cụm trên cùng một mạng cục bộ và chia sẻ message thống nhất trên nhiều datacenter.

### Flexible Language and Protocol Support (Hỗ trợ ngôn ngữ và giao thức linh hoạt)

RabbitMQ hỗ trợ chạy trên nhiều hệ điều hành và cả trên môi trường cloud, đồng thời cung cấp nhiều client libraries cho hầu hết các ngôn ngữ lập trình phổ biến. Ngoài ra, RabbitMQ còn hỗ trợ các giao thức nhắn tin khác nhau như STOMP, MQTT, ...

### Layers of security (Nhiều lớp bảo mật)

Trong RabbitMQ có nhiều lớp bảo mật. Kết nối của client có thể được bảo mật bằng cách thực thi giao tiếp chỉ có SSL và xác thực chứng chỉ client.

Quyền truy cập của người dùng có thể được quản lý ở máy chủ ảo, cung cấp sự cô lập mức độ cao cho message và tài nguyên. Ngoài ra, quyền truy cập cấu hình, đọc từ queues (hàng đợi) và ghi vào exchanges (sàn giao dịch) được quản lý bằng regex.

## 5. Nhược điểm của RabbitMQ

### Learning curve (Đường cong học tập)

Việc thiết lập và định cấu hình RabbitMQ có thể phức tạp, đặc biệt đối với những người mới làm quen với khái niệm message queuing. Quản lý phù hợp đòi hỏi sự hiểu biết về các khái niệm cốt lõi trong RabbitMQ như queues, exchanges, bindings (ràng buộc), ...

### Performance Overhead (Chi phí hiệu năng)

Mặc dù độ tin cậy của RabbitMQ là một điểm mạnh nhưng cơ chế xác nhận và lưu trữ có thể gây ra một số chi phí về hiệu năng, đặc biệt là trong các tình huống cần thông lượng cao.

### Queues of Accumulation (Hàng đợi tích luỹ)

Nếu consumer không thể tiêu thụ kịp message dẫn tới tích lũy message trong queue. Điều này có thể gây ra tiêu tốn tài nguyên và có khả năng dẫn đến các vấn đề về hiệu suất.

### Message Serialization (Tuần tự hoá tin nhắn)

Việc tuần tự hóa và giải tuần tự hóa các đối tượng phức tạp có thể tốn thời gian, ảnh hưởng đến hiệu suất tổng thể.

## 6. Ứng dụng của RabbitMQ

### 6.1. Real-time data streaming (Truyền dữ liệu thời gian thực)

Mạng quảng cáo trên thiết bị di động AdMob của Google sử dụng RabbitMQ trong dự án Rocksteady để phân tích số liệu theo thời gian thực, từ đó, phát hiện nguyên nhân gốc rễ của vấn đề rồi biến chúng thành các event gửi qua RabbitMQ tới hệ thống xử lý sự kiện Esper Complex Event Processing (CEP).

Dưới đây design (thiết kế) của dự án Rockesteady.

- Các metric (chỉ số) được gửi từ các host tới RabbitMQ
- Rocksteady subscribe metric trên RabbitMQ, đồng thời, có thể publish metric lên RabbitMQ.
- Graphite subscribe metric trên RabbitMQ.
- Rocksteady có thể yêu cầu số liệu lịch sử từ Graphite.
- Rocksteady xử lý metric và cảnh báo Nagios.
- Rocksteady capture một số dữ liệu ở dạng thô hoặc tổng hợp vào cơ sở dữ liệu.
- Dữ liệu của Graphite được sử dụng trong Dashboard
- Rocksteady capture data đã được sử dụng trong Dashboard.

### 6.2. IoT Data Processing (Xử lý dữ liệu IoT)

Internet of Things (IoT) là một hệ thống các thiết bị và đối tượng vật lý liên quan đến nhau được nhúng với các cảm biến, phần mềm và các công nghệ khác cho phép chúng trao đổi dữ liệu và tương tác với nhau qua Internet hoặc các mạng truyền thông khác.

Sáng kiến ​​Đài quan sát Đại dương (Ocean Observatories Initiative - OOI) là cơ sở nghiên cứu chính của Quỹ Khoa học Quốc gia Mỹ (National Science Foundation - NSF), bao gồm một mạng lưới các nền tảng và cảm biến quan sát đại dương dựa trên khoa học ở Đại Tây Dương và Thái Bình Dương.

Trong Sáng kiến đài quan sát đại dương OOI, RabbitMQ được ứng dụng để định tuyến dữ liệu vật lý, hoá học, địa chất và sinh học quan trọng ở quy mô ven biển, khu vực và toàn cầu tới một mạng lưới máy tính nghiên cứu phân tán để hiểu rõ môi trường đại dương và các vấn đề của đại dương.

Một ví dụ khác là trong dự án thành phố thông minh, cảm biến trên toàn thành phố sẽ giám sát chất lượng không khí, lưu lượng giao thông và việc sử dụng năng lượng. Các cảm biến này gửi dữ liệu tới RabbitMQ, chuyển tiếp dữ liệu tới consumer thích hợp như hệ thống quản lý thành phố để có thể phân tích và đưa ra quyết định theo thời gian thực.

### 6.3. Microservices Communication (Giao tiếp trong microservices)

Một ứng dụng thương mại điện tử trong hệ thống microservices bao gồm các service khác nhau như catalog sản phẩm, quản lý đơn đặt hàng và xử lý thanh toán. RabbitMQ có thể dùng để quản lý giao tiếp giữa các service này. Khi người mua đặt một đơn hàng, service order sẽ publish một event tới RabbitMQ, còn service payment thì subscribe tới những event này để xử lý thanh toán.

### 6.4. Log Aggregation and Monitoring (Tổng hợp và giám sát log)

Một ứng dụng chạy trên nhiều máy chủ sẽ tạo ra log. Log là bản ghi hoặc sự bắt đầu của sự kiện, hành động, giao dịch hoặc dữ liệu được tạo ra và lưu trữ có hệ thống để tham khảo, phân tích hoặc kiểm tra trong tương lai.

RabbitMQ có thể được sử dụng để thu thập và định tuyến log đến các công cụ tổng hợp log tập trung để phân tích. Điều này cho phép xác định nhanh chóng các vấn đề, từ đó, cải tiến hiệu suất.

## 7. Tổng kết

Tóm lại, với những tính năng mạnh mẽ và sự hỗ trợ từ cộng đồng, RabbitMQ đã khẳng định vị thế của mình như một giao pháp hàng đầu về message broking.

Dù bạn đang thiết kế một hệ thống phân tán hay làm việc với microservices hay chỉ cần một nền tảng truyền tin nhắn đáng tin cậy, RabbitMQ cung cấp đủ tính năng cần thiết giúp bạn đối mặt với những thách thức này.
