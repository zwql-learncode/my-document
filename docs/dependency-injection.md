---
id: dependency-injection
title: Dependency Injection
---

# Dependency Injection(Tiêm phụ thuộc)

## DI Design Pattern Example Tutorial

1. **Loosely couple(khớp nối lỏng lẻo)**: Các thành phần có liên kết yếu (có mối quan hệ dễ phá vỡ) với nhau và do đó, những thay đổi trong một thành phần ít ảnh hưởng đến sự tồn tại hoặc hiệu suất của thành phần khác.
2. **DI gồm các thành phần**: `Service` , `Consumer` (lớp tiêu thụ) , `DI Container`(Thành phần quản lý tiêm phụ thuộc)

`Dependency Injection` là một design pattern cho phép loại bỏ việc hard-code các dependency và làm cho ứng dụng có khớp nổi lỏng lẻo (Loosely couple) hơn, dễ mở rộng dễ bảo trì.

Lấy một ví dụ đơn giản & sau đó chúng ta sẽ xem cách sử dụng DI để đạt được `Loosely couple` (khớp nối lỏng lẻo) & làm cho ứng dụng dễ mở rộng hơn. Giả sử chúng ta có một `EmailService` để gửi Email. Thông thường cách triển khai sẽ như sau:

1. Lớp `EmailService` chứa logic để gửi email message

```
public class EmailService
{
    public void SendEmail(string message, string receiver)
    {
        // Logic để gửi email
        Console.WriteLine($"Email sent to {receiver} with Message={message}");
    }
}
```

2. Client sẽ sử dụng lớp `MyApplication` để gửi mail

```
public class MyApplication
{
    private EmailService email = new EmailService();

    public void ProcessMessages(string msg, string rec)
    {
        // Thực hiện một số logic kiểm tra, xử lý tin nhắn, v.v.
        this.email.SendEmail(msg, rec);
    }
}
```

```
public class MyLegacyTest
{
    public static void Main(string[] args)
    {
        MyApplication app = new MyApplication();
        app.ProcessMessages("Hi Pankaj", "pankaj@abc.com");
    }
}
```

Thoạt nhìn, cách triển khai trên không sai. Tuy nhiên code logic trên có một số hạn chế

1. Lớp `MyApplication` chịu trách nhiệm khởi tạo `EmailService` và sử dụng nó. Dẫn đến hard-code dependency. Nếu chúng ta muốn thêm chức năng cho `EmailService` trong tương lai, thì sẽ bắt buộc phải thay đổi code của `MyApplication`. Dẫn đến ứng dụng khó mở rộng và nếu `EmailService` được sử dụng trong nhiều class khác nhau thì việc mở rộng là vô cùng khó.

2. Nếu muốn mở rộng ứng dụng & thêm chức năng bổ sung, chẳng hạn như gửi tin nhắn qua SMS hoặc Facebook thì chúng ta sẽ cần viết một ứng dụng khác. Điều này dẫn tới việc phải thay đổi code cả trong application class và client class

3. Việc kiểm thử trở nên khó khăn vì application đang trực tiếp tạo ra service. Không có cách nào để mock dữ liệu vào các lớp kiểm thử

Có ý kiến cho răng xóa bỏ việc khởi tạo `EmailService` từ lớp `MyApplication` bằng cách sử dụng constructor và yêu cầu `EmailService` làm một đối số

```
public class MyApplication
{
    private EmailService email = null;

    public MyApplication(EmailService svc)
    {
        this.email = svc;
    }

    public void ProcessMessages(string msg, string rec)
    {
        // Thực hiện một số logic kiểm tra, xử lý tin nhắn, v.v.
        this.email.SendEmail(msg, rec);
    }
}
```

Nhưng trong trường hợp này, chúng ta đang yêu cầu client applications hoặc lớp kiểm thử khởi tạo `EmailService`, đây không phải là một thiết kế tốt. Giờ hãy xem chúng ta có thể áp dụng DI để giải quyết vấn đề. Tiêm phụ thuôc - `Dependency Injection` yêu cầu những điều sau:

1. Các Service nên được thiết kế với lớp cơ sở hoặc `interface`. Tốt nhất là `interface` hoặc `abstract class` xác định contract for the services (hợp đồng cho các service)

2. `Consumer class` phải được viết dựa trên `service interface`

- _`Consumer class`_ - Lớp tiêu thụ (dùng để chỉ các class sử dụng service được cung cấp bởi các class khác thông qua các `interface` )

3. `DI Container` chịu trách nhiệm khởi tạo các dịch vụ hoặc đối tượng phụ thuộc. Chúng quản lý việc tạo ra các đối tượng này và đảm bảo rằng chúng được tiêm vào `Consumer class` (các lớp tiêu thụ)

