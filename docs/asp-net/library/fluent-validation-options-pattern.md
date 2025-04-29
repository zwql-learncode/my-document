---
id: fluent-validation-options-pattern
title: Sử dụng FluentValidation với Options Pattern Validation
---

# Sử dụng FluentValidation với Options Pattern Validation

Nguồn: Bài viết "Options Pattern Validation in ASP.NET Core With FluentValidation" của tác giả [Milan Jovanović](https://www.milanjovanovic.tech/blog/options-pattern-validation-in-aspnetcore-with-fluentvalidation)

Nếu bạn đã từng làm việc với Options Pattern trong ASP.NET Core, hẳn bạn đã quen thuộc với cơ chế xác thực tích hợp sẵn bằng Data Annotations. Tuy hoạt động ổn định trong các trường hợp đơn giản, Data Annotations lại khá hạn chế khi cần xử lý các kịch bản xác thực phức tạp.

`Options Pattern` cho phép bạn sử dụng các class để truy xuất các đối tượng cấu hình được gán `strongly typed` (kiểu mạnh) tại thời điểm runtime.

Vấn đề là gì? Bạn không thể chắc chắn rằng cấu hình là hợp lệ cho đến khi bạn cố sử dụng nó.

Vậy tại sao không xác thực nó ngay khi ứng dụng khởi động?

Trong bài viết này, chúng ta sẽ khám phá cách tích hợp thư viện mạnh mẽ hơn - `FluentValidation` vào Options Pattern trong ASP.NET Core, nhằm xây dựng một giải pháp validation vững chắc được thực thi ngay từ lúc ứng dụng khởi động.

## Vì sao chọn FluentValidation thay vì Data Annotations?

Data Annotations hoạt động tốt với các xác thực đơn giản, nhưng FluentValidation mang lại nhiều lợi thế:

- Validation rules diễn đạt tốt hơn và linh hoạt hơn
- Hỗ trợ mạnh cho các validation điều kiện phức tạp
- `Separation of concerns`(phân tách mối quan tâm) - Tách biệt validation logic khỏi model)
- Dễ dàng kiểm thử các Validation rules
- Hỗ trợ tốt hơn cho validation logic tùy chỉnh
- Cho phép inject các dependency vào validator

## Tìm hiểu vòng đời của Options Pattern

Trước khi đi sâu vào xác thực, cần nắm rõ vòng đời của options trong ASP.NET Core:

1. Options được đăng ký với DI container
2. Các giá trị cấu hình được binding vào các class options
3. Validation được thực thi (nếu được cấu hình)
4. Options được resolve thông qua `IOptions<T>`, `IOptionsSnapshot<T>` hoặc `IOptionsMonitor<T>`

Phương thức `ValidateOnStart()` buộc xác thực xảy ra ngay khi ứng dụng khởi động, thay vì lúc options được sử dụng lần đầu.

## Các lỗi cấu hình phổ biến nếu không xác thực

Không có xác thực, cấu hình sai có thể gây ra các sự cố:

- Silent failure: Option sai có thể được gán giá trị mặc định mà không cảnh báo
- Runtime exception: Vấn đề chỉ xuất hiện khi sử dụng giá trị cấu hình không hợp lệ
- Cascading failure: Một thành phần cấu hình sai có thể gây lỗi cho toàn bộ hệ thống phụ thuộc

Việc xác thực ngay từ đầu giúp phản hồi sớm và ngăn chặn các sự cố này.

## Cài đặt

Trước tiên, cài các gói cần thiết cho FluentValidation:

```bash
Install-Package FluentValidation
Install-Package FluentValidation.DependencyInjectionExtensions
```

Giả sử ta có một class `GitHubSettings` cần xác thực:

```c#
public class GitHubSettings
{
    public const string ConfigurationSection = "GitHubSettings";

    public string BaseUrl { get; init; }
    public string AccessToken { get; init; }
    public string RepositoryName { get; init; }
}
```

## Tạo một FluentValidation Validator

Tiếp theo, ta sẽ tạo validator cho `GitHubSettings`:

