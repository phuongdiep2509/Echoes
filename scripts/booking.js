// Lấy dữ liệu từ Session Storage
let bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));
//render cho thông tin chung
if (bookingInfo) {
    console.log(bookingInfo);
    //render bookingInfo vào thông tin vé
    const musicTicket = document.querySelector('.music-ticket');
    if (musicTicket) {
        musicTicket.innerHTML = `
                           <div class="music-infomation">
                            <div class="music-image">
                                <img src="${bookingInfo.bookingImage}" alt="${bookingInfo.bookingName}">
                            </div>
                            <div class="music-content">
                                <div class="music-title">${bookingInfo.bookingName}</div>
                                <ul>
                                    <li>${bookingInfo.bookingFormat}</li>
                                    <li>${bookingInfo.bookingSubtitle}</li>
                                    <li>${bookingInfo.bookingDuration}</li>
                                </ul>
                            </div>
                        </div>

                        <div class="cinema">
                            <div class="cinema-name">Phòng hòa nhạc: ${bookingInfo.bookingCinema}</div>
                            <div> - </div>
                            <div class="cinema-number">${bookingInfo.bookingRoom}</div>
                        </div>
                        <div class="schedule">
                            <div class="showtime-number">Buổi diễn: ${bookingInfo.bookingTime}</div>
                            <div> - </div>
                            <div class="showtime-day">Chủ nhật, ${bookingInfo.bookingDate}</div>
                        </div>

                        <div class="seat-info-container">
                        </div>

                        <div class="food-info-container">
                        </div>

                        <div class="promotion-info-container">
                        </div>

                        <div class="total-price">
                            <div class="total-price-title">Tổng tiền</div>
                            <div class="total-price-number">0 đ</div>
                        </div>
                    </div>`;
    }
}
else {
    console.log('storage không có dữ liệu');
}

//Viết sự kiện cho nút tiếp theo/quay lại
const steps = ['seat'];
const title = ['Bước 1: Chọn vị trí'];
let currentStep = 0;

function showStep() {
    // Ẩn tất cả các bước
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));

    // Hiển thị bước hiện tại
    document.getElementById(steps[currentStep]).classList.add('active');
    document.querySelector('.inner-title').innerHTML = `${title[currentStep]}`;

    // Cập nhật trạng thái của nút
    btnPrev.disabled = (currentStep === 0);
    btnNext.innerText = "Thanh toán";
}

// Hàm chuyển bước tiếp theo
let btnNext = document.querySelector('.button-next');
btnNext.addEventListener('click', nextStep);
function nextStep() {
    //Lấy ghế từ sessionStorage để push vào bookingInfo
    const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats'));
    console.log(selectedSeats);

    // Kiểm tra xem đã chọn ghế chưa
    if (!selectedSeats || (Object.values(selectedSeats).every(seats => seats.length === 0))) {
        alert("Vui lòng chọn ít nhất một ghế!");
        return;
    }

    // Lấy thông tin hiện tại từ SessionStorage
    let bookingInfo = JSON.parse(sessionStorage.getItem('bookingInfo'));

    // Nếu có thông tin ghế, push vào bookingInfo
    if (bookingInfo && selectedSeats) {
        bookingInfo.bookingSeats = selectedSeats;
        sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    }

    // Chuyển thẳng sang trang thanh toán
    window.location.href = `payment.html`;
}

// Hàm quay lại bước trước
let btnPrev = document.querySelector('.button-prev');
btnPrev.addEventListener('click', prevStep);
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
    }
    showStep();
}

// Hiển thị bước đầu tiên khi load trang
showStep();

//Tính tổng tiền
function updateTotalPrice() {
    const totalPriceElement = document.querySelector('.total-price-number');

    // Lấy giá trị từ SessionStorage
    const seatTotalPrice = parseInt(sessionStorage.getItem('seatTotalPrice')) || 0;
    const foodTotalPrice = parseInt(sessionStorage.getItem('foodTotalPrice')) || 0;
    const promotionTotalPrice = parseFloat(sessionStorage.getItem('promotionTotalPrice')) || 0;

    // Tính tổng tiền
    const totalPrice = (seatTotalPrice + foodTotalPrice) * (1 - promotionTotalPrice);

    // Cập nhật giao diện
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toLocaleString()} đ`;
    }
}