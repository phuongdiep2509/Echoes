// Seat Booking JavaScript
import { concerts, liveMusic } from './ObjectForEchoes.js';

class SeatBooking {
    constructor() {
        this.currentEvent = null;
        this.selectedSection = null;
        this.selectedZone = null;
        this.ticketPrice = 0;
        this.quantity = 1;
        this.totalPrice = 0;
        this.useImageMap = false;
        
        // Define pricing for the 3 zones (VIP, Standard, Economy)
        this.zonePricing = {
            vip: { multiplier: 1.0, name: 'VIP' },
            standard: { multiplier: 0.7, name: 'Standard' }, 
            economy: { multiplier: 0.4, name: 'Economy' }
        };
        
        this.imageMapAreas = [];
        this.init();
    }
    
    init() {
        this.loadEventData();
        this.setupEventListeners();
        this.checkForVenueImage();
        this.updateUI();
    }
    
    checkForVenueImage() {
        const venueImagePath = this.getVenueImagePath();
        
        if (venueImagePath) {
            this.setupImageMap(venueImagePath);
        } else {
            this.useImageMap = false;
            document.getElementById('htmlSeatMap').style.display = 'block';
            document.getElementById('imageMapContainer').style.display = 'none';
        }
    }
    
    getVenueImagePath() {
        return null; // Will be updated with actual image path
    }
    
    setupImageMap(imagePath) {
        this.useImageMap = true;
        
        document.getElementById('htmlSeatMap').style.display = 'none';
        document.getElementById('imageMapContainer').style.display = 'block';
        document.getElementById('venueImage').src = imagePath;
        
        this.imageMapAreas = [
            { coords: '100,50,200,150', type: 'vip', section: 'vip-front', name: 'VIP Phía Trước' },
            { coords: '250,100,350,200', type: 'standard', section: 'standard-center', name: 'Standard Giữa' },
            { coords: '400,150,500,250', type: 'economy', section: 'economy-back', name: 'Economy Phía Sau' }
        ];
        
        this.createImageMapAreas();
    }
    
