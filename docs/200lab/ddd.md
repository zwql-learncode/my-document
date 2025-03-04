---
id: ddd-200lab
title: Domain-Driven Design
---

# Domain-Driven Design (DDD) là gì? Ví dụ dễ hiểu về DDD

Nguồn: [200Lab](https://200lab.io/blog/domain-driven-design-la-gi)

Domain-Driven Design là phương pháp thiết kế phần mềm, trong đó hệ thống được xây dựng để phản ánh chính xác các yêu cầu và quy tắc của nghiệp vụ.

Thay vì chỉ tập trung vào công nghệ, DDD giúp mô hình hóa phần mềm xoay quanh những khái niệm cốt lõi của nghiệp vụ, nhờ đó tạo ra một kiến trúc không chỉ phản ánh chính xác nhu cầu thực tế mà còn dễ dàng thích ứng với các thay đổi sau này. Hãy cùng mình tìm hiểu Domain-Driven Design là gì? thông qua các ví dụ cụ thể trong bài viết này nhé.

## 1. Domain-Driven Design giải quyết khó khăn gì?

Giả sử chúng ta đang phát triển hệ thống quản lý đơn hàng cho một công ty thương mại điện tử. Hệ thống này cần quản lý:

- Đơn hàng (Order), trạng thái, các thay đổi trạng thái bao gồm: Pending, Shipped, Delivered, Cancelled.
- Thanh toán (Payment) cho đơn hàng, xử lý và xác nhận thanh toán.
- Giao hàng (Shipping) cho đơn hàng, xác nhận khi đơn hàng đã được giao.

Code của chúng ta sẽ trông như thế này (MVC Model):

```
# models.py

class Order:
    def __init__(self, order_id, customer, items):
        self.order_id = order_id
        self.customer = customer
        self.items = items
        self.status = "pending"  # Trạng thái mặc định là "pending"

class Payment:
    def __init__(self, payment_id, order_id, amount):
        self.payment_id = payment_id
        self.order_id = order_id
        self.amount = amount
        self.status = "unpaid"  # Trạng thái mặc định là "unpaid"

class Shipping:
    def __init__(self, shipping_id, order_id, address):
        self.shipping_id = shipping_id
        self.order_id = order_id
        self.address = address
        self.status = "not_shipped"  # Trạng thái mặc định là "not_shipped"

# controllers.py
from models import Order, Payment, Shipping

class OrderController:
    def __init__(self):
        self.orders = {}
        self.payments = {}
        self.shippings = {}

    def create_order(self, customer, items):
        order_id = len(self.orders) + 1
        order = Order(order_id, customer, items)
        self.orders[order_id] = order
        print(f"Order {order_id} created.")
        return order

    def process_payment(self, order_id, amount):
        order = self.orders.get(order_id)
        if not order:
            return "Order not found."

        payment_id = len(self.payments) + 1
        payment = Payment(payment_id, order_id, amount)
        payment.status = "paid"  # Cập nhật trạng thái thanh toán thành "paid"
        self.payments[payment_id] = payment
        print(f"Payment {payment_id} for Order {order_id} processed.")
        return payment

    def ship_order(self, order_id, address):
        order = self.orders.get(order_id)
        if not order:
            return "Order not found."

        shipping_id = len(self.shippings) + 1
        shipping = Shipping(shipping_id, order_id, address)
        shipping.status = "shipped"  # Cập nhật trạng thái giao hàng
        self.shippings[shipping_id] = shipping
        order.status = "shipped"  # Cập nhật trạng thái đơn hàng thành "shipped"
        print(f"Order {order_id} shipped to {address}.")
        return shipping

    def deliver_order(self, order_id):
        order = self.orders.get(order_id)
        if order and order.status == "shipped":
            order.status = "delivered"
            print(f"Order {order_id} delivered.")
        else:
            print(f"Order {order_id} cannot be delivered.")
```

Mô hình này sẽ bộc lộ khó khăn khi logic nghiệp vụ ngày càng trở nên cực kì phức tạp, class Controller này sẽ ngày càng phình to với hàng loạt các logic if,else, tính toán phức tạp (hoàn tiền, tính thưởng, ...). Về lâu dài class này sẽ trở nên khó maintain, bất kì một thay đổi nào cũng có khả năng gây lỗi cho những phần khác.

Mình cá là bạn cũng không muốn maintain một class lớn đến như thế, chúng ta cần phải tìm phương pháp nào đó để chia nhỏ nó ra và thực hiện thay đổi trên phần nhỏ đó, thế là khái niệm DDD đã ra đời, cùng mình tìm hiểu xem DDD có gì hay nha.

## 2. Domain-Driven Design (DDD) là gì?

Domain-Driven Design (DDD) là một cách tiếp cận thiết kế phần mềm, trong đó hệ thống được xây dựng để phản ánh chính xác các yêu cầu và quy tắc của nghiệp vụ mà nó phục vụ. DDD đề xuất thay vì tập trung vào các khía cạnh kỹ thuật trước, dự án nên được tổ chức xung quanh các khái niệm nghiệp vụ thực sự của hệ thống.

Các thành phần chính trong DDD:

### Bounded Context (Ngữ cảnh Giới hạn)

Giúp chia hệ thống lớn thành các khu vực độc lập, mỗi khu vực chỉ tập trung vào một phần nghiệp vụ cụ thể, có quy tắc và thuật ngữ riêng. Mục tiêu của Bounded Context là tránh nhầm lẫn và đảm bảo các phần của hệ thống không chồng chéo lên nhau.

Ví dụ: Hệ thống quản lý đơn hàng có thể được chia thành các ngữ cảnh riêng biệt như "Quản lý Thanh toán", "Quản lý Đơn hàng", và "Quản lý Vận chuyển". Trong ngữ cảnh "Quản lý Thanh toán", từ "xác nhận" liên quan đến việc hoàn tất thanh toán, trong khi ở ngữ cảnh "Quản lý Vận chuyển" nó liên quan đến việc xác nhận giao hàng.

### Ubiquitous Language (Ngôn ngữ Chung)

Là ngôn ngữ chung mà tất cả mọi người trong dự án đều sử dụng - từ các chuyên gia nghiệp vụ đến lập trình viên. Ngôn ngữ này không chỉ dùng trong trao đổi hàng ngày mà còn xuất hiện trong mã nguồn, giúp đảm bảo tất cả đều hiểu đúng ý.

Ví dụ: Trong dự án ngân hàng, tất cả thành viên nên sử dụng các thuật ngữ như "Tài khoản", "Số dư", "Giao dịch", và "Dư nợ" thay vì dùng các từ ngữ thuần kỹ thuật. Nhờ vậy, mọi người đều hiểu rõ, tạo ra sự nhất quán về ý nghĩa của từng thuật ngữ.

### Entities và Value Objects

Entities (Thực thể) là các đối tượng có danh tính riêng biệt, bất kể thuộc tính của nó có thay đổi. Value Objects (Đối tượng Giá trị) không có danh tính và chỉ mang một tập hợp các giá trị, thường dùng để biểu diễn các đặc điểm của một thực thể.

Ví dụ: Trong ngữ cảnh "Quản lý Đơn hàng": Một Customer (Khách hàng) có thể là một Entity vì danh tính của họ là duy nhất, không phụ thuộc vào các thông tin như tên hay địa chỉ. Một Address (Địa chỉ) có thể là Value Object vì nó chỉ chứa thông tin về địa chỉ giao hàng và không cần danh tính riêng.

### Aggregates (Tập hợp)

Aggregate là một nhóm các Entity và Value Object liên kết chặt chẽ với nhau, được quản lý như một đơn vị. Aggregate giúp đảm bảo dữ liệu bên trong nó luôn nhất quán.

Ví dụ: Trong ngữ cảnh đơn hàng, Order có thể là một Aggregate chứa các Entity như OrderItem và các thông tin của khách hàng. Khi xử lý Order, tất cả các OrderItem bên trong nó cũng phải nhất quán.

### Repositories và Factories

Repositories (Kho lưu trữ): Chịu trách nhiệm lưu trữ và truy xuất Aggregates từ cơ sở dữ liệu.

Factories: Được dùng để tạo ra các đối tượng phức tạp.

Ví dụ: OrderRepository có thể là nơi lưu trữ tất cả thông tin của Order, OrderFactory có thể tạo ra một Order mới với tất cả các OrderItem của Order đó.

## 3. Một ví dụ cụ thể về DDD

Với DDD, chúng ta chia hệ thống thành các Bounded Contexts rõ ràng, mỗi ngữ cảnh tập trung vào một phần nghiệp vụ cụ thể:

- Order Management: Chỉ quản lý thông tin và trạng thái của đơn hàng.
- Payment Processing: Quản lý thanh toán, bao gồm xác nhận và hoàn tiền.
- Shipping Management: Quản lý giao hàng và cập nhật trạng thái giao hàng.
- Ngữ cảnh Đơn hàng (Order Context): Ngữ cảnh này chỉ lưu trữ thông tin đơn hàng cơ bản, không quản lý logic thanh toán hoặc vận chuyển.

```
# order_management.py
class Order:
    def __init__(self, order_id, customer, items):
        self.order_id = order_id
        self.customer = customer
        self.items = items
        self.status = "pending"

    def mark_as_paid(self):
        self.status = "paid"

    def mark_as_shipped(self):
        if self.status == "paid":
            self.status = "shipped"
        else:
            raise Exception("Order must be paid before shipping.")

    def mark_as_delivered(self):
        if self.status == "shipped":
            self.status = "delivered"
        else:
            raise Exception("Order must be shipped before it can be delivered.")

    def cancel(self):
        if self.status in ["pending", "paid"]:
            self.status = "cancelled"
        else:
            raise Exception("Order cannot be cancelled after it is shipped or delivered.")

# order_repository.py
class OrderRepository:
    def __init__(self):
        self.orders = {}

    def add_order(self, order):
        self.orders[order.order_id] = order

    def get_order(self, order_id):
        return self.orders.get(order_id)
```

Ngữ cảnh Thanh toán (Payment Context): Chỉ quản lý quy trình thanh toán, không liên quan đến logic khác.

```
# payment_processing.py
class Payment:
    def __init__(self, payment_id, order_id, amount):
        self.payment_id = payment_id
        self.order_id = order_id
        self.amount = amount
        self.status = "unpaid"

    def process_payment(self):
        self.status = "paid"

    def refund(self):
        if self.status == "paid":
            self.status = "refunded"
        else:
            raise Exception("Cannot refund an unpaid payment.")
```

Ngữ cảnh Vận chuyển (Shipping Context): Chỉ quản lý trạng thái vận chuyển của đơn hàng.

```
# shipping_management.py
class Shipping:
    def __init__(self, shipping_id, order_id, address):
        self.shipping_id = shipping_id
        self.order_id = order_id
        self.address = address
        self.status = "not_shipped"

    def ship_order(self):
        self.status = "shipped"
```

Repository và Service Layer: Class OrderRepository lưu trữ đơn hàng, OrderService quản lý quy trình nghiệp vụ liên quan đến đơn hàng.

```
# Order Repository
class OrderRepository:
    def __init__(self):
        self.orders = {}  # Lưu trữ đơn giản

    def add_order(self, order):
        self.orders[order.order_id] = order

    def get_order(self, order_id):
        return self.orders.get(order_id)

# Order Service
class OrderService:
    def __init__(self, order_repo, payment_service, shipping_service):
        self.order_repo = order_repo
        self.payment_service = payment_service
        self.shipping_service = shipping_service

    def place_order(self, customer, products):
        order_id = len(self.order_repo.orders) + 1
        order = Order(order_id, customer, products)
        self.order_repo.add_order(order)
        print(f"Order {order_id} placed.")
        return order

    def complete_order(self, order_id):
        order = self.order_repo.get_order(order_id)
        if order:
            self.payment_service.process_payment(order)
            self.shipping_service.ship_order(order)
            order.mark_as_completed()
            print(f"Order {order_id} completed.")
```

Các Service cho từng nghiệp vụ (Order, Payment, Shipping): do quá dài nên mình chỉ ví dụ OrderService thôi nhé:

```
# order_service.py
from order_management import Order
from payment_processing import Payment
from shipping_management import Shipping
from order_repository import OrderRepository
from payment_repository import PaymentRepository
from shipping_repository import ShippingRepository

class OrderService:
    def __init__(self, order_repo, payment_repo, shipping_repo):
        self.order_repo = order_repo
        self.payment_repo = payment_repo
        self.shipping_repo = shipping_repo

    def create_order(self, customer, items):
        order_id = len(self.order_repo.orders) + 1
        order = Order(order_id, customer, items)
        self.order_repo.add_order(order)
        print(f"Order {order_id} created.")
        return order

    def process_order_payment(self, order_id, amount):
        order = self.order_repo.get_order(order_id)
        if not order:
            return "Order not found."

        payment_id = len(self.payment_repo.payments) + 1
        payment = Payment(payment_id, order_id, amount)
        payment.process_payment()
        self.payment_repo.add_payment(payment)

        order.mark_as_paid()
        print(f"Payment {payment_id} processed for Order {order_id}.")
        return payment

    def ship_order(self, order_id, address):
        order = self.order_repo.get_order(order_id)
        if not order or order.status != "paid":
            return "Order not found or not paid."

        shipping_id = len(self.shipping_repo.shippings) + 1
        shipping = Shipping(shipping_id, order_id, address)
        shipping.ship_order()
        self.shipping_repo.add_shipping(shipping)

        order.mark_as_shipped()
        print(f"Order {order_id} shipped to {address}.")
        return shipping

    def cancel_order(self, order_id):
        order = self.order_repo.get_order(order_id)
        if not order:
            return "Order not found."

        if order.status in ["shipped", "delivered"]:
            return "Cannot cancel order after it has been shipped or delivered."

        order.cancel()
        print(f"Order {order_id} has been cancelled.")

        # Tìm và hoàn tiền nếu đã thanh toán
        payment = self.payment_repo.get_payment_by_order_id(order_id)
        if payment and payment.status == "paid":
            payment.refund()
            print(f"Payment {payment.payment_id} refunded for Order {order_id}.")
```

Cách các Service hoạt động cùng nhau trong một nghiệp vụ:

```
# main.py
from order_service import OrderService
from payment_service import PaymentService
from shipping_service import ShippingService

from order_repository import OrderRepository
from payment_repository import PaymentRepository
from shipping_repository import ShippingRepository

# Khởi tạo các Repository và Service
order_repo = OrderRepository()
payment_repo = PaymentRepository()
shipping_repo = ShippingRepository()

order_service = OrderService(order_repo)
payment_service = PaymentService(payment_repo)
shipping_service = ShippingService(shipping_repo)

# Tạo đơn hàng mới
order = order_service.create_order("John Doe", ["item1", "item2"])

# Xử lý thanh toán cho đơn hàng
payment = payment_service.process_payment(order.order_id, 100.0)
order_service.mark_order_as_paid(order.order_id)

# Tạo thông tin giao hàng và cập nhật trạng thái
shipping = shipping_service.create_shipping(order.order_id, "123 Main St")
order_service.mark_order_as_shipped(order.order_id)

# Hủy đơn hàng và hoàn tiền nếu cần
try:
    order_service.cancel_order(order.order_id)
    payment_service.refund_payment(order.order_id)
except Exception as e:
    print(e)
```

Với từng nghiệp vụ cụ thể như đơn hàng, thanh toán, và giao hàng, chúng ta có các Service và Repository riêng biệt. Khi có yêu cầu thay đổi hoặc bổ sung nghiệp vụ mới (như thêm quy trình kiểm tra trước khi thanh toán hoặc giao hàng), các thay đổi chỉ cần thực hiện trong Service liên quan mà không làm ảnh hưởng đến toàn bộ hệ thống.

Bằng cách áp dụng DDD, hệ thống trở nên linh hoạt, dễ bảo trì và dễ dàng đáp ứng các yêu cầu nghiệp vụ phức tạp hơn, so với khi logic nghiệp vụ bị tích hợp trong một Controller duy nhất như trong mô hình MVC truyền thống.

## 4. Khi nào nên sử dụng DDD?

DDD không phải là "silver bullet" cho tất cả các dự án, hãy cùng mình điểm qua các trường hợp nên và không nên áp dụng DDD nhé

- Hệ thống có nghiệp vụ phức tạp và thay đổi thường xuyên: DDD phù hợp khi hệ thống phải xử lý các nghiệp vụ phức tạp và liên tục thay đổi. DDD giúp tách biệt logic nghiệp vụ thành các Bounded Contexts, giúp dễ dàng điều chỉnh và mở rộng từng phần mà không ảnh hưởng đến toàn bộ hệ thống.
- Các hệ thống sử dụng kiến trúc microservices: Khi áp dụng vào microservices, mỗi Bounded Context có thể trở thành một microservice độc lập, được xây dựng xung quanh một tập hợp các nghiệp vụ cụ thể: Order Management, Payment Processing, Shipping Management
- Hệ thống lớn và phát triển lâu dài: Đối với các dự án lớn cần nhiều thời gian hoàn thiện cũng như triển khai, DDD giúp phân chia rõ ràng ứng dụng vào các Bounded Contexts, dễ dàng cho việc mở rộng cũng như maitain sau này

Với các dự án đơn giản, ngắn hạn, ít yêu cầu phức tạp hay thay đổi nghiệp vụ thường xuyên, DDD có thể gây tốn kém thời gian và công sức mà không mang lại lợi ích gì nhiều.

## 5. Kết luận

Domain-Driven Design (DDD) cung cấp một lối tiếp cận có hệ thống cho những ứng dụng cần xử lý nghiệp vụ phức tạp, nơi tính rõ ràng, nhất quán và khả năng mở rộng là yếu tố quan trọng.
