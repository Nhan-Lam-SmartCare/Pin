# 🚀 HƯỚNG DẪN SỬ DỤNG PHIẾU NHẬP KHO MỚI

## 📍 Truy cập

### Desktop

Từ trang Vật liệu → Nút **"Nhập kho"** → Tự động chuyển đến `/materials/goods-receipt/new`

### Direct URL

```
http://localhost:3004/#/materials/goods-receipt/new
```

---

## ✨ TÍNH NĂNG MỚI

### 1️⃣ **Modal thêm Nhà cung cấp**

- ✅ Nút **[+]** bên cạnh dropdown NCC
- ✅ Form gọn nhẹ: Tên (\*), SĐT, Địa chỉ, Email, Ghi chú
- ✅ Lưu và tự động chọn NCC vừa tạo
- ✅ Responsive mobile

### 2️⃣ **Modal thêm Sản phẩm**

- ✅ Xuất hiện khi:
  - Bấm **"Tạo sản phẩm mới"** trong dropdown
  - Không tìm thấy sản phẩm khi search
- ✅ Form thông minh:
  - Tên sản phẩm (\*)
  - Mã SKU (tự động nếu bỏ trống)
  - Đơn vị (dropdown: cái, chiếc, bộ, hộp, kg, lít)
  - Giá nhập (\*) - nổi bật màu cam
  - Giá bán lẻ (tự động +20% nếu bỏ trống)
  - Giá bán sỉ (tự động +10% nếu bỏ trống)
- ✅ Lưu và tự động thêm vào phiếu nhập

### 3️⃣ **Responsive Mobile**

- ✅ Header: Stack vertical trên mobile
- ✅ Bảng: Scroll horizontal với max-width
- ✅ Footer: Stack 1 cột trên mobile
- ✅ Nút "Quay lại": Sticky top-left
- ✅ Modal: Full screen trên mobile nhỏ

### 4️⃣ **Navigation Integration**

- ✅ Route mới: `/materials/goods-receipt/new`
- ✅ Route cũ: `/materials/goods-receipt/old` (backup)
- ✅ Nút **"Quay lại"** → `/materials`
- ✅ Sử dụng `useNavigate()` từ React Router

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile */
< 768px (md)
- Header: 1 cột
- Footer: 1 cột (Ghi chú trên, Tổng kết dưới)
- Bảng: Scroll ngang
- Nút [+]: Icon only

/* Tablet */
768px - 1024px (lg)
- Header: 2 cột (NCC + Ngày/Kho)
- Footer: 2 cột bất đối xứng

/* Desktop */
> 1024px (lg)
- Header: 4 cột
- Footer: 3 cột (1/3 - 2/3)
- Tất cả tính năng hiện đầy đủ
```

---

## 🎯 WORKFLOW SỬ DỤNG

### Bước 1: Chọn Nhà cung cấp

```
1. Gõ tên NCC vào dropdown
2. Chọn từ danh sách
3. HOẶC bấm [+] để thêm NCC mới
   → Modal hiện ra
   → Điền thông tin
   → Lưu → Tự động chọn
```

### Bước 2: Thêm sản phẩm

```
CÁCH 1: Tìm kiếm có sẵn
1. Gõ tên/SKU vào thanh tìm kiếm
2. Dropdown hiện gợi ý
3. Click chọn → Tự động thêm vào bảng

CÁCH 2: Nhấn Enter
1. Gõ tên sản phẩm
2. Nhấn Enter
3. Nếu tìm thấy → Thêm vào bảng
4. Nếu không → Tạo sản phẩm mới

CÁCH 3: Tạo sản phẩm mới
1. Trong dropdown, bấm "Tạo sản phẩm mới"
2. HOẶC khi không tìm thấy, bấm nút trong dropdown
3. Modal hiện ra
4. Điền thông tin
5. Lưu → Tự động thêm vào phiếu
```

### Bước 3: Điều chỉnh thông tin

```
- Đơn vị: Click vào ô để sửa
- Giá nhập: Nhập số (NỔI BẬT màu cam)
- Số lượng: Dùng nút [-] [+] hoặc gõ số
- Xóa: Bấm icon 🗑️
```

### Bước 4: Cập nhật giá bán (Tùy chọn)

```
1. Mở rộng "📊 Cập nhật giá bán"
2. Nhập Giá bán lẻ / Giá bán sỉ
3. Nếu bỏ trống → Tự động tính từ giá nhập
```

### Bước 5: Thanh toán

```
1. Chọn Phương thức: 💵 Tiền mặt | 🏦 Chuyển khoản
2. Nhập "Số tiền trả ngay"
3. Hệ thống TỰ ĐỘNG:
   - ✅ ≥ Tổng → "Đã thanh toán đủ"
   - ⚠️ 0 < x < Tổng → "Hoàn thành một phần" + Hiện "Còn nợ"
   - ❌ = 0 → "Chưa thanh toán"
