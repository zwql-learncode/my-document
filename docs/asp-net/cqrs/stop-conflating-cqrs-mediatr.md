---
id: stop-conflating-cqrs-mediatr
title: Đừng lẫn lộn CQRS với MediatR
---

# Đừng lẫn lộn CQRS với MediatR

Nguồn: Bài viết "Stop Conflating CQRS and MediatR" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/stop-conflating-cqrs-and-mediatr)

"Chúng ta cần triển khai CQRS? Tuyệt, để tôi cài MediatR ngay."

Nếu bạn đã từng nghe câu này trong nhóm phát triển của mình – hoặc thậm chí chính bạn đã từng nói – thì bạn không đơn độc. Hệ sinh thái .NET đã dần dần "hợp nhất" hai khái niệm này, tạo ra một phản xạ không điều kiện: CQRS đồng nghĩa với MediatR.

Lối mòn tư duy này đã dẫn dắt vô số nhóm phát triển vào con đường phức tạp không cần thiết. Một số nhóm khác thì tránh xa CQRS hoàn toàn, vì lo ngại phải gánh thêm sự nặng nề của một framework messaging nữa.

## Hiểu đúng CQRS theo hình thức thuần túy

CQRS (Command Query Responsibility Segregation) là một pattern phân tách các thao tác đọc và ghi trong ứng dụng của bạn. Pattern này đề xuất rằng các model sử dụng để đọc dữ liệu nên khác với các model sử dụng để ghi dữ liệu.

Chỉ vậy thôi.

Không có chỉ dẫn cụ thể về cách triển khai, không có yêu cầu dùng thư viện nào, chỉ đơn giản là một `architectural principle` (nguyên lý kiến trúc).

Mô hình này xuất phát từ việc hiểu ra rằng trong nhiều ứng dụng, đặc biệt là các domain phức tạp, yêu cầu giữa đọc và ghi dữ liệu vốn khác nhau một cách căn bản. Các thao tác đọc thường cần tổng hợp dữ liệu từ nhiều nguồn hoặc trình bày theo định dạng đặc biệt phục vụ giao diện người dùng (UI). Trong khi đó, các thao tác ghi cần áp dụng business rules, đảm bảo tính nhất quán, và quản lý trạng thái domain.

Việc phân tách này mang lại nhiều lợi ích:

- Tối ưu hóa model đọc và ghi cho mục đích riêng biệt
- Đơn giản hóa việc bảo trì khi nhu cầu đọc và ghi phát triển độc lập
- Tăng khả năng mở rộng (scalability) riêng biệt cho đọc và ghi
- Tạo ranh giới rõ ràng giữa domain logic và nhu cầu presentation

## MediatR: Một công cụ khác cho một bài toán khác

MediatR là một implementation của mediator pattern. Mục tiêu chính của nó là giảm sự phụ thuộc trực tiếp giữa các component, bằng cách cung cấp một `mediator` (người điều phối). Các component không cần biết tới nhau, mediator sẽ làm nhiệm vụ kết nối chúng.

Thư viện MediatR cung cấp nhiều tính năng:

- Messaging nội bộ (in-process) giữa các component
- Behavior pipeline cho các cross-cutting concerns
- Notification handling theo mô hình publish/subscribe

Sự gián tiếp mà MediatR tạo ra cũng chính là điểm bị chỉ trích nhiều nhất: nó có thể khiến code khó theo dõi hơn, đặc biệt với người mới vào codebase. Tuy nhiên, vấn đề này có thể dễ dàng khắc phục bằng cách định nghĩa request và handler trong cùng một file.

## Tại sao chúng thường xuất hiện cùng nhau

Việc CQRS và MediatR hay được sử dụng cùng nhau không phải không có lý do. Mô hình request/response của MediatR rất phù hợp với việc tách biệt command/query của CQRS. Command và Query có thể được implement dưới dạng MediatR request, còn logic xử lý nằm trong handler.

Ví dụ về một command sử dụng MediatR:

```c#
public record CreateHabit(string Name, string? Description, int Priority) : IRequest<HabitDto>;

public sealed class CreateHabitHandler(ApplicationDbContext dbContext, IValidator<CreateHabit> validator)
    : IRequestHandler<CreateHabit, HabitDto>
{
    public async Task<HabitDto> Handle(CreateHabit request, CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(createHabitDto);

        Habit habit = createHabitDto.ToEntity();

        dbContext.Habits.Add(habit);

        await dbContext.SaveChangesAsync(cancellationToken);

        return habit.ToDto();
    }
}
```

