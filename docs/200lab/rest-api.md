---
id: rest-api_200lab
title: REST API
---

# REST API là gì? Cách thiết kế RESTful API bạn chưa biết

Nguồn: Bài viết [REST API là gì? Cách thiết kế RESTful API bạn chưa biết](https://200lab.io/blog/rest-api-la-gi) của tác giả Việt Trần tại 200lab Blog

REST API là gì? Làm thế nào để thiết kế RESTful API hiệu quả? Cập nhật những thông tin mới nhất về REST API nhé!

REST API không còn là khái niệm xa lạ với tất cả anh em dev từ frontend tới backend. Tuy nhiên để hiểu rõ và làm đúng các chỉ dẫn tiêu chuẩn (convention) của REST thì có thể nhiều bạn vẫn chưa biết. Vì thế trong bài viết này mình sẽ chia sẻ các convention này nhé.

## 1. REST API là gì?

REST API (còn được biết với tên gọi RESTful API) là một giao diện lập trình ứng dụng (API) tuân thủ các ràng buộc và quy ước kiến trúc REST được sử dụng trong việc giao tiếp giữa client và server. REST là viết tắt của REpresentational State Transfer, nó được tạo ra bởi nhà khoa học máy tính Roy Fielding.

REST API thường vẫn sử dụng giao thức HTTP/1 kèm theo các định nghĩa trước đó mà cả client và server cần tuân thủ.

Hiện tại, các REST API dùng JSON rất phổ biến. Một ít có thể vẫn còn dùng XML.

## 2. Hai thành phần trong RESTful API

REST (REpresentational State Transfer) là một đại diện cho sự chuyển đổi dữ liệu. Trong kiến trúc này client và server hoàn toàn độc lập, chúng không biết gì về nhau. Mỗi một request REST API đều không mang theo trạng thái trước đó (stateless).

Như vậy để đôi bên trao đổi state, chúng sẽ phải thông qua các resources. Các resource này chính là phần đại diện cho sự thay đổi dữ liệu.

API (Application Programming Interface) là giao diện lập trình ứng dụng. Giao diện này không dành cho người dùng cuối mà dành cho các nhà phát triển (developer). Nó là cái “bề mặt”, chỉ thấy được phần khai báo (tên, tham số, kiểu trả về), bộ đồ lòng body thì không biết. “Biết mặt không biết lòng” chính là API.

## 3. Request và Response trong REST API

### Methods (Phương thức)

Như đã đề cập ở trên, để trao đổi state chúng sẽ cần giao tiếp resource thông qua việc gởi các request response thông qua HTTP/1. Cụ thể việc giao tiếp này là thế nào thì chúng cần chỉ định các method tương ứng bao gồm:

- `GET`: Trả về một Resource hoặc một danh sách Resource.
- `POST`: Tạo mới một Resource.
- `PUT`: Cập nhật thông tin cho Resource (toàn bộ resource).
- `PATCH`: Cật nhật thông tin cho resourse (một phần resource).
- `DELETE`: Xoá một Resource.

Nếu bạn từng nghe qua CRUD APIs thì chúng đại diện cho Create, Read, Update và Delete một resource nào đó.

### Header: Authentication và quy định kiểu dữ liệu trả về

Hãy nhớ rằng REST API là stateless. Mỗi một request không hề biết bất kỳ thông tin gì trước đó. Khác với khi chúng ta truy cập web, trình duyệt sẽ có session và cookie để hỗ trợ phân biệt request đấy là của ai, thông tin trước đó là gì.

Trong REST, nếu một request cần xác thực quyền truy cập, chúng sẽ phải dùng thêm thông tin trong header. Ví dụ như thông tin Authorization sẽ mang theo một user token. Hiện có 3 cơ chế Authentication chính:

- HTTP Basic
- JSON Web Token (JWT)
- OAuth2

Ngoài ra Header còn giúp client chỉ định được loại content cần trả về từ server – content type. Việc này được thực hiện thông qua phần Accept trong header. Giá trị của nó thường là MIME type:

- image — image/png, image/jpeg, image/gif
- audio — audio/wav, audio/mpeg
- video — video/mp4, video/ogg
- application — application/json, application/pdf, application/xml, application/octet-stream

Ví dụ request lấy danh sách bài viết:

```
GET /v1/posts
Accept: application/json
```

### Status Code trong RESTful API

Một số status phổ biến:

- 200 OK – Trả về thành công cho những phương thức GET, PUT, PATCH hoặc DELETE.
- 201 Created – Trả về khi một Resouce vừa được tạo thành công.
- 204 No Content – Trả về khi Resource xoá thành công.
- 304 Not Modified – Client có thể sử dụng dữ liệu cache, resource server không đổi gì.
- 400 Bad Request – Request không hợp lệ
- 401 Unauthorized – Request cần có xác thực.
- 403 Forbidden – bị từ chối không cho phép.
- 404 Not Found – Không tìm thấy resource từ URI
- 405 Method Not Allowed – Phương thức không cho phép với user hiện tại.
- 410 Gone – Resource không còn tồn tại, Version cũ đã không còn hỗ trợ.
- 415 Unsupported Media Type – Không hỗ trợ kiểu Resource này.
- 422 Unprocessable Entity – Dữ liệu không được xác thực
- 429 Too Many Requests – Request bị từ chối do bị giới hạn

### Hỗ trợ version của REST API

Thông thường REST API sẽ có version như /v1, /v2 để hỗ trợ các phiên bản dữ liệu cũ hơn. Việc này đặc biệt quan trọng khi chúng ta nâng cấp API lên các version cao hơn, sự nâng cấp này có thể khác biệt rất to lớn: thay đổi URL, cách thức xác thực người dùng hoặc cả resource name và cấu trúc của nó.

## 4. Cách thiết kế REST API theo convention

Mặc dù các ràng buộc và quy ước trên các nhà phát triển không cần tuân thủ. Tuy nhiên nếu làm “đúng”, chúng sẽ mang lại rất nhiều lợi ích.

### Thiết kế REST API URI

Mình đã từng thấy rất nhiều REST API thiết kế viết đại khái như sau:

```
POST /create_post (tạo bài viết)
GET /list_posts (lấy danh sách bài viết)
POST /feature_posts (danh sách bài viết nổi bật)
POST /edit_post/:post_id (edit bài viết với post_id)
```

Những REST API này vẫn hoạt động tốt, không vấn đề gì cả!! Có điều chúng không theo convention mà thôi.

Việc này dẫn đến một rắc rối cho người làm document (hoặc chính người thiết kế ra) phải rà soát lại cái URL có chính xác không. Phía sử dụng API cũng phải thiết lập một danh sách API đúng như vậy luôn.

Các bạn hãy so sánh với thiết kế URL như sau:

```
POST /v1/posts (tạo mới một bài viết)
GET /v1/posts (lấy danh sách bài viết)
GET /v1/posts/:post_id (lấy chi tiết bài viết với post_id cụ thể)
PUT /v1/posts/:post_id (update bài viết với post_id cụ thể)
DELETE /posts/:post_id (delete bài viết với post_id cụ thể)
```

Cách thiết kế này các bạn sẽ thấy rằng có một nguyên tắc rất rõ ràng sử dụng các method request để nói lên được nhiệm vụ của API. Phần URI có thể giống nhau, không cần cứ phải chứa các động từ như: create, get, update, delete nữa. Resource name sẽ ở dạng số nhiều (plural).

Một số ví dụ khác:

```
GET /v1/posts/:post_id/liked-users (lấy danh sách user đã like bài viết với post_id cụ thể)
POST /v1/posts/:post_id/liked-users (like bài viết với post_id cụ thể)
GET /v1/posts?page=2&limit=50 (hãy dùng query string để filter hoặc phân trang nhé)
```

### Các quy ước khác bạn cần chú ý

- Sử dụng đúng Status Code. Nếu API trả về lỗi, các bạn hãy dùng đúng status nhé, tránh luôn trả về status 2xx khi mà trong body là error message (cái này nhiều bạn đang làm sai lắm).
- Đừng dùng underscore (\_), hãy dùng hyphen (-) trong URI
- Trong URI đều là chữ viết thường (lowercase)
- Đừng nên sử dụng đuôi file (extension) trong URI (VD: .html, .xml, .json).

## 5. Kết luận về REST API

REST API là một kiểu kiến trúc phổ biến để xây dựng dịch vụ web, và việc thiết kế REST API theo các nguyên tắc chuẩn giúp đảm bảo tính nhất quán và dễ sử dụng của API.

Trong thực tế công nghệ ngày nay, REST API đã trở thành một phần không thể thiếu của việc xây dựng ứng dụng và dịch vụ trực tuyến. Với khả năng liên kết mạnh mẽ, tương tác hiệu quả và khả năng mở rộng linh hoạt, RESTful API thực sự đã thiết lập tiêu chuẩn cho việc trao đổi thông tin giữa các hệ thống khác nhau. Trong bối cảnh gia tăng của ứng dụng di động, dịch vụ web và IoT, kiến thức chắc về REST API đã trở thành một yếu tố quan trọng trong lĩnh vực phát triển phần mềm.
