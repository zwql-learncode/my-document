---
id: getting-the-current-user-ca
title: Lấy thông tin Current User trong Clean Architecture
---

# Lấy thông tin Current User trong Clean Architecture

Nguồn: Bài viết "Getting the Current User in Clean Architecture
" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/getting-the-current-user-in-clean-architecture)

Các ứng dụng bạn xây dựng phục vụ người dùng (khách hàng) nhằm giúp họ giải quyết một số vấn đề. Một yêu cầu phổ biến là bạn cần biết Current User của ứng dụng là ai.

Vậy làm thế nào để lấy thông tin Current User trong một use case của Clean Architecture?

Các use case tồn tại trong Application layer, nơi bạn không thể đưa vào các `external concerns`(tam dịch: các yếu tố/dịch vụ bên ngoài). Nếu làm vậy, bạn sẽ vi phạm `dependency rule`(nguyên tắc phụ thuộc).

Giả sử bạn muốn biết Current User là ai để xác định xem họ có thể truy cập một tài nguyên nào đó hay không. Đây là một ví dụ điển hình của `resource-based authorization check`. Nhưng để làm được điều đó, bạn cần tương tác với `identity provider` để lấy thông tin người dùng. Điều này phá vỡ `dependency rule` trong Clean Architecture.

Tôi đã thấy vấn đề này gây bối rối cho nhiều developer mới tiếp cận Clean Architecture.

Trong bài viết hôm nay, tôi sẽ chỉ cho bạn cách truy cập thông tin người dùng hiện tại một cách clean.

## Bắt đầu với Abstraction

Các lớp lõi (inner layers) trong Clean Architecture (Domain, Application) định nghĩa các abstraction cho các `external concerns`. Từ góc nhìn của `Application layer`, authentication và user identity là các `external concerns`.

`Infrastructure layer` xử lý các `external concerns`, bao gồm authentication và identity management. Đây là nơi bạn sẽ implement các abstraction.

Cách tiếp cận tôi ưa thích là tạo một abstraction tên là `IUserContext`. Thông tin chính tôi cần là `UserId` của người dùng hiện tại. Nhưng bạn có thể mở rộng `IUserContext` với bất kỳ dữ liệu nào khác mà bạn thấy cần thiết.

```c#
public interface IUserContext
{
    bool IsAuthenticated { get; }
    Guid UserId { get; }
}
```

Hãy xem cách implement `IUserContext`.

## Triển khai UserContext

Lớp `UserContext` là implement của `IUserContext` trong `Infrastructure layer`. Chúng ta cần inject `IHttpContextAccessor`, cho phép truy cập `ClaimsPrincipal` thông qua thuộc tính `User`. `ClaimsPrincipal` cung cấp quyền truy cập các claim của người dùng hiện tại, nơi chứa thông tin cần thiết.

Trong ví dụ dưới đây, tôi sẽ ném ra một exception nếu bất kỳ thuộc tính nào trả về null. Bạn có thể cân nhắc xem hành vi này có phù hợp với ứng dụng của bạn không.

Tôi cũng muốn chia sẻ một lưu ý quan trọng về `IHttpContextAccessor`: Chúng ta chỉ có thể sử dụng nó để truy cập `HttpContext` trong một API request. Ngoài phạm vi đó, `HttpContext` sẽ là null, và UserContext sẽ ném exception khi truy cập thuộc tính.

