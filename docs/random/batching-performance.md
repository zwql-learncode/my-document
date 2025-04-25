---
id: batching-performance
title: Tại sao Batching lại quan trọng
---

# Tại sao Batching lại quan trọng - Ví dụ thực tế về hiệu năng

Nguồn: Bài viết "Why batching matters: Real-world example of performance" của tác giả [Christopher Kujawa](https://medium.com/@zelldon91/why-batching-matters-real-world-example-of-performance-39bd4b3a9350)

Bạn đã bao giờ gặp trường hợp trong đời thực phải thu gom một lượng lớn vật phẩm và di chuyển chúng từ điểm A đến điểm B chưa? Tôi khá chắc là bạn đã từng.

Có thể là bạn đang bỏ bát đũa vào máy rửa chén, gom đồ cho vào máy giặt, chuyển nhà, hoặc đơn giản là sắp xếp lại đống củi như tôi đã từng làm.

Trong mỗi công việc, mỗi ngày, chúng ta thường vô thức tối ưu hiệu năng — ví dụ như mang nhiều món cùng lúc (batching) hoặc chọn đường đi ngắn hơn (giảm latency). Mục tiêu là giảm tổng thời gian cần thiết để hoàn thành công việc. Trong bài viết này, tôi muốn giải thích lý thuyết đằng sau điều đó.

Trong công việc của tôi tại Camunda với vai trò kỹ sư phần mềm, tôi thường xuyên thực hiện benchmark và bàn luận về hiệu năng. Các thuật ngữ như `latency` và `throughput` được dùng liên tục. Tuy nhiên, không phải lúc nào cũng rõ ràng và dễ hình dung chúng có ý nghĩa gì và tương tác với nhau ra sao. Đặc biệt là tầm quan trọng của việc `batching` đúng cách.

Vì tôi có đam mê cá nhân và chuyên môn với chủ đề này, tôi muốn chia sẻ một tình huống thực tế mà tôi từng gặp và dùng nó để giải thích về `latency`, `throughput` và `batching`. Mục tiêu của bài viết là giúp bạn hiểu rõ hơn về mối liên hệ giữa `latency` và `throughput`, cũng như lý do batching lại quan trọng đến vậy.

## Ví dụ thực tế

Một thời gian trước, tôi đã có một THỬ THÁCH (đúng hơn là tôi có hứng). Tôi đã có ý tưởng tuyệt vời để sắp xếp lại củi trong vườn của mình.

Đống củi nằm cạnh nhà kho (điểm A), và tôi muốn chuyển nó ra gần cổng (điểm B).

Đống củi nằm cạnh nhà kho (điểm A), và tôi muốn chuyển nó ra gần cổng (điểm B).
Ban đầu, tôi xách 2–3 khúc củi mỗi lần, đi bộ từ điểm A đến B. Tôi nhanh chóng nhận ra cách này rất không hiệu quả và sẽ mất cực kỳ nhiều thời gian (ít nhất là tôi cảm giác như vậy).

Tôi chợt nhớ ra mình có xe cút kít. Vậy là tôi bắt đầu chất củi lên xe và đẩy qua đẩy lại. Cách làm này hiệu quả hơn hẳn. Trong lúc làm, tôi nhận ra đây là ví dụ hoàn hảo cho batching. Và từ đó tôi nảy ra ý tưởng cho bài viết này.

## Phân tích chi tiết ví dụ

Ta có điểm A, nơi chất củi cũ. Chúng ta muốn chuyển tất cả củi đến điểm B (vị trí mới). Quãng đường từ A đến B mất khoảng 20 giây.

Để đơn giản, chúng ta coi đây là hằng số. Hãy tưởng tượng chúng ta là một con rô-bốt luôn đi rất nhanh, với cùng một tốc độ 🙂. Trong thực tế, điều này không đúng (đặc biệt nếu bạn làm việc với phần mềm và mạng).

## Latency - Độ trễ

Có một số định nghĩa tốt về `latency` (độ trễ) ở ngoài kia, tôi không muốn thay thế chúng, tôi chỉ muốn đưa bạn đến gần hơn với chủ đề này.

Khi chúng ta nói về độ trễ trong ví dụ này, có nghĩa là chúng ta lấy một khúc gỗ từ vị trí A và đi bộ đến vị trí B rồi đặt nó ở đó. Việc này sẽ mất 20 giây.

➡️ Latency = 20 giây cho mỗi log.

Latency càng thấp thì càng tốt. Giá trị Latency lớn là điều chúng ta không mong muốn. Ta luôn muốn giảm latency.

## Throughput - Thông lượng

Thông lượng là số lượng khúc gỗ mà chúng ta có thể di chuyển trong một đơn vị thời gian nhất định. Trong ví dụ của chúng ta, là một (hoặc nhiều) khúc mỗi 20 giây. Thông thường, thông lượng được đo theo giây, có nghĩa là trong trường hợp của chúng ta:

```
Thông lượng (Throughput) = Số lượng đối tượng (Amount of objects) / độ trễ (Latency)
```

Trong ví dụ của chúng ta, điều này có nghĩa là: `1/20 logs/s = 0.05 logs/s`. Thông lượng của chúng ta là 0.05 logs/s. Nói cách khác, chúng ta có thể di chuyển 0.05 logs mỗi giây từ A đến B.

Khác với độ trễ (Latency), đối với thông lượng (Throughput), chúng ta muốn tăng giá trị. Ở đây, giá trị càng cao càng tốt. Nếu độ trễ giảm, thì ngược lại thông lượng sẽ tăng lên (như bạn có thể thấy trong công thức trên).

## Batching - Gom nhóm

Dựa trên công thức trên, chúng ta có thể thấy rằng nếu thay đổi số lượng khúc gỗ mà chúng ta di chuyển, chúng ta có thể tăng thông lượng.

Điều này có nghĩa là khi bắt đầu Batching, chúng ta có thể tăng thông lượng.

Đây là những gì tôi tự nhiên đã làm trong tình huống được mô tả: lấy nhiều hơn một khúc gỗ và ôm chúng vào tay (nó mô tả "Batch" của chúng ta)

Nếu chúng ta lấy ba khúc gỗ cùng một lúc, điều này có nghĩa là `3/20 logs/s = 0.15 logs/s`. Với điều này, chúng ta đã gấp ba lần thông lượng! Nhưng điều này chỉ đúng nếu việc Batching (phân nhóm) không tốn thời gian gì.

Tôi khẳng định rằng bạn đã từng ở trong tình huống này ít nhất một lần, khi gom đồ ăn, quần áo, hay bất cứ thứ gì. Việc gom chúng lại, mang và giữ nhiều đồ hơn (thêm vào nhóm) sẽ tốn một ít thời gian. Chúng ta gọi đó là độ trễ (delay) trước khi bạn bắt đầu công việc chính của mình là mang hay di chuyển chúng đi.

Độ trễ (delay) này được cộng vào tổng độ trễ (Latency) thực tế của mỗi vật phẩm/khúc gỗ mà chúng ta thu gom. Để đơn giản, giả sử mỗi khúc gỗ thêm vào nhóm (batch) tốn 1 giây. Chúng rất nặng, bạn phải nhấc chúng lên, đặt chúng vào nhóm, v.v.

Điều này có nghĩa là Latency bây giờ là một hàm:

```
latency(batch size) = 20s + batch size * 1s
```

### Batch size - Kích thước nhóm

Nếu chúng ta quay lại ví dụ với ba khúc gỗ thay vì một, điều này có nghĩa là độ trễ của chúng ta bây giờ là: 23 giây. Điều này có nghĩa là mất 23 giây để một khúc gỗ di chuyển từ A đến B, vì nó cần phải được đưa vào nhóm (batch) trước, nhóm (batch) cần được lấp đầy cho đến giới hạn của nó (3 logs) rồi mới được di chuyển. Đây là độ trễ tối đa trong trường hợp của chúng ta. Khúc gỗ cuối cùng trong nhóm có thể có độ trễ thấp hơn, nhưng độ trễ tối đa là 23s.

Vì độ trễ (Latency) và kích thước nhóm (Batch size) của chúng ta đã thay đổi, thông lượng (Throughput) của chúng ta cũng thay đổi theo và bây giờ là: 3/23 logs/s ~ 0.13 logs/s

Chúng ta có thể thấy thông lượng được tăng đáng kể - 260% (0.13 logs/s so với trước đó là 0.05 logs/s), trong khi độ trễ tăng 15% (23s so với trước đó là 20s).

### Sử dụng xe cút kít: batch size lớn hơn

Như tôi đã đề cập trước đó, tôi đã sử dụng cút kít, vì vậy chúng ta có thể tăng kích thước nhóm (Batch size) lên nữa, có thể là từ 10–15 khúc gỗ.

Batch size 10 logs - Kích thước nhóm 10 khúc gỗ

- Độ trễ: `20 s + 10 logs * 1 s = 30s` -> tăng 50%
- Thông lượng: `10/30 = ~ 0.333 log/s` -> tăng 666%

Batch size 15 logs - Kích thước nhóm 15 khúc gỗ

- Độ trễ: `20s + 15 logs * 1 s = 35s` -> tăng 75%
- Thông lượng: `15/35 = 3/7 = 0.429 logs/s` -> tăng 858%

## Total Execution Time - Tổng thời gian thực thi

Tùy thuộc vào kịch bản hoặc mục đích sử dụng của bạn, bạn có thể cần xem xét các chỉ số khác nhau và tinh chỉnh chúng cho phù hợp.

Đôi khi độ trễ (latency) của một đối tượng đơn lẻ quan trọng hơn thông lượng của nhiều đối tượng, đôi khi điều quan trọng lại là tổng thời gian thực thi (total execution time).

Trong thế giới phần mềm, bạn thường có dữ liệu bất tận cần xử lý và làm việc với nó. Nhưng trong thực tế thì khác, dữ liệu hay các đối tượng thường có giới hạn. Giống như đống củi của tôi (may là chúng có giới hạn).

Để tính tổng thời gian thực thi (total execution time) mà chúng ta cần để di chuyển mọi thứ từ điểm A đến điểm B, ta có thể dùng công thức sau:

```
total execution time = total amount / batch size * latency(batch size)
```

### Lấy từng khúc gỗ một

Giả sử chúng ta có 200 khúc gỗ trong đống củi và muốn di chuyển hết. Nếu mỗi lần chỉ lấy 1 khúc, thì sẽ mất:

👉 `200 khúc * 20 giây = 4000 giây` (66,666 phút)

→ Sau khoảng 1 tiếng, chúng ta sẽ xong việc di chuyển đống củi.

### Nhóm 3 khúc một lần

Nếu chúng ta tăng kích thước nhóm lên 3 khúc/lần, thì sẽ mất:

👉 `200 / 3 * 23 giây = 1533,33 giây` (25,55 phút)

→ Sau khoảng 25 phút, chúng ta sẽ xong việc.

### Nhóm 10 khúc với xe cút kít

Nếu dùng xe đẩy và chở 10 khúc mỗi lần:

👉 `200 / 10 * 30 giây = 600 giây` (10 phút)

→ Chỉ mất 10 phút để hoàn thành việc di chuyển.

## Vì sao batching lại quan trọng

Chúng ta học điều này một cách tự nhiên từ khi còn nhỏ. Nếu ta mang nhiều hơn mỗi lần và đi ít hơn, ta sẽ nhanh hơn.

Tuy nhiên, cần lưu ý rằng tổng thời gian thực thi (total execution time) sẽ thay đổi nếu Latency (vốn là một hàm của Batch size) tăng quá nhanh hoặc không tuyến tính. Điều này không hiếm — đôi khi độ trễ tăng nhanh hơn cả kích thước nhóm, dẫn đến cái gọi là sự đánh đổi giữa độ trễ và thông lượng (latency/throughput tradeoff).

## Tổng kết

Chúng ta đã thấy rằng độ trễ (latency) và batching (gom nhóm) ảnh hưởng đến thông lượng (throughput) và tổng thời gian thực thi (total execution time). Chúng có mối liên hệ và tương tác lẫn nhau.

Mọi thứ đều là một sự đánh đổi. Mọi thứ đều phụ thuộc vào từng tình huống cụ thể. Đó là nghệ thuật của việc tìm ra điểm cân bằng hợp lý giữa batch sizes, throughput, and good latency.

Trong các hệ thống phần mềm xử lý theo yêu cầu, ta cần giữ sự cân bằng giữa việc phản hồi nhanh, độ trễ chấp nhận được, và thông lượng tốt (có thể xử lý nhiều yêu cầu cùng lúc). Điều này có nghĩa là không hợp lý khi gộp tất cả các yêu cầu mãi mãi và gửi chúng cùng một lúc. May mắn thay, trong phần mềm ta có thể xử lý song song (parallelize), đây là một cách để bù đắp cho độ trễ cao.

Điều này lại khó áp dụng trong thực tế, trừ khi bạn có một gia đình đông người hoặc nhiều bạn bè để nhờ vả. Chúng ta bị giới hạn bởi các quy luật vật lý (trong ví dụ của chúng ta, là không còn chỗ trống trong xe cút kít nữa).

Như chúng ta đã thấy, batching có thể và sẽ gây ra độ trễ bổ sung (introduce delays) ảnh hưởng đến từng đối tượng riêng lẻ — như việc thêm từng khúc gỗ vào. Trong ví dụ của chúng ta, đó không phải vấn đề, vì chỉ số quan trọng là tổng thời gian thực thi (total execution time), và độ trễ (latency) tăng tuyến tính theo kích thước batch.

Tuy nhiên, có những tình huống mà độ trễ (latency) tăng không tuyến tính khi batch size tăng, và điều đó gây ra nhiều rắc rối hơn. Nhìn chung, nếu chúng ta giảm độ trễ (latency) hoặc giữ cho tốc độ tăng độ trễ gần như tuyến tính khi tăng batch size, thì chúng ta có thể cải thiện được throughput (thông lượng).

Hy vọng rằng phần chia sẻ này đã mang lại cho bạn một góc nhìn rõ hơn về mối quan hệ giữa `Latency` (độ trễ) và `Throughput` (thông lượng), cũng như vì sao Batching lại quan trọng.
