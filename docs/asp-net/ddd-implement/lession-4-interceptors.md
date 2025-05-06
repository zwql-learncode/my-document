---
id: interceptors
title: Interceptors
---

# Interceptors - EF Core

Nguồn: Bài viết "How To Use EF Core Interceptors" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/how-to-use-ef-core-interceptors)

EF Core là ORM (Object-Relational Mapper) yêu thích của tôi dành cho các ứng dụng .NET. Tuy nhiên, nhiều tính năng tuyệt vời của nó đôi khi lại bị bỏ qua. Ví dụ như query splitting, query filters, và đặc biệt là interceptors.

EF Interceptors rất thú vị vì bạn có thể làm nhiều điều mạnh mẽ với chúng, như:

- Hook into materialization - Can thiệp vào quá trình ánh xạ dữ liệu
- handle optimistic concurrency errors - Xử lý lỗi xung đột lạc quan
- Thêm `query hints` (Gợi ý truy vấn)

Trường hợp sử dụng thực tế nhất là thêm hành vi khi lưu các thay đổi vào cơ sở dữ liệu.

Hôm nay tôi sẽ giới thiệu 3 trường hợp sử dụng interceptors trong EF Core:

- Audit Logging
- Publishing Domain Events
- Lưu trữ Outbox Messages

## EF Interceptors là gì?

EF Core Interceptors cho phép bạn can thiệp (intercept), thay đổi (change), hoặc ngăn chặn (suppress) các hoạt động của EF Core.Tất cả interceptor đều triển khai từ interface `IInterceptor`. Một số interface thường dùng: `IDbCommandInterceptor`, `IDbConnectionInterceptor`, `IDbTransactionInterceptor`.

Loại phổ biến nhất là `ISaveChangesInterceptor`, cho phép bạn thêm hành vi trước hoặc sau khi save changes.

Interceptor được đăng ký tại mỗi DbContext instance khi cấu hình context.

```c#
public interface IInterceptor
{
}
```

Bạn không cần phải triển khai trực tiếp các interface này. Tốt hơn là sử dụng các `concrete implementations` (triển khai cụ thể) và override các phương thức cần thiết.

Ví dụ, tôi sẽ cho bạn thấy cách sử dụng `SaveChangesInterceptor`.

## Audit Logging

Audit logging (nhật ký kiểm tra) tức là lưu lại thông tin mỗi lần một thực thể được tạo hoặc sửa.

Một audit logging các thay đổi của entity là một tính năng rất giá trị trong một số ứng dụng. Bạn sẽ ghi thêm thông tin audit mỗi khi một entity được tạo mới hoặc chỉnh sửa. Nhật ký này cũng có thể chứa đầy đủ giá trị trước và sau thay đổi, tùy theo yêu cầu của bạn.

Tuy nhiên, để dễ hiểu hơn, chúng ta sẽ bắt đầu với một ví dụ đơn giản.

Tôi có một interface `IAuditable` với hai thuộc tính đại diện cho thời điểm entity được tạo hoặc chỉnh sửa:

```c#
public interface IAuditable
{
    DateTime CreatedOnUtc { get; }

    DateTime? ModifiedOnUtc { get; }
}
```

Tiếp theo, tôi sẽ triển khai một interceptor tên là `UpdateAuditableInterceptor` để ghi các giá trị audit. Interceptor này sử dụng `ChangeTracker` để tìm tất cả các instances của `IAuditable` và gán giá trị thích hợp cho các thuộc tính đó.

Tôi muốn nhấn mạnh rằng ở đây tôi đang override phương thức `SavingChangesAsync`. Phương thức `SavingChangesAsync` được gọi trước khi các thay đổi được lưu xuống database, và bất kỳ cập nhật nào thực hiện bên trong `UpdateAuditableInterceptor` cũng sẽ là một phần của transaction database hiện tại.

Việc triển khai này cũng rất dễ dàng mở rộng nếu bạn muốn thêm thông tin về người dùng hiện tại.

```c#
internal sealed class UpdateAuditableInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            UpdateAuditableEntities(eventData.Context);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void UpdateAuditableEntities(DbContext context)
    {
        DateTime utcNow = DateTime.UtcNow;
        var entities = context.ChangeTracker.Entries<IAuditable>().ToList();

        foreach (EntityEntry<IAuditable> entry in entities)
        {
            if (entry.State == EntityState.Added)
            {
                SetCurrentPropertyValue(
                    entry, nameof(IAuditable.CreatedOnUtc), utcNow);
            }

            if (entry.State == EntityState.Modified)
            {
                SetCurrentPropertyValue(
                    entry, nameof(IAuditable.ModifiedOnUtc), utcNow);
            }
        }

        static void SetCurrentPropertyValue(
            EntityEntry entry,
            string propertyName,
            DateTime utcNow) =>
            entry.Property(propertyName).CurrentValue = utcNow;
    }
}

```

## Publish Domain Events

Một trường hợp sử dụng khác của EF Interceptors là publish domain events. Domain events là một DDD tactical pattern để tạo ra các hệ thống `loosely coupled`.

Domain events cho phép bạn thể hiện rõ ràng các `side effects` (tác dụng phụ) và giúp `separation of concerns` (phân tách mối quan tâm) tốt hơn trong domain.

Bạn có thể tạo một interface `IDomainEvent`, kế thừa từ `MediatR.INotification`. Điều này cho phép bạn sử dụng `IPublisher` để publish domain events và xử lý chúng một cách bất đồng bộ.

```c#
using MediatR;

public interface IDomainEvent : INotification
{
}
```

