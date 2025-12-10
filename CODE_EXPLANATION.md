# Giải Thích Chi Tiết Code: Dashboard, Categories, Inventory, và Reports

Tài liệu này cung cấp giải thích chi tiết về mã nguồn (Source Code) cho các module quan trọng trong hệ thống quản lý xe đạp: **Dashboard** (Bảng điều khiển), **Categories** (Danh mục), **Inventory** (Kho hàng), và **Reports** (Báo cáo). Phân tích bao gồm cả Frontend (Next.js) và Backend (NestJS).

---

## 1. Module Dashboard (Bảng Điều Khiển)

Module này cung cấp cái nhìn tổng quan về tình hình kinh doanh, bao gồm các chỉ số thống kê, biểu đồ doanh thu và danh sách sản phẩm/khách hàng tiêu biểu.

### 1.1. Frontend (`src/app/(admin)/dashboard/page.tsx`)

Trang Dashboard được xây dựng để hiển thị dữ liệu ngay khi tải trang.

*   **Logic chính**:
    *   **State Management**: Sử dụng `useState` để lưu trữ `stats` (thống kê tổng quan), `salesData` (dữ liệu biểu đồ), `topProducts` (sản phẩm bán chạy) và `recentOrders` (đơn hàng gần đây).
    *   **Data Fetching**:
        *   Sử dụng `useEffect` để gọi API khi trang được mount.
        *   Hàm `fetchDashboardData` thực hiện các cuộc gọi song song (`Promise.all`) đến các endpoint backend để lấy dữ liệu nhanh chóng.
    *   **Hiển thị (UI)**:
        *   Top Cards: Hiển thị 4 thẻ thông tin quan trọng: Tổng doanh thu, Đơn hàng, Khách hàng, Sản phẩm. Mỗi thẻ có icon và màu sắc riêng biệt.
        *   **Biểu đồ (Chart)**: Sử dụng thư viện `react-chartjs-2` (dựa trên Chart.js) để vẽ biểu đồ đường (Line Chart) thể hiện doanh thu theo thời gian.
        *   **Bảng (Tables)**: Hai bảng nhỏ hiển thị "Top Selling Products" (Sản phẩm bán chạy) và "Recent Orders" (Đơn hàng mới nhất) để người quản lý nắm bắt nhanh tình hình.

### 1.2. Backend (`src/modules/dashboard/*`)

Backend chịu trách nhiệm tổng hợp dữ liệu từ nhiều nguồn (Orders, Products, Customers).

*   **Controller (`dashboard.controller.ts`)**:
    *   Định nghĩa các API endpoint:
        *   `GET /dashboard/metrics`: Trả về các số liệu tổng quan (Tổng doanh thu, số đơn hàng...).
        *   `GET /dashboard/sales-chart`: Trả về dữ liệu cho biểu đồ doanh thu, hỗ trợ tham số `days` (mặc định 30 ngày).
        *   `GET /dashboard/top-products`: Trả về danh sách sản phẩm bán chạy.
        *   `GET /dashboard/recent-orders`: Trả về danh sách đơn hàng mới nhất.

*   **Service (`dashboard.service.ts`)**:
    *   `getMetrics()`: Sử dụng `QueryBuilder` hoặc `count/sum` từ các repository (`OrderRepository`, `CustomerRepository`, `ProductRepository`) để tính toán. Doanh thu thường được tính bằng tổng `totalAmount` của các đơn hàng có trạng thái 'Paid' hoặc 'Completed'.
    *   `getSalesChart(days)`: Thực hiện truy vấn SQL phức tạp để nhóm doanh thu theo ngày (`GROUP BY DATE(order_date)`). Dữ liệu này được format chuẩn để Frontend dễ dàng vẽ biểu đồ.

---

## 2. Module Categories (Quản Lý Danh Mục)

Module này cho phép quản lý phân loại sản phẩm, giúp tổ chức kho hàng khoa học.

### 2.1. Frontend (`src/app/(admin)/categories/page.tsx`)

Giao diện quản lý danh mục dạng bảng (Table) với các chức năng thêm, sửa, xóa.

*   **Logic chính**:
    *   **Danh sách**: Hiển thị bảng danh mục gồm ID, Tên, Mô tả, và nút hành động.
    *   **Tìm kiếm & Lọc**: Có thanh tìm kiếm (Search bar) để lọc danh mục theo tên ngay tại client (hoặc gọi API search).
    *   **Modal Form**: Sử dụng Modal (cửa sổ bật lên) để Thêm mới hoặc Chỉnh sửa danh mục. Form này reset dữ liệu khi đóng hoặc khi chuyển chế độ (Add -> Edit).
    *   **Xử lý xóa**: Khi bấm nút Xóa, sẽ có bước xác nhận (confirm) để tránh xóa nhầm.

### 2.2. Backend (`src/modules/categories/*`)

Xử lý logic nghiệp vụ CRUD (Create, Read, Update, Delete) cho danh mục.

*   **Controller (`categories.controller.ts`)**:
    *   Cung cấp các chuẩn RESTful API: `POST /categories`, `GET /categories`, `GET /categories/:id`, `PATCH /categories/:id`, `DELETE /categories/:id`.
    *   Sử dụng DTO (`CreateCategoryDto`, `UpdateCategoryDto`) để validate dữ liệu đầu vào.

*   **Service (`categories.service.ts`)**:
    *   `create()`: Tạo mới danh mục. Có thể xử lý logic danh mục cha-con (parent category) nếu hệ thống hỗ trợ đa cấp.
    *   `remove(id)`: **Điểm quan trọng**: Trước khi xóa danh mục, Service kiểm tra xem có sản phẩm nào đang thuộc danh mục này không.
        *   Nếu có: Ném lỗi `BadRequestException` để ngăn chặn việc xóa, đảm bảo toàn vẹn dữ liệu (không để sản phẩm bị "mồ côi" danh mục).
        *   Nếu không: Cho phép xóa.