Sử dụng CQRS kết hợp với MediatR mang lại nhiều lợi ích:

- Consistent handling cho cả commands và queries
- Pipeline behaviors cho logging, validation, and error handling
- `separation of concerns` (tách biệt mối quan tâm) rõ ràng thông qua các handler class
- Đơn giản hóa testing nhờ handler isolation

Tuy nhiên, sự tiện lợi này đi kèm với cái giá là thêm abstraction và tăng độ phức tạp. Bạn phải định nghĩa thêm các class request/response, handler, code để gửi request, v.v... Điều này có thể trở thành overkill trong các ứng dụng đơn giản.

Vấn đề không nằm ở việc đánh giá sự đánh đổi này là "tốt" hay "xấu" một cách tuyệt đối, mà là liệu nó có phù hợp với bối cảnh cụ thể của bạn hay không.

## CQRS mà không cần MediatR

Bạn hoàn toàn có thể implement CQRS mà không cần dùng MediatR. Ví dụ đơn giản:

Định nghĩa command và query bằng interface thuần:

```c#
public interface ICommandHandler<in TCommand, TResult>
{
    Task<TResult> Handle(TCommand command, CancellationToken cancellationToken = default);
}

// Tương tự với IQueryHandler
```

Implement handler và đăng ký nó vào dependency injection:

```c#
public record CreateOrderCommand(string CustomerId, List<OrderItem> Items)
    : ICommand<CreateOrderResult>;

public class CreateOrderCommandHandler : ICommandHandler<CreateOrderCommand, CreateOrderResult>
{
    public async Task<CreateOrderResult> Handle(
        CreateOrderCommand command,
        CancellationToken cancellationToken = default)
    {
        // implementation
    }
}

// Đăng ký DI...
builder.Services
    .AddScoped<ICommandHandler<CreateOrderCommand, CreateOrderResult>, CreateOrderCommandHandler>();
```

Sau đó sử dụng handler trong controller:

```c#
[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CreateOrderResult>> CreateOrder(
        CreateOrderCommand command,
        ICommandHandler<CreateOrderCommand, CreateOrderResult> handler)
    {
        var result = await handler.Handle(command);

        return Ok(result);
    }
}
```

## Khác biệt so với MediatR?

Cách này vẫn giữ separation of concerns, nhưng không có thêm bước gián tiếp (indirection). Mọi thứ trực tiếp, rõ ràng và đủ tốt cho rất nhiều ứng dụng.

Tuy nhiên, nó thiếu một số tiện ích mà MediatR mang lại, như behavior pipeline hoặc tự động đăng ký handler. Ngoài ra, bạn phải inject từng handler cụ thể vào controller, điều này có thể trở nên cồng kềnh nếu ứng dụng lớn.

## Kết luận

CQRS và MediatR là hai công cụ riêng biệt giải quyết hai bài toán khác nhau. Dù chúng có thể phối hợp tốt với nhau, nhưng việc coi chúng như thể "bất khả phân ly" là một cách tiếp cận sai lầm.

- CQRS: Phân tách concern giữa đọc và ghi
- MediatR: Giảm coupling giữa các component thông qua mediator

Điều cốt lõi là hiểu đúng giá trị từng pattern, và đưa ra quyết định phù hợp với bối cảnh. Có lúc bạn cần cả hai, có lúc chỉ một, và cũng có lúc chẳng cần cái nào. Đó mới chính là bản chất của việc kiến trúc hệ thống có suy nghĩ: chọn đúng công cụ cho đúng nhu cầu.

Nếu bạn muốn tìm hiểu thêm cách triển khai CQRS một cách hiệu quả trong kiến trúc sạch (clean architecture), hãy tham khảo [Pragmatic Clean Architecture](https://www.milanjovanovic.tech/pragmatic-clean-architecture). Bạn sẽ học cách áp dụng các pattern này trong các tình huống thực tế, tránh các sai lầm phổ biến và tình trạng over-engineering khi xây dựng các ứng dụng có khả năng mở rộng.