```c#
public class GitHubSettingsValidator : AbstractValidator<GitHubSettings>
{
    public GitHubSettingsValidator()
    {
        RuleFor(x => x.BaseUrl).NotEmpty();

        RuleFor(x => x.BaseUrl)
            .Must(baseUrl => Uri.TryCreate(baseUrl, UriKind.Absolute, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.BaseUrl))
            .WithMessage($"{nameof(GitHubSettings.BaseUrl)} must be a valid URL");

        RuleFor(x => x.AccessToken).NotEmpty();
        RuleFor(x => x.RepositoryName).NotEmpty();
    }
}
```

## Tích hợp FluentValidation với Options Pattern

Để tích hợp FluentValidation với Options Pattern, chúng ta cần tạo một triển khai `IValidateOptions<T>` tùy chỉnh:

```c#
public class FluentValidateOptions<TOptions> : IValidateOptions<TOptions>
    where TOptions : class
{
    private readonly IServiceProvider _serviceProvider;
    private readonly string? _name;

    public FluentValidateOptions(IServiceProvider serviceProvider, string? name)
    {
        _serviceProvider = serviceProvider;
        _name = name;
    }

    public ValidateOptionsResult Validate(string? name, TOptions options)
    {
        if (_name is not null && _name != name)
            return ValidateOptionsResult.Skip;

        ArgumentNullException.ThrowIfNull(options);

        using var scope = _serviceProvider.CreateScope();
        var validator = scope.ServiceProvider.GetRequiredService<IValidator<TOptions>>();

        var result = validator.Validate(options);
        if (result.IsValid)
            return ValidateOptionsResult.Success;

        var errors = result.Errors.Select(failure =>
            $"Validation failed for {typeof(TOptions).Name}.{failure.PropertyName} with the error: {failure.ErrorMessage}"
        ).ToList();

        return ValidateOptionsResult.Fail(errors);
    }
}
```

Lưu ý:

- Sử dụng scope để resolve validator đúng cách (thường được đăng ký là scoped)
- Xử lý named options thông qua thuộc tính `\_name`
- Ghi log lỗi đầy đủ với tên property và thông báo lỗi

## Cách hoạt động của FluentValidation trong Options Pattern

1. `IValidateOptions<T>` là "hook" mà ASP.NET Core cung cấp để xác thực options
2. Class `FluentValidateOptions<T>` đóng vai trò cầu nối với FluentValidation
3. Khi gọi `ValidateOnStart()`, ASP.NET Core sẽ resolve tất cả `IValidateOptions<T>` và thực thi chúng
4. Nếu thất bại, một `OptionsValidationException` được ném ra và ngăn ứng dụng khởi động

## Tạo Extension Method để tích hợp dễ dàng hơn

Bây giờ, chúng ta sẽ tạo một vài extension method để việc cấu hình validation trở nên dễ dàng hơn:

```c#
public static class OptionsBuilderExtensions
{
    public static OptionsBuilder<TOptions> ValidateFluentValidation<TOptions>(
        this OptionsBuilder<TOptions> builder)
        where TOptions : class
    {
        builder.Services.AddSingleton<IValidateOptions<TOptions>>(
            sp => new FluentValidateOptions<TOptions>(sp, builder.Name));

        return builder;
    }
}
```

Extension method này cho phép chúng ta gọi `.ValidateFluentValidation()` khi cấu hình options, tương tự như cách gọi `.ValidateDataAnnotations()` có sẵn trong ASP.NET Core.

Để tiện lợi hơn nữa, ta có thể tạo thêm một extension method khác giúp đơn giản hóa toàn bộ quá trình cấu hình:

```c#
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOptionsWithFluentValidation<TOptions>(
        this IServiceCollection services,
        string configurationSection)
        where TOptions : class
    {
        services.AddOptions<TOptions>()
            .BindConfiguration(configurationSection)
            .ValidateFluentValidation() // Cấu hình validation bằng FluentValidation
            .ValidateOnStart();         // Thực thi validation khi ứng dụng khởi động

        return services;
    }
}
```

## Đăng ký và Sử dụng Validation

### 1. Đăng ký thông thường với đăng ký thủ công Validator