    createImageMapAreas() {
        const map = document.getElementById('venueMap');
        map.innerHTML = '';
        
        this.imageMapAreas.forEach((area) => {
            const areaElement = document.createElement('area');
            areaElement.shape = 'rect';
            areaElement.coords = area.coords;
            areaElement.dataset.type = area.type;
            areaElement.dataset.section = area.section;
            areaElement.dataset.name = area.name;
            areaElement.style.cursor = 'pointer';
            
            areaElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectImageMapArea(area);
            });
            
            map.appendChild(areaElement);
        });
    }
    
    selectImageMapArea(area) {
        this.selectedSection = area.section;
        this.selectedZone = area.type;
        
        const indicator = document.getElementById('selectionIndicator');
        const areaName = document.getElementById('selectedAreaName');
        
        areaName.textContent = `Đã chọn: ${area.name}`;
        indicator.style.display = 'block';
        
        this.calculatePrice();
        this.updateTicketDetails();
        this.updateUI();
    }
    
    loadEventData() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        console.log('Loading event data for eventId:', eventId);
        
        if (eventId) {
            // Try to find in concerts first, then liveMusic
            let eventData = concerts[eventId] || liveMusic[eventId];
            
            if (eventData) {
                console.log('Found event data:', eventData);
                this.currentEvent = eventData;
                this.displayEventInfo();
                return;
            } else {
                console.log('Event not found in concerts or liveMusic for ID:', eventId);
            }
        }
        
        // Fallback: try to get from localStorage (from eventDetail page)
        const savedEvent = localStorage.getItem('currentBookingEvent');
        if (savedEvent) {
            try {
                const parsedEvent = JSON.parse(savedEvent);
                console.log('Found saved event in localStorage:', parsedEvent);
                this.currentEvent = parsedEvent;
                this.displayEventInfo();
                
                // Update URL with the correct eventId
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('eventId', this.currentEvent.id);
                window.history.replaceState({}, '', newUrl);
                return;
            } catch (e) {
                console.error('Error parsing saved event:', e);
            }
        }
        
        // Final fallback: use first concert
        console.log('Using fallback - first concert');
        const firstEventId = Object.keys(concerts)[0];
        if (firstEventId) {
            this.currentEvent = concerts[firstEventId];
            this.displayEventInfo();
            
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('eventId', firstEventId);
            window.history.replaceState({}, '', newUrl);
        } else {
            this.showNoEventsMessage();
        }
    }
    
    displayEventInfo() {
        if (!this.currentEvent) return;
        
        document.getElementById('eventBreadcrumb').textContent = this.currentEvent.title;
        document.getElementById('eventPoster').src = this.currentEvent.image;
        document.getElementById('eventPoster').alt = this.currentEvent.title;
        document.getElementById('eventTitle').textContent = this.currentEvent.title;
        document.getElementById('eventDate').textContent = this.currentEvent.date;
        document.getElementById('eventVenue').textContent = this.currentEvent.venue;
        document.getElementById('eventDuration').textContent = this.currentEvent.duration || '3 giờ';
        
        document.title = `Chọn Chỗ Ngồi - ${this.currentEvent.title} | Echoes`;
    }
    
    showNoEventsMessage() {
        document.getElementById('eventTitle').textContent = 'Không tìm thấy sự kiện';
        document.getElementById('eventDate').textContent = 'N/A';
        document.getElementById('eventVenue').textContent = 'N/A';
        document.getElementById('eventDuration').textContent = 'N/A';
        
        document.querySelector('.seat-map-container').innerHTML = `
            <div class="alert alert-warning text-center">
                <h4>Không tìm thấy sự kiện</h4>
                <p>Vui lòng chọn một sự kiện hợp lệ để tiếp tục đặt vé.</p>
                <a href="concert.html" class="btn btn-danger">Quay lại danh sách Concert</a>
            </div>
        `;
    }
    
    setupEventListeners() {
        document.querySelectorAll('.seat-section').forEach(section => {
            section.addEventListener('click', (e) => {
                if (!this.useImageMap) {
                    this.selectSeat(e.target.closest('.seat-section'));
                }
            });
        });
        
        document.getElementById('decreaseQty').addEventListener('click', () => {
            this.changeQuantity(-1);
        });
        
        document.getElementById('increaseQty').addEventListener('click', () => {
            this.changeQuantity(1);
        });
        
        document.getElementById('ticketQuantity').addEventListener('change', (e) => {
            this.setQuantity(parseInt(e.target.value));
        });
        
        document.getElementById('proceedToPayment').addEventListener('click', () => {
            this.proceedToPayment();
        });
        
        document.getElementById('giftTicket').addEventListener('click', () => {
            this.giftTicket();
        });
    }
    
    selectSeat(sectionElement) {
        if (!sectionElement) return;
        
        document.querySelectorAll('.seat-section.selected').forEach(section => {
            section.classList.remove('selected');
        });
        
        sectionElement.classList.add('selected');
        
        this.selectedSection = sectionElement.dataset.section;
        this.selectedZone = sectionElement.dataset.type;
        
        this.calculatePrice();
        this.updateTicketDetails();
        this.updateUI();
    }
    
    calculatePrice() {
        if (!this.currentEvent || !this.selectedZone) return;
        
        const vipTicket = this.currentEvent.tickets.find(ticket => ticket.type === 'vip');
        const basePrice = vipTicket ? vipTicket.price : 1000000;
        
        const zoneInfo = this.zonePricing[this.selectedZone];
        this.ticketPrice = Math.round(basePrice * zoneInfo.multiplier);
        
        this.calculateTotal();
    }
    
    calculateTotal() {
        this.totalPrice = this.ticketPrice * this.quantity;
    }
    
    updateTicketDetails() {
        if (!this.selectedZone) return;
        
        const zoneInfo = this.zonePricing[this.selectedZone];
        
        document.getElementById('seatSelection').innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Đã chọn khu vực: <strong>${zoneInfo.name.toUpperCase()}</strong>
        `;
        document.getElementById('seatSelection').className = 'alert alert-success';
        
        document.getElementById('ticketDetails').style.display = 'block';
        
        document.getElementById('selectedZone').textContent = zoneInfo.name.toUpperCase();
        document.getElementById('ticketPrice').textContent = this.formatPrice(this.ticketPrice);
        document.getElementById('totalPrice').textContent = this.formatPrice(this.totalPrice);
    }
    
    changeQuantity(delta) {
        const newQuantity = this.quantity + delta;
        this.setQuantity(newQuantity);
    }
    
    setQuantity(newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 10) newQuantity = 10;
        
        this.quantity = newQuantity;
        document.getElementById('ticketQuantity').value = this.quantity;
        
        if (this.selectedZone) {
            this.calculateTotal();
            document.getElementById('totalPrice').textContent = this.formatPrice(this.totalPrice);
        }
    }
    
    updateUI() {
        const paymentBtn = document.getElementById('proceedToPayment');
        const giftBtn = document.getElementById('giftTicket');
        
        if (this.selectedZone && this.currentEvent) {
            paymentBtn.disabled = false;
            paymentBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>TIẾN HÀNH THANH TOÁN';
            
            giftBtn.disabled = false;
            giftBtn.innerHTML = '<i class="fas fa-gift me-2"></i>TẶNG VÉ CHO BẠN BÈ';
        } else {
            paymentBtn.disabled = true;
            paymentBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>CHỌN CHỖ NGỒI TRƯỚC';
            
            giftBtn.disabled = true;
            giftBtn.innerHTML = '<i class="fas fa-gift me-2"></i>CHỌN CHỖ NGỒI TRƯỚC';
        }
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
    
    // Unified method to create booking data
    createBookingData(isGift = false) {
        return {
            id: (isGift ? 'gift_' : 'booking_') + Date.now(),
            eventId: this.currentEvent.id,
            eventName: this.currentEvent.title,
            eventDate: this.currentEvent.date,
            eventTime: this.currentEvent.time || '20:00',
            venue: this.currentEvent.venue,
            ticketType: this.zonePricing[this.selectedZone].name,
            seatSection: this.selectedSection,
            price: this.ticketPrice,
            quantity: this.quantity,
            totalAmount: this.totalPrice,
            timestamp: new Date().toISOString(),
            status: isGift ? 'gift' : 'pending',
            isGift: isGift,
            bookingType: 'seat-booking',
            eventImage: this.currentEvent.image
        };
    }
    
    // Unified method to save booking
    saveBooking(bookingData) {
        try {
            const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('userBookings', JSON.stringify(existingBookings));
            sessionStorage.setItem('currentBookingData', JSON.stringify(bookingData));
            return true;
        } catch (error) {
            console.error('Error saving booking:', error);
            return false;
        }
    }
    
    proceedToPayment() {
        if (!this.selectedZone || !this.currentEvent) {
            alert('Vui lòng chọn khu vực chỗ ngồi trước khi thanh toán!');
            return;
        }
        
        if (window.authManager && !window.authManager.isLoggedIn()) {
            alert('Vui lòng đăng nhập để tiếp tục đặt vé!');
            window.location.href = 'accounts/SignUp_LogIn_Form.html';
            return;
        }
        
        const bookingData = this.createBookingData(false);
        
        if (this.saveBooking(bookingData)) {
            localStorage.setItem('currentBooking', JSON.stringify({
                id: bookingData.id,
                type: 'seat-booking'
            }));
            
            window.location.href = `payment.html?type=seat-booking&bookingId=${bookingData.id}`;
        } else {
            alert('Có lỗi xảy ra khi lưu thông tin đặt vé. Vui lòng thử lại!');
        }
    }
    
    giftTicket() {
        if (!this.selectedZone || !this.currentEvent) {
            alert('Vui lòng chọn khu vực chỗ ngồi trước khi tặng vé!');
            return;
        }
        
        if (window.authManager && !window.authManager.isLoggedIn()) {
            alert('Vui lòng đăng nhập để tiếp tục tặng vé!');
            window.location.href = 'accounts/SignUp_LogIn_Form.html';
            return;
        }
        
        const bookingData = this.createBookingData(true);
        
        if (this.saveBooking(bookingData)) {
            window.location.href = `ticketGift.html?bookingId=${bookingData.id}&type=seat-booking`;
        } else {
            alert('Có lỗi xảy ra khi lưu thông tin tặng vé. Vui lòng thử lại!');
        }
    }
    
    static getBookingData(bookingId) {
        try {
            const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            return bookings.find(booking => booking.id === bookingId);
        } catch (error) {
            console.error('Error retrieving booking data:', error);
            return null;
        }
    }
}

// Initialize seat booking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SeatBooking();
});

// Export for use in other modules
export { SeatBooking };

// Global function for back button
window.goBack = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    if (eventId) {
        window.location.href = `eventDetail.html?id=${eventId}&type=concert`;
    } else {
        window.location.href = 'concert.html';
    }
};