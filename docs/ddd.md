---
id: ddd-doc
title: Domain-Driven Design
---

# Tìm hiểu về Domain-Driven Design

Tổng hợp từ Mehmet Ozkaya

## 1. Domain-Driven Design là gì?

Được giới thiệu lần đầu tiên vào năm 2003 bởi Eric Evans, trong cuốn sách: Domain-Driven Design - Tackling Complexity in the Heart of Software. Domain-Driven Design là một `software development approach` (cách tiếp cận phát triển phần mềm) cho phép các team quản lý cấu trúc và bảo tri phần mềm trong những lĩnh vực có độ phức tạp lớn.

Nó không phải là một Architecture Pattern hay một Design Pattern mà nó là cách tiếp cận trong phát triển phần mềm. DDD giải quyết các vấn đề phức tạp bằng cách chia nhỏ chúng thành các phần nhỏ hơn, tập trung vào từng vấn đề nhỏ và dễ xử lý hơn. Một Domain phức tạp có thể chứa nhiều Sub-Domain. Một số Sub-Domain có thể kết hợp với nhau để chia sẻ quy tắc và trách nhiệm chung.

### Domain (Lĩnh vực)

Là lĩnh vực nghiệp vụ mà ứng dụng của bạn đang giải quyết. Domain chính là phạm vi hoạt động của phần mềm. Nó đại diện cho `problem space`(không gian vấn đề) và các yêu cầu nghiệp vụ mà phần mềm cần giải quyết. Nó bao gồm tất cả quy tắc, dữ liệu, quy trình và logic liên quan đến lĩnh vực đó.

Để tạo ta một phần mềm tốt, bạn cần hiểu về phần mềm đó. Bạn không thể làm ra hệ thống phần mềm ngân hàng nếu trừ khi bạn có hiểu biết tương đối tốt về mảng ngân hàng và những điều liên quan. Nghĩa là, để làm phần mềm tốt, bạn cần hiểu về Domain (lĩnh vực) ngân hàng.

Liệu có thể làm được phần mềm ngân hàng phức tạp dù không có hiểu biết nghiệp vụ tốt? Không thể. Không bao giờ. Ai hiểu về banking? Người thiết kế phần mềm? Không. Đồng chí này chỉ tới ngân hàng để gửi tiền và rút tiền khi cần. Người phân tích phần mềm? Cũng không hẳn. Anh ta chỉ biết phân tích một chủ đề cụ thể khi anh ta có đầy đủ tất cả cấu phần. Lập trình viên? Quên chuyện đó đi. Vậy là ai? Nhân viên ngân hàng, hiển nhiên. Hiểu nhất về hệ thống ngân hàng là những người ở trong đó, những chuyên gia của họ. Họ hiểu mọi thứ chi tiết, cái hay-dở, mọi vấn đề có thể và mọi quy định. Đây là nơi chúng ta thường xuất phát: Domain (lĩnh vực).

Giả sử, bạn cần xây dựng một hệ thống phần mềm quản lý bệnh viện. Rõ ràng bạn cần làm việc với đội ngũ bác sĩ, y tá (chính là các chuyên gia trong lĩnh vực này - domain expert) để xây dựng kiến thức về Domain. Bạn và họ nói chuyện, trao đổi kiến thức, đặt câu hỏi và trả lời. Bạn cần hiểu rõ càng nhiều càng tốt về Domain này. Bằng cách đặt câu hỏi đúng, xử lý thông tin đúng cách, bạn và chuyên gia sẽ dần vẽ ra một Domain, một mô hình domain (Domain Model). Bạn là kỹ sư phần mềm, kết hợp với Domain Expert cùng tạo nên một Momain Model và mô hình đó là nơi kiến thức chuyên môn của cả hai bên được kết hợp và tổng hợp lại.

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

Mỗi Bounded Context có thể có cơ sở dữ liệu riêng. Nó còn được gọi là module, và thường được một nhóm riêng biệt làm việc trên nó.

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

## 2. Các cấp độ của Domain-Driven Design

Domain-Driven Design được chia thành chia thành 2 cấp độ chính:

- Strategic DDD (DDD chiến lược): Chỉ tập trung vào xách định cách tổ chức tổng thể. Nó bao gồm việc xác định các Bounded Context và cách chúng tương tác với nhau. Không cần triển khai chi tiết. Thành phần chính:

  - Bounded Context
  - Ubiquitous Language
  - Context Mapping Pattern
  - Amenity-Domain Model (chỉ chứa property của Domain Model)

- Tactical DDD (DDD chiến thuật): Tập trung vào triển khai chi tiết ở mức dộ module bên trong từng Bounded Context. Thành phần chính:

  - Domain Models (Entity, Value Object, Aggregate, Aggregate Root)
  - Domain Events
  - Rich-Domain Model (chứa property và behavior của Domain Model)

