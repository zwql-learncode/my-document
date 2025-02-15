---
id: docker_200lab
title: Docker
---

# Docker Document

Nguồn: [200Lab](https://200lab.io/blog/docker-la-gi)

Docker là một nền tảng mã nguồn mở được thiết kế để đơn giản hóa việc phát triển, triển khai và chạy các ứng dụng bên trong các container.

Bạn đã bao giờ mất hàng giờ chỉ để thiết lập môi trường phát triển giống với các bạn khác trong team hay cố gắng tái tạo một lỗi mà nó "chỉ xảy ra trên server"? Đây là những rắc rối mà bất kỳ lập trình viên nào cũng từng gặp phải. Và rồi, Docker xuất hiện như một giải pháp cho vấn đề này, giúp gạt bỏ mọi rào cản giữa các môi trường phát triển, kiểm thử, và triển khai.

Trong bài viết này, hãy cùng mình khám phá cách Docker thay đổi cách chúng ta phát triển và triển khai phần mềm, lý do nó trở thành xu hướng, và cách bạn có thể áp dụng Docker để tối ưu hóa quy trình làm việc của mình.

## 1. Containerization là gì?

### 1.1 Khái niệm

Trước khi có container, các Developer thường gặp phải vấn đề là phần mềm họ viết và kiểm thử trên máy tính cá nhân vẫn chạy được bình thương nhưng khi đưa lên Production thì lại lỗi. Điều này xảy ra do sự khác biệt giữa môi trường phát triển (local) và môi trường sản xuất (production), gây ra sự không nhất quán và khó khăn trong việc khắc phục lỗi.

- Trước khi có container: Developer viết một ứng dụng trên máy tính cá nhân sử dụng thư viện Python phiên bản 3.6. Sau khi kiểm thử thành công, anh ấy triển khai ứng dụng này lên máy chủ Production, nhưng máy chủ này lại đang chạy Python phiên bản 3.7. Sự khác biệt nhỏ này đã gây ra lỗi do một số thư viện không tương thích với Python 3.7.

- Với container: Developer có thể đóng gói ứng dụng của mình cùng với tất cả các thư viện, bao gồm phiên bản Python 3.6 mà ứng dụng cần, vào một container. Khi container này được triển khai trên bất kỳ môi trường nào (local, test, production), ứng dụng vẫn sẽ hoạt động chính xác như khi nó được kiểm thử trên máy tính cá nhân.

Hãy tưởng tượng bạn có một chiếc hộp đặc biệt, và bất kỳ thứ gì bạn đặt vào trong chiếc hộp này sẽ hoạt động giống hệt nhau bất kể bạn mang nó đi đâu. Đó chính là những gì container mang lại cho phần mềm. Container đóng gói phần mềm trong một môi trường nhất quán, tách nó ra khỏi các sự khác biệt về hệ thống và cơ sở hạ tầng bên dưới.

### 1.2 Vai trò của Containerization

Những lợi ích mà containerization mang lại trong phát triển và triển khai phần mềm:

- `Consistency` (Nhất quán): Đảm bảo rằng ứng dụng được đóng gói trong container sẽ hoạt động giống nhau trên mọi môi trường, dù là trên máy tính của developer, test server, hay môi trường production.

- `Portability` (Di động): container là các gói phần mềm nhẹ có thể dễ dàng chuyển từ hệ thống này sang hệ thống khác mà không gặp vấn đề về tương thích.

- `Scalability` (Khả năng mở rộng): Containers có thể được khởi động hoặc dừng nhanh chóng, cho phép các ứng dụng dễ dàng mở rộng hoặc thu hẹp tùy theo nhu cầu sử dụng thực tế.

- `Efficiency` (Hiệu quả): Container chia sẻ kernel của hệ điều hành chủ, không giống như các máy ảo truyền thống phải có một hệ điều hành đầy đủ riêng. Điều này làm cho container tốn ít tài nguyên hơn, khởi động nhanh hơn và có ít chi phí quản lý hơn.

- `Isolation` (Cô lập): Container đảm bảo rằng các ứng dụng được cô lập với nhau, tăng cường bảo mật. Nếu một ứng dụng bị tấn công, sự cố này không ảnh hưởng đến các ứng dụng khác.

## 2. Docker là gì?

`Docker` là một nền tảng mã nguồn mở được thiết kế để đơn giản hóa việc phát triển, triển khai và chạy các ứng dụng bên trong các container. Container là các đơn vị phần mềm nhẹ, độc lập và có thể thực thi được, nó đóng gói tất cả các thành phần cần thiết để chạy một ứng dụng, bao gồm mã nguồn, thư viện, và các cài đặt hệ thống.

Các công nghệ container trước Docker (containerization không phải do Docker phát minh mà có từ lâu trước đó) như LXC (Linux Containers), Solaris Zones, và OpenVZ, đã có khả năng tạo và quản lý các container. Nhưng những công nghệ này yêu cầu kiến thức sâu về hệ điều hành và cần nhiều cấu hình thủ công, không có giao diện người dùng đơn giản để quản lý các container. Việc di chuyển các container giữa các hệ thống hoặc môi trường khác nhau thường gặp khó khăn.

Docker ra đời đã cung cấp một giao diện dòng lệnh đơn giản và trực quan, dễ sử dụng ngay cả với những người không có kinh nghiệm sâu về hệ điều hành, cho phép Docker contain
er có thể chạy trên bất kỳ hệ thống nào có Docker.

### 2.1 Các thành phần chính của Docker

`Docker Engine`: Đây là trung tâm của hệ thống Docker. Nó là một runtime (môi trường thực thi) quản lý các container Docker trên một hệ thống. Docker Engine là một ứng dụng client-server với ba thành phần chính: Docker CLI, Docker API, và Docker Daemon.

- `Docker CLI`: Là giao diện dòng lệnh mà các nhà phát triển và quản trị viên hệ thống sử dụng để tương tác với Docker. Các lệnh như `docker build`, `docker run`, và `docker push`.

- `Docker API`: Trong khi CLI là giao diện dành cho người dùng cuối, Docker API là giao diện dành cho các ứng dụng. Các giải pháp phần mềm có thể tương tác với Docker Engine, điều khiển hoạt động của nó và truy xuất thông tin thông qua API này.

- `Docker Daemon`: Thường được gọi tắt là `Dockerd`, Daemon chạy trên máy chủ và thực hiện các công việc chính như build, chạy và quản lý các container. Dockerd có thể giao tiếp với các Docker Daemons khác để đồng bộ hóa dịch vụ container trên nhiều máy.

`Docker Images`: Docker Images là các bản thiết kế (blueprints) cho container. Một image định nghĩa tất cả những gì một ứng dụng cần để chạy. Sau khi một image được tạo ra, nó không thể thay đổi (immutable). Bạn có thể chạy các instance của image này, được gọi là các container.

`Docker Containers`: Đây là các instance đang chạy của Docker images. Container đóng gói một ứng dụng và tất cả các thành phần phụ thuộc của nó. Containers cô lập phần mềm khỏi sự ảnh hưởng của môi trường và đảm bảo rằng nó vẫn hoạt động bất kể sự khác biệt (staging vs production).

`Docker Hub`: Là một registry service phổ biến nhất cung cấp bởi Docker. Đây là nơi bạn có thể tải lên (push) các Docker images của mình, chia sẻ chúng với cộng đồng hoặc đồng nghiệp, và tải xuống (pull) các images từ cộng đồng hoặc từ các nguồn đáng tin cậy khác.

## 3. Nguyên tắc hoạt động của Docker

### 3.1 Trên Linux

Docker dựa vào các tính năng của Linux kernel như namespaces, cgroups, và UnionFS để thực hiện containerization.

- `Namespaces`: Cô lập các tài nguyên như tiến trình (PID), mạng (NET), hệ thống file (MNT), và các yếu tố khác để mỗi container có một môi trường riêng.

  - `PID Namespace`: Tạo một không gian riêng cho các tiến trình trong container, nghĩa là các tiến trình này không thể nhìn thấy hoặc tương tác với các tiến trình bên ngoài container, và ngược lại, các tiến trình trên hệ điều hành chủ cũng không thể nhìn thấy tiến trình bên trong container.
  - `Network Namespace`: Cung cấp một network stack riêng biệt cho mỗi container, bao gồm các network interface, route tables và firewall rules.
  - `Mount Namespace`: Cung cấp một hệ thống file độc lập cho mỗi container. Nó giúp Docker cô lập hệ thống file của container khỏi hệ thống file của host (hệ điều hành chủ), cho phép mỗi container có một hệ thống file riêng, chỉ chứa các file và thư mục mà nó cần.
  - `IPC Namespace`: Giúp cô lập cơ chế giao tiếp giữa các tiến trình (processes) bên trong container khỏi các tiến trình bên ngoài container, đảm bảo rằng các tiến trình trong container chỉ có thể giao tiếp với nhau mà không ảnh hưởng hoặc bị ảnh hưởng bởi các tiến trình khác trên hệ thống.

- `Cgroups`: Containerd cũng sử dụng cgroups để quản lý và giới hạn tài nguyên hệ thống (như CPU, RAM, I/O) mà container có thể sử dụng, đảm bảo container không tiêu tốn quá nhiều tài nguyên và ảnh hưởng đến hệ thống chủ.

- `UnionFS`: Hỗ trợ các hệ thống file nhiều lớp, cho phép Docker image được xây dựng từ nhiều lớp khác nhau.

Quy trình chi tiết khi khởi chạy một container:

```
docker run -d --name my_nginx nginx
```

- Docker CLI gửi lệnh đến Docker Daemon.
- Docker Daemon tương tác với Containerd.
- Containerd tạo ra Container.
- Runc khởi chạy container.
- Container hoạt động (running).

### 3.2 Trên Windows

Docker trên Windows sẽ có cách hoạt động khác với Docker trên Linux do sự khác biệt cơ bản giữa hai hệ điều hành, đặc biệt là trong cách quản lý tài nguyên và thực hiện containerization. Docker trên Windows có thể hoạt động ở hai chế độ chính:

- `Windows Containers` (Windows-native Containers): Chạy các ứng dụng Windows bên trong containers. Các containers này sử dụng Windows kernel và chạy trực tiếp trên hệ điều hành Windows. Đây là chế độ mặc định khi chạy các ứng dụng Windows.

- `Linux Containers on Windows` (LCOW): Chạy các containers Linux trên hệ điều hành Windows. Docker sử dụng một lớp ảo hóa để cung cấp một môi trường Linux trên Windows. Ban đầu, Docker sử dụng Hyper-V để tạo ra một máy ảo Linux nhỏ gọn, nhưng hiện nay, Docker cũng có thể sử dụng WSL 2 (Windows Subsystem for Linux 2) để cung cấp một kernel Linux đầy đủ.
  - `Hyper-V`: Công nghệ ảo hóa của Microsoft, được sử dụng để tạo ra các máy ảo nhỏ gọn cho việc chạy containers. Khi Docker được cấu hình để sử dụng Hyper-V, mỗi container sẽ được chạy trong một máy ảo riêng, đảm bảo tính cô lập cao giữa container và hệ điều hành chủ.
  - `WSL 2`: Đây là một cải tiến lớn từ WSL ban đầu, WSL 2 cung cấp một kernel Linux thực sự chạy bên trong Windows thông qua một máy ảo Hyper-V nhẹ. Docker có thể tích hợp với WSL 2 để chạy các containers Linux một cách trực tiếp và hiệu quả hơn so với các phương pháp trước đó.

Quy trình chi tiết khi khởi chạy một container:

```
docker run -d --name my_nginx nginx
```

- Docker CLI gửi lệnh đến Docker Daemon.
- Docker Daemon chọn chế độ hoạt động: Nếu bạn chạy một container Linux như nginx, Docker sẽ sử dụng chế độ LCOW (Linux Containers on Windows).
- Sử dụng WSL 2 Hoặc Hyper-V để tạo môi trường Linux: Nếu Docker được cấu hình để sử dụng WSL 2, nó sẽ khởi tạo một instance WSL 2, nơi Docker daemon có thể chạy các containers Linux. Nếu WSL 2 không được kích hoạt, Docker có thể sử dụng Hyper-V để tạo ra một máy ảo nhỏ chạy một hệ điều hành Linux tối giản.
- Khởi tạo và quản lý container.
- Container hoạt động (running).

## 4. Kết luận

Docker là một công nghệ containerization phổ biến nhất hiện tại, giúp đóng gói các thành phần cần thiết để chạy một ứng dụng vào trong các container, tạo ra một môi trường tách biệt khỏi hệ điều hành chủ. Điều này giúp đảm bảo các ứng dụng có thể chạy một cách nhất quán trên mọi môi trường, từ phát triển đến production, giảm thiểu rủi ro lỗi và rút ngắn thời gian triển khai.
