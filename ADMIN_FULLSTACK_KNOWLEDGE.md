# 🧠 CƠ SỞ KIẾN THỨC FULLSTACK: ADMIN DASHBOARD & RESOURCES
> **Tài liệu chuyên sâu**: Dành cho Developer muốn hiểu tường tận kiến trúc, luồng dữ liệu và các quyết định kỹ thuật của các module Admin (Dashboard, Categories, Inventory, Reports).

---

## 🏗 Kế Trúc Tổng Quan (Architecture Overview)

Hệ thống tuân theo mô hình **Layered Architecture** (Kiến trúc phân lớp) tiêu chuẩn của NestJS:
`Client (React/Next.js) ➡️ Controller (Validation) ➡️ Service (Business Logic) ➡️ Repository (TypeORM) ➡️ Database (MySQL)`

### � Validation Layer (DTOs)
Trước khi dữ liệu vào được Controller, nó phải đi qua `ValidationPipe`.
- Sử dụng thư viện `class-validator` và `class-transformer`.
- **Tại sao?** Đảm bảo tính toàn vẹn dữ liệu ngay từ cổng vào, tránh "Garbage In, Garbage Out".
- Ví dụ: `CreateInventoryDto` sử dụng `@Min(0)` để đảm bảo số lượng không bao giờ âm.

---

## 1. 📊 MODULE DASHBOARD

### 🔍 Chi Tiết Kỹ Thuật (Deep Dive)

**1. Data Aggregation Strategy (Chiến lược tổng hợp dữ liệu):**
- **Vấn đề**: Dashboard cần load rất nhiều số liệu (Products, Orders, Revenue, Customers) cùng lúc. Nếu chạy tuần tự (await từng cái), latency sẽ rất cao.
- **Giải pháp**: Sử dụng `Promise.all()` trong `getDashboardStats`.
  ```typescript
  const [totalProducts, lowStockProducts] = await Promise.all([...]);
  ```
  -> Giảm thời gian phản hồi xuống bằng request chậm nhất thay vì tổng thời gian của tất cả.

**2. Sparse Data Filling (Lấp đầy dữ liệu thưa):**
- **Vấn đề**: Khi vẽ biểu đồ doanh thu 30 ngày, SQL chỉ trả về những ngày *có đơn hàng*. Nếu frontend vẽ trực tiếp, biểu đồ sẽ bị méo (ngày 1 nối thẳng sang ngày 5).
- **Giải pháp (`getSalesChart`)**:
  1. Query DB lấy dữ liệu thô.
  2. Tạo một vòng lặp `for` chạy đủ 30 ngày từ `startDate` đến `endDate`.
  3. Với mỗi ngày, kiểm tra xem có dữ liệu từ DB không?
     - ✅ Có: Dùng dữ liệu đó.
     - ❌ Không: Điền object mặc định `{ revenue: 0, orders: 0 }`.
  -> Đảm bảo FE luôn nhận được mảng đủ 30 phần tử liên tục.

### ❓ Câu Hỏi Phỏng Vấn (Q&A)

**Q: Tại sao trong Controller lại dùng `+limit` hay `+days`?**
> **A:** Các query param trên URL (`?limit=10`) luôn được nhận dưới dạng `string`. Toán tử `+` là shorthand của `Number()` để ép kiểu sang số nguyên trước khi truyền vào Service, tránh lỗi logic toán học.

**Q: Làm thế nào để truy vấn hiệu quả "Doanh thu tháng này" và "Doanh thu tháng trước"?**
> **A:** Backend tính toán 4 mốc thời gian: `startCurrentMonth`, `endCurrentMonth` (ngày 1 tháng sau), `startPrevMonth`, `startCurrentMonth`.
> Sử dụng `QueryBuilder` với điều kiện: `orderDate >= :start AND orderDate < :end`. Việc dùng toán tử `<` cho ngày đầu tháng sau an toàn hơn dùng `<=` ngày cuối tháng vì tránh việc bỏ sót các đơn hàng đặt vào giây cuối cùng (23:59:59.999).

---

## 2. 📂 MODULE CATEGORIES

### � Chi Tiết Kỹ Thuật (Database Relations)

**Entity: `Category`**
- **Self-Referencing Relation (Quan hệ tự tham chiếu)**:
  - Một danh mục có thể có danh mục cha (`parent`) và nhiều danh mục con (`children`).
  - **TypeORM**: `@ManyToOne` và `@OneToMany` trỏ về chính class `Category`.
