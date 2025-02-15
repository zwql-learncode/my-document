---
id: docker
title: 2.Docker
---

# Docker Document

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

## 1.Docker là gì?

Docker là một nền tảng mã nguồn mở giúp `phát triển`, `đóng gói`, `vận chuyển` và chạy ứng dụng một cách linh hoạt. Với Docker, bạn có thể tách biệt ứng dụng khỏi hạ tầng hệ thống, giúp triển khai phần mềm nhanh chóng và hiệu quả hơn.

- `Tách biệt ứng dụng và hạ tầng`: Ứng dụng chạy độc lập, không phụ thuộc vào môi trường bên dưới.
- `Triển khai nhanh chóng`: Giảm độ trễ giữa quá trình viết code và đưa vào môi trường production.
- `Tự động hóa việc triển khai`: Đóng gói ứng dụng thành các `container di động` (self-sufficient containers), có thể chạy trên cloud hoặc on-premises.
- `Khả năng chạy mọi nơi`: `Docker container` có thể chạy từ máy tính cá nhân đến các nền tảng cloud.
- `Hỗ trợ đa nền tảng`: `Docker image` chạy natively trên cả Linux và Windows.
- `Tiêu chuẩn vàng cho Microservices`: Docker trở thành `chuẩn mặc định` (de facto standard) trong việc `container hóa`(containerization) các ứng dụng microservices.

## 2. Docker Containers, Images, và Registries

Docker hoạt động dựa trên ba thành phần chính: Container, Image, và Registry.

- Docker Image

  - Là một bản `đóng gói tĩnh`(static representation) của ứng dụng, chứa toàn bộ mã nguồn, thư viện, cấu hình và dependencies.
  - Được tạo bởi lập trình viên và có thể dùng để triển khai ứng dụng trên bất kỳ hệ thống nào có Docker.

- Docker Container

  - Là một `thể hiện đang chạy` (instantiated to create) của một Docker Image.
  - Khi cần chạy ứng dụng, Docker sẽ instantiate (khởi tạo) một container từ image tương ứng.
  - Containers chạy trên Docker Host, giúp quản lý tài nguyên hiệu quả.

- Docker Registry

  - Là `kho lưu trữ`(registry) các Docker Images, giúp chia sẻ và triển khai ứng dụng dễ dàng hơn.
  - Public Registries: Docker Hub, Azure Container Registry, AWS ECR...
  - Lưu trữ và quản lý Docker Images: `Docker Images` được lưu trữ trong một `Registry`, đóng vai trò như một thư viện tập trung để `quản lý` và `phân phối` images. Khi triển khai ứng dụng trong môi trường production, các `orchestrator`(hệ thống quản lý và điều phối các container) sẽ cần truy cập Registry này để lấy các Images cần thiết.

## 3.Container hóa(Containerization) ứng dụng với Docker, Orchestration với Docker Compose

`Orchestration`(hệ thống quản lý và điều phối các container): `Kubernetes`,Amazon ECS, Azure AKS,...

- Bước 1: Viết Dockerfile cho ứng dụng

  - Dockerfile là một tệp cấu hình mô tả cách xây dựng image cho ứng dụng.
  - Chứa thông tin về môi trường, dependencies, và cách chạy ứng dụng.

- Bước 2: Build ứng dụng và tạo Docker Image

  - Sử dụng Dockerfile để build thành một image chứa toàn bộ ứng dụng và dependencies.

- Bước 3: Chạy Container từ Docker Image

  - Có thể chạy image này trên bất kỳ máy nào có Docker.
  - Khi chạy, Docker sẽ khởi tạo một container từ image tương ứng.

- Orchestration với Docker Compose

  - Docker Compose không phải là công cụ Orchestration thực sự, nó chỉ là chỉ là công cụ giúp quản lý multi-container trên một máy.
  - Sử dụng tệp docker-compose.yml để cấu hình các dịch vụ trong môi trường multi-container.
  - Sử dụng lệnh docker compose up, để khởi chạy tất cả các microservices theo cấu hình đã định.