Domain-Driven Design triển khai ở cấp độ Chiến Lược (Strategic DDD) phù hợp cho hệ thống không có quy tắc nghiệp vụ phức tạp, chỉ cần lưu trữ và truy vấn dữ liệu và không cần triển khai chi tiết. Nhưng với hệ thống có nghiệp vụ phức tạp, cần đảm bảo tính toàn vẹn dữ liệu và bảo vệ quy tắc nghiệp vụ thì nên triển khai Domain-Driven Design ở cấp độ Chiến Thuật (Tatical DDD)

## 3. Kiến trúc của Domain-Driven Design

Ở đây mô hình DDD vẫn giữ lại những ưu điểm của `Layered Architecture` để đảm bảo nguyên tắc `Separation of Concerns`. Các phần logic xử lý khác nhau sẽ được cô lập ra khỏi các phần khác làm tăng tính `Loose Coupling` của ứng dụng và tính dễ đọc và dễ bảo trì cũng như ứng dụng khi có thay đổi logic của từng layer thì không ảnh hưởng đến các layer khác.

### Domain Layer

Bao gồm: Domain Models (Entities, Value Objects, Agreegate & Agreegate Root), Abstract Repositories, Abstract UnitOfWork, Domain Events.

Tầng này chứa thông tin về các Domain (lĩnh vực). Đây chính là trái tim của phần mềm. Trạng thái của đối tượng nghiệp vụ được giữ tại đây.

- Strategy DDD: Khi triển khai ở mức độ Strategy (Chiến lược), tầng này có thể không cần chứa Business Logic. Các Domain Model sẽ được triển khai bằng Anemic-Domain Model (chỉ chứa thuộc tính, không chứa behavior - hành vi của Domain Model). Tuy nhiên, với hệ thống có Business Logic phức tạp, cần đảm bảo tính toàn vẹn dữ liệu và bảo vệ Business Rule. Việc thiếu behavior có thể làm Domain Model không kiểm soát được nghiệp vụ (Dữ liệu có thể bị thay đổi mà không đảm bảo tính hợp lệ).

- Tactical DDD: Khi triển khai ở mức độ Tactical (Chiến thuật), tầng này sẽ chứa Business Logic ở mức `Core Business Rules` (quy tắc nghiệp vụ cốt lõi). Các Domain Model sẽ được triển khai bằng Rich-Domain Model (chứa cả thuộc tính và behavior - hành vi của Domain Model). Các `Core Business Rules` sẽ được triển khai trong các behavior của Domain Model.

### Application Layer

Bao gồm: Application Services (hoặc các Query & Command Handlers), DTOs (Data Transfer Object)

Reference: Domain Layer

Tầng này được thiết kế khá mỏng (ít xử lý logic) phối hợp các hoạt động của ứng dụng. Nó điều phối luồng xử lý nhưng không chứa Domain Logic.

- Strategy DDD: Khi triển khai ở mức độ Strategy (Chiến lược), Tầng này có thể chứa toàn bộ Business Logic. Tuy nhiên, khi Business Logic trở nên phức tạp hơn. Việc dồn toàn bộ Business Logic vào Application Service sẽ làm Application Layer quá tải, trở nên cồng kềnh và dễ bị lỗi, khó maintain về lâu dài.

- Tactical DDD: Khi triển khai ở mức độ Tactical (Chiến thuật), tầng này sẽ chứa Business Logic ở mức `Use Case` (luồng xử lý nghiệp vụ). Nó sẽ gọi xuống Domain Layer để thực hiện `Core Business Rules`.

### Infrastructure Layer

Bao gồm: Persistence(Implement Repositories), External Devices, Cross-cutting Concerns, IoC Container, Infrastructure Configuration

Reference: Domain Layer, Application Layer

- Infrastructure Layer chủ yếu phục vụ Domain Layer và Application Layer, giúp chúng kết nối với databases, các `External Devices` (Các dịch vụ bên ngoài) và các `Cross-cutting Concerns`(Các dịch vụ chung) mà phần lõi (Domain & Application Layer) của hệ thống không nên quan tâm.

- Configuration có thể tách ra cho toàn bộ Layer để dễ maintain. Cuối cùng, tất cả sẽ được tập hợp vào IoC Container để đăng ký.

### Presentation Layer

Có thể là: API (REST, GraphQL, gRPC) hoặc UI (Web, Mobile, Desktop)

Reference: Application Layer, Infrastructure Layer