- **Cascade Rule: `onDelete: 'SET NULL'`**:
  - **Quyết định**: Khi xóa danh mục Cha, danh mục Con **KHÔNG** bị xóa theo. Thay vào đó, trường `parent_id` của con sẽ về `NULL`.
  - **Lý do**: Tránh việc xóa nhầm một nhánh lớn dữ liệu (xóa mục "Xe Đạp" khiến mất sạch "Xe Địa Hình", "Xe Đua"...). An toàn dữ liệu là ưu tiên hàng đầu.

**Slug Generation (Tạo URL thân thiện):**
- Logic: `Name -> Normalize (NFD) -> Remove Accents -> Lowercase -> Remove Special Chars -> Replace Spaces with '-'`.
- Entity Configuration: `@Column({ unique: true })`. DB sẽ ném lỗi nếu cố tình tạo trùng slug -> Backend phải handle hoặc FE phải validate.

### ❓ Câu Hỏi Phỏng Vấn (Q&A)

**Q: Tại sao khi xóa Category lại phải check bảng Product? (Integrity Check)**
> **A:** Đây là logic nghiệp vụ để ngăn chặn "Orphan Data" (Dữ liệu mồ côi).
> Nếu xóa danh mục "Áo", nhưng vẫn còn 100 sản phẩm đang được gán category là "Áo", thì các sản phẩm đó sẽ bị lỗi hiển thị hoặc logic lọc.
> -> Backend query `count()` bảng Product trước. Nếu `> 0`, ném lỗi `BadRequestException`.

**Q: Tại sao `is_active` lại lưu kiểu `tinyint` trong DB?**
> **A:** MySQL không có kiểu dữ liệu `BOOLEAN` native thực sự. Nó dùng `TINYINT(1)` (0 hoặc 1) để đại diện. TypeORM tự động map `true/false` của JS sang `1/0` của MySQL.

---

## 3. 📦 MODULE INVENTORY

### � Chi Tiết Kỹ Thuật (Critical Logic)

**1. Data Syncing (Đồng bộ dữ liệu - Write Optimization vs Read Optimization)**
- **Kiến trúc**:
  - Bảng `Inventory`: Lưu chi tiết (Product A ở Kho 1 số lượng 5).
  - Bảng `Product`: Lưu tổng (Product A tổng số lượng 5).
- **Read Optimization (Storefront)**: Khách hàng xem list sản phẩm rất nhiều. Nếu mỗi lần xem đều phải `JOIN Inventory` và `SUM()`, DB sẽ quá tải.
- **Write Heavy Strategy**: Mỗi khi cập nhật `Inventory` (Thêm/Sửa/Xóa), Backend gọi hàm `syncProductQuantity`:
  1. Tìm tất cả record Inventory của Product đó.
  2. Tính tổng `SUM(quantity - reserved)`.
  3. Update ngược lại vào trường `quantity` của bảng `Product`.
  -> Chấp nhận ghi chậm một chút để đọc cực nhanh.

**2. Cascade Rule: `onDelete: 'CASCADE'`**:
- Khác với Category, mối quan hệ giữa Inventory và Product là phụ thuộc hoàn toàn.
- Nếu Product bị xóa -> Inventory record đó trở nên vô nghĩa.
- -> Sử dụng `CASCADE` để tự động dọn dẹp rác.

### ❓ Câu Hỏi Phỏng Vấn (Q&A)

**Q: Logic `Available`, `Reserved` và `Quantity` khác nhau thế nào?**
> **A:**
> - `Quantity`: Số lượng thực tế năm trong kho (Physical Stock).
> - `Reserved`: Số lượng khách đã đặt nhưng chưa ship (đang trong quá trình xử lý).
> - `Available (Free Stock)`: Số lượng còn lại có thể bán = `Quantity - Reserved`.
> - Hệ thống bán hàng chỉ cho phép đặt tối đa `Available`.

**Q: Tại sao lại cần trường `min_stock`?**
> **A:** Dùng để kích hoạt các logic cảnh báo tự động hoặc gợi ý nhập hàng. Trên UI sẽ hiển thị màu đỏ/vàng dựa trên việc so sánh `Available < min_stock`.

---

## 4. 📈 MODULE REPORTS

### � Chi Tiết Kỹ Thuật (Advanced SQL & TypeORM)

**1. Conditional Aggregation (Pivot Technique):**
- **Bài toán**: Muốn đếm xem ngày hôm nay có bao nhiêu đơn "Pending", bao nhiêu đơn "Paid".
- **Cách ngây thơ**: Query 2 lần (hoặc N lần cho N trạng thái).
- **Cách tối ưu (Sử dụng trong code)**: Dùng 1 Query duy nhất với toán tử `CASE WHEN`.
  ```sql
  SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
  SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid_count
  ```