---

## 3. Module Inventory (Quản Lý Kho Hàng)

Quản lý số lượng tồn kho của từng sản phẩm, nhập hàng và điều chỉnh số lượng.

### 3.1. Frontend (`src/app/(admin)/inventory/page.tsx`)

Trang này tập trung vào việc theo dõi số lượng tồn.

*   **Logic chính**:
    *   **Bảng tồn kho**: Hiển thị Tên sản phẩm, Danh mục, Số lượng hiện tại (Quantity), Số lượng đã đặt (Reserved - nếu có), và Trạng thái (Stock Status: Còn hàng/Hết hàng/Sắp hết).
    *   **Cảnh báo**: Sử dụng màu sắc (Đỏ/Vàng/Xanh) để làm nổi bật các sản phẩm có số lượng thấp dưới mức quy định (Low Stock).
    *   **Chức năng điều chỉnh**: Có thể cung cấp nút để cập nhật nhanh số lượng (ví dụ: Nhập thêm hàng).

### 3.2. Backend (`src/modules/inventory/*`)

Logic quản lý kho phức tạp hơn CRUD thông thường vì nó liên quan đến đồng bộ dữ liệu.

*   **Service (`inventory.service.ts`)**:
    *   `adjustQuantity(id, delta)`: Hàm tăng/giảm số lượng tồn kho.
    *   **Cơ chế đồng bộ (`syncProductQuantity`)**:
        *   Khi số lượng trong bảng `Inventory` thay đổi, hệ thống tự động cập nhật lại trường `quantity` hoặc `status` trong bảng `Product` chính. Điều này giúp khi khách hàng xem sản phẩm ở trang chủ, họ thấy đúng số lượng khả dụng mà không cần join bảng Inventory mỗi lần.
    *   `checkLowStock()`: Logic (có thể chạy định kỳ hoặc khi gọi API) để tìm các sản phẩm dưới mức `min_stock`.

---

## 4. Module Reports (Báo Cáo & Thống Kê)

Module mạnh mẽ nhất cho việc phân tích, cho phép trích xuất dữ liệu chi tiết.

### 4.1. Frontend (`src/app/(admin)/reports/page.tsx`)

Giao diện linh hoạt cho phép người dùng chọn loại báo cáo và khoảng thời gian.

*   **Logic chính**:
    *   **Tabs/Selector**: Cho phép chọn giữa các loại báo cáo:
        1.  **Revenue** (Doanh thu)
        2.  **Orders** (Đơn hàng)
        3.  **Inventory** (Tồn kho)
    *   **Date Range Picker**: Cho phép chọn "Từ ngày" - "Đến ngày" để lọc dữ liệu chính xác.
    *   **Data Visualization**: Dữ liệu báo cáo được hiển thị dưới dạng Bảng chi tiết bên dưới bộ lọc.
    *   **Export CSV**: Nút "Export CSV" gọi API backend để tải về file `.csv`, giúp kế toán hoặc quản lý dễ dàng mở bằng Excel.

### 4.2. Backend (`src/modules/reports/*`)

Sử dụng các câu lệnh SQL nâng cao (Aggregation) để xử lý dữ liệu thô thành thông tin có ý nghĩa.

*   **Controller (`reports.controller.ts`)**:
    *   Nhận các tham số `from`, `to`, `type` từ query string.
    *   Endpoint `GET /reports/export` trả về dữ liệu dạng stream hoặc file text để trình duyệt tải xuống.

*   **Service (`reports.service.ts`)**:
    *   `getRevenueReport(groupBy, from, to)`:
        *   Sử dụng `QueryBuilder` để `SUM(totalAmount)` và `COUNT(id)`.
        *   Nhóm (Group By) theo Ngày, Tháng hoặc Năm tùy thuộc vào tham số.
    *   `getOrdersReport(from, to)`:
        *   Thống kê số lượng đơn hàng theo từng trạng thái (Pending, Paid, Shipped, Cancelled) trong khoảng thời gian.
        *   Sử dụng `CASE WHEN` trong SQL để đếm có điều kiện: `SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END)`.
    *   `getInventoryReport()`:
        *   Tính toán: `Available = Quantity - Reserved`.
        *   Xác định cờ `belowMin` (Dưới định mức) nếu `Available < MinStock`.
    *   `exportCsv()`:
        *   Chuyển đổi dữ liệu JSON từ các hàm trên thành chuỗi String định dạng CSV (Comma Separated Values).
        *   Xử lý các ký tự đặc biệt (như dấu phẩy trong tên sản phẩm) để không làm vỡ format CSV.

---

## Tóm Lược Luồng Dữ Liệu (Data Flow)

1.  **User (Admin)** thao tác trên giao diện Dashboard/Report.
2.  **Frontend** gửi request HTTP (GET/POST) kèm theo filter (ngày tháng, danh mục) tới Backend.
3.  **Backend (Controller)** nhận request, validate dữ liệu (DTO), và gọi Service tương ứng.
4.  **Backend (Service)** thực thi logic nghiệp vụ, gọi Repository để truy vấn Database (MySQL/PostgreSQL) bằng TypeORM.
5.  **Database** trả về dữ liệu thô.
6.  **Backend (Service)** tính toán, tổng hợp (Aggregation), format dữ liệu.
7.  **Backend** trả kết quả JSON (hoặc file CSV) về cho Frontend.
8.  **Frontend** render dữ liệu lên màn hình (Biểu đồ, Bảng) cho người dùng xem.
