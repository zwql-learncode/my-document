---
id: decorator-guru
title: Decorator
---

# Decorator Pattern

Còn được gọi là: Wrapper

Dịch từ bài viết [Decorator](https://refactoring.guru/design-patterns/decorator) của Refactoring Guru

Decorator là một `structural design pattern` (mẫu thiết kế cấu trúc) cho phép bổ sung hành vi mới vào một đối tượng mà không cần thay đổi mã nguồn của nó. Bằng cách đặt chúng vào một `wrapper object đặc biệt` chứa các hành vi.

![Ảnh minh họa Mediator Pattern](/img/guru/decorator.png)

## 1. Vấn đề

Giả sử bạn đang làm việc với một notification library (thư viện thông báo) cho phép các chương trình khác thông báo cho người dùng về các sự kiện quan trọng.

Phiên bản đầu tiên của thư viện có một `Notifier` class cơ bản, chứa một list email và phương thức send(message) có đối số message. Khi ứng dụng khách cần gửi thông báo đến danh sách email, họ chỉ cần khởi tạo Notifier một lần và gọi phương thức send().

![Vấn đề](/img/guru/decorator-problem.png)

Đến một lúc nào đó, bạn nhận ra rằng người dùng thư viện mong đợi nhiều hơn là chỉ thông báo qua email. Nhiều người trong số họ muốn nhận được tin nhắn SMS về các vấn đề quan trọng. Những người khác muốn được thông báo trên Facebook và tất nhiên, người dùng doanh nghiệp sẽ thích nhận thông báo trên Slack.

Chuyện đó có gì khó đâu? Bạn mở rộng `Notifier` class và thêm các phương thức thông báo bổ sung vào các class con mới. Bây giờ, phía client chỉ cần khởi tạo class thông báo mong muốn và sử dụng nó cho tất cả các thông báo sau này.

Nhưng rồi ai đó đặt một câu hỏi rất hợp lý: “Tại sao không thể sử dụng nhiều loại thông báo cùng lúc? Nếu nhà bạn đang cháy, chắc chắn bạn muốn nhận thông báo qua mọi kênh có thể.”

Bạn cố giải quyết vấn đề đó bằng cách tạo ra các class con đặc biệt, trong đó kết hợp nhiều phương thức thông báo vào một class duy nhất. Tuy nhiên, cách này nhanh chóng khiến code trở nên cồng kềnh một cách khủng khiếp, không chỉ với mã nguồn của thư viện mà cả code phía client cũng trở nên rối rắm.

![Vấn đề](/img/guru/decorator-problem-2.png)

> _Sự kết hợp rối rắm của các lớp con_

Bạn phải tìm cách khác để cấu trúc các notifications class sao cho số lượng của chúng không vô tình phá vỡ kỷ lục Guinness.

## 2. Giải pháp

Mở rộng một lớp (Extending a class ) thường là cách đầu tiên mà người ta nghĩ đến khi muốn thay đổi hành vi của một đối tượng. Tuy nhiên, kế thừa (inheritance) có một số hạn chế nghiêm trọng mà bạn cần lưu ý.

- Kế thừa mang tính tĩnh (static): Bạn không thể thay đổi hành vi của một đối tượng hiện có trong lúc chương trình đang chạy (runtime). Cách duy nhất để thay đổi là thay thế toàn bộ đối tượng bằng một đối tượng khác được tạo từ một lớp con khác.
- Lớp con chỉ có thể kế thừa từ một lớp cha: Trong hầu hết các ngôn ngữ lập trình, một lớp không thể kế thừa hành vi của nhiều lớp cùng lúc (đa kế thừa thường không được hỗ trợ).

Một trong những cách để khắc phục những hạn chế trên là sử dụng Aggregation (tập hợp) hoặc Composition (thành phần) thay vì Inheritance (kế thừa). Cả hai phương pháp này hoạt động gần như giống nhau

- Một đối tượng giữ tham chiếu đến một đối tượng khác và ủy quyền công việc cho nó.
- Trong khi với kế thừa, đối tượng tự thực hiện công việc bằng cách kế thừa hành vi từ lớp cha.

Với cách tiếp cận mới này, bạn có thể dễ dàng thay thế `helper object` (đối tượng trợ giúp) được liên kết bằng một đối tượng khác, giúp thay đổi hành vi của lớp chứa trong lúc chương trình đang chạy (runtime). Một đối tượng có thể sử dụng hành vi của nhiều lớp khác nhau bằng cách tham chiếu đến nhiều đối tượng và ủy quyền công việc cho chúng. Aggregation/Composition là nguyên tắc cốt lõi của nhiều design pattern, bao gồm cả Decorator.

Trong ví dụ về thư viện thông báo ở bên trên, hãy giữ chức năng gửi email cơ bản bên trong class gốc - `Notifier` class, còn tất cả các phương thức thông báo khác sẽ được chuyển thành decorator.

![Giải pháp](/img/guru/decorator-solution.png)

> _Nhiều biến thể phương thức thông báo trở thành decorators_

Phía client sẽ cần bọc (wrap) một đối tượng `Notifier` cơ bản bằng một tập hợp các decorator phù hợp với nhu cầu của client. Các đối tượng kết quả sẽ được tổ chức theo cấu trúc ngăn xếp (stack).

Decorator cuối cùng trong stack chính là đối tượng mà client thực sự làm việc. Vì tất cả các decorator đều triển khai cùng một interface như `Notifier` gốc, nên mã nguồn client không cần quan tâm đến việc nó đang làm việc với một Notifier gốc hay một Notifier đã được decorated.

## 3. Ví dụ thực tế

![Ảnh minh họa: Decorator Pattern](/img/guru/decorator-comic.png)

> _Bạn có thể kết hợp nhiều lớp quần áo để kết hợp nhiều loại tác dụng._

Việc mặc quần áo là một ví dụ về cách sử dụng Decorator. Khi trời lạnh, bạn mặc một chiếc áo len. Nếu vẫn chưa đủ ấm, bạn có thể khoác thêm một chiếc áo khoác bên ngoài.Nếu trời mưa, bạn mặc thêm áo mưa để bảo vệ bản thân.

Tất cả những lớp quần áo này “mở rộng” hành vi cơ bản của bạn (giữ ấm, chống mưa) nhưng không phải là một phần cố định của bạn. Bạn có thể dễ dàng thêm hoặc cởi bỏ từng lớp khi không cần thiết.

Giống như Decorator trong lập trình, bạn có thể bổ sung hành vi mới cho đối tượng mà không cần thay đổi cấu trúc gốc của nó.

## 4. Cấu trúc của Decorator Pattern

![Cấu trúc của Decorator Pattern](/img/guru/decorator-structure.png)

### 4.1. Component

- Là một interface định nghĩa các method chung cần phải có cho tất cả các thành phần tham gia vào pattern này bao gồm:
  - Đối tượng gốc (wrapped object) hay Concrete Component.
  - Các lớp bọc (wrapper) hay Decorator.

### 4.2. Concrete Component Decorator

- Là lớp triển khai - lớp cụ thể (implementation class - detail class) của Component, cung cấp hành vi mặc định. Các Decorator có thể thay đổi hoặc mở rộng hành vi của class này.

### 4.3. Base Decorator

- Có một thuộc tính tham chiếu đến Concrete Component.
- Kiểu dữ liệu của thuộc tính này phải là interface Component, giúp nó có thể chứa cả Concrete Component và Decorator khác.
- Base Decorator ủy quyền tất cả các thao tác cho đối tượng mà nó bọc.

### 4.4. Concrete Decorators:

- Định nghĩa các hành vi bổ sung có thể được thêm vào wrapped object (đối tượng gốc) hay Concrete Component một cách linh hoạt.
- Ghi đè phương thức của Base Decorator, thực thi logic bổ sung trước hoặc sau khi gọi phương thức của lớp cha.

### 4.5. Client

- Có thể bọc một Component trong nhiều lớp Decorator.
- Miễn là Client tương tác với đối tượng thông qua Component Interface, thì nó không cần quan tâm đến việc đối tượng đó là wrapped object hay đã được bọc thêm nhiều lớp.

## 5. Khi nào nên sử dụng Decorator Pattern

- Cần gán thêm hành vi cho đối tượng tại runtime mà không làm ảnh hưởng đến code đang sử dụng đối tượng đó.
- Muốn tổ chức logic theo từng lớp (layered structure), giúp linh hoạt trong việc kết hợp các hành vi khác nhau khi chạy chương trình.
- Kế thừa (Inheritance) không phải là một lựa chọn phù hợp, hoặc khi việc mở rộng hành vi của đối tượng thông qua kế thừa trở nên cồng kềnh.
- Lớp cần mở rộng bị đánh dấu là final (trong một số ngôn ngữ như Java), khiến việc kế thừa bị chặn. Khi đó, cách duy nhất để mở rộng hành vi là sử dụng Decorator để bọc đối tượng lại.

## 6. Ưu và nhược điểm

### Ưu điểm

1. Tuân theo nguyên tắc Single Responsibility Principle (SRP)

- Có thể chia nhỏ một class lớn với nhiều hành vi thành các class nhỏ hơn, dễ quản lý hơn.

2. Mở rộng hành vi của đối tượng mà không cần tạo subclass mới.

3. Thêm hoặc loại bỏ trách nhiệm của đối tượng ngay tại runtime.

4. Kết hợp nhiều hành vi khác nhau bằng cách bọc đối tượng trong nhiều Decorator.

### Nhược điểm

- Khó gỡ bỏ một lớp Decorator cụ thể trong stack.
- Hành vi của Decorator có thể phụ thuộc vào thứ tự trong stack, gây khó kiểm soát.
- Code khởi tạo ban đầu có thể trông phức tạp và khó đọc.
