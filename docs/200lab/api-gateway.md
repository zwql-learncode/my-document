---
id: api-gateway_200lab
title: API Gateway
---

# API Gateway là gì? Các chức năng chính của API Gateway

Nguồn: [200Lab](https://200lab.io/blog/api-gateway-la-gi)

## 1. API Gateway là gì?

API Gateway thực chất là reverse proxy được cải tiến, cung cấp nhiều tùy chỉnh và linh hoạt hơn so với reverse proxy thông thường. API Gateway hoạt động như một "giao diện" của API nằm giữa Client và các dịch vụ API (Catalog/Ordering Service).

API Gateway chịu trách nhiệm điều phối các yêu cầu API, áp dụng các chính sách về lưu lượng (throttling, caching), các chính sách bảo mật (authorization, authentication), thu thập dữ liệu về lưu lượng truy cập, điều phối các công cụ chuyển đổi để chỉnh sửa yêu cầu/phản hồi ngay lập tức.

![API Gateway Image](/img/mehmet/api-gateway.png)

> _API Gateway ( Mehmet Ozakaban Image)_

## 2. Chức năng của API Gateway

### 2.1. API Security (Bảo mật cho API)

Khi public API ra bên ngoài, bạn chắc chắn phải bảo vệ nó khỏi nhưng truy cập trái phép hay nói cách khác chỉ các client có đủ quyền mới có thể tương tác với các dịch vụ tương ứng, sau đây là một số các kĩ thuật phổ biến để bảo mật API.

#### API Key

API Key là một chuỗi ký tự duy nhất được cấp phát cho mỗi client sử dụng API. Key này sẽ được truyền cùng với yêu cầu HTTP để xác thực (authentication) danh tính của client trước khi truy cập dịch vụ.

```
# Kong Gateway Demo
# đăng kí consumer
curl -X POST http://localhost:8001/consumers/ --data "username=partner_001"
# kiểm tra đăng kí
curl -X GET http://localhost:8001/consumers/
# đăng kí API cần được bảo vệ
curl -X POST http://localhost:8001/apis/movies/plugins \
    --data "name=key-auth" \
    --data "config.key_names=apikey
# tạo key
curl -X POST http://localhost:8001/consumers/3f3d9926-349c-4bb2-b378-9b6a6f40a1cb/key-auth -d
```

API Key tương tự như chìa khoá để vào nhà, nên miễn client nào có khoá là gọi được API của chúng ta, để bảo vệ người dùng nếu chẳng may lộ Key ra ngoài mà không biết, một số nền tảng đặt ra thời hạn sử dụng cho Key của họ, ví dụ như Facebook là 3 tháng. Vì thời gian tồn tại khá dài nên API Key thường phục vụ cho nhu cầu xác thực server-to-server, quản lý nội bộ, cung cấp quyền truy cập cho các đối tác.

#### OAuth2

OAuth2 là một tiêu chuẩn được sử dụng rộng rãi để cấp quyền truy cập (authorization) cho các ứng dụng bên thứ ba vào các tài nguyên của người dùng mà không cần tiết lộ thông tin đăng nhập của họ.

Thông thường các `access_token` được tạo ra từ quá trình uỷ quyền OAuth2 sẽ có thời gian tồn tại ngắn, ví dụ khi bạn login tài khoản Facebook ở máy lạ, Facebook sẽ không cấp phát 1 `access_token` có thời gian tồn tại dài vì lo ngại vấn đề bảo mật.

```
# Cấp phát token cho một bên thứ 3 truy xuất vào scope read_profile, read_history
curl -X POST http://localhost:8001/apis/movies/plugins \
    --data "name=oauth2" \
    --data "config.enable_authorization_code=true" \
    --data "config.token_expiration=240" \
    --data "config.scopes=read_profile,read_history"
```

#### JWT Token

JWT là phương pháp xác thực được sử dụng phổ biến nhất hiện nay, JWT là một chuỗi ký tự mã hóa được tạo ra để đại diện cho một tập hợp các thông tin (claims). Nó thường bao gồm ba phần: Header (chứa thông tin về thuật toán mã hóa), Payload (chứa dữ liệu cần truyền tải như thông tin người dùng hoặc quyền truy cập), và Signature (chữ ký mã hóa đảm bảo tính toàn vẹn của token).

```
# Bật JWT Plugin
curl -X POST http://localhost:8001/apis/movies/plugins \
    --data "name=jwt" \
    --data "config.claims_to_verify=exp
```
