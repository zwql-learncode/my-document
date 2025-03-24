---
id: ddd-doc
title: Domain-Driven Design
---

# Domain-Driven Design Document

Tổng hợp từ Mehmet Ozkaya, [Viblo Asia](https://viblo.asia/p/domain-driven-design-phan-1-mrDGMOExkzL)

## 1. Domain-Driven Design là gì?

Được giới thiệu lần đầu tiên vào năm 2003 bởi Eric Evans, trong cuốn sách: Domain-Driven Design - Tackling Complexity in the Heart of Software. Domain-Driven Design (DDD) là một `software development approach` (cách tiếp cận phát triển phần mềm) tập trung vào mô hình hóa nghiệp vụ (Domain Model) dựa trên hiểu biết chuyên sâu về lĩnh vực đó.

Nó không phải là một Architecture Pattern hay một Design Pattern mà nó là cách tiếp cận trong phát triển phần mềm. DDD giúp quản lý sự phức tạp bằng cách xác định ranh giới rõ ràng giữa các phần của hệ thống, sử dụng mô hình domain để phản ánh thực tế nghiệp vụ một cách trực quan và dễ hiểu. Một Domain phức tạp có thể chứa nhiều Sub-Domain. Một số Sub-Domain có thể kết hợp với nhau để chia sẻ quy tắc và trách nhiệm chung.

### Domain (Lĩnh vực)

Là lĩnh vực nghiệp vụ mà ứng dụng của bạn đang giải quyết. Domain chính là phạm vi hoạt động của phần mềm. Nó đại diện cho `problem space`(không gian vấn đề) và các yêu cầu nghiệp vụ mà phần mềm cần giải quyết. Nó bao gồm tất cả quy tắc, dữ liệu, quy trình và logic liên quan đến lĩnh vực đó.

Để tạo ta một phần mềm tốt, bạn cần hiểu về phần mềm đó. Bạn không thể làm ra hệ thống phần mềm ngân hàng nếu trừ khi bạn có hiểu biết tương đối tốt về mảng ngân hàng và những điều liên quan. Nghĩa là, để làm phần mềm tốt, bạn cần hiểu về Domain (lĩnh vực) ngân hàng.

Liệu có thể làm được phần mềm ngân hàng phức tạp dù không có hiểu biết nghiệp vụ tốt? Không thể. Không bao giờ. Ai hiểu về banking? Người thiết kế phần mềm? Không. Đồng chí này chỉ tới ngân hàng để gửi tiền và rút tiền khi cần. Người phân tích phần mềm? Cũng không hẳn. Anh ta chỉ biết phân tích một chủ đề cụ thể khi anh ta có đầy đủ tất cả cấu phần. Lập trình viên? Quên chuyện đó đi. Vậy là ai? Nhân viên ngân hàng, hiển nhiên. Hiểu nhất về hệ thống ngân hàng là những người ở trong đó, những chuyên gia của họ. Họ hiểu mọi thứ chi tiết, cái hay-dở, mọi vấn đề có thể và mọi quy định. Đây là nơi chúng ta thường xuất phát: Domain (lĩnh vực).

Giả sử, bạn cần xây dựng một hệ thống phần mềm quản lý bệnh viện. Rõ ràng bạn cần làm việc với đội ngũ bác sĩ, y tá (chính là các chuyên gia trong lĩnh vực này - domain expert) để xây dựng kiến thức về Domain. Bạn và họ nói chuyện, trao đổi kiến thức, đặt câu hỏi và trả lời. Bạn cần hiểu rõ càng nhiều càng tốt về Domain này. Bằng cách đặt câu hỏi đúng, xử lý thông tin đúng cách, bạn và chuyên gia sẽ dần vẽ ra một Domain, một mô hình domain (Domain Model). Bạn là kỹ sư phần mềm, kết hợp với Domain Expert cùng tạo nên một Domain Model và mô hình đó là nơi kiến thức chuyên môn của cả hai bên được kết hợp và tổng hợp lại.

Giả sử bạn đang tham gia thiết kế một tòa nhà. Yêu cầu là:

- Xây dựng trên một diện tích đất cố định
- Tòa nhà cao 6 tầng
- Mỗi tầng có 4 căn hộ

Vậy Domain ở đây là gì? Là công trình xây dựng chăng? Cũng có thể. Nhưng nếu bạn xem công trình xây dựng là Domain của bạn, thì có thể bạn đang bỏ qua một vài chi tiết trong yêu cầu. Công trình xây dựng bạn đang thiết kế phải bao gồm thiết kế căn hộ cho người dân sinh sống. Vậy thuật ngữ "công trình xây dựng" có thể khiến chúng ta bỏ lỡ chi tiết, thay vì đó ta có thể thu hẹp xuống thành "chung cư". Lúc này nếu bạn nói với các kỹ sư về việc thiết kế, rõ ràng thuật ngữ "chung cư" sẽ dễ hiểu hơn là "công trình xây dựng" đơn thuần. Bạn thấy đấy, chỉ một thay đổi nhỏ trong ngôn từ cũng có thể tạo nên sự khác biệt.

### Ubiquitous Language (Ngôn ngữ chung)

Trở lại ví dụ phần mềm bệnh viện ở trên, bạn và các bác sĩ, y tá không thể nói cùng một ngôn ngữ được. Họ nói về từ ngữ chuyên môn, bạn nói bằng đối tượng, phương thức, quan hệ. Đó chính là lúc chúng ta cần một `Ubiquitous Language` (ngôn ngữ chung) để cả hai bên có thể làm việc với nhau dễ dàng hơn.

Khái niệm rất đơn giản, bạn và domain expert phải cùng nói một ngôn ngữ chung để cùng hiểu đúng một vấn đề. Ví dụ:

- Sai: Tỉ lệ chiều dài, chiều rộng của một phòng ngủ cỡ nhỏ là 4:3.
- Đúng: Chiều dài phòng ngủ trẻ em là 6m, chiều rộng là 4.5m.

Rõ ràng những từ như phòng ngủ cỡ nhỏ, tỉ lệ thiên hướng kỹ thuật. Phòng ngủ trẻ em sẽ dễ hiểu hơn, và một số đo cụ thể rõ ràng có ý nghĩa và dễ hình dung hơn.

### Bounded Context (Ngữ cảnh giới hạn)

Là tập hợp các phạm vi liên quan chặt chẽ được nhóm lại với nhau, tạo thành ranh giới logic trong hệ thống. Các ranh giới logic này chia nhỏ một Domain phức tạp thành các phần nhỏ hơn, mỗi phần có tính độc lập và nhất quán tối đa với nhau. Giúp quản lý sự phức tạp bằng cách chia domain thành các phần có thể kiểm soát được.

Mỗi Bounded Context có thể có database riêng và định nghĩa rõ ràng về các business rule. Một nhóm phát triển có thể chịu trách nhiệm cho một Bounded Context.

### Context Mapping Pattern (Mô hình ánh xạ ngữ cảnh)

Là quá trình xác định toàn bộ các Bounded Context trong ứng dụng cùng với ranh giới logic của chúng. Đây là cách để định nghĩa ranh giới logic giữa các domain, giúp hiểu rõ cách các Bounded Context tương tác với nhau.

Ví dụ: Giả sử trong hệ thống E-Commerce có nhiều Bounded Context như:

- Quản lý đơn hàng (Order Management)
- Quản lý kho hàng (Inventory Management)
- Quản lý khách hàng (Customer Management)

Mỗi cái này là một ngữ cảnh riêng biệt, có logic, quy tắc và dữ liệu của riêng nó. Nhưng trong thực tế, chúng cần giao tiếp với nhau.

- Khi đơn hàng được tạo trong Quản lý đơn hàng, hệ thống Quản lý kho cần cập nhật số lượng hàng tồn kho.
- Khi khách hàng mua hàng, Quản lý khách hàng cần lưu lại thông tin đơn hàng của họ.

Context Mapping Pattern giúp vẽ ra những ranh giới đó, thể hiện:

- Bounded Context nào trong hệ thống.
- Bounded Context nào cần giao tiếp với nhau.
- Cách thức giao tiếp giữa chúng (qua API, event message, database...).

Nó giúp hiểu rõ hệ thống, tránh chồng chéo dữ liệu, giúp thiết kế hợp tác giữa các context tốt hơn.

### Domain Models

Là các mô hình thể hiện Business Logic của ứng dụng theo cách gần gũi nhất với thực tế của Domain (lĩnh vực). Nó bao gồm 4 loại thành phần chính:

1. Entities (Thực thể): Là các đối tượng có Identity (danh tính) riêng biệt, bất kể thuộc tính của nó có thay đổi theo thời gian.
2. Value Objects (Đối tượng Giá trị): không có Identity (danh tính) và chỉ mang một tập hợp các giá trị, thường dùng để biểu diễn các đặc điểm của một Entity.
3. Aggregates (Tập hợp): Aggregate là một nhóm các Entity và Value Object liên kết chặt chẽ với nhau, được quản lý như một đơn vị. Aggregate giúp đảm bảo dữ liệu bên trong nó luôn nhất quán.
4. Aggregate Root: Là Entity chính trong một Aggregate, chịu trách nhiệm duy trì tính nhất quán của toàn bộ Aggregate. Các thao tác với Aggregate phải thông qua Aggregate Root.

### Domain Events

Domain Events đại diện cho một sự kiện đã xảy ra trong quá khứ. Domain Events thường được đặt tên ở thì quá khứ (ví dụ: OrderPlaced, ProductAddedToCart).

Các phần khác trong cùng một Service Boundary (ranh giới dịch vụ) cũng như cùng một domain cần phản ứng với những thay đổi này.

Domain Events là một business event (sự kiện nghiệp vụ) xảy ra trong domain model. Nó thường thể hiện một side-effect (tác dụng phụ) hoặc là kết quả của một domain operation (thao tác trong domain).

Đây là một kỹ thuật được sử dụng để đảm bảo tính nhất quán giữa các aggregates trong cùng một domain.

- Ví dụ: Khi một đơn hàng được đặt, một event OrderPlaced có thể được kích hoạt.

Những event này rất quan trọng trong việc ghi nhận ý định và kết quả của các hành động trong domain, đồng thời có thể được sử dụng để kích hoạt các side-effects (tác dụng phụ).

Side-effects có thể được handling (xử lý) trong cùng một transaction (synchronously) hoặc bên ngoài transaction (asynchronously). Một số side-effects có thể chỉ cần gửi thông báo (Notification Event), trong khi một số khác có thể cần cập nhật trạng thái.

Domain Events được sử dụng để đóng gói event details và gửi chúng đến các interested parties (thành phần quan tâm). Chúng thường được sử dụng để thông báo (communicate) các thay đổi trong domain đến các external handlers (bộ xử lý bên ngoài), những handlers này có thể thực hiện các hành động dựa trên các event được published.

## 2. Các cấp độ của Domain-Driven Design

Domain-Driven Design được chia thành 2 cấp độ chính:

- Strategic DDD (DDD chiến lược): Tập trung vào tổ chức tổng thể của hệ thống, xác định cách phân chia domain thành các Bounded Contexts và thiết lập cách chúng tương tác với nhau. Mục tiêu của nó là giúp hệ thống có cấu trúc rõ ràng, dễ mở rộng và duy trì.

  - Bounded Context (Ngữ cảnh ràng buộc)
  - Ubiquitous Language (Ngôn ngữ chung)
  - Context Mapping Pattern (Bản đồ quan hệ giữa các ngữ cảnh)

- Tactical DDD (DDD chiến thuật): Tactical DDD tập trung vào việc triển khai chi tiết bên trong mỗi Bounded Context, đảm bảo logic nghiệp vụ được kiểm soát chặt chẽ thông qua Domain Model.

  - Domain Models (Entity, Value Object, Aggregate, Aggregate Root)
  - Domain Events
  - Domain Services (chứa business logic không thể đặt vào Entity hoặc Value Object)
  - Repository Pattern
  - Rich-Domain Model (chứa property và behavior)

Domain-Driven Design ở cấp độ Chiến lược (Strategic DDD) giúp tổ chức và phân chia hệ thống thành các Bounded Contexts, định nghĩa ngôn ngữ chung (Ubiquitous Language) và thiết lập cách các phần của hệ thống tương tác với nhau. Mặc dù không tập trung vào chi tiết triển khai, nhưng nó là nền tảng quan trọng cho cả hệ thống đơn giản lẫn phức tạp.

Với những hệ thống có quy tắc nghiệp vụ phức tạp, cần đảm bảo tính toàn vẹn dữ liệu và bảo vệ business rules, việc kết hợp Strategic DDD với Tactical DDD là cần thiết. t. Tactical DDD giúp hiện thực hóa chi tiết Domain Model, đảm bảo rằng logic nghiệp vụ được kiểm soát chặt chẽ thông qua Entity, Value Object, Aggregate, Domain Services và Domain Events.

## 3. Kiến trúc của Domain-Driven Design

Ở đây mô hình DDD vẫn giữ lại những ưu điểm của `Layered Architecture` để đảm bảo nguyên tắc `Separation of Concerns`. Các phần logic xử lý khác nhau sẽ được cô lập ra khỏi các phần khác làm tăng tính `Loose Coupling` của ứng dụng và tính dễ đọc và dễ bảo trì cũng như ứng dụng khi có thay đổi logic của từng layer thì không ảnh hưởng đến các layer khác.

### Domain Layer

Bao gồm:

- Domain Models (Entities, Value Objects, Agreegate & Agreegate Root)
- Domain Abstractions (Repository, Unit Of Work,...)
- Domain Events
- Domain Services

Tầng này chứa thông tin về các Domain (lĩnh vực). Đây chính là trái tim của phần mềm. Trạng thái của đối tượng nghiệp vụ được giữ tại đây.

- Strategy DDD: Khi triển khai ở mức độ Strategy (Chiến lược), tầng này có thể không cần chứa Business Logic và các Domain Model có thể được triển khai bằng Anemic-Domain Model - chỉ chứa thuộc tính, không chứa behavior - hành vi của Domain Model.

  - Tuy nhiên, việc sử dụng Anemic Model thường bị xem là anti-pattern (phản mẫu). DDD khuyến khích sử dụng các Rich-Domain Model. Với hệ thống có Business Logic phức tạp, cần đảm bảo tính toàn vẹn dữ liệu và bảo vệ Business Rule. Việc thiếu behavior có thể làm Domain Model không kiểm soát được nghiệp vụ (Dữ liệu có thể bị thay đổi mà không đảm bảo tính hợp lệ).

  - Nhưng nếu hệ thống không quá phức tạp, việc sử dụng Anemic Model kết hợp với Application Layer có thể chấp nhận được.

- Tactical DDD: Khi triển khai ở mức độ Tactical (Chiến thuật), tầng này sẽ chứa Business Logic ở mức `Core Business Rules` (quy tắc nghiệp vụ cốt lõi). Các Domain Model sẽ được triển khai bằng Rich-Domain Model (chứa cả thuộc tính và behavior - hành vi của Domain Model). Các `Core Business Rules` sẽ được triển khai trong các behavior của Domain Model.

### Application Layer

[Reference: Domain Layer]

Bao gồm:

- Application Services
- Query & Command Handlers (với CQRS)
- Event Handlers
- DTOs & Mapping Extensions

Tầng này được thiết kế khá mỏng (ít xử lý logic) chủ yếu thực hiện orchestration (điều phối) ứng dụng. Nó không chứa domain logic, không chịu trách nhiệm thực thi business logic chi tiết.

- Strategy DDD: Khi triển khai ở mức độ Strategy (Chiến lược), Tầng này có thể chứa toàn bộ Business Logic.

  - Tuy nhiên, điều này dẫn đến giống kiến trúc Service Layer truyền thống hơn thay vì DDD thuần túy. Khi Business Logic trở nên phức tạp hơn. Việc dồn toàn bộ Business Logic vào Application Service sẽ làm Application Layer quá tải, trở nên cồng kềnh và dễ bị lỗi, khó maintain về lâu dài.

- Tactical DDD: Khi triển khai ở mức độ Tactical (Chiến thuật), tầng này sẽ chứa Business Logic ở mức `Use Case` (luồng xử lý nghiệp vụ). Nó sẽ gọi xuống Domain Layer để thực hiện `Core Business Rules`.

### Infrastructure Layer

[Reference: Domain Layer, Application Layer]

Bao gồm:

- Persistence (Data Access): Chứa Repository Implementation, ORM Mapping
- External Devices: Các dịch vụ bên ngoài như Payment Gateway, Email Service, Cloud Storage, ...
- Cross-cutting Concerns: Các dịch vụ chung như Logging, Exception Handling, Authentication & Authorization, ...
- Infrastructure Configuration: Cấu hình ORM (mapping Domain Model to EF Core Entities), kết nối cơ sở dữ liệu,...

Infrastructure Layer đảm nhiệm việc kết nối với database, tích hợp các `External Devices` (Các dịch vụ bên ngoài), xử lý các `Cross-cutting Concerns`(Các dịch vụ chung). Điều này giúp Domain Layer và Application Layer tập trung vào logic nghiệp vụ mà không cần quan tâm đến cách lưu trữ dữ liệu hoặc giao tiếp với hệ thống bên ngoài.

Các configuration trong Infrastructure Layer có thể được tách riêng để dễ bảo trì và cuối cùng được đăng ký vào IoC Container để quản lý dependencies.

### Presentation Layer

[Reference: Application Layer, Infrastructure Layer]

Có thể bao gồm:

- API (REST, GraphQL, gRPC) – Giao tiếp với hệ thống khác.
- UI (Web, Mobile, Desktop) – Giao tiếp với người dùng.

Là phần consumer của hệ thống, đảm nhiệm giao diện người dùng hoặc cung cấp API cho hệ thống bên ngoài. Có thể thay đổi linh hoạt mà không ảnh hưởng đến Domain & Application Layer. Chịu trách nhiệm xử lý UI logic, xác thực request (nếu cần), và chuyển đổi dữ liệu trước khi gửi đến Application Layer.

## 4. Triển khai Strategic và Tactical Domain-Driven Design

### Cấp độ Chiến lược (Strategic Domain-Driven Design)

- Strategic DDD giúp phân chia hệ thống lớn thành các Bounded Context khác nhau, mỗi context có model riêng, không bị chồng chéo. Giao tiếp với nhau thông qua Context Mapping.

- Ví dụ : Giả sử bạn đang xây dựng hệ thống E-Commerce, bạn có thể phân hệ thống thành:

  - Customer Context (Quản lý khách hàng)
  - Order Context (Quản lý đơn hàng)
  - Payment Context (Quản lý thanh toán)

### Cấp độ chiến thuật (Tactical Domain-Driven Design)

Sau khi đã chia hệ thống thành các Bounded Context, Tactical DDD giúp thiết kế chi tiết bên trong từng context. Bằng cách sử dụng các pattern như Entity, Value Object, Aggregate, Repository, Service, Domain Event.

Sau khi chia hệ thống thành các Bounded Context, Tactical DDD giúp thiết kế chi tiết bên trong từng context. Trong Ordering Context, ta có thể triển khai như sau:

- Aggregate Root: Order
- Entity: OrderItem
- Value Object: Address, OrderStatus
- Domain Event: OrderCreatedEvent, OrderUpdatedEvent

#### Domain Abstracts

Ta có Domain Abstracts như sau:

```
public abstract class Entity<T> : IEntity<T>
{
    public T Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}
```

```
public interface IAggregate<T> : IAggregate, IEntity<T>
{
}

public interface IAggregate : IEntity
{
    IReadOnlyList<IDomainEvent> DomainEvents { get; }
    IDomainEvent[] ClearDomainEvents();
}
```

```
using MediatR;

public interface IDomainEvent : INotification
{
    Guid EventId => Guid.NewGuid();
    public DateTime OccurredOn => DateTime.Now;
    public string EventType => GetType().AssemblyQualifiedName;
}
```

#### Aggregate (Tập hợp)

- Là nhóm các thực thể và giá trị có liên quan chặt chẽ, cần được thao tác cùng nhau.
- Đảm bảo tính nhất quán (Consistency) trong toàn bộ Aggregate.
- Chỉ một Aggregate Root duy nhất được truy cập từ bên ngoài. Các thay đổi phải thông qua Aggregate Root, không trực tiếp thao tác với các entity con.

VD: Một Order có nhiều OrderItem, nhưng chỉ Order có thể thêm/sửa/xóa OrderItem.

```
[Order] (Aggregate Root)
 ├── [OrderItem] (Entity)
 ├── [OrderName] (Value Object)
 ├── [Address] (Value Object)
 ├── [Payment] (Value Object)
 ├── [OrderStatus] (Value Object)
```

#### Aggregate Root

- Là thực thể chính trong Aggregate, đóng vai trò quản lý các thực thể con.
- Chịu trách nhiệm duy nhất trong Aggregate. Là thực thể duy nhất mà bên ngoài có thể thao tác.
- Tránh tham chiếu trực tiếp đến các entity con để đảm bảo tính nhất quán.

VD: Order là Aggregate Root, vì OrderItem không thể bị thay đổi từ bên ngoài. Mọi thay đổi của OrderItem phải thông qua Order.

```
public class Order : Aggregate<Guid>
{
    private readonly List<OrderItem> _orderItems = new();
    public IReadOnlyList<OrderItem> OrderItems => _orderItems.AsReadOnly();

    public Guid CustomerId { get; private set; } = default!;
    public OrderName OrderName { get; private set; } = default!;
    public Address ShippingAddress { get; private set; } = default!;
    public Address BillingAddress { get; private set; } = default!;
    public Payment Payment { get; private set; } = default!;
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    public decimal TotalPrice
    {
        get => OrderItems.Sum(x => x.Price * x.Quantity);
        private set { }
    }

    public static Order Create(Guid id, Guid customerId, OrderName orderName, Address shippingAddress, Address billingAddress, Payment payment)
    {
        var order = new Order
        {
            Id = id,
            CustomerId = customerId,
            OrderName = orderName,
            ShippingAddress = shippingAddress,
            BillingAddress = billingAddress,
            Payment = payment,
            Status = OrderStatus.Pending
        };

        order.AddDomainEvent(new OrderCreatedEvent(order));

        return order;
    }

    public void Update(OrderName orderName, Address shippingAddress, Address billingAddress, Payment payment, OrderStatus status)
    {
        OrderName = orderName;
        ShippingAddress = shippingAddress;
        BillingAddress = billingAddress;
        Payment = payment;
        Status = status;

        AddDomainEvent(new OrderUpdatedEvent(this));
    }

    public void Add(Guid productId, int quantity, decimal price)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(price);

        var orderItem = new OrderItem(Id, productId, quantity, price);
        _orderItems.Add(orderItem);
    }

    public void Remove(Guid productId)
    {
        var orderItem = _orderItems.FirstOrDefault(x => x.ProductId == productId);
        if (orderItem is not null)
        {
            _orderItems.Remove(orderItem);
        }
    }
}
```

#### Entity (Thực thể)

- Là đối tượng có identity (định danh) duy nhất, không thay đổi theo thời gian, ngay cả khi dữ liệu bên trong thay đổi.
- Thay đổi trạng thái theo thời gian.
- Có vòng đời độc lập.

VD: OrderItem là Entity vì mỗi đơn hàng có Id duy nhất, dữ liệu có thể thay đổi (thêm sản phẩm, cập nhật trạng thái...).

```
public class OrderItem : Entity<OrderItemId>
{
    internal OrderItem(OrderId orderId, ProductId productId, int quantity, decimal price)
    {
        Id = OrderItemId.Of(Guid.NewGuid());
        OrderId = orderId;
        ProductId = productId;
        Quantity = quantity;
        Price = price;
    }

    public OrderId OrderId { get; private set; } = default!;
    public ProductId ProductId { get; private set; } = default!;
    public int Quantity { get; private set; } = default!;
    public decimal Price { get; private set; } = default!;
}
```

#### Value Object (Đối tượng giá trị)

- Là đối tượng không có identity (định danh), chỉ quan trọng về giá trị.
- Bất biến (Immutable): Không thay đổi sau khi tạo.
- So sánh bằng giá trị, không phải bằng tham chiếu.

VD: OrderName, Address, Payment, OrderStatus là Value Object vì nó chỉ quan trọng về giá trị , không cần ID.

```
public record Address
{
    public string FirstName { get; } = default!;
    public string LastName { get; } = default!;
    public string? EmailAddress { get; } = default!;
    public string AddressLine { get; } = default!;
    public string Country { get; } = default!;
    public string State { get; } = default!;
    public string ZipCode { get; } = default!;
    protected Address()
    {
    }

    private Address(string firstName, string lastName, string emailAddress, string addressLine, string country, string state, string zipCode)
    {
        FirstName = firstName;
        LastName = lastName;
        EmailAddress = emailAddress;
        AddressLine = addressLine;
        Country = country;
        State = state;
        ZipCode = zipCode;
    }

    public static Address Of(string firstName, string lastName, string emailAddress, string addressLine, string country, string state, string zipCode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(emailAddress);
        ArgumentException.ThrowIfNullOrWhiteSpace(addressLine);

        return new Address(firstName, lastName, emailAddress, addressLine, country, state, zipCode);
    }
}
```

```
public record OrderName
{
    public string Value { get; }
    private OrderName(string value) => Value = value;
    public static OrderName Of(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        return new OrderName(value);
    }
}
```

```
public record Payment
{
    public string? CardName { get; } = default!;
    public string CardNumber { get; } = default!;
    public string Expiration { get; } = default!;
    public string CVV { get; } = default!;
    public int PaymentMethod { get; } = default!;

    protected Payment()
    {
    }

    private Payment(string cardName, string cardNumber, string expiration, string cvv, int paymentMethod)
    {
        CardName = cardName;
        CardNumber = cardNumber;
        Expiration = expiration;
        CVV = cvv;
        PaymentMethod = paymentMethod;
    }

    public static Payment Of(string cardName, string cardNumber, string expiration, string cvv, int paymentMethod)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(cardName);
        ArgumentException.ThrowIfNullOrWhiteSpace(cardNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(cvv);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(cvv.Length, 3);

        return new Payment(cardName, cardNumber, expiration, cvv, paymentMethod);
    }
}
```

- Enum cũng được xem là một dạng của Value Object

```
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Canceled
}
```

#### Repositories

- Repository giúp tách biệt logic truy vấn và domain logic

```
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid orderId);
    Task AddAsync(Order order);
    Task UpdateAsync(Order order);
}
```

#### Domain Events

- Domain Events giúp decouple logic giữa các bounded context và hỗ trợ event-driven architecture.

```
public record OrderCreatedEvent(Order Order) : IDomainEvent;
```

```
public record OrderUpdatedEvent(Order Order) : IDomainEvent;
```
