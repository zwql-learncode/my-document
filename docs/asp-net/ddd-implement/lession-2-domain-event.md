---
id: lession-2-domain-event
title: Domain Events
---

# Value Objects

Nguồn: Bài viết "How To Use Domain Events To Build Loosely Coupled Systems" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/how-to-use-domain-events-to-build-loosely-coupled-systems)

Trong software engineering, `coupling` đề cập đến việc các phần khác nhau của một hệ thống phần mềm phụ thuộc lẫn nhau đến mức nào. Nếu chúng `tightly coupled` (khớp nối chặt chẽ), việc thay đổi một phần có thể ảnh hưởng đến nhiều phần khác. Ngược lại, nếu chúng `loosely coupled` (khớp nối lỏng lẻo), việc thay đổi một phần sẽ không gây ra nhiều vấn đề cho phần còn lại của hệ thống.

Domain events là một Domain-Driven Design tactical pattern mà ta có thể sử dụng để xây dựng hệ thống `loosely coupled`.

Bạn có thể kích hoạt một domain event từ domain, event này đại diện cho một fact. Các thành phần khác trong hệ thống có thể subscribe và handle event này tương ứng.

Nội dung bạn sẽ học trong bản tin tuần này:
Domain events là gì

- Sự khác nhau giữa domain events và integration events
- Cách triển khai và kích hoạt domain events
- Cách publish domain events với EF Core
- Cách handle domain events với MediatR

## Domain Events Là Gì?

Một event là điều gì đó đã xảy ra trong quá khứ.
Đó là một fact (sự thật).
Không thể thay đổi.

Domain event là một sự kiện xảy ra bên trong domain, và các phần khác của domain nên biết đến sự kiện này.

Domain events cho phép bạn thể hiện `side effects` (tác dụng phụ) một cách rõ ràng, và mang lại `separation of concerns` (tách biệt mối quan tâm) tốt hơn trong domain. Đây là cách lý tưởng để kích hoạt các side effect xuyên suốt nhiều aggregate bên trong domain.

Bạn có trách nhiệm đảm bảo rằng việc publish một domain event là transactional. Điều này nghe dễ nhưng làm thì không đơn giản.

## Domain Events Và Integration Events

Bạn có thể đã nghe về integration events và tự hỏi chúng khác gì với domain events.

Về mặt ngữ nghĩa, cả hai đều đại diện cho một điều gì đó đã xảy ra trong quá khứ.

Tuy nhiên, mục đích sử dụng thì khác nhau, và đây là điểm bạn cần hiểu rõ:

Domain events:

- Published và consumed trong một domain duy nhất
- Sử dụng in-memory message bus
- Tiến trình có thể đồng bộ hoặc bất đồng bộ

Integration events:

- Consumed bởi other subsystems (microservices, Bounded Contexts)
- Sử dụng message broker qua hàng đợi (queue)
- Tiến trình luôn bất đồng bộ

Nếu bạn đang tự hỏi nên publish loại event nào, hãy nghĩ đến mục đích và ai là người sẽ handle event đó.

Bạn cũng có thể sử dụng domain event để phát sinh integration event, tức là các event vượt ra khỏi ranh giới domain.

## Triển khai Domain Events

BCách tôi thường sử dụng để triển khai domain event là tạo abstraction `IDomainEvent` và implement `INotification` từ MediatR.

Lợi ích là bạn có thể tận dụng cơ chế publish-subscribe của MediatR để publish một notification đến một hoặc nhiều handler.

```c#
using MediatR;

public interface IDomainEvent : INotification
{
}
```

Giờ bạn có thể định nghĩa domain event cụ thể:

Một số ràng buộc cần lưu ý khi thiết kế domain event:

- Immutability – domain event là fact, nên phải bất biến
- Fat vs Thin event – bạn cần bao nhiêu thông tin trong event?
- Dùng thì quá khứ cho tên event

```c#
public class CourseCompletedDomainEvent : IDomainEvent
{
    public Guid CourseId { get; init; }
}
```

## Kích Hoạt Domain Events

Sau khi tạo domain events, bạn sẽ cần cách để kích hoạt chúng từ domain.

Cách tôi làm là tạo một base class Entity, vì chỉ entity mới được quyền kích hoạt domain event.
Bạn có thể đóng gói việc kích hoạt domain event bằng cách để phương thức `RaiseDomainEvent` là protected.

Chúng ta lưu domain events trong một internal collection để ngăn truy cập từ bên ngoài. Phương thức `GetDomainEvents` có tác dụng lấy snapshot của collection và phương thức `ClearDomainEvents` có tác dụng xóa internal collection.

```c#
public abstract class Entity : IEntity
{
    private readonly List<IDomainEvent> _domainEvents = new();

    public IReadOnlyList<IDomainEvent> GetDomainEvents()
    {
        return _domainEvents.ToList();
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    protected void RaiseDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
}
```

Giờ các entity của bạn có thể kế thừa từ Entity class và kích hoạt domain events:

