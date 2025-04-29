---
id: options-pattern
title: Options Pattern
---

# Cách sử dụng Options Pattern trong ASP.NET Core

Nguồn: Bài viết "How To Use The Options Pattern In ASP.NET Core" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/how-to-use-the-options-pattern-in-asp-net-core-7)

Trong bản tin tuần này, mình muốn giới thiệu cho bạn cách sử dụng options pattern – một mẫu thiết kế mạnh mẽ trong ASP.NET Core

`Options pattern` sử dụng các class để cung cấp `strongly typed` (cấu hình kiểu mạnh) cho ứng dụng của bạn tại runtime.

Các giá trị cho instance của options có thể đến từ nhiều nguồn khác nhau. Trường hợp phổ biến nhất là lấy các giá trị cấu hình từ file `application configuration`.

Bạn có thể cấu hình `options pattern` theo một vài cách khác nhau trong ASP.NET Core. Bài viết này sẽ trình bày một số cách tiếp cận và lợi ích của chúng.

Hãy cùng bắt đầu.

## Tạo Options class

Đầu tiên, ta cần tạo `option class` để các giá trị cấu hình và cấu hình các thiết lập (settings) mà chúng ta muốn ánh xạ (bind) vào lớp này.

Chúng ta muốn cấu hình `JWT Authentication` cho ứng dụng, vì vậy ta quyết định tạo ra một class có tên `JwtOptions` để chứa các cấu hình đó:

```c#
public class JwtOptions
{
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public string SecretKey { get; init; }
}
```

Và giả sử trong tệp `appsettings.json` của chúng ta có đoạn cấu hình sau:

```json
"Jwt": {
    "Issuer": "Gatherly",
    "Audience": "Gatherly",
    "SecretKey": "dont-tell-anyone!"
}
```

Ổn rồi. Bây giờ tôi sẽ chỉ cho bạn một vài cách để ánh xạ (bind) các giá trị từ JSON vào class `JwtOptions`.

## Cấu hình Options Pattern bằng IConfiguration

Cách đơn giản nhất là sử dụng đối tượng `IConfiguration` – có sẵn khi đăng ký service.

Ta gọi phương thức `IServiceCollection.Configure<TOptions>` và truyền vào `JwtOptions` như một generic argument:

```c#
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));
```

Cách này không thể đơn giản hơn, phải không?

Điểm hạn chế duy nhất là nó chỉ hoạt động với các giá trị từ application configuration.

Tuy nhiên, cách này có thể mở rộng để bao gồm biến môi trường (environment variables) hoặc user secrets.

## Cấu hình Options Pattern bằng IConfigureOptions

Nếu bạn muốn một cách tiếp cận mạnh mẽ hơn, thì đây là lựa chọn. Ta sẽ sử dụng interface `IConfigureOptions` để định nghĩa một class cấu hình cho `strongly typed options`.

Có hai bước cần thực hiện:

1. Tạo class implement `IConfigureOptions`
2. Gọi `IServiceCollection.ConfigureOptions<TOptions>` với class vừa tạo

Bắt đầu với class `JwtOptionsSetup`:

```c#
public class JwtOptionsSetup : IConfigureOptions<JwtOptions>
{
    private const string SectionName = "Jwt";
    private readonly IConfiguration _configuration;

    public JwtOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(JwtOptions options)
    {
        _configuration
            .GetSection(SectionName)
            .Bind(options);
    }
}
```

Ta phải viết nhiều code hơn để đạt cùng một kết quả. Vậy có đáng không?

Có thể là đáng, nếu bạn cần dùng dependency injection trong `JwtOptionsSetup`. Điều này có nghĩa là bạn có thể inject thêm các service khác để lấy dữ liệu cấu hình.

Đừng quên đăng ký class `JwtOptionsSetup`:

```c#
builder.Services.ConfigureOptions<JwtOptionsSetup>();
```

Khi bạn inject `JwtOptions` ở đâu đó, phương thức `JwtOptionsSetup.Configure` sẽ được gọi để khởi tạo giá trị tương ứng.

## Inject Options bằng IOptions

Chúng ta đã xem qua một vài ví dụ về cách cấu hình options pattern với lớp `JwtOptions`.

Nhưng làm cách nào để sử dụng options pattern một cách thực tế?

Rất đơn giản, chỉ cần inject `IOptions<JwtOptions>` trong constructor.

Tôi sẽ chỉ hiển thị constructor của lớp `JwtProvider` để ngắn gọn:

```c#
public JwtProvider(IOptions<JwtOptions> options)
{
    _options = options.Value;
}
```

Instance `JwtOptions` thật sự sẽ có sẵn tại thuộc tính `IOptions<JwtOptions>.Value`.

Lưu ý rằng instance `IOptions` được đăng ký như một Singleton trong DI container. Điều này rất quan trọng.

## Vậy còn IOptionsSnapshot và IOptionsMonitor?

Nếu bạn muốn sử dụng các giá trị cấu hình mới nhất mỗi lần inject options, thì `IOptions` là không đủ.

Bạn có thể sử dụng interface `IOptionsSnapshot`:

- Nó cung cấp snapshot cấu hình mới nhất (cached theo từng request)
- Được đăng ký dưới dạng Scoped service
- Phát hiện thay đổi cấu hình sau khi ứng dụng khởi động

Ngoài ra, có thể dùng `IOptionsMonitor` – lấy giá trị options hiện tại tại bất kỳ thời điểm nào, và được đăng ký dưới dạng Singleton service.

## Tổng kết

Options pattern cho phép chúng ta sử dụng các class cấu hình kiểu mạnh trong ứng dụng.

Ta có thể cấu hình class options đơn giản với `IConfiguration`, hoặc tạo một class implement `IConfigureOptions` nếu cần nhiều quyền kiểm soát hơn.

Khi sử dụng, có 3 cách inject:

- IOptions
- IOptionsSnapshot
- IOptionsMonitor

Việc chọn cách nào tuỳ thuộc vào hành vi bạn muốn. Nếu bạn không cần cập nhật giá trị cấu hình sau khi ứng dụng khởi động, thì IOptions là lựa chọn tối ưu.
