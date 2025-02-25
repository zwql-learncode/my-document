---
id: redis_200lab
title: Redis
---

# Redis là gì? Bạn có đang sử dụng hết các tính năng của Redis

Nguồn: [200Lab](https://200lab.io/blog/redis-la-gi)

Redis là một kho lưu trữ dữ liệu mã nguồn mở hoạt động hoàn toàn trong bộ nhớ, nổi bật với tốc độ cực nhanh và độ trễ rất thấp

## 1. Redis là gì?

Redis (Remote Dictionary Server) là một kho lưu trữ dữ liệu mã nguồn mở hoạt động hoàn toàn trong bộ nhớ (in-memory store). Được phát triển bởi Salvatore Sanfilippo vào năm 2009, Redis đã trở thành một trong những NoSQL database phổ biến nhất hiện nay, nổi bật với tốc độ cực nhanh và độ trễ thấp, khiến nó trở thành sự lựa chọn tuyệt vời cho nhiều ứng dụng và tình huống cần xử lý dữ liệu theo thời gian thực (real-time application).

Redis không chỉ là một kho lưu trữ dữ liệu theo kiểu key-value đơn giản mà còn hỗ trợ nhiều loại cấu trúc dữ liệu đa dạng: danh sách (Lists), tập hợp (Sets), tập hợp có thứ tự (Sorted Sets), bảng băm (Hashes) và Geospatial Index.

## 2. Các ứng dụng thực tế của Redis

Redis có khả năng xử lý hơn 500,000 thao tác mỗi giây với độ trễ dưới một mili giây trong cấu hình ACID, và có thể đạt tới 50 triệu thao tác mỗi giây với 26 node. Điều này cho thấy Redis cực kỳ hiệu quả và có thể đáp ứng nhu cầu hiệu suất cao của các ứng dụng hiện đại. Hãy cùng mình điểm qua các ứng dụng thực tế của Redis nhé.

### 2.1 Caching

Để giảm tải cho hệ thống cơ sở dữ liệu chính (database), một kỹ thuật thường được sử dụng là caching. Caching là quá trình lưu trữ tạm thời dữ liệu mà ứng dụng thường xuyên truy xuất, giúp giảm thiểu thời gian truy vấn. Redis là một công cụ phổ biến để thực hiện caching, nhờ vào tốc độ truy xuất nhanh và khả năng lưu trữ dữ liệu trong bộ nhớ (in-memory).

- Ví dụ: Thay vì truy vấn cơ sở dữ liệu mỗi lần người dùng yêu cầu xem thông tin sản phẩm, bạn có thể lưu trữ thông tin sản phẩm trong Redis cache. Khi người dùng yêu cầu thông tin về sản phẩm, ứng dụng sẽ kiểm tra Redis trước để xem liệu dữ liệu đã có trong cache hay chưa. Nếu có, dữ liệu sẽ được trả về ngay lập tức mà không cần truy vấn cơ sở dữ liệu.

### 2.2 Message/Queue

Message Queue trong Redis được triển khai thông qua việc sử dụng các cấu trúc dữ liệu danh sách (Lists). Thông điệp được đẩy vào một hàng đợi (queue) và xử lý theo thứ tự FIFO (First In, First Out). Người nhận (consumers) lấy thông điệp ra khỏi hàng đợi để xử lý, đảm bảo rằng mỗi thông điệp chỉ được xử lý một lần.

Tin nhắn trong hàng đợi chỉ được một consumer duy nhất xử lý. Khi một tin nhắn được lấy ra khỏi hàng đợi, nó sẽ không còn sẵn sàng cho các consumer khác nữa.

### 2.3 Pub/Sub (Publish/Subscribe)

Pub/Sub trong Redis hoạt động theo mô hình phát hành/đăng ký (publish/subscribe). Một hoặc nhiều nhà phát hành (publishers) phát thông điệp đến một kênh, và bất kỳ khách hàng đăng ký (subscribers) nào đang nghe kênh đó sẽ nhận được thông điệp ngay lập tức.

Redis Pub/Sub được thiết kế để truyền tải thông điệp trong thời gian thực. Nếu không có subscriber nào kết nối vào thời điểm thông điệp được phát đi, thông điệp đó sẽ bị mất, đây là điểm khác biệt chính giữa Redis Pub/Sub và Kafka.

### 2.4 Real-Time Analytics (Phân tích thời gian thực)

Redis rất phù hợp cho các tính toán thời gian thực, như xếp hạng (top scores), người đóng góp hàng đầu (top-ranked contributors), và các bài đăng nổi bật (top posts). Redis sử dụng cấu trúc dữ liệu Sorted Sets để tự động sắp xếp và giữ thứ tự của dữ liệu, giúp bạn dễ dàng lấy được các giá trị cao nhất hoặc thấp nhất mà không cần tốn tài nguyên để sắp xếp thủ công.

### 2.5 Fraud Detection (Phát hiện gian lận)

Redis có thể được sử dụng để phát hiện gian lận trong các giao dịch tài chính hoặc mua sắm. Dữ liệu giao dịch có thể được ghi nhận trong Redis Streams, sau đó chuyển sang Redis Bloom để đánh giá xác suất gian lận, và sử dụng RedisAI để phân tích toàn diện giao dịch đó.

Redis TimeSeries có thể giúp phát hiện các xu hướng trong dữ liệu, chẳng hạn như các mô hình gian lận lặp đi lặp lại, thông qua phân tích chuỗi thời gian.

### 2.6 Personalization with session (Cá nhân hóa với session)

Khi người dùng đăng nhập hoặc sử dụng ứng dụng, một phiên làm việc (session) được thiết lập để theo dõi hoạt động của họ. Redis là lựa chọn lý tưởng cho các ứng dụng này vì dữ liệu được lưu trữ trong bộ nhớ (in-memory), cho phép truy xuất cực nhanh, Redis Hash giúp lưu trữ dữ liệu trong nhiều trường.

- Ví dụ: Bạn đang quản lý một trang web thương mại điện tử và muốn cá nhân hóa trải nghiệm của người dùng dựa trên hoạt động trước đó của họ. Khi người dùng đăng nhập, thông tin session như user ID, các mục đã xem gần đây, và giỏ hàng được lưu trữ trong Redis Hash.

Khi người dùng truy cập lại, hệ thống sẽ nhanh chóng lấy thông tin từ Redis để hiển thị các sản phẩm liên quan hoặc gợi ý dựa trên lịch sử hoạt động. Trường hợp này cũng khá tương tự với cách Netflix lưu danh sách phim bạn đang xem gần đây và "có thể bạn sẽ thích".

### 2.7 Recommendation management (Quản lý đề xuất)

Redis Sets giúp bạn dễ dàng theo dõi các mục (items) thông qua việc gắn thẻ (tagging), hỗ trợ trong việc xây dựng hệ thống đề xuất sản phẩm.

### 2.8 Social app (Hỗ trợ ứng dụng mạng xã hội)

Người dùng của các ứng dụng xã hội mong đợi thao tác của họ được phản hồi trong thời gian thực (real-time) hoặc gần thời gian thực (near real-time), chẳng hạn như khi nhắn tin, theo dõi, bình luận, hoặc chơi game. Các hệ thống lưu trữ dữ liệu trên đĩa (disk-based data stores) thường không đủ nhanh để đáp ứng nhu cầu này, do đó, việc sử dụng một kho dữ liệu trong bộ nhớ (in-memory data store) như Redis là rất cần thiết, với các tính năng như:

- Intelligent Caching: Lưu trữ tạm thời các cuộc trò chuyện gần đây để giảm thời gian tải khi người dùng mở lại cuộc trò chuyện.
- Publish/Subscribe (pub/sub): Redis sử dụng mô hình pub/sub để gửi và nhận tin nhắn theo thời gian thực.
- Job and Queue Management: Khi người dùng theo dõi người khác, một tác vụ sẽ được đưa vào hàng đợi để gửi thông báo cho người dùng đó.
- Built-in Analytics: Redis có thể phân tích dữ liệu về việc theo dõi (follow), như ai đang theo dõi ai và xu hướng theo dõi trong một khoảng thời gian nhất định.
- Native JSON-handling: Redis hỗ trợ lưu trữ và xử lý dữ liệu JSON, giúp ứng dụng của bạn dễ dàng tương tác với dữ liệu mà không cần chuyển đổi.

### 2.9 Search (Tìm kiếm)

RediSearch cung cấp tính năng lập chỉ mục (indexing), hỗ trợ tìm kiếm toàn văn bản (full-text search) và cho phép người dùng thực hiện các truy vấn phức tạp một cách nhanh chóng. RediSearch sẽ cung cấp gợi ý ngay cả khi người dùng nhập sai chính tả (fuzzy search).

- Ví dụ: Bạn đang quản lý một cửa hàng trực tuyến và muốn cung cấp chức năng tìm kiếm sản phẩm theo tên, mô tả, và các thuộc tính khác. Trước tiên, bạn tạo một chỉ mục cho các sản phẩm của mình. Sau khi lập chỉ mục, bạn có thể thêm các sản phẩm vào Redis và RediSearch sẽ tự động cập nhật chỉ mục. Khi người dùng tìm kiếm, RediSearch sẽ truy xuất kết quả ngay lập tức mà không cần thực hiện quét (SCAN) toàn bộ dữ liệu.

## 3. Kết luận

Dù bạn cần một giải pháp lưu trữ tạm thời, hệ thống truyền tải thông tin thời gian thực, hay một chức năng tìm kiếm mạnh mẽ, Redis đều sẽ cung cấp các công cụ cần thiết để tối ưu hóa hoạt động và đảm bảo trải nghiệm tốt nhất cho người dùng. Sự phổ biến và ứng dụng rộng rãi của Redis trong các lĩnh vực từ thương mại điện tử, quản lý nội dung, hệ thống IoT đến các ứng dụng tài chính, đã chứng minh rằng đây là một trong những công cụ không thể thiếu trong thế giới công nghệ ngày nay.