- Là phần Consumer của hệ thống, có thể thay đổi liên tục không ảnh hưởng đến phần lõi của hệ thống (Domain & Application Layer). Có thể là UI để giao tiếp với với người dùng hoặc API để giao tiếp với hệ thống khác.

## 4. Triển khai Strategic và Tactical Domain-Driven Design

### Cấp độ Chiến lược (Strategic Domain-Driven Design)

- Strategic DDD giúp phân chia hệ thống lớn thành các Bounded Context khác nhau, mỗi context có model riêng, không bị chồng chéo. Giao tiếp với nhau thông qua Context Mapping.

- Ví dụ : Giả sử bạn đang xây dựng hệ thống E-Commerce, bạn có thể phân hệ thống thành:

  - Customer Context (Quản lý khách hàng)
  - Order Context (Quản lý đơn hàng)
  - Payment Context (Quản lý thanh toán)

### Cấp độ chiến thuật (Tactical Domain-Driven Design)

Sau khi đã chia hệ thống thành các Bounded Context, Tactical DDD giúp thiết kế chi tiết bên trong từng context. Bằng cách sử dụng các pattern như Entity, Value Object, Aggregate, Repository, Service, Domain Event.

Trong Order Context, có thể triển khai như sau:

- Entity: Order, OrderItem
- Value Object: Address, Money
- Aggregate Root: Order là root quản lý danh sách OrderItem

```
[Order] (Aggregate Root)
 ├── [OrderItem] (Entity)
 ├── [ShippingAddress] (Value Object)
 ├── [Money] (Value Object)
```

- Repository: OrderRepository để truy vấn dữ liệu
- Domain Event: OrderCreatedEvent để phát sự kiện khi đơn hàng được tạo

#### Entity (Thực thể)

- Là đối tượng có identity (định danh) duy nhất, không thay đổi theo thời gian, ngay cả khi dữ liệu bên trong thay đổi.
- Thay đổi trạng thái theo thời gian.
- Có vòng đời độc lập.

VD: Order là Entity vì mỗi đơn hàng có Id duy nhất, dữ liệu có thể thay đổi (thêm sản phẩm, cập nhật trạng thái...).

```
public class Order
{
    public Guid Id { get; private set; } // Identity (không đổi)
    public DateTime OrderDate { get; private set; }
    public List<OrderItem> Items { get; private set; }

    public Order(Guid id, DateTime orderDate)
    {
        Id = id;
        OrderDate = orderDate;
        Items = new List<OrderItem>();
    }
}
```

#### Value Object (Đối tượng giá trị)

- Là đối tượng không có identity (định danh), chỉ quan trọng về giá trị.
- Bất biến (Immutable): Không thay đổi sau khi tạo.
- So sánh bằng giá trị, không phải bằng tham chiếu.

VD: Money là Value Object vì nó chỉ quan trọng về giá trị (Amount và Currency), không cần ID.

```
public class Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public override bool Equals(object obj)
    {
        if (obj is Money money)
        {
            return Amount == money.Amount && Currency == money.Currency;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Amount, Currency);
    }
}
```

```
var price1 = new Money(100, "USD");
var price2 = new Money(100, "USD");

Console.WriteLine(price1 == price2); // True (Vì so sánh bằng giá trị)

```

#### Aggregate (Tập hợp)

- Là nhóm các thực thể và giá trị có liên quan chặt chẽ, cần được thao tác cùng nhau.
- Đảm bảo tính nhất quán (Consistency) trong toàn bộ Aggregate.
- Chỉ một Aggregate Root duy nhất được truy cập từ bên ngoài. Các thay đổi phải thông qua Aggregate Root, không trực tiếp thao tác với các entity con.

VD: Một Order có nhiều OrderItem, nhưng chỉ Order có thể thêm/sửa/xóa OrderItem.

```
public class Order
{
    public Guid Id { get; private set; }
    private List<OrderItem> _items = new List<OrderItem>();

    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public void AddItem(Product product, int quantity)
    {
        var item = new OrderItem(product.Id, product.Name, quantity);
        _items.Add(item);
    }
}
```

#### Aggregate Root

- Là thực thể chính trong Aggregate, đóng vai trò quản lý các thực thể con.
- Chịu trách nhiệm duy nhất trong Aggregate. Là thực thể duy nhất mà bên ngoài có thể thao tác.
- Tránh tham chiếu trực tiếp đến các entity con để đảm bảo tính nhất quán.

VD: Order là Aggregate Root, vì OrderItem không thể bị thay đổi từ bên ngoài. Mọi thay đổi của OrderItem phải thông qua Order.

```
Order order = new Order();
order.AddItem(product, 2); // Đúng
order.Items[0].Quantity = 5; // Sai! Không thể sửa trực tiếp
```
