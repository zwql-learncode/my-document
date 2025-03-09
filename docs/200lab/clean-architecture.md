---
id: ca_200lab
title: Clean Architecture
---

# Clean Architecture là gì - Ưu nhược và cách dùng hợp lý

Nguồn: Bài viết [Clean Architecture là gì - Ưu nhược và cách dùng hợp lý](https://200lab.io/blog/clean-architecture-uu-nhuoc-va-cach-dung-hop-ly) của tác giả Việt Trần tại 200lab Blog

Clean Architecture là một kiến trúc ứng dụng rất nổi tiếng dựa trên nguyên lý loại bỏ sự lệ thuộc giữa các đối tượng cũng như các layer trong ứng dụng. Clean Architecture bao gồm 4 layer được đại diện thông qua các vòng tròn đồng tâm

Bài viết này mình sẽ cố gắng giải thích Clean Architecture một cách dễ hiểu nhất thông qua các ví dụ thực tế. Hy vọng các bạn sẽ nắm được kiến trúc nổi tiếng này để có thể xây dựng các ứng dụng lớn dễ test, maintain và mở rộng.

## 1. Clean Architecture là gì?

Clean Architecture là một kiến trúc ứng dụng rất nổi tiếng dựa trên nguyên lý loại bỏ sự lệ thuộc giữa các đối tượng cũng như các layer trong ứng dụng. Nguyên lý này kế thừa và phát triển dựa trên Dependency Inversion - nguyên lý nổi tiếng trong SOLID.

Trong kiến trúc Clean Architecture bao gồm 4 layer được đại diện thông qua các vòng tròn đồng tâm. Các vòng tròn ở trong sẽ không hề biết gì về các vòng tròn bên ngoài. Nguyên tắc "hướng tâm" này được minh hoạ như sau:

![Clean Architecture](/img/mehmet/clean-architecture.jpg)

> _Clean Architecture_

Từ trong ra ngoài Clean Architecture sẽ bao gồm: Entities, Use Cases, Interface Adapters và Frameworks & Drivers.

Về cơ bản các layer này sẽ làm việc qua thông qua các trừu tượng của nhau (interfaces). Nếu bạn chưa rõ về khái niệm này thì nên xem qua bài viết dưới đây nhé:

[Tầm quan trọng của trừu tượng hóa trong kiến trúc ứng dụng](https://200lab.io/blog/kien-truc-ung-dung-nen-bat-dau-nhu-the-nao)

### Entities Layer (hay Domain Layer)

Entities là layer trong cùng, cũng là layer quan trọng nhất. Entity chính là các thực thể hay từng đối tượng cụ thể và các rule business logic của nó. Trong OOP, đây chính là Object cùng với các method và properties tuân thủ nguyên tắc Encapsulation - chỉ bên trong Object mới có thể thay đổi trạng thái (State) của chính nó.

VD: Trong object Person thì thuộc tính age không thể bé hơn 1. Nếu cần thay đổi age, chúng ta phải viết hàm public setAge, hàm này cũng chịu trách nhiệm check điều kiện liên quan tới age.

Các business logic của layer Entities sẽ không quan tâm hay lệ thuộc vào các business logic ở các layer bên ngoài như Use Cases. Giả sử với trường hợp người dùng phải từ 18 tuổi trở lên mới được phép tạo tài khoản thì rule thuộc tính Age trong Entities vẫn không đổi.

### Use Cases Layer (hay Application Layer)

Use Cases là layer chứa các business logic ở cấp độ cụ thể từng Use Case (hay application).

VD: Use Case đăng ký tài khoản (tạo mới một Person/Account) sẽ cần tổ hợp một hoặc nhiều Entities tuỳ vào độ phức tạp của Use Case.

Các business logic của Use Case đương nhiên cũng sẽ không quan tâm và lệ thuộc vào việc dữ liệu đến từ đâu, dùng các thư viện nào làm apdapter, dữ liệu thể hiện thế nào,... Vì đấy là nhiệm vụ của layer Interface Adapters.

### Interface Adapters (hay Infrastructure Layer)

Interface Adapters chính là layer phụ trách việc chuyển đổi các format dữ liệu để phù hợp với từng Use Case và Entities. Các format dữ liệu này có thể dùng cho cả bên trong hoặc ngoài ứng dụng.

VD: Thông tin người dùng sẽ có một số thông tin rất nhạy cảm như Email, Phone, Address. Không phải lúc nào dữ liệu cũng về đầy đủ để phục vụ GUI (Web, App). Tương tự với tuỳ vào hệ thống Database mà các adapter phải format dữ liệu hợp lý.

Như vậy dữ liệu đầu vào và ra ở tầng Interface Apdapter chỉ cần đủ và hợp lý. Nó sẽ không quan tâm việc dữ liệu sẽ được hiển thị cụ thể như thế nào cũng như được thu thập như thế nào. Vì đó là nhiệm vụ của tầng Frameworks & Drivers.

Để các layer trong Clean Architecture có thể làm việc được nhưng lại độc lập với nhau thì chúng sẽ dùng các Interfaces.

### Frameworks & Drivers Layer (Persentation Layer)

Frameworkd & Drivers là tầng ngoài cùng, tổ hợp các công cụ cụ thể phục vụ cho từng nhu cầu của end user như: thiết bị (devices), web, application, databases,... Trong kiến trúc Clean Architecture thì ở tầng này là "nhẹ" nhất vì chúng ta không cần phải viết quá nhiều code.

Trên thực tế thì đây là nơi "biết tất cả" cụ thể các tầng là gì thông qua việc chịu trách nhiệm khởi tạo các objects cho các tầng bên trong (hay còn gọi là Setup Dependencies)

Để các layer trong Clean Architecture có thể làm việc được nhưng lại độc lập với nhau thì chúng sẽ dùng các Interfaces.

## 2. Ưu và nhược của Clean Architecture

Đầu tiên mình sẽ nói về các điểm hạn chế của Clean Architecture, chê cái rồi khen sau!

### Nhược điểm của Clean Architecture

- Cồng kềnh và phức tạp: Điều dễ thấy nhất là Clean Architecture không hề dễ sử dụng, phải viết nhiều lớp (class/object) hơn. Trong trường hợp ứng dụng của bạn quá đơn giản, ít tính năng, vòng đời ngắn thì chọn lựa kiến trúc này có thể mang lại những rắc rối không cần thiết.

- Tính trừu tượng cao: Vấn đề này gọi là indirect. Trừu tượng càng cao thì tiện cho các developers nhưng sẽ gây ảnh hưởng không nhỏ tới tốc độ thực thi (performance). Ngoài ra cũng không thể code nhanh, vội vã "mì ăn liền" được mà phải tạo đủ các Interfaces.

- Khó tuyển người: Sử dụng Clean Architecture sẽ cần tuyển dụng developer thấu hiểu về kiến trúc này. Nguyên tắc Dependency Inversion rất dễ bị xâm phạm vì sự hạn chế kiến thức, sự bất cẩn hoặc vì thời gian cần triển khai tính năng quá ít.

### Ưu điểm của Clean Architecture

- Chia để trị rất hiệu quả trong ứng dụng lớn: Trong Clean Architecture thì code tầng nào thì ở đúng tầng nấy. Hạn chế được việc "code ở đâu cũng là code, chạy được là được". Nếu làm tốt được các bài toán nhỏ thì không có bài toán lớn nào không giải quyết được.

- Rất dễ maintain và mở rộng: Việc tìm kiếm bug và lỗi logic sẽ trở nên dễ dàng và nhanh hơn, file code sẽ không nhiều vì chỉ làm đúng việc của nó. Vì các tầng độc lập với nhau thông qua các Interfaces nên việc mở rộng hoặc thay đổi các tầng sẽ không ảnh hưởng tới nhau. Điều này hạn chế các breaking change cũng như phải viết lại code (refactoring).

- Rất dễ làm Unit Test: Các logic business của các tầng trong Clean Architecture chính là các Unit Test cần được kiểm thử rất cẩn thận. Vì sự độc lập thông qua Interfaces nên các mock test rất dễ triển khai. Việc này được thực hiện thông qua implement lại để coverage được tất cả các trường hợp.

## 3. Sử dụng kiến trúc Clean Architecture sao cho hợp lý

Đầu tiên không phải một ứng dụng và sản phẩm công nghệ nào cũng đầy đủ 4 tầng Entities, Use Cases, Interface Adapters và Frameworks & Drivers. Chúng ta có thể linh động tăng hoặc giảm số tầng cho phù hợp. Trong thực tế, hầu hết các kỹ sư sẽ chỉ tham khảo kiến trúc này để có được các kiến trúc phù hợp hơn.

Chúng ta chỉ cần nhớ rằng thay vì thực hiện các business logic ở một nơi (một class hoặc một hàm duy nhất) thì nên chia chúng thành các layer chịu trách nhiệm riêng biệt. Các layer này độc lập với nhau, không sử dụng trực tiếp các concrete object mà thay vào đó là các Interfaces.
