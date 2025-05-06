---
id: lession-1-value-object
title: Value Objects
---

# Value Objects

Nguồn: Bài viết "Value Objects in .NET (DDD Fundamentals)" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/value-objects-in-dotnet-ddd-fundamentals)

Value Objects là một trong những building blocks (tạm dịch: khối xây dựng cốt lõi) của Domain-Driven Design (DDD). DDD là một phương pháp phát triển phần mềm nhằm giải quyết các vấn đề trong những nghiệp vụ phức tạp.

Value objects đóng gói một tập các `primitive values` (giá trị nguyên thủy) cùng với các `invariants` (ràng buộc bất biến) liên quan.

Ví dụ: money và date range.

- Một đối tượng `Money` gồm có value objects `Amount` và `Currency`.
- Một `DateRange` gồm ngày bắt đầu và ngày kết thúc.

Hôm nay, tôi sẽ trình bày một số best practices trong việc triển khai (implementation) value objects.

## Value Object là gì?

Hãy bắt đầu với định nghĩa từ cuốn sách Domain-Driven Design:

> Một object đại diện cho một khía cạnh mô tả của domain nhưng không có conceptual identity (danh tính khái niệm) được gọi là Value Object. Value Object được tạo ra để đại diện cho các yếu tố trong thiết kế mà chúng ta chỉ quan tâm đến what they are, not who or which they are.

_— Eric Evans_

Value objects khác với entities — chúng không có khái niệm về danh tính (identity). Chúng đóng gói các primitive types (kiểu dữ liệu nguyên thủy) trong domain và giải quyết `primitive obsession`(lạm dụng kiểu dữ liệu nguyên thủy).

Hai đặc điểm chính của Value Object:

- Chúng là immutable (bất biến)
- Chúng không có identity

Một đặc điểm khác là structural equality – hai value object được coi là bằng nhau nếu các giá trị bên trong chúng giống nhau. Đây là đặc điểm ít quan trọng hơn trong thực tế, nhưng có những trường hợp bạn chỉ muốn một số thuộc tính xác định sự bằng nhau.

## Triển khai Value Object

Đặc điểm quan trọng nhất của value object là tính bất biến (immutability). Các giá trị của một value object không thể bị thay đổi sau khi được tạo. Nếu muốn thay đổi một giá trị, bạn cần tạo ra một value object mới hoàn toàn.

Ví dụ: một thực thể `Booking` chứa các giá trị nguyên thủy để biểu diễn địa chỉ và khoảng thời gian:

```c#
public class Booking
{
    public string Street { get; init; }
    public string City { get; init; }
    public string State { get; init; }
    public string Country { get; init; }
    public string ZipCode { get; init; }

    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
}
```

Bạn có thể thay thế các giá trị nguyên thủy này bằng value object `Address` và `DateRange`:

```c#
public class Booking
{
    public Address Address { get; init; }
    public DateRange Period { get; init; }
}
```

Vậy làm sao để triển khai một value object?

## Sử dụng C# Records

Bạn có thể sử dụng record trong C# để biểu diễn value objects. Record mặc định là immutable và hỗ trợ structural equality — đây là hai đặc điểm mà ta cần.

Ví dụ, bạn có thể định nghĩa `Address` như sau:

```c#
public record Address(
    string Street,
    string City,
    string State,
    string Country,
    string ZipCode);
```

Tuy nhiên, bạn sẽ mất sự ngắn gọn khi cần định nghĩa private constructor. Trường hợp này xảy ra khi bạn muốn ràng buộc các invariant (các điều kiện bất biến) trong quá trình khởi tạo value object. Một vấn đề khác khi sử dụng record là việc có thể vượt qua các invariant của value object bằng cách dùng biểu thức `with`.

```c#
public record Address
{
    private Address(
        string street,
        string city,
        string state,
        string country,
        string zipCode)
    {
        Street = street;
        City = city;
        State = state;
        Country = country;
        ZipCode = zipCode;
    }

    public string Street { get; init; }
    public string City { get; init; }
    public string State { get; init; }
    public string Country { get; init; }
    public string ZipCode { get; init; }

    public static Result<Address> Create(
        string street,
        string city,
        string state,
        string country,
        string zipCode)
    {
        // Validate address
        return new Address(street, city, state, country, zipCode);
    }
}
```

## Base Class (Lớp cơ sở)

Một cách tiếp cận khác để triển khai value objects là sử dụng một base class `ValueObject`. Lớp cơ sở này xử lý so sánh cấu trúc (structural equality) thông qua abstract method `GetAtomicValues`. Các implementations từ `ValueObject` sẽ phải hiện thực phương thức này và xác định rõ các thành phần được dùng để so sánh bằng nhau.

Lợi thế của việc sử dụng lớp cơ sở `ValueObject` là tính rõ ràng (explicit) — bạn có thể dễ dàng nhận biết class nào trong domain của bạn là một value object. Một lợi ích khác là bạn có thể kiểm soát chính xác các thành phần tham gia vào việc so sánh bằng nhau.

Dưới đây là một ví dụ về lớp cơ sở `ValueObject` mà tôi thường sử dụng trong các dự án của mình:

