---
id: lession-3-outbox-pattern
title: Outbox Pattern
---

# Outbox Pattern

Nguồn: Bài viết "Outbox Pattern For Reliable Microservices Messaging" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/outbox-pattern-for-reliable-microservices-messaging)

Làm việc với Microservices, hoặc bất kỳ hệ thống phân tán (distributed system) nào, đều là một việc khó. Trong một hệ thống phân tán, rất nhiều thứ có thể gặp sự cố – thậm chí đã có những bài nghiên cứu khoa học về điều này. Nếu bạn muốn tìm hiểu sâu hơn, mình gợi ý bạn đọc về [fallacies of distributed computing](https://www.se.rit.edu/~se442/doc/fallacies.pdf)

Giảm thiểu `surface area` (diện tích bề mặt) để mọi thứ không diễn ra đúng như mong muốn nên là mục tiêu của bạn. Trong bản tin tuần này, chúng ta sẽ đạt được điều đó thông qua Outbox pattern.

Làm thế nào bạn có thể triển khai reliable communication (giao tiếp đáng tin cậy) giữa các thành phần trong một hệ thống phân tán?

Outbox pattern là một giải pháp tinh tế cho vấn đề này, cho phép bạn đạt được các đảm bảo transaction trong một service duy nhất và ít nhất một lần gửi tin nhắn đến các hệ thống bên ngoài.

Hãy cùng xem Outbox pattern giải quyết vấn đề này như thế nào và chúng ta có thể triển khai nó như thế nào.

## Outbox Pattern giải quyết vấn đề gì?

Để hiểu Outbox pattern giải quyết vấn đề gì, đầu tiên ta cần một vấn đề, đương nhiên rồi.

Đây là một ví dụ về luồng đăng ký người dùng. Có vài thao tác xảy ra:

- Lưu `User` vào cơ sở dữ liệu
- Gửi email chào mừng đến người dùng
- Gửi một `UserRegisteredEvent` lên message bus

```c#
public async Task RegisterUserAsync(User user, CancellationToken token)
{
    _userRepository.Insert(user);

    await _unitOfWork.SaveChangesAsync(token);

    await _emailService.SendWelcomeEmailAsync(user, token);

    await _eventBus.PublishAsync(new UserRegisteredEvent(user.Id), token);
}
```

Trong trường hợp lý tưởng, mọi thao tác đều thành công và hệ thống hoạt động trơn tru.

- Nhưng nếu một thao tác nào đó thất bại thì sao?
- Cơ sở dữ liệu không khả dụng → lưu `User` thất bại
- Dịch vụ gửi email gặp lỗi
- Gửi message lên service bus không thành công

Ngoài ra, hãy tưởng tượng một tình huống mà bạn quản lý để lưu một `User` vào cơ sở dữ liệu, gửi cho anh ta một email chào mừng, nhưng không xuất bản `UserRegisteredEvent` để thông báo cho các dịch vụ khác. Bạn sẽ phục hồi từ tình huống này như thế nào?

Outbox pattern cho phép bạn đồng thơi update cơ sở dữ liệu và send message đến message bus.

## Triển khai Outbox Pattern

Bước đầu tiên là tạo một bảng trong cơ sở dữ liệu để đại diện cho Outbox. Chúng ta có thể đặt tên bảng này là `OutboxMessages`, và nó dùng để lưu trữ tất cả các message cần được gửi đi. Thay vì gọi trực tiếp đến các service bên ngoài, ta chỉ đơn giản lưu message đó dưới dạng một row mới trong bảng Outbox. Các message thường được lưu dưới dạng JSON trong cơ sở dữ liệu.

Bước thứ hai là tạo một `background process` (tiến trình nền) sẽ định kỳ `poll` (truy vấn) bảng `OutboxMessages`. Nếu tiến trình worker này tìm thấy một dòng có message chưa được xử lý, nó sẽ publish message đó và đánh dấu là đã gửi. Nếu việc publish thất bại vì lý do nào đó, tiến trình worker có thể retry (thử lại) trong lần chạy tiếp theo.

Hãy chú ý rằng với cơ chế retry, bạn đã triển khai được cơ chế gửi thông điệp ít nhất một lần (at-least-once message delivery). Message sẽ được gửi đúng một lần trong trường hợp suôn sẻ, và có thể được gửi nhiều lần nếu cần retry.

Ta có thể viết lại phương thức `RegisterUserAsync` từ ví dụ trước, giờ đây sử dụng Outbox:

```c#
public async Task RegisterUserAsync(User user, CancellationToken token)
{
    _userRepository.Insert(user);

    _outbox.Insert(new UserRegisteredEvent(user.Id));

    await _unitOfWork.SaveChangesAsync(token);
}
```

Outbox là một phần trong cùng transaction với unit of work, , vì vậy ta có thể lưu ( save) `User` vào database và đồng thời lưu trữ (persist) `OutboxMessage`. Nếu việc lưu vào cơ sở dữ liệu không thành công, toàn bộ transaction sẽ bị roll back và không có message nào được gửi đến message bus.

Và vì chúng ta đã chuyển việc publish `UserRegisteredEvent` sang tiến trình worker, chúng ta cần thêm một handler để có thể gửi mail chào mừng đến người dùng. Sau đây là ví dụ trong class `SendWelcomeEmailHandler`:

```c#
public class SendWelcomeEmailHandler : IHandle<UserRegisteredEvent>
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    public SendWelcomeEmailHandler(
        IUserRepository userRepository,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task Handle(UserRegisteredEvent message)
    {
        var user = await _userRepository.GetByIdAsync(message.UserId);

        await _emailService.SendWelcomeEmailAsync(user);
    }
}
```

## Architecture Diagram

Dưới đây là high level overview về kiến ​​trúc hệ thống của Outbox. Bạn có thể thấy bảng Outbox trong cơ sở dữ liệu. Những thay đổi hiện tại là bạn lưu trữ tin nhắn vào bảng Outbox trong cùng một transaction cùng với các entity của bạn.

![Architecture Diagram: Outbox pattern](/img/milan/outbox-architecture-diagram.png)

## Tổng kết

Sau khi đọc bản tin này, bạn sẽ hiểu khá rõ về Outbox pattern là gì và nó giải quyết những vấn đề gì. Nếu bạn cần triển khai nhắn tin đáng tin cậy trong hệ thống phân tán, thì đây là giải pháp tuyệt vời cho vấn đề của bạn.
