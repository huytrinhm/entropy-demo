# entropy-demo
Minh họa vòng thi tăng tốc theo format chương trình Đường lên đỉnh Olympia

## Live demo
Vui lòng chọn server nhanh nhất để có được trải nghiệm tốt nhất.
- IBM Cloud Foundry (khuyên dùng): https://entropy-demo.us-south.cf.appdomain.cloud/
- Heroku app: https://huytrinhm-entropy-demo.herokuapp.com/
- opeNode: https://entropy-demo.openode.io/

## Cài đặt
### Yêu cầu kĩ thuật
- Node.js >= 14.0.0

### Tải hoặc clone project
```
git clone https://github.com/huytrinhm/entropy-demo.git
cd entropy-demo
```

### Cài đặt các dependencies
```
npm install
```

### Chạy web
```
node app.js
```

## Các tính năng và bộ phận
### Quản lí
- Bắt đầu/dừng khẩn cấp trận đấu
- Xem các đáp án và thời gian trả lời lần lượt của từng thí sinh theo thời gian thực
- Chấm đáp án

### Thí sinh
- Trả lời câu hỏi chuỗi hình ảnh
- Xem tổng kết đáp án và tổng kết điểm sau khi hết thời gian trả lời

### Khán giả
- Theo dõi câu hỏi chuỗi hình ảnh
- Xem tổng kết đáp án và tổng kết điểm sau khi hết thời gian trả lời

## Cách tính điểm
- Điểm sẽ được tính dựa trên đáp án cuối cùng của mỗi thí sinh, người đầu tiên đúng được 40 điểm, các người sau lần lượt được 30-20-10 điểm nếu đúng.
- Thời gian được tính tương tự với chương trình Đường lên đỉnh Olympia - làm tròn đến 2 chữ số thập phân. Các thí sinh trả lời đúng với thời gian bằng nhau sẽ có bằng điểm, chênh lệch điểm số giữa 2 thí sinh trả lời đúng liền kề luôn bé hơn 10 điểm.
- Ví dụ: Thí sinh 1 và 2 trả lời đúng cùng thời gian, thí sinh 3 trả lời chậm hơn thí sinh 1 và 2, thí sinh 4 trả lời đúng và nhanh nhất, điểm số của 4 thí sinh lần lượt là 30-30-20-40

## Lưu ý
- Cần có ít nhất 1 thí sinh đang kết nối để bắt đầu trận đấu
- Vòng thi sẽ tự động kết thúc nếu không còn tab quản lí nào đang mở
