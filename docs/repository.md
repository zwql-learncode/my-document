---
id: repository
title: Repository
---

# Repository

## Repository Pattern Example Tutorial

`Repository` pattern đã trở nên phổ biến từ khi nó được giới thiệu lần đầu như làm một phần của Domain-Driven Design vào 2003. Về cơ bản, nó cung cấp một `abstraction of data persistence` ( trừu tượng hóa tương tác dữ liệu ), vậy nên ứng dụng của bạn có thể hoạt động với một abstraction đơn giản ( mà domain model sở hữu ) có interface tương tự như một `Collection`. Việc đọc, thêm, sửa, xóa các các bản ghi được thông qua các phương thức đơn giản mà không cần phải xử lý các vấn đề về database như connections, commands, con trỏ, reader.

- `Abstraction of data persistence` ở đây nghĩa là việc Repository Pattern cung cấp một lớp trung gian giữa ứng dụng của bạn và cách mà dữ liệu được lưu trữ thực tế (như trong cơ sở dữ liệu ). Thay vì tương tác trực tiếp với cơ sở dữ liệu ( ví dụ: các câu lệnh SQL hoặc LINQ ), ứng dụng của bạn sẽ làm việc với một interface. Điều này giúp che giấu - trừu tượng hóa (abstraction) các chi tiết kỹ thuật về việc ghi và đọc dữ liệu, khiến cho phần code trong domain model của bạn chỉ cần biết về các phương thức như "đọc", "thêm", "sửa" ,"xóa" mà không cần quan tâm đến cách thức cụ thể mà dữ liệu được lưu trữ hoặc lấy ra. Nhờ đó, ứng dụng có thể dễ dàng thay đổi cách thức đọc ghi dữ liệu mà không cần thay đổi logic nghiệp vụ.

Sử dụng `Repository` giúp đạt được `loose coupling` (khớp nối lỏng lẻo) và giữ cho các domain object `persistence ignorant`

- `Persistence Ignorance Principle` (Nguyên tắc tránh dính líu đến nguồn dữ liệu) cho rằng các class mô hình hóa `business domain` trong một ứng dụng không nên bị ảnh hưởng bởi các chúng được lưu trữ. Do đó, thiết kế của chúng phản ánh chi tiết ý tưởng thiết kế để giải quyết vấn đề về business, mà không ảnh hưởng bởi trạng thái của các đối tượng khi được lưu và truy xuất.

Có nhiều cách khác nhau để triển khai `Repository` pattern. Hãy xem một số trong chúng và tìm hiểu ưu nhược điểm của nó.

## I. Repository cho mỗi thực thể (Entity) hoặc Business Object

Đây là cách tiếp cận đơn giản nhất, tạo một Repository với mỗi Entity (hoặc Business Object) bạn cần lưu trữ hoặc truy xuất. Ưu điểm lớn nhất của cách tiếp cận này đó là bạn không phải tốn thời gian để triển khai phương thức mà bạn không gọi.

Cách tiếp cận này hoạt động tốt nhất khi ứng dụng không có quá nhiều aggregates và cần nhiều tương tác khác nhau. Tuy nhiên, nếu bạn thấy các thao tác CRUD với mỗi Entity (hoặc Business Object) được thực hiện lặp lại & tương tự nhau, thì có thể tiếp cận với cách sử dụng `Generic` để tránh lập lại mã nguồn & tăng hiểu quả quản lý.

## II. Generic Repository Interface

Một cách tiếp cận khác đó là tạo `generic interface` cho `Repository`. Bạn có thể giới hạn kiểu mà nó hoạt động với một type nhất định hoặc để triển khai một interface nhất định ( VD: Đảm bảo nó có thuộc tính Id, bằng cách sử dụng một lớp cơ sở).

```
public abstract class EntityBase
{
   public int Id { get; protected set; }
}
```

```
interface IRepository<T> where T : EntityBase
{
    Task<T> GetByIdAsync(int id);
    Task<List<T>> ListAsync();
    TaskList<T> ListAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    Task DeleteAsync(T entity);
    Task EditAsync(T entity);
}
```

Ưu điểm của cách tiếp cận này là đảm bảo rằng bạn có một interface dùng chung cho để làm việc với bất cứ đối tượng nào. Bạn có thể đơn giản hóa cách triển khai bằng cách sử dụng `Generic Repository Implementation` (ví dụ dưới). Tuy nhiên cách này có thể dẫn đến rò rỉ dữ liệu về data access details trong calling code. Vậy nên hãy cân nhắc sử dụng `Generic Repository Implementation` để giảm thiểu vấn đề trên. Với cách triển khai dưới đây, tất cả các vấn đề truy vấn đều được đóng gói trong domain model.

## III. Generic Repository Implementation

Giả sử bạn tạo một `Generic Repository Interface` (Giao diện Repository Tổng quát) , bạn có thể triển khai interface theo cách tổng quát. Bạn có thể dễ dàng tạo các `Repositoriy` cho bất kỳ type nào mà không cần phải viết code mới và các class khai báo phụ thuộc (`Explicit Dependencies Principle` - Nguyên tắc phụ thuộc rõ ràng ) chỉ cần chỉ định `IRepository<Item>` làm type, và IoC container dễ dàng match với `Repository<Item>` implementation. Bạn có thể xem ví dụ về cách triển khai Generic Repository Implementation, sử dụng Entity Framework Core ở đây :

```
public class Repository<T> : IRepository<T> where T : EntityBase
{
    private readonly ApplicationDbContext _dbContext;

    public Repository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public virtual async Task<T> GetByIdAsync(int id)
    {
        return await _dbContext.Set<T>().FindAsync(new object[] { id });
    }

    public virtual async Task<List<T>> ListAsync()
    {
        return _dbContext.Set<T>().ToListAsync();
    }

    public virtual async Task<List<T>> List(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
    {
        return await _dbContext.Set<T>()
               .Where(predicate)
               .ToListAsync();
    }

    public async Task AddAsync(T entity)
    {
        _dbContext.Set<T>().Add(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(T entity)
    {
        _dbContext.Set<T>().Update(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbContext.Set<T>().Remove(entity);
        await _dbContext.SaveChangesAsync();
    }
}
```

- **Tham khảo từ**: [_deviq_](https://deviq.com/design-patterns/repository-pattern)
- [_Explicit Dependencies Principle_](https://deviq.com/principles/explicit-dependencies-principle) (Nguyên tắc phụ thuộc rõ ràng)