- -> Giảm tải DB đáng kể (O(1) request vs O(N) requests).

**2. CSV Export Stream:**
- Sử dụng `res` object của Express trong NestJS controller (`@Res()`).
- Set Headers quan trọng để browser hiểu đây là file download:
  - `Content-Type: text/csv; charset=utf-8`
  - `Content-Disposition: attachment; filename="..."`
- Nội dung file được generate thủ công bằng string manipulation (nối chuỗi với dấu phẩy) -> Đơn giản, nhanh, không cần thư viện nặng nề.

### ❓ Câu Hỏi Phỏng Vấn (Q&A)

**Q: Sự khác nhau giữa `QueryBuilder` và `Repository.find()`? Khi nào dùng cái nào?**
> **A:**
> - `Repository.find()`: Dùng cho các query đơn giản, CRUD cơ bản, quan hệ `relations` rõ ràng. Code gọn, dễ đọc.
> - `QueryBuilder`: Dùng cho các query phức tạp cần `GROUP BY`, Aggregate Functions (`SUM`, `COUNT`), báo cáo thống kê, hoặc join nhiều bảng với điều kiện filter custom. Module Reports gần như dùng 100% QueryBuilder.

**Q: Tại sao Group By Month lại dùng `DATE_FORMAT` trong SQL?**
> **A:** SQL lưu datetime chính xác đến giây. Để nhóm theo tháng, ta cần quy tất cả các ngày trong tháng về cùng một giá trị (ví dụ: ngày 1). `DATE_FORMAT(date, '%Y-%m-01')` biến `2023-12-15` thành `2023-12-01`. Như vậy `GROUP BY` mới gom nhóm chính xác được.

---

## 5. 📐 SYSTEM DESIGN & UML (Phụ lục)

### 🔍 Sequence Diagram vs Activity Diagram

| Đặc điểm | Sequence Diagram (Biểu đồ Tuần tự) | Activity Diagram (Biểu đồ Hoạt động) |
| :--- | :--- | :--- |
| **Trọng tâm** | **Tương tác (Interaction)**: Ai gọi ai? Thứ tự tin nhắn là gì? | **Luồng xử lý (Workflow)**: Việc gì làm trước, việc gì làm sau? |
| **Trục thời gian** | Quan trọng (từ trên xuống dưới). | Không quá nhấn mạnh thời gian, chỉ quan tâm thứ tự logic. |
| **Thành phần** | Objects (User, FE, Controller, DB), Lifelines, Messages. | Activities (Actions), Decisions (Diamond), Fork/Join. |
| **Khi nào dùng?** | Khi muốn mô tả **API Flow**: Request từ FE đi qua những lớp nào của Backend. | Khi muốn mô tả **Business Logic**: Thuật toán tính toán, quy trình duyệt đơn hàng (Nếu A thì B, ngược lại C). |

**Ví dụ trong dự án:**
- **Sequence**: Mô tả luồng `getDashboardStats()`: *FE gọi API -> Controller gọi Service -> Service gọi 5 query song song vào Repository -> Repository trả Data -> Service tổng hợp -> Trả về FE.*
- **Activity**: Mô tả luồng logic `createInventory()`: *Nhập dữ liệu -> Validate (số lượng < 0?) -> Lưu vào bảng Inventory -> Tính toán tổng tồn kho mới -> Update số lượng vào bảng Product.*

### ❓ Câu Hỏi Phỏng Vấn (Q&A)

**Q: Khi thiết kế tính năng "Thanh toán", bạn sẽ dùng biểu đồ nào để trao đổi với team?**
> **A:**
> - Dùng **Activity Diagram** để chốt quy trình nghiệp vụ với PM/BA (Product Manager): *Khách ấn nút -> Check thẻ -> Trừ tiền -> Update đơn hàng -> Gửi Email*. Dễ hiểu cho người không chuyên kỹ thuật.
> - Dùng **Sequence Diagram** để hướng dẫn Dev code: *FE POST `/payment` -> PaymentController -> StripeService -> Stripe API -> Webhook -> OrderService*. Chi tiết hóa từng function call.

**Q: Tại sao trong tài liệu kỹ thuật (Technical Spec) thường yêu cầu cả hai?**
> **A:** Vì chúng bổ trợ cho nhau. Activity Diagram cho ta cái nhìn "Rừng" (Tổng quan quy trình), còn Sequence Diagram cho ta cái nhìn "Cây" (Chi tiết cài đặt). Thiếu Activity thì không hiểu nghiệp vụ, thiếu Sequence thì không biết code sao cho đúng kiến trúc.