## I. Thành phần Service

Trong trường hợp này chúng ta sẽ sử dụng `IMessageService` để khai báo the contract for service implementations (hợp đồng để triển khai dịch vụ)

```
public interface IMessageService
{
    void SendMessage(string msg, string rec);
}
```

Bây giờ chúng ta có các Email & SMS services được triển khai (implement) interfaces trên.

```
public class EmailService : IMessageService
{
    public void SendMessage(string msg, string rec)
    {
        // Logic để gửi email
        Console.WriteLine($"Email sent to {rec} with Message={msg}");
    }
}
```

```
public class SMSService : IMessageService
{
    public void SendMessage(string msg, string rec)
    {
        // Logic để gửi SMS
        Console.WriteLine($"SMS sent to {rec} with Message={msg}");
    }
}
```

## II. Thành phần Consumer (các Controller, Service Consumer là lớp tiêu thụ)

```
public class MyDIApplication
{
    private readonly IMessageService service;

    public MyDIApplication(IMessageService svc)
    {
        this.service = svc;
    }

    public void ProcessMessages(string msg, string rec)
    {
        // Thực hiện một số logic kiểm tra, xử lý tin nhắn, v.v.
        this.service.SendMessage(msg, rec);
    }
}
```

Lưu ý rằng application class chỉ sử dụng service, chứ không khởi tạo service. Dẫn đến `separation of concerns`tốt hơn. Sử dụng `service interface` còn cho phép chúng ta kiểm thử dễ dàng hơn bằng cách mock `MessageService` và bind services tại thời điểm run thay vì thời điểm compile.

- `separation of concerns` ( tách các mối quan tâm ) là một nguyên tắc thiết kế để tách chương trình thành các phần riêng biệt

## III . Thành phần quản lý tiêm phụ thuộc (DI Container)

Giờ chúng ta sẽ xem client applications sử dụng lớp application với một chương trình đơn giản

```
using Microsoft.Extensions.DependencyInjection;

class Program
{
    static void Main(string[] args)
    {
        var serviceProvider = new ServiceCollection()
            .AddSingleton<IMessageService, EmailService>()
            .BuildServiceProvider();

        var app = new MyDIApplication(serviceProvider.GetService<IMessageService>());

        string msg = "Hi Pankaj";
        string email = "pankaj@abc.com";
        string phone = "4088888888";

        // Send email
        app.ProcessMessages(msg, email);

        // For SMS, you would configure the DI container to use SMSService instead
        // var serviceProvider = new ServiceCollection()
        //     .AddSingleton<IMessageService, SMSService>()
        //     .BuildServiceProvider();
        // var app = new MyDIApplication(serviceProvider.GetService<IMessageService>());
        // app.ProcessMessages(msg, phone);
    }
}
```

Có thể sử dụng `AddScoped` thay vì `AddSingleton`, tùy thuộc vào việc chúng ta muốn quản lý vòng đời của service như thế nào. Với `AddScoped`, service được đăng ký dưới dạng Scoped sẽ được tạo ra mỗi khi có một yêu cầu mới trong một phạm vi (scope) nhất định. Còn với `AddSingleton`, service được đăng ký dưới dạng Singleton sẽ được tạo ra một lần duy nhất trong suốt vòng đời của ứng dụng. Tất cả các yêu cầu về dịch vụ này sẽ nhận cùng một thể hiện (instance) của dịch vụ.

- **Tham khảo từ**: [_digitalocean_](https://www.digitalocean.com/community/tutorials/java-dependency-injection-design-pattern-example-tutorial)

## So sánh cách sử dụng DI với ASP.NET với các framework backend khác

| Framework  | DI Container   | Cách triển khai DI      | Đặc điểm nổi bật                                                      |
| ---------- | -------------- | ----------------------- | --------------------------------------------------------------------- |
| ASP.NET    | Tích hợp sẵn   | AddScoped, AddSingleton | Hỗ trợ lifecycle (Scoped, Transient, Singleton) mạnh mẽ.              |
| Spring     | Spring IoC     | Annotation hoặc XML     | Rất mạnh trong quản lý Bean và tích hợp tốt với hệ sinh thái Java.    |
| Express.js | Không tích hợp | Dùng thư viện bên ngoài | Tự do nhưng cần thêm thư viện như InversifyJS.                        |
| NestJS     | Tích hợp sẵn   | @Injectable, @Module    | DI Container mạnh mẽ, thiết kế module-based gần giống ASP.NET/Spring. |