Tạo một implement class `UserContext` (Từ phiên bản .NET 7 và C# 11 trở lên)

```c#
internal sealed class UserContext(IHttpContextAccessor httpContextAccessor)
    : IUserContext
{
    public Guid UserId =>
        httpContextAccessor
            .HttpContext?
            .User
            .GetUserId() ??
        throw new ApplicationException("User context is unavailable");

    public bool IsAuthenticated =>
        httpContextAccessor
            .HttpContext?
            .User
            .Identity?
            .IsAuthenticated ??
        throw new ApplicationException("User context is unavailable");
}
```

Hoặc viết một cách tường minh hơn:

```c#
internal sealed class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId
    {
        get
        {
            if (_httpContextAccessor.HttpContext?.User.GetUserId() is Guid userId)
            {
                return userId;
            }
            else
            {
                throw new ApplicationException("User context is unavailable");
            }
        }
    }

    public bool IsAuthenticated
    {
        get
        {
            if (_httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated is bool isAuthenticated)
            {
                return isAuthenticated;
            }
            else
            {
                throw new ApplicationException("User context is unavailable");
            }
        }
    }
}
```

Đây là method mở rộng `GetUserId` được sử dụng trong `UserContext.UserId`. Nó tìm một claim có tên `ClaimTypes.NameIdentifier`, và parse giá trị thành Guid. Bạn có thể thay đổi kiểu dữ liệu này để phù hợp với `user identity` (định danh người dùng) trong hệ thống của bạn.

```c#
internal static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal? principal)
    {
        string? userId = principal?.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(userId, out Guid parsedUserId) ?
            parsedUserId :
            throw new ApplicationException("User id is unavailable");
    }
}
```

## Sử dụng thông tin Current User

Giờ bạn đã có `IUserContext`, bạn có thể sử dụng nó từ `Application layer`.

Một yêu cầu phổ biến là kiểm tra xem người dùng hiện tại có quyền truy cập vào một tài nguyên nào đó hay không.

Dưới đây là một ví dụ sử dụng `GetInvoiceQueryHandler`, truy vấn cơ sở dữ liệu để lấy một hóa đơn. Sau khi mapping kết quả sang đối tượng `InvoiceResponse`, ta kiểm tra xem người dùng hiện tại có phải là người được phát hành hóa đơn đó hay không.

Bạn cũng có thể thực hiện kiểm tra này ngay trong câu truy vấn đến cơ sở dữ liệu. Tuy nhiên, thực hiện kiểm tra trong bộ nhớ (in-memory) cho phép bạn trả về một phản hồi khác biệt nếu người dùng không được phép truy cập. Ví dụ, một mã phản hồi HTTP 403 Forbidden có thể là phù hợp.

Tạo một query handler `GetInvoiceQueryHandler` (Từ phiên bản .NET 7 và C# 11 trở lên)

```c#
class GetInvoiceQueryHandler(IAppDbContext dbContext, IUserContext userContext)
    : IQueryHandler<GetInvoiceQuery, InvoiceResponse>
{
    public async Task<Result<InvoiceResponse>> Handle(
        GetInvoiceQuery request,
        CancellationToken cancellationToken)
    {
        InvoiceResponse? invoiceResponse = await dbContext
            .Invoices
            .ProjectTo<InvoiceResponse>()
            .FirstOrDefaultAsync(
                invoice => invoice.Id == request.InvoiceId,
                cancellationToken);

        if (invoiceResponse is null ||
            invoiceResponse.IssuedToUserId != userContext.UserId)
        {
            return Result.Failure<InvoiceResponse>(InvoiceErrors.NotFound);
        }

        return invoiceResponse;
    }
}
```

Hoặc viết một cách tường minh hơn:

```c#
class GetInvoiceQueryHandler : IQueryHandler<GetInvoiceQuery, InvoiceResponse>
{
    private readonly IAppDbContext _dbContext;
    private readonly IUserContext _userContext;

    public GetInvoiceQueryHandler(IAppDbContext dbContext, IUserContext userContext)
    {
        _dbContext = dbContext;
        _userContext = userContext;
    }

    public async Task<Result<InvoiceResponse>> Handle(
        GetInvoiceQuery request,
        CancellationToken cancellationToken)
    {
        InvoiceResponse? invoiceResponse = await _dbContext
            .Invoices
            .ProjectTo<InvoiceResponse>()
            .FirstOrDefaultAsync(
                invoice => invoice.Id == request.InvoiceId,
                cancellationToken);

        if (invoiceResponse == null || invoiceResponse.IssuedToUserId != _userContext.UserId)
        {
            return Result.Failure<InvoiceResponse>(InvoiceErrors.NotFound);
        }

        return invoiceResponse;
    }
}
```

## Kết luận

Việc tích hợp `user identity` (định danh người dùng) và `authentication` (xác thực) vào Clean Architecture không nhất thiết phải làm tổn hại đến tính toàn vẹn trong thiết kế của bạn. `Application layer` cần được giữ tách biệt khỏi các `external concerns` như `identity management` (quản lý danh tính).

Chúng ta tuân thủ `dependency rule` (nguyên tắc phụ thuộc) của Clean Architecture bằng cách trừu tượng hóa thông tin liên quan đến người dùng thông qua interface `IUserContext`, và triển khai nó ở `Infrastructure layer`.

Với chiến lược này, bạn có thể quản lý hiệu quả thông tin người dùng, hỗ trợ các kiểm tra phân quyền (authorization checks), đồng thời đảm bảo ứng dụng của bạn vẫn vững chắc và linh hoạt trước các thay đổi trong tương lai.

Hãy nhớ rằng, chìa khóa nằm ở việc định nghĩa rõ ràng các abstraction và tôn trọng ranh giới giữa các layer trong kiến trúc.

Hy vọng phần này hữu ích với bạn.
