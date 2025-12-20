// Open Secret Box JavaScript - Clean Random System

document.addEventListener('DOMContentLoaded', function() {
    // Danh sách quà với tỉ lệ trúng (phù hợp với secretbox.html)
    const gifts = [
        { 
            name: "🎫 Voucher 500.000đ", 
            chance: 10,
            description: "Voucher giảm giá trị giá 500.000đ cho vé concert và nhạc sống",
            code: "ECHOES500"
        },
        { 
            name: "👕 Áo thun Noel", 
            chance: 20,
            description: "Áo thun Giáng sinh độc quyền với thiết kế đặc biệt từ Echoes",
            code: "NOEL2024"
        },
        { 
            name: "🔑 Móc khóa lưu niệm", 
            chance: 30,
            description: "Móc khóa kim loại cao cấp với logo Echoes và sticker đi kèm",
            code: "KEYCHAIN"
        },
        { 
            name: "🎄 Lời chúc may mắn", 
            chance: 40,
            description: "Lời chúc đặc biệt từ đội ngũ Echoes cùng voucher 10% lần sau",
            code: "LUCKY10"
        }
    ];

    // Hàm random quà theo tỉ lệ
    function randomGift() {
        const rand = Math.random() * 100;
        let sum = 0;
        
        for (const gift of gifts) {
            sum += gift.chance;
            if (rand < sum) {
                return gift;
            }
        }
        
        // Fallback về quà cuối cùng
        return gifts[gifts.length - 1];
    }

    // Kiểm tra đã mở quà chưa
    function hasOpenedGift() {
        return localStorage.getItem('gift_opened') === 'true';
    }

    // Lưu thông tin đã mở quà
    function saveGiftOpened(gift) {
        localStorage.setItem('gift_opened', 'true');
        localStorage.setItem('gift_received', JSON.stringify(gift));
        localStorage.setItem('gift_opened_time', new Date().toISOString());
    }

    // Lấy thông tin quà đã nhận
    function getSavedGift() {
        const savedGift = localStorage.getItem('gift_received');
        if (savedGift) {
            try {
                return JSON.parse(savedGift);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Hiển thị kết quả quà
    function showGiftResult(gift, isAlreadyOpened = false) {
        const resultEl = document.getElementById("resultDisplay");
        const resultContent = resultEl.querySelector('.result-content');
        
        const title = isAlreadyOpened ? " Bạn đã nhận được:" : "🎉 Chúc mừng!";
        
        resultContent.innerHTML = `
            <h2>${title}</h2>
            <p>Bạn nhận được <strong>${gift.name}</strong></p>
            <p style="font-size: 0.9rem; color: #666;">${gift.description}</p>
            <div class="voucher-code">
                <span>Mã: ${gift.code}</span>
            </div>
        `;
        
        resultEl.classList.add('show');
        
        if (!isAlreadyOpened) {
            createFireworks();
        }
    }

    // Xử lý mở hộp quà
    const giftBox = document.getElementById("giftBox");
    const resultEl = document.getElementById("resultDisplay");

    giftBox.addEventListener("click", function() {
        // Kiểm tra đã mở quà chưa
        if (hasOpenedGift()) {
            alert("🎁 Bạn đã mở quà rồi! Mỗi người chỉ được mở 1 lần duy nhất.");
            return;
        }

        // Hiệu ứng mở hộp quà
        giftBox.classList.add('opening');

        // Random quà và hiển thị kết quả
        setTimeout(() => {
            const gift = randomGift();
            
            // Lưu thông tin đã mở quà
            saveGiftOpened(gift);
            
            // Hiển thị kết quả
            showGiftResult(gift, false);
            
        }, 1200);
    });

    // Kiểm tra khi load trang - nếu đã mở quà thì hiển thị kết quả
    if (hasOpenedGift()) {
        const savedGift = getSavedGift();
        if (savedGift) {
            giftBox.classList.add('opening');
            showGiftResult(savedGift, true);
        }
    }

    // Tạo hiệu ứng pháo hoa
    function createFireworks() {
        const fireworkEmojis = ['🎉', '✨', '🎊', '⭐', '🎈', '🎆', '💫'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.position = 'fixed';
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.fontSize = (20 + Math.random() * 15) + 'px';
                firework.style.zIndex = '10000';
                firework.style.pointerEvents = 'none';
                firework.style.animation = 'fireworkFade 3s ease-out forwards';
                firework.textContent = fireworkEmojis[Math.floor(Math.random() * fireworkEmojis.length)];
                
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    if (firework.parentNode) {
                        firework.remove();
                    }
                }, 3000);
            }, i * 150);
        }
    }

    // CSS cho hiệu ứng pháo hoa
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fireworkFade {
            0% { 
                opacity: 1; 
                transform: scale(0.5) translateY(0px); 
            }
            50% { 
                opacity: 1; 
                transform: scale(1.2) translateY(-50px); 
            }
            100% { 
                opacity: 0; 
                transform: scale(0.8) translateY(-100px); 
            }
        }
    `;
    document.head.appendChild(style);
});

// Snow Effect
function initSnowEffect() {
    const snowContainer = document.createElement("div");
    snowContainer.style.position = "fixed";
    snowContainer.style.inset = "0";
    snowContainer.style.pointerEvents = "none";
    snowContainer.style.zIndex = "999";
    document.body.appendChild(snowContainer);

    function createSnow() {
        const snow = document.createElement("div");
        snow.textContent = "❄";
        snow.style.position = "absolute";
        snow.style.top = "-20px";
        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.fontSize = (12 + Math.random() * 12) + "px";
        snow.style.opacity = Math.random();
        snow.style.transition = `top ${duration}ms linear`;
        snow.style.color = "#ffffff";
        snow.style.fontSize = (16 + Math.random() * 16) + "px";
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

    // Tạo tuyết rơi mỗi 500ms
    setInterval(createSnow, 500);
}

// Khởi tạo hiệu ứng tuyết rơi
document.addEventListener('DOMContentLoaded', initSnowEffect);