```c#
public class Course : Entity
{
    public Guid Id { get; private set; }

    public CourseStatus Status { get; private set; }

    public DateTime? CompletedOnUtc { get; private set; }

    public void Complete()
    {
        Status = CourseStatus.Completed;
        CompletedOnUtc = DateTime.UtcNow;

        RaiseDomainEvent(new CourseCompletedDomainEvent { CourseId = this.Id });
    }
}
```

Và tất cả những gì còn lại phải làm là publish các domain event.

## Publish Domain Events - Với EF Core

Một cách hiệu quả để publish các domain event là sử dụng EF Core.

Vì EF Core đóng vai trò như một Unit of Work, bạn có thể dùng nó để thu thập tất cả domain events trong một transaction hiện tại và publish chúng.

Tôi thường override phương thức `SaveChangesAsync` để publish các domain event sau khi đã lưu vào database. Bạn cũng có thể dùng interceptor nếu muốn.

```c#
public class ApplicationDbContext : DbContext
{
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Khi nào nên publish domain events?
        //
        // 1. Trước khi gọi SaveChangesAsync:
        //    - domain events là một phần của cùng transaction
        //    - tính nhất quán ngay lập tức (immediate consistency)
        //
        // 2. Sau khi gọi SaveChangesAsync:
        //    - domain events ở một transaction khác
        //    - tính nhất quán cuối cùng (eventual consistency)
        //    - handler có thể fail

        var result = await base.SaveChangesAsync(cancellationToken);
        await PublishDomainEventsAsync();
        return result;
    }
}
```

Quyết định quan trọng nhất là khi nào bạn sẽ publish domain events.

Tôi nghĩ hợp lý nhất là publish sau khi gọi `SaveChangesAsync`. Tức là sau khi đã lưu các thay đổi vào database.

Điều này mang lại vài sự đánh đổi:

- `Eventual consistency` (Sự nhất quán cuối cùng) – vì event được xử lý sau khi transaction gốc hoàn tất
- `Database inconsistency risk` (Rủi ro không nhất quán dữ liệu) – nếu việc xử lý domain event thất bại

Tôi có thể chấp nhận `eventual consistency`, nên tôi chọn cách này.

Tuy nhiên, `database inconsistency risk` là vấn đề lớn.

Bạn có thể giải quyết bằng `Outbox pattern`, nơi bạn lưu thay đổi vào database và domain event (dưới dạng outbox message) trong cùng một transaction. Khi đó, bạn có được `atomic transaction` (tính toàn vẹn giao dịch), và domain event sẽ được xử lý bất đồng bộ qua background job.

Nếu bạn đang thắc mắc bên trong phương thức `PublishDomainEventsAsync` có gì:

```c#
private async Task PublishDomainEventsAsync()
{
    var domainEvents = ChangeTracker
        .Entries<Entity>()
        .Select(entry => entry.Entity)
        .SelectMany(entity =>
        {
            var domainEvents = entity.GetDomainEvents();
            entity.ClearDomainEvents();
            return domainEvents;
        })
        .ToList();

    foreach (var domainEvent in domainEvents)
    {
        await _publisher.Publish(domainEvent);
    }
}
```

## Handle Domain Events

Với tất cả phần “plumbing” ta đã tạo, giờ chúng ta sẵn sàng triển khai handler cho domain event.
May mắn thay, đây là phần đơn giản nhất.

Tất cả những gì bạn cần là tạo một implementing class `INotificationHandler<T>` và chỉ định loại domain event làm generic argument.

Đây là handler cho `CourseCompletedDomainEvent`, xử lý domain event và publish `CourseCompletedIntegrationEvent` để thông báo cho các hệ thống khác.

```c#
public class CourseCompletedDomainEventHandler
    : INotificationHandler<CourseCompletedDomainEvent>
{
    private readonly IBus _bus;

    public CourseCompletedDomainEventHandler(IBus bus)
    {
        _bus = bus;
    }

    public async Task Handle(
        CourseCompletedDomainEvent domainEvent,
        CancellationToken cancellationToken)
    {
        await _bus.Publish(
            new CourseCompletedIntegrationEvent(domainEvent.CourseId),
            cancellationToken);
    }
}
```

## Tổng kết

Domain events giúp bạn xây dựng hệ thống loosely coupled. Bạn có thể tách biệt rõ ràng `core domain logic` và `side effects`, những thứ có thể xử lý bất đồng bộ.

Không cần phải sáng tạo lại bánh xe, bạn hoàn toàn có thể dùng EF Core và MediatR để triển khai domain events.

Bạn cần quyết định thời điểm publish domain events. Việc publish trước hay sau khi lưu database đều có điểm mạnh và điểm yếu.

Tôi ưu tiên publish sau khi lưu database, và sử dụng `Outbox pattern` để đảm bảo tính transaction. Cách làm này dẫn đến `eventual consistency`, nhưng lại đáng tin cậy hơn.

Hy vọng bài viết hữu ích.

Hẹn gặp lại bạn vào tuần sau!