```c#
// Đăng ký validator
builder.Services.AddScoped<IValidator<GitHubSettings>, GitHubSettingsValidator>();

// Cấu hình options kèm validation
builder.Services.AddOptions<GitHubSettings>()
    .BindConfiguration(GitHubSettings.ConfigurationSection)
    .ValidateFluentValidation() // Dùng FluentValidation để kiểm tra dữ liệu cấu hình
    .ValidateOnStart();         // Thực thi validation ngay khi ứng dụng khởi động

```

### 2. Dùng Extension Method tiện lợi

```c#
// Đăng ký validator
builder.Services.AddScoped<IValidator<GitHubSettings>, GitHubSettingsValidator>();

// Sử dụng extension method đã tạo sẵn để cấu hình nhanh
builder.Services.AddOptionsWithFluentValidation<GitHubSettings>(GitHubSettings.ConfigurationSection);
```

### 3. Tự động đăng ký tất cả các validator

Nếu bạn có nhiều validator và muốn đăng ký tất cả cùng lúc, có thể dùng tính năng quét assembly của FluentValidation:

```c#
// Tự động đăng ký toàn bộ validator trong assembly hiện tại
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Sử dụng extension method tiện lợi
builder.Services.AddOptionsWithFluentValidation<GitHubSettings>(GitHubSettings.ConfigurationSection);
```

## Chuyện gì xảy ra khi chạy ứng dụng?

Với `.ValidateOnStart()`, nếu có bất kỳ rule validation nào bị sai, ứng dụng sẽ báo lỗi ngay khi khởi động. Ví dụ, nếu file `appsettings.json` thiếu trường bắt buộc `AccessToken`, bạn sẽ thấy lỗi như:

```log
Microsoft.Extensions.Options.OptionsValidationException:
    Validation failed for GitHubSettings.AccessToken with the error: 'Access Token' must not be empty.
```

Cơ chế này giúp đảm bảo ứng dụng không khởi động khi cấu hình bị sai, từ đó phát hiện lỗi càng sớm càng tốt.

## Làm việc với nhiều nguồn cấu hình khác nhau

Hệ thống cấu hình của ASP.NET Core hỗ trợ nhiều nguồn như:

- Biến môi trường (Environment variables)
- Azure Key Vault
- User secrets
- Tệp JSON
- Cấu hình trong bộ nhớ (In-memory configuration)

FluentValidation sẽ hoạt động bình thường bất kể bạn dùng nguồn nào, rất hữu ích trong các ứng dụng chạy container (Docker/Kubernetes), nơi cấu hình thường đến từ biến môi trường hoặc file mount.

## Kiểm thử validator

Một lợi ích lớn của FluentValidation là khả năng kiểm thử validator rất dễ dàng:

```c#
// Sử dụng FluentValidation.TestHelper để kiểm thử
[Fact]
public void GitHubSettings_WithMissingAccessToken_ShouldHaveValidationError()
{
    // Sắp xếp dữ liệu đầu vào
    var validator = new GitHubSettingsValidator();
    var settings = new GitHubSettings { RepositoryName = "test-repo" };

    // Gọi kiểm thử validation
    TestValidationResult<GitHubSettings>? result = await validator.TestValidate(settings);

    // Kiểm tra kết quả
    result.ShouldNotHaveAnyValidationErrors();
}
```

## Tổng kết

Bằng cách kết hợp `FluentValidation`, `Options Pattern`, và `.ValidateOnStart()`, bạn có thể tạo ra một hệ thống kiểm tra cấu hình mạnh mẽ, đảm bảo rằng ứng dụng có cấu hình chính xác ngay từ khi khởi động.

Ưu điểm của cách tiếp cận này:

- Cung cấp các rule kiểm tra rõ ràng hơn so với DataAnnotations
- Tách riêng logic kiểm tra khỏi model cấu hình
- Phát hiện lỗi cấu hình ngay khi khởi động
- Hỗ trợ các kịch bản kiểm tra phức tạp
- Dễ dàng kiểm thử bằng unit test

Đặc biệt hữu ích trong các kiến trúc microservice hoặc ứng dụng container, nơi việc cấu hình sai nên được phát hiện càng sớm càng tốt.

Hãy đảm bảo luôn đăng ký validator đúng cách và gọi `.ValidateOnStart()` để validation được kích hoạt khi ứng dụng bắt đầu chạy.
