---
id: distributed-cache_mehmet
title: 5.Distributed Caching
---

# Triển khai Distributed Caching trong Microservices

Trong bài viết này, chúng ta sẽ triển khai Distributed Caching bằng với Redis, sử dụng chiến lược caching `Cache-Aside`, hai design pattern là `Proxy Pattern`, `Decorator Pattern` và thư viện `Scrutor`.

## 1.Redis là gì?

### Sơ lược về Redis

- Redis là một key-value store hiệu năng cao, tối ưu cho tốc độ xử lý. Được sử dụng phổ biến cho caching, lưu trữ session và hệ thống pub/sub. Redis lưu trữ dữ liệu trực tiếp trong RAM, giúp truy xuất cực nhanh. Nó hỗ trợ nhiều cấu trúc dữ liệu khác nhau, phù hợp với nhiều trường hợp sử dụng.

### Tại sao lại sử dụng Redis cho Distributed Caching trong dự án Microservices

- Microservices thường cần chia sẻ trạng thái hoặc dữ liệu trong môi trường phân tán. Do đó, Redis là lựa chọn lý tưởng nhờ khả năng mở rộng và hiệu suất cao. Redis sẽ hoạt động như một Distributed Cache, giúp các service truy xuất dữ liệu nhanh hơn và giảm tải cho database.

## 2. Chiến lược Cache-Aside

Cache-Aside là một `chiến lược caching` phổ biến, giúp giảm tải cho database và tối ưu hiệu suất.

### Cách thức hoạt động

Service kiểm tra dữ liệu trong cache trước khi truy xuất database.

- Nếu cache có dữ liệu, service trả về dữ liệu trong cache ngay lập tức.
- Nếu cache không có dữ liệu, service sẽ lấy dữ liệu từ database, lưu vào cache rồi trả về.

### Lợi ích

- Quản lý cache và xử lý cache-miss.
- Giảm số lượng truy vấn database, giảm tải và cải thiện tốc độ xử lý.

Ngoài ra, còn một số chiến lược caching nâng cao khác như:

- Read-through: Cache tự động đọc dữ liệu từ database khi không có sẵn.
- Write-through / Write-behind: Cache tự động ghi dữ liệu vào database khi có thay đổi.

### Hạn chế

- Tăng độ phức tạp: Caching có thể làm hệ thống phức tạp hơn và không phải lúc nào cũng phù hợp.
- Vấn đề cache invalidation: Khi dữ liệu trong database thay đổi, cache cần được làm mới hoặc xóa bỏ để tránh sử dụng dữ liệu cũ.
- Cần cơ chế đồng bộ: Yêu cầu có sự phối hợp giữa các microservices để đảm bảo dữ liệu nhất quán giữa cache và database.
- Độ trễ tiềm ẩn: Nếu cache đặt ở xa microservices, có thể gây ra độ trễ khi truy xuất dữ liệu.

## 3. Proxy Pattern, Decorator Pattern và thư viện Scrutor

### 3.1 Proxy Pattern

- Cung cấp lớp trung gian để kiểm soát truy cập vào một đối tượng khác. Proxy đóng vai trò như một cổng kiểm soát trước khi truy xuất dữ liệu gốc.
- Ứng dụng: Lazy loading, kiểm soát quyền truy cập, logging,... Tương tự như một "bảo vệ" giúp kiểm tra hoặc thêm logic trước khi truy cập đối tượng thật.

### 3.2 Decorator Pattern

- Mở rộng chức năng đối tượng một cách linh hoạt mà không làm thay đổi cấu trúc của nó.
- Sử dụng các lớp decorator để bổ sung hành vi mới mà không sửa đổi code gốc.
- Ứng dụng: Thêm tính năng cho đối tượng trong runtime, ví dụ như mở rộng một cửa sổ với thanh cuộn hoặc viền mà không thay đổi code gốc.

### 3.3x` Scrutor

- Scrutor là một thư viện ASP.NET giúp triển khai các pattern như Decorator theo cách rõ ràng và đơn giản hóa quá trình register decorator trong IOC container.

## 4. Triển khai

- Bước 1: Tạo `decorator class` implement cùng interface của đối tượng cần mở rộng.
- Bước 2: Xây dựng các decorator cụ thể để bổ sung hành vi mới.
- Bước 3: Đăng ký decorator class trong IOC container, sử dụng thư viện Scrutor

### Ví dụ cụ thể

1. Ta có class `BasketRepository` xử lý dữ liệu giỏ hàng từ database. `BasketRepository` là implement của interface `IBasketRepository`.

```
public class BasketRepository(IDocumentSession session) : IBasketRepository
    {
        public async Task<ShoppingCart> GetBasket(string username, CancellationToken cancellationToken = default)
        {
            var basket = await session.LoadAsync<ShoppingCart>(username, cancellationToken);

            if (basket == null)
            {
                throw new BasketNotFoundException(username);
            }

            return basket;
        }

        public async Task<ShoppingCart> StoreBasket(ShoppingCart basket, CancellationToken cancellationToken = default)
        {
            // Save to db
            session.Store(basket);
            await session.SaveChangesAsync(cancellationToken); // ORM generate SQL command

            return basket;
        }

        public async Task<bool> DeleteBasket(string username, CancellationToken cancellationToken = default)
        {
            // Save to db
            session.Delete<ShoppingCart>(username);
            await session.SaveChangesAsync(cancellationToken); // ORM generate SQL command

            return true;
        }
    }
```

```
public interface IBasketRepository
    {
        Task<ShoppingCart> GetBasket(string username, CancellationToken cancellationToken = default);
        Task<ShoppingCart> StoreBasket(ShoppingCart basket, CancellationToken cancellationToken = default);
        Task<bool> DeleteBasket(string username, CancellationToken cancellationToken = default);
    }
```

2. Giờ ta sẽ tạo một lớp `CachedBasketRepository` implement với cùng một interface `IBasketRepository`. Lớp này sẽ xử lý caching.

```
public class CachedBasketRepository(IBasketRepository repository, IDistributedCache cache) : IBasketRepository
    {
        public async Task<ShoppingCart> GetBasket(string username, CancellationToken cancellationToken = default)
        {
            var cachedBasket = await cache.GetStringAsync(username, cancellationToken);

            if (!string.IsNullOrEmpty(cachedBasket))
            {
                Console.WriteLine($"info: Cache hit: {cachedBasket}");

                return JsonSerializer.Deserialize<ShoppingCart>(cachedBasket);
            }

            var basket = await repository.GetBasket(username, cancellationToken);

            await cache.SetStringAsync(username, JsonSerializer.Serialize(basket), cancellationToken);

            return basket;
        }

        public async Task<ShoppingCart> StoreBasket(ShoppingCart basket, CancellationToken cancellationToken = default)
        {
            await repository.StoreBasket(basket, cancellationToken);

            await cache.SetStringAsync(basket.Username, JsonSerializer.Serialize(basket), cancellationToken);

            return basket;
        }

        public async Task<bool> DeleteBasket(string username, CancellationToken cancellationToken = default)
        {
            await repository.DeleteBasket(username, cancellationToken);

            await cache.RemoveAsync(username, cancellationToken);

            return true;
        }
    }
```

3. Đăng ký Decorator `CachedBasketRepository` với interface `IBasketRepository` trong IOC container bằng thư viện Scrutor.

```
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.Decorate<IBasketRepository, CachedBasketRepository>();
```

- Và đừng quên đăng ký cả Redis cache trong IOC container nữa.

```
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});
```

Bằng cách này, ta có thể bổ sung cơ chế caching mà không cần thay đổi logic của lớp gốc.
