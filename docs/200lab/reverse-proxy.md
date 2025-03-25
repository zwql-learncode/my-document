---
id: reverse-proxy_200lab
title: Reverse Proxy
---

# Proxy và Reverse Proxy là gì? Hướng dẫn sử dụng Proxy

Nguồn: [200Lab](https://200lab.io/blog/proxy-la-gi)

## 1. Proxy là gì?

Proxy hay chính xác hơn là Proxy Server đóng vai trò như một máy chủ trung gian đứng giữa người dùng cuối và các trang web mà họ truy cập. Proxy Server ngăn chặn việc khách hàng và máy chủ giao tiếp trực tiếp với nhau, từ đó giúp chúng ta nâng cao tính bảo mật và kiểm soát các lượt truy cập.

![Proxy Server Image](/img/200lab/proxy-server.jpg)

> _Proxy Server (Forward Proxy)_

Nếu bạn đã từng bị công ty chặn không cho truy cập các trang web giải trí như Facebook, TikTok, ... khi đang truy xuất bằng mạng nội bộ thì các bạn đã tương tác với Proxy Server rồi đó. Yêu cầu truy cập này sẽ được gửi trực tiếp tới máy chủ proxy của công ty chứ không phải tới trang web đích (VD: Facebook). Máy chủ proxy đánh giá yêu cầu, tiến hành lọc theo các quy định đã được thiết lập sẵn và quyết định xem có gửi yêu cầu tới trang web đích hay không. Sau đó, nó truyền phản hồi từ trang web đích tới máy của bạn.

Bằng cách này, công ty sẽ kiểm soát được các trang web mà nhân viên có thể truy cập đồng thời ghi lại lịch sử truy cập của từng IP. Proxy Server ở trường hợp này còn có tên gọi khác là Forward Proxy bạn nhé.

## 2. Reverse Proxy là gì?

Reverse Proxy thể hiện đúng như tên gọi của nó về nguyên tắc hoạt động. Đây là một Server trung gian giữa các khách hàng và một hoặc nhiều máy chủ nội bộ. Khi nhận được yêu cầu từ khách hàng, Reverse Proxy sẽ xác định máy chủ nào trong mạng sẽ nhận yêu cầu đó. Ngược lại với Forward Proxy kiểm soát việc truy cập từ mạng nội bộ ra bên ngoài, Reverse Proxy kiểm soát truy cập từ bên ngoài vào các máy chủ nội bộ.

![Reverse Proxy Image](/img/200lab/reverse-proxy.jpg)

> _Reverse Proxy_

Hãy tưởng tượng một website có nhiều máy chủ phía sau xử lý yêu cầu như ở hình bên trên. Khi người dùng truy cập trang web này và gửi request, các request này sẽ đến Reverse Proxy trước, và Reverse Proxy sẽ chuyển chúng đến máy chủ nào có khả năng phản hồi tốt nhất cho yêu cầu đó.

## 3. Ứng dụng thực tế của Proxy

Proxy mang lại rất nhiều lợi ích trong quá trình phát triển ứng dụng, bên dưới đây là một số ví dụ nổi bật về việc sử dụng Proxy trong thực tế.

### 3.1. Truy cập ẩn danh

Ngày nay, nhiều người sử dụng máy chủ proxy ẩn danh để giữ kín danh tính hoặc vượt qua các thiết lập chặn vị trí địa lý trên Internet. Ví dụ như Medium đã chặn địa chỉ IP từ Việt Nam, muốn vượt qua các bạn đơn giản chỉ cần sử dụng proxy là được. Những proxy này cung cấp tính ẩn danh bằng cách che giấu địa chỉ IP thật của người dùng, làm cho Medium nhầm tưởng là truy cập của bạn đang diễn ra tại Mỹ, Anh, ...

Nếu bạn nào đã từng thực hiện các dự án thu thập (cào) dữ liệu từ các website lớn như Facebook, Shopee, ... để phục vụ cho mục đích phân tích khách hàng, thị trường, ... thì sẽ không còn xa lạ với việc bị chặn/giới hạn số lượt truy cập bởi các nền tảng này, mỗi phút/giây bạn chỉ có thể gọi được tối đa x request tới máy chủ của họ. Proxy server cho phép bạn che giấu địa chỉ IP thực của mình để tiếp tục crawl dữ liệu mà không bị phát hiện, mình đã từng thử nghiệm và thành công vượt qua được giới hạn của họ.

Bằng việc che giấu danh tính bạn cũng có thể tạo ra được các tương tác ảo hay còn gọi là seeding nhằm tăng tính tin cậy cho các bài viết, video của mình hoặc làm suy yếu các chiến dịch của đối thủ bằng cách liên tục click vào quảng cáo của họ, ...

Tuy nhiên để sử dụng hiệu quả thì chúng ta cần phải biết đến các mức độ ẩn danh của proxy server để tránh các trường hợp không mong muốn xảy ra.

- Transparent Proxy (Proxy trong suốt): Loại proxy này không cung cấp nhiều sự ẩn danh vì nó gửi địa chỉ IP thật của người dùng đến trang web đích, thường được sử dụng để lưu trữ đệm (caching) và lọc nội dung mà không cần bảo vệ danh tính người dùng.
- Anonymous Proxy (Proxy ẩn danh): Proxy này giấu địa chỉ IP thật của người dùng khỏi trang web đích nhưng vẫn cho biết rằng người dùng đang sử dụng proxy. Bảo vệ danh tính người dùng ở mức độ nhất định và vượt qua các hạn chế vị trí địa lý (vị trí thật của bạn).
- High Anonymity Proxy (Proxy ẩn danh cao cấp): Proxy này không chỉ giấu địa chỉ IP thật của người dùng mà còn giấu cả việc người dùng đang sử dụng proxy. Cung cấp mức độ bảo vệ cao nhất cho danh tính và hoạt động trực tuyến của người dùng.

### 3.2. Kiểm soát truy cập Internet

Truy cập Internet tại trường học và nơi làm việc có thể được kiểm soát bằng máy chủ proxy. Các yêu cầu truy cập từ trình duyệt được chuyển tiếp đến một máy chủ khác thông qua proxy như mình đã nói đến ở bên trên.

Lý do cần phải hạn chế thì mình nghĩ khá là dễ đoán: Hạn chế nhân viên truy cập các website giải trí trong giờ làm, ngăn chặn nhân viên upload mã nguồn lên các trang web như google drive, one drive, ... Các ứng dụng Chat không được cho phép, làm lộ bí mật kinh doanh hoặc các trang web có chứa mã độc, ...

### 3.3. Lưu trữ đệm (Caching)

Nếu website của bạn có hàng chục nghìn yêu cầu có thể được gửi đến trang chủ mỗi phút. Bạn có thể sử dụng reverse proxy để lưu trữ vào bộ nhớ đệm (caching) các nội dung thường được truy cập nhiều nhằm mục đích tăng tốc độ phản hồi của website. Thay vì phải chuyển request này đến các máy chủ để xử lý thì reverse proxy sẽ trả về nội dung lấy từ bộ nhớ đệm luôn.

### 3.4. Mã hóa SSL (Secure Sockets Layer)

Các trang web sử dụng mã hóa SSL/TLS cho phép người dùng thiết lập kết nối an toàn giữa họ và website, giúp cho các thông tin nhạy cảm như tài khoản ngân hàng, tín dụng được mã hóa nhằm nâng cao tính bảo mật. Reverse Proxy có thể được dùng để quản lý quá trình mã hóa này, giúp giảm tải cho các máy chủ.

## 4. Kết luận

Proxy là một công cụ mạnh mẽ và đa dạng, đóng vai trò quan trọng trong việc quản lý truy cập website, bảo mật. Mỗi loại proxy đều có các ứng dụng và ưu điểm riêng, phù hợp với nhiều nhu cầu khác nhau của người dùng và tổ chức.

Tuy nhiên, cũng cần lưu ý rằng không phải tất cả các proxy đều an toàn và tin cậy, do đó, việc lựa chọn proxy phải được thực hiện cẩn thận, đặc biệt khi xử lý thông tin nhạy cảm. Hy vọng bài viết của mình có thể giúp bạn phần nào nắm rõ khái niệm về proxy và ứng dụng trong các dự án sắp tới của mình.
