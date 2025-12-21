
// Tạo seatBox nếu chưa có
let seat = document.querySelector('.seatBox');
if (!seat) {
    seat = document.createElement('div');
    seat.className = 'seatBox';
    
    // Tạo wrapper container
    let wrapper = document.createElement('div');
    wrapper.className = 'seat-wrapper';
    wrapper.appendChild(seat);
    
    document.getElementById('seat').appendChild(wrapper);
}

if (seat) {
    // Khởi tạo layout cho phòng nhạc thính phòng
    // VIP Section - Khối bên trái và bên phải (3 hàng, mỗi hàng 6 ghế)
    const vipLeftBlock = [
        ["V1", "V2", "V3", "V4", "V5", "V6"],
        ["V7", "V8", "V9", "V10", "V11", "V12"],
        ["V13", "V14", "V15", "V16", "V17", "V18"]
    ];
    
    const vipRightBlock = [
        ["V19", "V20", "V21", "V22", "V23", "V24"],
        ["V25", "V26", "V27", "V28", "V29", "V30"],
        ["V31", "V32", "V33", "V34", "V35", "V36"]
    ];
    
    // Standard Section - Khối bên trái và bên phải (3 hàng, mỗi hàng 6 ghế)
    const standardLeftBlock = [
        ["S1", "S2", "S3", "S4", "S5", "S6"],
        ["S7", "S8", "S9", "S10", "S11", "S12"],
        ["S13", "S14", "S15", "S16", "S17", "S18"]
    ];
    
    const standardRightBlock = [
        ["S19", "S20", "S21", "S22", "S23", "S24"],
        ["S25", "S26", "S27", "S28", "S29", "S30"],
        ["S31", "S32", "S33", "S34", "S35", "S36"]
    ];

    // Tạo sân khấu/khu vực biểu diễn
    function createStage() {
        let stage = document.createElement('div');
        stage.className = 'stage';
        stage.innerHTML = '<div class="stage-text">SÂN KHẤU</div>';
        seat.appendChild(stage);
    }

    // Tạo một hàng ghế đơn
    function createSeatRow(seatTypes, seatClass) {
        let row = document.createElement('div');
        row.className = 'seat-row';
        seatTypes.forEach(seatType => {
            row.innerHTML += `<div class="seat ${seatClass}">${seatType}</div>`
        });
        return row;
    }

    // Tạo section với 2 khối ghế (trái và phải) có lối đi ở giữa
    function createSeatSection(leftBlock, rightBlock, seatClass, sectionClass) {
        let section = document.createElement('div');
        section.className = `seat-section ${sectionClass}`;
        
        // Tạo từng hàng ghế
        for (let i = 0; i < leftBlock.length; i++) {
            let rowContainer = document.createElement('div');
            rowContainer.className = 'row-container';
            
            // Khối bên trái
            let leftRow = createSeatRow(leftBlock[i], seatClass);
            leftRow.classList.add('left-block');
            
            // Lối đi
            let aisle = document.createElement('div');
            aisle.className = 'aisle';
            
            // Khối bên phải
            let rightRow = createSeatRow(rightBlock[i], seatClass);
            rightRow.classList.add('right-block');
            
            rowContainer.appendChild(leftRow);
            rowContainer.appendChild(aisle);
            rowContainer.appendChild(rightRow);
            section.appendChild(rowContainer);
        }
        
        seat.appendChild(section);
    }

    // Tạo chú thích ghế
    function createSeatLegend() {
        let legend = document.createElement('div');
        legend.className = 'seat-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-seat legend-vip"></div>
                <span>VIP - 800.000đ</span>
            </div>
            <div class="legend-item">
                <div class="legend-seat legend-standard"></div>
                <span>Standard - 500.000đ</span>
            </div>
            <div class="legend-item">
                <div class="legend-seat legend-selected"></div>
                <span>Đã chọn</span>
            </div>
            <div class="legend-item">
                <div class="legend-seat legend-unavailable"></div>
                <span>Không khả dụng</span>
            </div>
        `;
        seat.appendChild(legend);
    }

    // Tạo sân khấu trước
    createStage();
    
    // Tạo khoảng cách giữa sân khấu và ghế VIP
    let spacer1 = document.createElement('div');
    spacer1.className = 'row-spacer';
    seat.appendChild(spacer1);
    
    // Tạo ghế VIP (2 khối, mỗi khối 2 hàng x 8 ghế)
    createSeatSection(vipLeftBlock, vipRightBlock, 'seat-vip', 'vip-section');
    
    // Tạo khoảng cách giữa VIP và Standard
    let spacer2 = document.createElement('div');
    spacer2.className = 'row-spacer';
    seat.appendChild(spacer2);
    
    // Tạo ghế Standard (2 khối cong, mỗi khối 2 hàng x 8 ghế)
    createSeatSection(standardLeftBlock, standardRightBlock, 'seat-standard', 'standard-section');
    
    // Tạo chú thích ghế
    createSeatLegend();

    //Giá tiền cho từng loại ghế (phòng nhạc thính phòng)
    const seatPrices = {
        'seat-standard': 500000,  // Ghế standard
        'seat-vip': 800000        // Ghế VIP (gần sân khấu hơn)
    };

    //Phân ghế được chọn theo loại
    let selectedSeatsByType = {
        'seat-standard': [],
        'seat-vip': []
    };

    //Thêm sự kiện click cho từng ghế 
    let seats = document.querySelectorAll('.seat');

    seats.forEach(seat => {
        seat.addEventListener('click', function () {
            const seatType = [...seat.classList].find(cls => seatPrices[cls]); //kiểm tra xem class có tồn tại trong seatPrices, trả về class đó

            // Nếu ghế đã chọn
            if (seat.classList.contains('selected')) {
                seat.classList.remove('selected');
                selectedSeatsByType[seatType] = selectedSeatsByType[seatType].filter(s => s !== seat.textContent);
            }
            //Nếu ghế chưa được chọn 
            else {
                seat.classList.add('selected');
                selectedSeatsByType[seatType].push(seat.textContent);
            }
            
            console.log(selectedSeatsByType[seatType]);
            renderTicket(); //mỗi lần click hiển thị lại ghế và tổng tiền tương ứng
        });
    });


    //render tính tiền vé
    function renderTicket() {
        let seatInfoContainer = document.querySelector('.seat-info-container');
        seatInfoContainer.innerHTML = '';
        let seatTotalPrice = 0;

        Object.keys(selectedSeatsByType).forEach(seatType => {
            const seats = selectedSeatsByType[seatType];

            if (seats.length > 0) {
                const price = seatPrices[seatType];
                let seatPriceByType = price * seats.length;
                seatTotalPrice += seatPriceByType;

                let seatInfo = document.createElement('div');
                seatInfo.classList.add('seat-info');
                seatInfo.innerHTML = `
                <div class="seat-selected">
                    <div class="seat-total">${seats.length} Ghế ${seatType.replace('seat-', '')}</div>
                    <div class="seat-number">Ghế: ${seats.join(', ')}</div>
                </div>
                <div class="seat-price">${seatPriceByType.toLocaleString()} đ</div>
            `;

                seatInfoContainer.appendChild(seatInfo);
            }
        });

        //Lưu ghế cho hóa đơn
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsByType));

        // Lưu tổng tiền vé vào SessionStorage
        sessionStorage.setItem('seatTotalPrice', seatTotalPrice);
        
        console.log('Saved to sessionStorage - selectedSeats:', selectedSeatsByType);
        console.log('Saved to sessionStorage - seatTotalPrice:', seatTotalPrice);
        
        // Update total price display directly
        updateTotalPriceDisplay(seatTotalPrice);
        
        // Call updateTotalPrice if it exists
        if (typeof window.updateTotalPrice === 'function') {
            console.log('Calling updateTotalPrice function');
            window.updateTotalPrice();
        } else {
            console.log('updateTotalPrice function not available, trying again in 200ms');
            setTimeout(() => {
                if (typeof window.updateTotalPrice === 'function') {
                    console.log('Calling updateTotalPrice function (delayed)');
                    window.updateTotalPrice();
                } else {
                    console.log('updateTotalPrice still not available after delay');
                }
            }, 200);
        }
    }
    
    // Function to update total price display directly
    function updateTotalPriceDisplay(totalPrice) {
        const totalPriceElement = document.querySelector('.total-price-number');
        if (totalPriceElement) {
            const formatted = new Intl.NumberFormat('vi-VN').format(totalPrice);
            totalPriceElement.textContent = formatted + ' đ';
            console.log('Updated total price display directly to:', formatted + ' đ');
        }
        
        // Update button state
        const nextButton = document.querySelector('.button-next');
        const giftButton = document.querySelector('.button-gift');
        
        if (nextButton && totalPrice > 0) {
            nextButton.textContent = 'THANH TOÁN';
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
            nextButton.classList.remove('disabled');
            // Force remove any disabled attribute
            nextButton.removeAttribute('disabled');
        } else if (nextButton) {
            nextButton.textContent = 'CHỌN GHẾ TRƯỚC';
            nextButton.style.opacity = '0.6';
            nextButton.style.cursor = 'not-allowed';
            nextButton.classList.add('disabled');
        }
        
        if (giftButton && totalPrice > 0) {
            giftButton.textContent = 'TẶNG VÉ';
            giftButton.style.opacity = '1';
            giftButton.style.cursor = 'pointer';
            giftButton.classList.remove('disabled');
            // Force remove any disabled attribute
            giftButton.removeAttribute('disabled');
        } else if (giftButton) {
            giftButton.textContent = 'CHỌN GHẾ TRƯỚC';
            giftButton.style.opacity = '0.6';
            giftButton.style.cursor = 'not-allowed';
            giftButton.classList.add('disabled');
        }
    }

    
} else {
    console.log('Khởi tạo ghế thất bại');
}