```

### Bước 6: Hoàn tất

```
Bấm nút [✅ Hoàn tất nhập kho]
→ Cập nhật stock vào kho
→ Tạo giao dịch tiền mặt (nếu có)
→ Ghi nhận công nợ (nếu còn nợ)
→ Quay về /materials
```

---

## 🔥 SHORTCUTS & TIPS

### Keyboard Shortcuts

- `Enter` trong thanh tìm kiếm → Thêm sản phẩm
- `Tab` → Di chuyển giữa các ô
- `Esc` → Đóng modal

### Tips

1. **Thêm nhanh nhiều sản phẩm**:
   - Gõ tên → Enter → Gõ tiếp → Enter
2. **Tính giá bán tự động**:
   - Chỉ cần nhập Giá nhập
   - Giá bán tự động +20% (lẻ) / +10% (sỉ)
3. **Kiểm tra tồn kho**:
   - Dropdown hiển thị "Tồn: X cái"
4. **Công nợ thông minh**:
   - KHÔNG CẦN chọn "Nợ NCC"
   - Hệ thống tự nhận diện khi nhập số tiền < Tổng

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Vui lòng chọn nhà cung cấp"

→ Dropdown NCC chưa chọn hoặc bị reset
→ **Fix**: Chọn lại NCC từ dropdown

### Lỗi: "Vui lòng nhập giá nhập cho tất cả sản phẩm"

→ Có sản phẩm trong bảng chưa nhập giá
→ **Fix**: Kiểm tra cột "Giá nhập" (màu cam), nhập số > 0

### Modal không đóng được

→ Click vào nền đen bên ngoài HOẶC nút [X]
→ **Fix**: Refresh trang nếu bị stuck

### Sản phẩm không thêm vào bảng

→ Kiểm tra console log (F12)
→ **Fix**: Đảm bảo tên sản phẩm không rỗng

---

## 📊 DEMO DATA

### Nhà cung cấp mẫu

```
Tên: Pin Nhập Khẩu JSC
SĐT: 0912 345 678
Địa chỉ: 123 Lê Lợi, Q1, TP.HCM
```

### Sản phẩm mẫu

```
Tên: Pin Lithium 18650
SKU: PIN18650-LI
Đơn vị: cái
Giá nhập: 150,000
Giá bán lẻ: 180,000 (tự động)
Giá bán sỉ: 165,000 (tự động)
```

### Phiếu nhập mẫu

```
NCC: Pin Nhập Khẩu JSC
Ngày: 21/11/2025
Kho: Kho chính

Sản phẩm:
- Pin 18650: 100 cái × 150,000 = 15,000,000
- Sạc nhanh: 20 cái × 280,000 = 5,600,000

Tổng: 20,600,000
Trả ngay: 15,000,000
Còn nợ: 5,600,000
→ Trạng thái: ⚠️ Hoàn thành một phần
```

---

## 🔄 MIGRATION TỪ PHIẾU CŨ

### Điểm khác biệt

| Tính năng | Phiếu cũ          | Phiếu mới         |
| --------- | ----------------- | ----------------- |
| Layout    | Dọc, nhiều bước   | 3 khu vực rõ ràng |
| Thêm SP   | Bấm nút [+]       | Gõ + Enter        |
| Giá nhập  | Lẫn với giá bán   | Nổi bật màu cam   |
| Công nợ   | Chọn radio button | Tự động tính      |
| Modal     | Không có          | Có (NCC + SP)     |
| Mobile    | Không tối ưu      | Responsive đầy đủ |

### Dữ liệu tương thích

✅ Nhà cung cấp: 100% tương thích
✅ Sản phẩm: 100% tương thích  
✅ Giao dịch: 100% tương thích
✅ Công nợ: 100% tương thích

### Rollback

Nếu cần quay lại phiếu cũ:

```
URL: /#/materials/goods-receipt/old
```

---

## 📞 HỖ TRỢ

### Báo lỗi

- Kiểm tra Console (F12) → Tab Console
- Screenshot lỗi
- Ghi lại các bước tái hiện

### Request tính năng mới

- Phản hồi tại: GitHub Issues
- Email: support@pincorp.vn

---

**Version:** 2.0.0  
**Last Updated:** 21/11/2025  
**Status:** ✅ Production Ready
