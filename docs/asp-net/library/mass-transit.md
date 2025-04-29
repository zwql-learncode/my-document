---
id: mass-transit
title: Sử dụng MassTransit với RabbitMQ và Azure Service Bus
---

# Sử dụng MassTransit với RabbitMQ và Azure Service Bus

Nguồn: Bài viết "Using MassTransit with RabbitMQ and Azure Service Bus
" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/using-masstransit-with-rabbitmq-and-azure-service-bus)

MassTransit là một framework mã nguồn mở cho ứng dụng phân tán trên nền tảng .NET. Nó cung cấp một abstraction về messaging dựa trên các message transport hỗ trợ sẵn. MassTransit cho phép bạn tập trung vào việc bổ sung giá trị nghiệp vụ thay vì phải bận tâm đến sự phức tạp của messaging.

MassTransit hỗ trợ nhiều công nghệ message transport khác nhau. Một vài cái phổ biến gồm:

- RabbitMQ
- Azure Service Bus
- Amazon SQS
- Kafka

Trong bản tin hôm nay, tôi sẽ hướng dẫn bạn cách cài đặt và cấu hình MassTransit trong .NET. Chúng ta sẽ kết nối MassTransit với một số message broker – cụ thể là RabbitMQ và Azure Service Bus. Ngoài ra, chúng ta cũng sẽ đề cập đến cách publish và consume message với MassTransit.

## Tại sao nên dùng MassTransit?

MassTransit giải quyết rất nhiều thách thức khi xây dựng ứng dụng phân tán. Bạn (gần như) không cần phải nghĩ về lớp transport bên dưới. Điều này cho phép bạn tập trung vào việc cung cấp giá trị nghiệp vụ.

Dưới đây là một số tính năng MassTransit hỗ trợ:

- Message routing – Publish/Subscribe theo kiểu type-based, tự động cấu hình topology cho broker.
- Exception handling – Cho phép retry hoặc di chuyển message lỗi sang error queue.
- Dependency injection – Hỗ trợ cấu hình Service Collection và scope Service Provider.
- Request-Response – Xử lý request với tự động định tuyến response.
- Observability – Tích hợp sẵn OpenTelemetry (OTEL).
- Scheduling – Lên lịch gửi message bằng delay của transport, hoặc dùng Quartz.NET, Hangfire.
- Sagas – Điều phối workflow dựa trên event theo cách bền vững và đáng tin cậy.

Bây giờ chúng ta cùng bắt đầu sử dụng MassTransit.

## Cài đặt và cấu hình MassTransit với RabbitMQ

Bạn cần cài đặt thư viện MassTransit. Nếu bạn đã chọn được message transport, hãy cài thêm thư viện tương ứng. Ở đây, ta thêm MassTransit.RabbitMQ để cấu hình RabbitMQ làm transport.

```bash
Install-Package MassTransit

Install-Package MassTransit.RabbitMQ
```

Sau đó, bạn có thể cấu hình các service cần thiết cho MassTransit. Phương thức `AddMassTransit`nhận vào một delegate để cấu hình các thiết lập. Ví dụ, bạn có thể thiết lập endpoint sử dụng cách đặt tên theo kiểu kebab case bằng cách gọi `SetKebabCaseEndpointNameFormatter`. Đây cũng là nơi để cấu hình transport, gọi `UsingRabbitMq` để kết nối RabbitMQ.

```c#
builder.Services.AddMassTransit(busConfigurator =>
{
    busConfigurator.SetKebabCaseEndpointNameFormatter();

    busConfigurator.UsingRabbitMq((context, configurator) =>
    {
        configurator.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        configurator.ConfigureEndpoints(context);
    });
});
```

MassTransit tự động thiết lập topology cần thiết cho broker. Vì RabbitMQ hỗ trợ exchange và queue, nên message sẽ được gửi hoặc publish tới exchange, và RabbitMQ sẽ định tuyến chúng tới queue phù hợp.

Bạn có thể khởi động RabbitMQ cục bộ trong một container Docker:

```bash
docker run -d --name rabbitmq -p 5672:5672 rabbitmq
```

## Cấu hình MassTransit với Azure Service Bus

Azure Service Bus là một message broker trên cloud, hỗ trợ queue và topic. MassTransit hỗ trợ đầy đủ Azure Service Bus, bao gồm nhiều tính năng và khả năng nâng cao. Tuy nhiên, bạn cần phải sử dụng Standard hoặc Premium tier của dịch vụ Azure Service Bus.

Để cấu hình MassTransit làm việc với Azure Service Bus, bạn cần cài thư viện transport tương ứng:

```bash
Install-Package MassTransit.Azure.ServiceBus.Core
```