```c#
public abstract class ValueObject : IEquatable<ValueObject>
{
    public static bool operator ==(ValueObject? a, ValueObject? b)
    {
        if (a is null && b is null)
        {
            return true;
        }

        if (a is null || b is null)
        {
            return false;
        }

        return a.Equals(b);
    }

    public static bool operator !=(ValueObject? a, ValueObject? b) =>
        !(a == b);

    public virtual bool Equals(ValueObject? other) =>
        other is not null && ValuesAreEqual(other);

    public override bool Equals(object? obj) =>
        obj is ValueObject valueObject && ValuesAreEqual(valueObject);

    public override int GetHashCode() =>
        GetAtomicValues().Aggregate(
            default(int),
            (hashcode, value) =>
                HashCode.Combine(hashcode, value.GetHashCode()));

    protected abstract IEnumerable<object> GetAtomicValues();

    private bool ValuesAreEqual(ValueObject valueObject) =>
        GetAtomicValues().SequenceEqual(valueObject.GetAtomicValues());
}
```

value object `Address` khi triển khai sẽ trông như thế này:

```c#
public sealed class Address : ValueObject
{
    public string Street { get; init; }
    public string City { get; init; }
    public string State { get; init; }
    public string Country { get; init; }
    public string ZipCode { get; init; }

    protected override IEnumerable<object> GetAtomicValues()
    {
        yield return Street;
        yield return City;
        yield return State;
        yield return Country;
        yield return ZipCode;
    }
}
```

## Khi nào nên dùng Value Objects?

Tôi sử dụng value object để giải quyết `primitive obsession` (lạm dụng kiểu dữ liệu nguyên thủy) và đóng gói các domain invariants (quy tắc nghiệp vụ bất biến). Việc đóng gói này rất quan trọng trong bất kỳ domain model nào. Bạn không nên để value object tồn tại ở trạng thái không hợp lệ.

Value object cũng giúp bạn đạt được `type safety` (tính an toàn về kiểu dữ liệu). Hãy xem method signature sau:

```c#
public interface IPricingService
{
    decimal Calculate(Apartment apartment, DateOnly start, DateOnly end);
}
```

Bây giờ, so sánh với phiên bản dưới đây, nơi chúng ta đã thêm value object. Bạn sẽ thấy interface `IPricingService` sử dụng value object rõ ràng và chặt chẽ hơn rất nhiều. Ngoài ra, bạn còn nhận được lợi ích của `type safety`. Khi biên dịch mã, value object sẽ giảm khả năng xuất hiện lỗi do truyền sai kiểu.

```c#
public interface IPricingService
{
    PricingDetails Calculate(Apartment apartment, DateRange period);
}
```

Dưới đây là một vài yếu tố bạn nên cân nhắc để quyết định có nên sử dụng value object hay không:

- Độ phức tạp của các invariants – Nếu cần áp đặt các quy tắc bất biến phức tạp, hãy cân nhắc sử dụng value object.
- Số lượng các primitive types – Nếu bạn cần đóng gói nhiều giá trị nguyên thủy lại với nhau, thì value object là hợp lý.
- Số lần lặp lại logic – Nếu bạn chỉ cần kiểm tra bất biến ở một vài chỗ trong mã, bạn có thể không cần thiết phải dùng value object.

## Lưu trữ Value Object - với EF Core

Value object là một phần của domain entity, vì vậy bạn cần lưu chúng vào cơ sở dữ liệu.

Dưới đây là cách sử dụng EF Core `Owned Types` và `Complex Types` để lưu trữ các value object.

### Owned Types

Owned Types có thể được cấu hình bằng cách gọi phương thức `OwnsOne` khi cấu hình entity. Điều này thông báo cho Entity Framework rằng nó nên lưu các value object trong cùng một bảng với entity. Các value object sẽ được ánh xạ thành những cột bổ sung trong bảng.

```c#
public void Configure(EntityTypeBuilder<Apartment> builder)
{
    builder.ToTable("apartments");

    builder.OwnsOne(property => property.Address);

    builder.OwnsOne(property => property.Price, priceBuilder =>
    {
        priceBuilder.Property(money => money.Currency)
            .HasConversion(
                currency => currency.Code,
                code => Currency.FromCode(code));
    });
}
```

Một vài lưu ý về Owned Types:

- Owned types có khóa ẩn (hidden key).
- Không hỗ trợ kiểu optional (nullable).
- Hỗ trợ collection thông qua `OwnsMany`.
- Có thể sử dụng table splitting để lưu riêng các owned type ở bảng khác nếu cần.

### Complex Types

Complex Types là một tính năng mới của EF Core trong .NET 8. Chúng không có khóa định danh và không được theo dõi bằng key. Complex types phải là một phần của entity.

Complex Types là cách phù hợp hơn để thể hiện value object trong EF Core.

Ví dụ cấu hình `Address` làm complex type:

```c#
public void Configure(EntityTypeBuilder<Apartment> builder)
{
    builder.ToTable("apartments");

    builder.ComplexProperty(property => property.Address);
}
```

Một vài hạn chế của Complex Types:

- Không hỗ trợ collection.
- Không hỗ trợ giá trị nullable.

## Tổng kết

Value objects giúp thiết kế một rich domain model. Bạn có thể sử dụng chúng để giải quyết vấn đề `primitive obsession` (lạm dụng kiểu dữ liệu nguyên thủy) và đóng gói các domain invariants. Value object còn giúp giảm lỗi, bằng cách ngăn chặn việc tạo ra các invalid domain objects.

Bạn có thể dùng record hoặc base class `ValueObject` để thể hiện cho value object. Việc lựa chọn cách nào nên phụ thuộc vào yêu cầu cụ thể và độ phức tạp của domain của bạn. Với tôi, tôi thường mặc định dùng record, trừ khi tôi cần một số đặc tính mà chỉ có lớp cơ sở `ValueObject` cung cấp. Ví dụ, lớp cơ sở rất hữu ích khi bạn muốn kiểm soát cụ thể các thành phần dùng để so sánh bằng nhau (equality components).
