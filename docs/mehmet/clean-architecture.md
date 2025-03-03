---
id: clean-architecture_mehmet
title: 7. Clean Architecture
---

# Clean architecture Document

Nguồn: Khóa học [Udemy .NET 8 Microservices](https://www.udemy.com/course/microservices-architecture-and-implementation-on-dotnet) của tác giả [Mehmet Ozkaya](https://www.linkedin.com/in/mehmet-ozkaya/?originalSubdomain=tr)

## 1. Domain-Driven Design

Domain-Driven Design(DDD) xuất hiện từ năm 2003 khi Eric Evans xuất bản cuốn sách về chủ đề này. Nó không phải là một công nghệ cải tiến hay một phương pháp cụ thể mà DDD giải quyết các vấn đề phức tạp bằng cách chia nhỏ chúng thành các phần nhỏ hơn, tập trung vào từng vấn đề nhỏ và dễ xử lý hơn. Một domain phức tạp có thể chứa nhiều sub-domain. Một số sub-domain có thể kết hợp với nhau để chia sẻ quy tắc và trách nhiệm chung.

Các khái niệm chính trong Domain-Driven Design:

### Domain

- Là lĩnh vực nghiệp vụ mà ứng dụng của bạn đang giải quyết. Domain chính là phạm vi hoạt động của phần mềm.
- Nó đại diện cho `problem space`(không gian vấn đề) và các yêu cầu nghiệp vụ mà phần mềm cần giải quyết. Nó bao gồm tất cả quy tắc, dữ liệu, quy trình và logic liên quan đến lĩnh vực đó.
- Ví dụ: Domain E-Commerce có thể bao gồm đặt hàng, quản lý kho, hỗ trợ khách hàng, v.v.

### Sub-Domain

- Là một phần của domain, đại diện cho một khu vực nghiệp vụ cụ thể bên trong domain tổng thể.
- Mỗi sub-domain có logic và quy tắc riêng.

### Ubiquitous Language (Ngôn ngữ chung)

- Là ngôn ngữ chung được sử dụng bởi cả lập trình viên và chuyên gia nghiệp vụ (BA) nhằm đảm bảo sự rõ ràng và nhất quán.
- Quan trọng là ngôn ngữ này phải được sử dụng cả trong thảo luận lẫn trong codebase.
- Điều này giúp tránh hiểu sai và đảm bảo tất cả các bên đều có sự thống nhất về các khái niệm trong domain.

### Bounded Context (Ngữ cảnh giới hạn)

- Là tập hợp các phạm vi liên quan chặt chẽ được nhóm lại với nhau, tạo thành ranh giới logic trong hệ thống.
- Các ranh giới logic này chia nhỏ một domain phức tạp thành các phần nhỏ hơn, mỗi phần có tính độc lập và nhất quán tối đa với nhau. Đây là một mô hình quan trọng trong DDD, giúp quản lý sự phức tạp bằng cách chia domain thành các phần có thể kiểm soát được.
- Mỗi Bounded Context có thể có cơ sở dữ liệu riêng. Nó còn được gọi là module, và thường được một nhóm riêng biệt làm việc trên nó.

### Context Mapping Pattern (Mô hình ánh xạ ngữ cảnh)

Là quá trình xác định toàn bộ các Bounded Context trong ứng dụng cùng với ranh giới logic của chúng. Đây là cách để định nghĩa ranh giới logic giữa các domain, giúp hiểu rõ cách các Bounded Context tương tác với nhau.

Ví dụ: Giả sử hệ thống có nhiều Bounded Context như:

- Quản lý đơn hàng (Order Management)
- Quản lý kho hàng (Inventory Management)
- Quản lý khách hàng (Customer Management)

Mỗi cái này là một ngữ cảnh riêng biệt, có logic, quy tắc và dữ liệu của riêng nó. Nhưng trong thực tế, chúng cần giao tiếp với nhau.

- Khi đơn hàng được tạo trong Quản lý đơn hàng, hệ thống Quản lý kho cần cập nhật số lượng hàng tồn kho.
- Khi khách hàng mua hàng, Quản lý khách hàng cần lưu lại thông tin đơn hàng của họ.

Context Mapping Pattern giúp vẽ ra những ranh giới đó, thể hiện:

- Bounded Context nào trong hệ thống.
- Bounded Context nào cần giao tiếp với nhau.
- Cách thức giao tiếp giữa chúng (qua API, tin nhắn sự kiện, database...).

Nó giúp hiểu rõ hệ thống, tránh chồng chéo dữ liệu, giúp thiết kế hợp tác giữa các context tốt hơn.

## 2. Clean Architecture

### 2.1. Clean Architecture là gì?

Được giới thiệu bởi Robert C. Martin (Uncle Bob), đây là một architectural pattern nhằm `Separation of Concerns` (tách biệt các mối quan tâm) và tạo ra các hệ thống độc lập với framework, UI và Database.

Cách tiếp cận này giúp hệ thống trở nên mô-đun hóa (modular), dễ bảo trì (maintainable), linh hoạt (flexible) và dễ thích ứng (adaptable) với thay đổi:

- Mô-đun hóa (Modular): Thay đổi trong một mô-đun hoặc dịch vụ không ảnh hưởng nhiều đến các phần khác.
- Thích ứng (Adaptable): Dễ dàng cập nhật hoặc thay thế công nghệ, cơ sở dữ liệu.
- Kiểm thử dễ dàng (Testable): Có thể kiểm tra logic cốt lõi một cách độc lập.
- Dễ bảo trì (Maintainable): Sự tách biệt rõ ràng giữa các phần giúp hệ thống dễ hiểu và bảo trì hơn.

### 2.2. Nguyên tắc chính của Clean Architecture

- Không phụ thuộc vào framework: Hệ thống không bị ràng buộc vào một framework cụ thể, giúp dễ dàng thay đổi công cụ và công nghệ.
- Dễ kiểm thử (Testable): Quy tắc nghiệp vụ có thể kiểm tra mà không phụ thuộc vào UI, cơ sở dữ liệu, web server hay các thành phần bên ngoài.
- Không phụ thuộc vào UI (UI Agnostic): Giao diện người dùng có thể thay đổi mà không ảnh hưởng đến phần còn lại của hệ thống.
- Không phụ thuộc vào cơ sở dữ liệu (Database Agnostic): Quy tắc nghiệp vụ không bị ràng buộc với cơ sở dữ liệu, giúp hệ thống không phụ thuộc vào một nền tảng lưu trữ dữ liệu cụ thể.
- Không phụ thuộc vào hệ thống bên ngoài (External System Agnostic): Quy tắc nghiệp vụ hoàn toàn độc lập với thế giới bên ngoài, giúp hệ thống không bị ảnh hưởng bởi sự thay đổi của các external devices (dịch vụ bên ngoài).

### 2.3. Các layer của Clean Architecture

![Ảnh: Kiến trúc của Clean Architecture](/img/mehmet/clean-architecture.jpg)

> _Kiến trúc của CLean Architecture_

#### Entities Layer (hay Domain Layer)

- Đại diện cho các đối tượng nghiệp vụ (business object) của ứng dụng.
- Đây là phần lõi của hệ thống, chứa các quy tắc nghiệp vụ tổng quát và cấp cao nhất.
- Các thực thể (Entities) trong tầng này bao gồm các `enterprise-wide business rules`(quy tắc nghiệp vụ có phạm vi toàn bộ doanh nghiệp).

#### Use Cases Layer (hay Application Layer)

- Chứa các quy tắc nghiệp vụ cụ thể của ứng dụng.
- Định nghĩa và triển khai các trường hợp sử dụng (Use Cases) của hệ thống.
- Tầng này giúp điều phối luồng dữ liệu giữa Domain Layer và các tầng bên ngoài.

#### Interface Adapter Layer (hay Infrastructure Layer)

- Chuyển đổi dữ liệu từ định dạng phù hợp với Application Layer (Use Cases & Entities) sang định dạng phù hợp với hệ thống bên ngoài (UI, Database, API,...).
- Giúp kết nối giữa ứng dụng và các dịch vụ bên ngoài.

#### Framework & Drivers Layer (hay Presentaion Layer)

- Là tầng ngoài cùng, bao gồm các công nghệ, framework, cơ sở dữ liệu, giao diện người dùng (UI), và các hệ thống bên ngoài.
- Tầng này cung cấp môi trường để hệ thống giao tiếp với database, frameworks, UI và các hệ thống bên ngoài mà không ảnh hưởng đến quy tắc nghiệp vụ.

## 3. Kết hợp giữa Clean Architecture và Domain-Driven Design

Kết hợp Clean Architecture với Domain-Driven Design giúp phần mềm dễ mở rộng, dễ bảo trì, tách biệt rõ logic nghiệp vụ với các yếu tố kỹ thuật, đồng thời đảm bảo mã nguồn có tổ chức tốt, dễ hiểu và sát với thực tế doanh nghiệp.

- Clean Architecture giúp tổ chức code để đảm bảo kiến trúc rõ ràng, Domain-Driven Design giúp mô hình hóa nghiệp vụ sao cho dễ hiểu và mở rộng.
- Domain Layer(hay Entities Layer) trong Clean Architecture chính là nơi áp dụng Domain-Driven Design đảm bảo domain logic độc lập với các công nghệ bên ngoài.

Khi kết hợp Clean Architecture với Domain-Driven Design, kết trúc sẽ chia thành 2 tầng chính bao gồm: Core Layers (Tầng cốt lõi) và Periphery Layers (Tầng ngoại vi).

![Ảnh: Kết hợp giữa Clean Architecture và Domain-Driven Design](/img/mehmet/clean-architecture-ddd.png)

> _Kết hợp giữa Clean Architecture và Domain-Driven Design_

### Tầng cốt lõi (Core Layers):

Bao gồm Domain Layer và Application Layer:

1. Domain Layer

- Chứa logic nghiệp vụ cốt lõi, các entity, giá trị, quy tắc nghiệp vụ chính.
- Định nghĩa các abstract (Interfaces hoặc Abstract Classes) nhưng không chứa bất kỳ detail nào (là các Implementation Class hay còn gọi là Consumer Class).
- Không phụ thuộc vào bất kỳ tầng nào bên ngoài.

2. Application Layer

- Chứa logic ứng dụng, triển khai các use case.
- Định nghĩa các abstract cho Infrastructure Layer & Presentation Layer, nhưng không tự Implement chúng.
- Các use case chỉ làm việc với các abstraction mà không quan tâm đến detail của các outer layer (Infrastructure Layer & Presentation Layer).

### Tầng ngoại vi (Periphery Layers):

Bao gồm Infrastructure Layer và Presentation Layer:

1. Infrastructure Layer

- Là thành phần detail cho các abstraction của Core Layer. Chỉ triển khai các interfaces hoặc abstract classes, không chứa business logic.
- Chứa các thành phần như:
  - Data Access (Repository, EF Core DbContext, Migrations, Seeding Data),
  - External Services: Kết nối với hệ thống bên ngoài như Message Queue, Email Service, Logging, Authentication Providers.
  - Các Adapter: Giúp giao tiếp với hệ thống bên ngoài như API Clients, External Storage, Notification Services.

2. Presentation Layer

- Thường được gọi là API Layer hoặc UI Layer. Tầng này giao tiếp với người dùng (UI) hoặc các hệ thống khác (API).
- Gọi Application Layer để thực thi use case, sau đó trả kết quả về.
- Không chứa business logic, chỉ làm nhiệm vụ điều phối dữ liệu.

## 4. Strategic và Tactical Domain-Driven Design

Domain-Driven Design được chia thành chia thành 2 cấp độ chính:

- Strategic DDD (DDD chiến lược): Tập trung vào xách định cách tổ chức tổng thể và mô hình hóa business domain. Nó bao gồm việc xác định các domain, các sub-domain, và cách chúng tương tác với nhau.

- Tactical DDD (DDD chiến thuật): Tập trung vào triển khai chi tiết bên trong từng domain và cung cấp các mẫu thiết kế (design patterns). Sử dụng các pattern như Entity, Value Object, Aggregates, v.v.

### Mục đích sử dụng

| Đặc điểm         | Strategic Domain-Driven Design                                                  | Tactical Domain-Driven Design                                       |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Mục đích         | Xác định kiến trúc tổng thể, phân chia domain hợp lý.                           | Thiết kế chi tiết bên trong từng domain.                            |
| Thành phần chính | Bounded Context, Ubiquitous Language, Context Mapping.                          | Entity, Value Object, Aggregate, Repository, Service, Domain Event. |
| Phạm vi          | Ở mức độ toàn hệ thống (macro).                                                 | Ở mức độ từng module (micro).                                       |
| Vai trò          | Giúp chia nhỏ hệ thống thành các domain có ranh giới rõ ràng để tránh phức tạp. | Xác định cách triển khai code bên trong mỗi domain.                 |
| Tác động         | Ảnh hưởng đến cách team làm việc và cách các hệ thống giao tiếp với nhau.       | Ảnh hưởng đến codebase, kiến trúc phần mềm.                         |

Khi nào nên sử dụng Tactical Domain-Driven Design hay Strategic Domain-Driven Design:

- Strategic DDD phù hợp cho kiến trúc hệ thống lớn, cần xác định rõ ràng ranh giới giữa các domain.
- Tactical DDD phù hợp khi thiết kế chi tiết bên trong từng domain.

## 5. Triển khai Strategic và Tactical Domain-Driven Design

### 5.1. Strategic Domain-Driven Design

- Strategic DDD giúp phân chia hệ thống lớn thành các Bounded Context khác nhau, mỗi context có model riêng, không bị chồng chéo. Giao tiếp với nhau thông qua Context Mapping.

- Ví dụ : Giả sử bạn đang xây dựng hệ thống E-Commerce, bạn có thể phân hệ thống thành:

  - Customer Context (Quản lý khách hàng)
  - Order Context (Quản lý đơn hàng)
  - Payment Context (Quản lý thanh toán)

### 5.2. Tactical Domain-Driven Design

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

#### 3. Aggregate (Tập hợp)

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

#### 4. Aggregate Root

- Là thực thể chính trong Aggregate, đóng vai trò quản lý các thực thể con.
- Chịu trách nhiệm duy nhất trong Aggregate. Là thực thể duy nhất mà bên ngoài có thể thao tác.
- Tránh tham chiếu trực tiếp đến các entity con để đảm bảo tính nhất quán.

VD: Order là Aggregate Root, vì OrderItem không thể bị thay đổi từ bên ngoài. Mọi thay đổi của OrderItem phải thông qua Order.

```
Order order = new Order();
order.AddItem(product, 2); // Đúng
order.Items[0].Quantity = 5; // Sai! Không thể sửa trực tiếp
```
