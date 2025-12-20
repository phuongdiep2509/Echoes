# HƯỚNG DẪN THÊM ẢNH VENUE LAYOUT

## Bước 1: Chuẩn bị ảnh
1. Lưu ảnh venue layout vào thư mục: `assets/images/venues/`
2. Đặt tên file, ví dụ: `venue-layout.png` hoặc `venue-layout.jpg`

## Bước 2: Cập nhật code để sử dụng ảnh

### Trong file `scripts/seat-booking.js`, tìm method `getVenueImagePath()`:

```javascript
getVenueImagePath() {
    // Thay đổi dòng này:
    return null;
    
    // Thành:
    return 'assets/images/venues/venue-layout.png';
}
```

## Bước 3: Xác định tọa độ các khu vực trên ảnh

### Cách xác định tọa độ:
1. Mở ảnh trong trình duyệt
2. Sử dụng công cụ như: https://www.image-map.net/
3. Vẽ các vùng VIP, Standard, Economy trên ảnh
4. Copy tọa độ

### Cập nhật tọa độ trong method `setupImageMap()`:

```javascript
this.imageMapAreas = [
    // VIP Areas
    { 
        coords: 'x1,y1,x2,y2',  // Thay bằng tọa độ thực tế
        type: 'vip', 
        section: 'vip-front', 
        name: 'VIP Phía Trước' 
    },
    { 
        coords: 'x1,y1,x2,y2', 
        type: 'vip', 
        section: 'vip-center', 
        name: 'VIP Trung Tâm' 
    },
    
    // Standard Areas
    { 
        coords: 'x1,y1,x2,y2', 
        type: 'standard', 
        section: 'standard-left', 
        name: 'Standard Trái' 
    },
    { 
        coords: 'x1,y1,x2,y2', 
        type: 'standard', 
        section: 'standard-right', 
        name: 'Standard Phải' 
    },
    
    // Economy Areas
    { 
        coords: 'x1,y1,x2,y2', 
        type: 'economy', 
        section: 'economy-back', 
        name: 'Economy Phía Sau' 
    }
];
```

## Bước 4: Test

1. Mở trang `seat-booking.html` trong trình duyệt
2. Click vào các khu vực trên ảnh
3. Kiểm tra xem có hiển thị "Đã chọn: [Tên khu vực]" không
4. Kiểm tra giá vé có tính đúng không

## Ví dụ tọa độ:

Nếu ảnh có kích thước 800x600:
- VIP ở giữa trên: `coords: "300,100,500,200"`
- Standard bên trái: `coords: "100,200,250,400"`
- Standard bên phải: `coords: "550,200,700,400"`
- Economy phía sau: `coords: "200,450,600,550"`

## Lưu ý:
- Tọa độ theo format: `"x1,y1,x2,y2"` (góc trên trái, góc dưới phải)
- Có thể dùng shape='poly' cho hình phức tạp
- Đảm bảo các vùng không chồng lên nhau
