// 3D Gift Box Popup

class GiftPopup {
    constructor() {
        this.isVisible = false;
        this.hasClicked = false;
        this.init();
    }

    init() {
        // Chỉ hiển thị trên trang chủ và một số trang chính
        const allowedPages = ['index.html', 'music.html', 'News.html', 'aboutUs.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!allowedPages.includes(currentPage)) {
            return;
        }

        // Tạm thời bỏ kiểm tra localStorage để test
        // const today = new Date().toDateString();
        // const lastClicked = localStorage.getItem('gift_popup_clicked');
        
        // if (lastClicked === today) {
        //     return; // Đã click hôm nay rồi, không hiển thị
        // }

        this.createPopup();
        this.showWithDelay();
    }

    createPopup() {
        console.log('Creating gift popup element...');
        const popup = document.createElement('div');
        popup.className = 'gift-popup';
        popup.id = 'giftPopup';
        
       popup.innerHTML = `
         <div class="gift-tooltip">NHẬN QUÀ GIÁNG SINH!🎄</div>

         <button class="gift-pop-btn" type="button" aria-label="Mở quà">
         <img
         class="gift-pop-img"
        src="assets/images/open/giftbox.png"
        alt="Gift"
        />
        </button>
        </div>
        <div class="gift-pop-shell">
        </div>
        `;

        // Thêm event listener
        popup.addEventListener('click', () => this.handleClick());
        
        document.body.appendChild(popup);
        console.log('Popup element created and added to body');
    }

    showWithDelay() {
        console.log('Starting showWithDelay...');
        // Hiển thị sau 3 giây
        setTimeout(() => {
            const popup = document.getElementById('giftPopup');
            console.log('Attempting to show popup:', popup);
            if (popup) {
                popup.style.opacity = '0';
                popup.style.transform = 'translateY(100px)';
                popup.style.transition = 'all 0.5s ease';
                popup.style.display = 'block';
                console.log('Popup display set to block');
                
                // Animate in
                setTimeout(() => {
                    popup.style.opacity = '1';
                    popup.style.transform = 'translateY(0)';
                    this.isVisible = true;
                    console.log('Popup animation completed, should be visible');
                }, 100);
            } else {
                console.log('ERROR: Popup element not found!');
            }
        }, 1000); // Giảm xuống 1 giây để test nhanh hơn
    }

    handleClick() {
        if (this.hasClicked) return;
        
        this.hasClicked = true;
        
        // Lưu trạng thái đã click hôm nay
        const today = new Date().toDateString();
        localStorage.setItem('gift_popup_clicked', today);
        
        // Hiệu ứng click
        const popup = document.getElementById('giftPopup');
        if (popup) {
            popup.style.transform = 'scale(1.2)';
            popup.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                popup.style.transform = 'scale(0)';
                popup.style.opacity = '0';
                
                setTimeout(() => {
                    popup.remove();
                    // Chuyển đến trang opensecretbox
                    window.location.href = 'opensecretbox.html';
                }, 300);
            }, 200);
        }
    }

    hide() {
        const popup = document.getElementById('giftPopup');
        if (popup && this.isVisible) {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(100px)';
            
            setTimeout(() => {
                popup.remove();
                this.isVisible = false;
            }, 500);
        }
    }

    // Không ẩn popup khi scroll - để luôn hiển thị
    handleScroll() {
        // Bỏ logic ẩn popup khi scroll
        // Popup sẽ luôn hiển thị cho đến khi user click
        return;
    }
}

// Khởi tạo khi DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Debug: Xóa localStorage để test
    console.log('Clearing gift popup localStorage for testing...');
    localStorage.removeItem('gift_popup_clicked');
    
    const giftPopup = new GiftPopup();
    
    // Lắng nghe scroll (hiện tại không làm gì)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            giftPopup.handleScroll();
        }, 100);
    });
    
    // Debug: Force tạo popup sau 2 giây nếu chưa có
    setTimeout(() => {
        if (!document.getElementById('giftPopup')) {
            console.log('Force creating popup...');
            giftPopup.createPopup();
            const popup = document.getElementById('giftPopup');
            if (popup) {
                popup.style.display = 'block';
                popup.style.opacity = '1';
                popup.style.transform = 'translateY(0)';
                giftPopup.isVisible = true;
                console.log('Popup force created and shown');
            }
        }
    }, 2000);
});

// Debug function để reset popup
window.resetGiftPopup = function() {
    localStorage.removeItem('gift_popup_clicked');
    const existingPopup = document.getElementById('giftPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
    location.reload();
};

// Export cho sử dụng global nếu cần
window.GiftPopup = GiftPopup;