Sau đó, tôi sẽ tạo một interceptor tên là `PublishDomainEventsInterceptor`, cũng kế thừa từ `SaveChangesInterceptor`. Tuy nhiên, lần này, chúng ta sẽ override phương thức `SavedChangesAsync` để publish các domain events sau khi thay đổi đã được lưu vào database.

Điều này có 2 ý nghĩa quan trọng:

- Luồng công việc giờ đây là `eventually consistent`(sự nhất quán cuối cùng). Các handler của domain event sẽ thực hiện lưu dữ liệu vào database sau transaction ban đầu.

- Nếu bất kỳ domain event handlers nào bị lỗi, ta có nguy cơ khiến request không thành công ngay cả khi transaction ban đầu đã hoàn tất thành công.

Bạn có thể làm cho tiến trình này đáng tin cậy hơn bằng cách sử dụng `Outbox Pattern`.

```c#
internal sealed class PublishDomainEventsInterceptor : SaveChangesInterceptor
{
    private readonly IPublisher _publisher;

    public PublishDomainEventsInterceptor(IPublisher publisher)
    {
        _publisher = publisher;
    }

    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            await PublishDomainEventsAsync(eventData.Context);
        }

        return result;
    }

    private async Task PublishDomainEventsAsync(DbContext context)
    {
        var domainEvents = context
            .ChangeTracker
            .Entries<Entity>()
            .Select(entry => entry.Entity)
            .SelectMany(entity =>
            {
                List<IDomainEvent> domainEvents = entity.DomainEvents;

                entity.ClearDomainEvents();

                return domainEvents;
            })
            .ToList();

        foreach (IDomainEvent domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }
    }
}
```

## Lưu trữ Outbox Messages - EF Core

Thay vì publish các domain events như một phần của EF transaction, bạn có thể chuyển đổi chúng thành các Outbox message.

Dưới đây là một `InsertOutboxMessagesInterceptor` thực hiện chính xác điều đó.

Interceptor này ghi đè phương thức `SavingChangesAsync`. Điều đó có nghĩa là nó sẽ chạy bên trong EF transaction hiện tại trước khi lưu thay đổi.

`InsertOutboxMessagesInterceptor` chuyển đổi bất kỳ domain event nào thành một `OutboxMessage ` và thêm nó vào `DbSet<OutboxMessage>` tương ứng. Điều này có nghĩa là chúng sẽ được lưu vào cơ sở dữ liệu với bất kỳ thay đổi hiện có nào bên trong cùng một giao dịch.

Đây là một hoạt động đồng thời.

Hoặc mọi thứ thành công hoặc mọi thứ thất bại.

Không có trạng thái trung gian như khi sử dụng `PublishDomainEventsInterceptor`.

Sau đó, bạn có thể tạo một background worker để xử lý các Outbox messages.

Và đây chính là cách bạn triển khai Outbox Pattern với EF Core.

```
using Newtonsoft.Json;

public sealed class InsertOutboxMessagesInterceptor : SaveChangesInterceptor
{
    private static readonly JsonSerializerSettings Serializer = new()
    {
        TypeNameHandling = TypeNameHandling.All
    };

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            InsertOutboxMessages(eventData.Context);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void InsertOutboxMessages(DbContext context)
    {
        context
            .ChangeTracker
            .Entries<Entity>()
            .Select(entry => entry.Entity)
            .SelectMany(entity =>
            {
                List<IDomainEvent> domainEvents = entity.DomainEvents;

                entity.ClearDomainEvents();

                return domainEvents;
            })
            .Select(domainEvent => new OutboxMessage
            {
                Id = domainEvent.Id,
                OccurredOnUtc = domainEvent.OccurredOnUtc,
                Type = domainEvent.GetType().Name,
                Content = JsonConvert.SerializeObject(domainEvent, Serializer)
            })
            .ToList();

        context.Set<OutboxMessage>().AddRange(outboxMessages);
    }
}
```

## Cấu hình EF Interceptors

Các EF Interceptors phải nhẹ (lightweight) và không trạng thái (stateless). Bạn có thể thêm chúng vào `DbContext` bằng cách gọi `AddInterceptors` và truyền vào các instance interceptor.

Tôi thích cấu hình các interceptor thông qua Dependency Injection (DI) vì hai lý do:

- Nó cũng cho phép tôi sử dụng DI bên trong các interceptor (hãy lưu ý rằng các interceptor sẽ được đăng ký dạng singleton).
- Nó giản lược việc thêm interceptor vào `DbContext` khi dùng `AddDbContext`.

Dưới đây là cách bạn có thể cấu hình `UpdateAuditableInterceptor` và `InsertOutboxMessagesInterceptor` với `ApplicationDbContext`:

```c#
services.AddSingleton<UpdateAuditableInterceptor>();
services.AddSingleton<InsertOutboxMessagesInterceptor>();

services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(
    (sp, options) => options
        .UseSqlServer(connectionString)
        .AddInterceptors(
            sp.GetRequiredService<UpdateAuditableInterceptor>(),
            sp.GetRequiredService<InsertOutboxMessagesInterceptor>()));
```

## Lời kết

Interceptors cho phép bạn thực hiện gần như bất kỳ điều gì với các thao tác trong EF Core.
Nhưng đi kèm với sức mạnh lớn là trách nhiệm lớn: bạn cần lưu ý rằng interceptors có thể ảnh hưởng đến hiệu suất. Các thao tác như gọi external services hoặc handling events sẽ làm chậm quá trình thực thi.

Hãy nhớ rằng, bạn không nhất thiết phải dùng EF interceptors. Bạn hoàn toàn có thể đạt được hành vi tương tự bằng cách ghi đè phương thức `SaveChangesAsync` trên `DbContext` và thêm logic tùy chỉnh của mình vào đó.