Sau đó, kết nối đến Azure Service Bus bằng cách gọi UsingAzureServiceBus và truyền vào chuỗi kết nối (connection string). Các bước còn lại tương tự như RabbitMQ – MassTransit sẽ tự động cấu hình topology cho bạn.

```c#
builder.Services.AddMassTransit(busConfigurator =>
{
    busConfigurator.SetKebabCaseEndpointNameFormatter();

    busConfigurator.UsingAzureServiceBus((context, configurator) =>
    {
        configurator.Host("<CONNECTION_STRING>");

        configurator.ConfigureEndpoints(context);
    });
});
```

## Sử dụng In-Memory Transport của MassTransit

Bạn cũng có thể cấu hình MassTransit sử dụng in-memory transport. Nó rất hữu ích cho việc testing vì không cần chạy message broker. Ngoài ra, nó cũng rất nhanh.

Tuy nhiên, điểm yếu lớn nhất của in-memory transport là không đảm bảo độ bền (durability). Nếu message bus bị dừng, toàn bộ message sẽ mất. Vì vậy, không nên dùng in-memory transport cho hệ thống production.

Nó cũng chỉ hoạt động trên một máy duy nhất, nên không phù hợp với ứng dụng phân tán.

```c#
builder.Services.AddMassTransit(busConfigurator =>
{
    busConfigurator.SetKebabCaseEndpointNameFormatter();

    busConfigurator.UsingInMemory((context, configurator) =>
    {
        configurator.ConfigureEndpoints(context);
    });
});
```

## Message Types

MassTransit yêu cầu các message type phải là reference type. Bạn có thể dùng `class`, `record` hoặc `interface` để định nghĩa message.

Thông thường bạn sẽ tạo hai loại message:

Command: Một yêu cầu thực hiện một hành động. Một command thường chỉ có một consumer. Command thường được đặt tên với động từ ở đầu: `CreateArticle`, `PublishArticle`, `ShareArticle`.

Event: Thể hiện rằng một điều gì đó đã xảy ra. Một event có thể có một hoặc nhiều consumer. Event nên được đặt tên ở thì quá khứ: `ArticleCreated`, `ArticlePublished`, `ArticleShared`.

Ví dụ về message `ArticleCreated`:

```
public record ArticleCreated
{
    public Guid Id { get; init; }
    public string Title { get; init; }
    public string Content { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
```

Khuyến nghị dùng các property với `public set` hoặc `public init` để tránh lỗi serialize với `System.Text.Json`.

## Publish và Consume Messages

Bạn có thể sử dụng service `IPublishEndpoint` để publish message với MassTransit. Framework sẽ tự động định tuyến message tới queue hoặc topic phù hợp dựa trên loại message.

Ví dụ publish một `ArticleCreated`:

```
app.MapPost("article", async (
    CreateArticleRequest request,
    IPublishEndpoint publishEndpoint) =>
{
    await publishEndpoint.Publish(new ArticleCreated
    {
        Id = Guid.NewGuid(),
        Title = request.Title,
        Content = request.Content,
        CreatedOnUtc = DateTime.UtcNow
    });

    return Results.Accepted();
});
```

Để consume `ArticleCreated`, bạn cần implement interface `IConsumer`. Interface `IConsumer` có một phương thức `Consume` nơi bạn đặt logic nghiệp vụ. Ngoài ra, bạn còn có quyền truy cập `ConsumeContext`, cho phép gửi thêm message nếu cần.

```
public class ArticleCreatedConsumer(ApplicationDbContext dbContext)
    : IConsumer<ArticleCreated>
{
    public async Task Consume(ConsumeContext<ArticleCreated> context)
    {
        ArticleCreated message = context.Message;

        var article = new Article
        {
            Id = message.Id,
            Title = message.Title,
            Content = message.Content,
            CreatedOnUtc = message.CreatedOnUtc
        };

        dbContext.Add(article);

        await dbContext.SaveChangesAsync();
    }
}
```

MassTransit không tự động biết được bạn có consumer `ArticleCreatedConsumer`. Bạn phải đăng ký nó khi gọi `AddMassTransit`, bằng `AddConsumer`:

```
builder.Services.AddMassTransit(busConfigurator =>
{
    busConfigurator.SetKebabCaseEndpointNameFormatter();

    busConfigurator.AddConsumer<ArticleCreatedConsumer>();

    // ...
});
```

## Các bước tiếp theo

MassTransit là một thư viện messaging tuyệt vời mà tôi thường xuyên sử dụng khi xây dựng ứng dụng phân tán. Quá trình thiết lập rất đơn giản và chỉ có một vài abstraction quan trọng bạn cần biết:

- IPublishEndpoint – để publish message
- IConsumer – để consume message
