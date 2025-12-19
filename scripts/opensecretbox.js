// Open Secret Box JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Hiện ngày đã chọn từ trang giới thiệu
    const picked = localStorage.getItem('secret_free_date');
    const el = document.getElementById('pickedDate');
    if (picked) {
        el.textContent = "📅 Ngày bạn đăng ký tham gia: " + picked;
    } else {
        el.textContent = "📅 Bạn chưa chọn ngày ở trang giới thiệu (có thể quay lại chọn).";
    }

    // Random quà theo tỉ lệ - phù hợp với Echoes
    const gifts = [
        { name: "Voucher giảm giá 50% vé Concert", chance: 5 },
        { name: "Voucher giảm giá 30% vé Nhạc Sống", chance: 15 },
        { name: "Áo thun Echoes Limited Edition", chance: 20 },
        { name: "Móc khóa Echoes + Sticker", chance: 25 },
        { name: "Lời chúc may mắn từ Echoes 🎄", chance: 35 }
    ];

    function randomGift() {
        let rand = Math.random() * 100;
        let sum = 0;
        for (const gift of gifts) {
            sum += gift.chance;
            if (rand <= sum) return gift.name;
        }
        return gifts[gifts.length - 1].name;
    }

    // Xử lý click vào hộp quà
    const giftBox = document.getElementById("giftBox");
    const resultEl = document.getElementById("result");
    let hasOpened = false;

    giftBox.addEventListener("click", function() {
        if (hasOpened) {
            resultEl.textContent = "🎁 Bạn đã mở hộp quà rồi! Mỗi người chỉ được mở 1 lần.";
            return;
        }

        // Thêm hiệu ứng shake
        giftBox.classList.add('shake');
        setTimeout(() => {
            giftBox.classList.remove('shake');
        }, 600);

        // Hiển thị kết quả sau một chút delay
        setTimeout(() => {
            const gift = randomGift();
            resultEl.textContent = "🎉 Chúc mừng! Bạn nhận được: " + gift;
            hasOpened = true;
            
            // Lưu vào localStorage để tránh mở lại
            localStorage.setItem('gift_opened', 'true');
            localStorage.setItem('gift_received', gift);
        }, 300);
    });

    // Kiểm tra xem đã mở quà chưa
    if (localStorage.getItem('gift_opened') === 'true') {
        hasOpened = true;
        const savedGift = localStorage.getItem('gift_received');
        if (savedGift) {
            resultEl.textContent = "🎁 Bạn đã nhận được: " + savedGift;
        }
    }
});

// Snow Effect
function initSnowEffect() {
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-container";
    document.body.appendChild(snowContainer);

    function createSnow() {
        const snow = document.createElement("div");
        snow.textContent = "❄";
        snow.style.position = "absolute";
        snow.style.top = "-20px";
        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.fontSize = (12 + Math.random() * 12) + "px";
        snow.style.opacity = Math.random();
        snow.style.transition = "top linear";
        snow.style.color = "#74070d";
        snowContainer.appendChild(snow);

        const duration = 4000 + Math.random() * 4000;
        setTimeout(() => {
            snow.style.top = window.innerHeight + "px";
        }, 50);

        setTimeout(() => {
            if (snow.parentNode) {
                snow.remove();
            }
        }, duration);
    }

    // Tạo tuyết rơi mỗi 300ms
    setInterval(createSnow, 300);
}

// Khởi tạo hiệu ứng tuyết rơi
document.addEventListener('DOMContentLoaded', initSnowEffect);