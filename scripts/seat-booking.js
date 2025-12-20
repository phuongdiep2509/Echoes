// Seat Booking JavaScript
import { concerts } from './ObjectForEchoes.js';

class SeatBooking {
    constructor() {
        this.currentEvent = null;
        this.selectedSection = null;
        this.selectedZone = null;
        this.ticketPrice = 0;
        this.quantity = 1;
        this.totalPrice = 0;
        this.useImageMap = false; // Flag to determine which map to use
        
        // Define pricing for the 3 zones (VIP, Standard, Economy)
        this.zonePricing = {
            vip: { multiplier: 1.0, name: 'VIP' },
            standard: { multiplier: 0.7, name: 'Standard' }, 
            economy: { multiplier: 0.4, name: 'Economy' }
        };
        
        // Define image map areas (will be set when image is provided)
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
        // Check if there's a venue image for this event
        // This will be updated when you provide the actual image
        const venueImagePath = this.getVenueImagePath();
        
        if (venueImagePath) {
            this.setupImageMap(venueImagePath);
        } else {
            // Use HTML seat map as default
            this.useImageMap = false;
            document.getElementById('htmlSeatMap').style.display = 'block';
            document.getElementById('imageMapContainer').style.display = 'none';
        }
    }
    
    getVenueImagePath() {
        // This method will return the path to the venue image
        // For now, return null to use HTML map
        // When you provide the image, update this method
        return null; // Will be updated with actual image path
    }
    
    setupImageMap(imagePath) {
        this.useImageMap = true;
        
        // Hide HTML map and show image map
        document.getElementById('htmlSeatMap').style.display = 'none';
        document.getElementById('imageMapContainer').style.display = 'block';
        
        // Set image source
        document.getElementById('venueImage').src = imagePath;
        
        // Define clickable areas (coordinates will be set based on your image)
        this.imageMapAreas = [
            // Example areas - will be updated with actual coordinates
            { coords: '100,50,200,150', type: 'vip', section: 'vip-front', name: 'VIP Phía Trước' },
            { coords: '250,100,350,200', type: 'standard', section: 'standard-center', name: 'Standard Giữa' },
            { coords: '400,150,500,250', type: 'economy', section: 'economy-back', name: 'Economy Phía Sau' }
        ];
        
        this.createImageMapAreas();
    }
    
    createImageMapAreas() {
        const map = document.getElementById('venueMap');
        map.innerHTML = ''; // Clear existing areas
        
        this.imageMapAreas.forEach((area, index) => {
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
        // Store selection data
        this.selectedSection = area.section;
        this.selectedZone = area.type;
        
        // Show selection indicator
        const indicator = document.getElementById('selectionIndicator');
        const areaName = document.getElementById('selectedAreaName');
        
        areaName.textContent = `Đã chọn: ${area.name}`;
        indicator.style.display = 'block';
        
        // Calculate price and update UI
        this.calculatePrice();
        this.updateTicketDetails();
        this.updateUI();
    }
    
    loadEventData() {
        // Get event ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        if (eventId && concerts[eventId]) {
            this.currentEvent = concerts[eventId];
            this.displayEventInfo();
        } else {
            // Fallback to a default event for demo
            const firstEventId = Object.keys(concerts)[0];
            if (firstEventId) {
                this.currentEvent = concerts[firstEventId];
                this.displayEventInfo();
                
                // Update URL to reflect the demo event
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('eventId', firstEventId);
                window.history.replaceState({}, '', newUrl);
            } else {
                // No events available
                this.showNoEventsMessage();
            }
        }
    }
    
    displayEventInfo() {
        if (!this.currentEvent) return;
        
        // Update breadcrumb
        document.getElementById('eventBreadcrumb').textContent = this.currentEvent.title;
        
        // Update event header
        document.getElementById('eventPoster').src = this.currentEvent.image;
        document.getElementById('eventPoster').alt = this.currentEvent.title;
        document.getElementById('eventTitle').textContent = this.currentEvent.title;
        document.getElementById('eventDate').textContent = this.currentEvent.date;
        document.getElementById('eventVenue').textContent = this.currentEvent.venue;
        document.getElementById('eventDuration').textContent = this.currentEvent.duration || '3 giờ';
        
        // Update page title
        document.title = `Chọn Chỗ Ngồi - ${this.currentEvent.title} | Echoes`;
    }
    
    showNoEventsMessage() {
        document.getElementById('eventTitle').textContent = 'Không tìm thấy sự kiện';
        document.getElementById('eventDate').textContent = 'N/A';
        document.getElementById('eventVenue').textContent = 'N/A';
        document.getElementById('eventDuration').textContent = 'N/A';
        
        // Hide seat map and show error message
        document.querySelector('.seat-map-container').innerHTML = `
            <div class="alert alert-warning text-center">
                <h4>Không tìm thấy sự kiện</h4>
                <p>Vui lòng chọn một sự kiện hợp lệ để tiếp tục đặt vé.</p>
                <a href="concert.html" class="btn btn-danger">Quay lại danh sách Concert</a>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Seat section selection (HTML map)
        document.querySelectorAll('.seat-section').forEach(section => {
            section.addEventListener('click', (e) => {
                if (!this.useImageMap) {
                    this.selectSeat(e.target.closest('.seat-section'));
                }
            });
        });
        
        // Image map areas are handled in createImageMapAreas()
        
        // Quantity controls
        document.getElementById('decreaseQty').addEventListener('click', () => {
            this.changeQuantity(-1);
        });
        
        document.getElementById('increaseQty').addEventListener('click', () => {
            this.changeQuantity(1);
        });
        
        document.getElementById('ticketQuantity').addEventListener('change', (e) => {
            this.setQuantity(parseInt(e.target.value));
        });
        
        // Proceed to payment
        document.getElementById('proceedToPayment').addEventListener('click', () => {
            this.proceedToPayment();
        });
        
        // Gift ticket
        document.getElementById('giftTicket').addEventListener('click', () => {
            this.giftTicket();
        });
    }
    
    selectSeat(sectionElement) {
        if (!sectionElement) return;
        
        // Remove previous selection
        document.querySelectorAll('.seat-section.selected').forEach(section => {
            section.classList.remove('selected');
        });
        
        // Add selection to clicked section
        sectionElement.classList.add('selected');
        
        // Store selection data
        this.selectedSection = sectionElement.dataset.section;
        this.selectedZone = sectionElement.dataset.type;
        
        // Calculate price based on zone and event's base VIP price
        this.calculatePrice();
        
        // Update UI
        this.updateTicketDetails();
        this.updateUI();
    }
    
    calculatePrice() {
        if (!this.currentEvent || !this.selectedZone) return;
        
        // Get base VIP price from event data
        const vipTicket = this.currentEvent.tickets.find(ticket => ticket.type === 'vip');
        const basePrice = vipTicket ? vipTicket.price : 1000000; // Fallback price
        
        // Calculate price based on zone multiplier
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
        
        // Update selection info
        document.getElementById('seatSelection').innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Đã chọn khu vực: <strong>${zoneInfo.name.toUpperCase()}</strong>
        `;
        document.getElementById('seatSelection').className = 'alert alert-success';
        
        // Show ticket details
        document.getElementById('ticketDetails').style.display = 'block';
        
        // Update ticket info
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
        // Enable/disable payment button
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
    
    proceedToPayment() {
        if (!this.selectedZone || !this.currentEvent) {
            alert('Vui lòng chọn khu vực chỗ ngồi trước khi thanh toán!');
            return;
        }
        
        // Check if user is logged in
        if (window.authManager && !window.authManager.isLoggedIn()) {
            alert('Vui lòng đăng nhập để tiếp tục đặt vé!');
            window.location.href = 'accounts/SignUp_LogIn_Form.html';
            return;
        }
        
        // Create booking data
        const bookingData = {
            id: 'booking_' + Date.now(),
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
            status: 'pending'
        };
        
        // Save booking to localStorage
        try {
            const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('userBookings', JSON.stringify(existingBookings));
            
            // Save current booking for payment
            localStorage.setItem('currentBooking', JSON.stringify({
                id: bookingData.id,
                type: 'seat-booking'
            }));
            
            // Redirect to payment
            window.location.href = `components/payment.html?type=seat-booking&bookingId=${bookingData.id}`;
            
        } catch (error) {
            console.error('Error saving booking:', error);
            alert('Có lỗi xảy ra khi lưu thông tin đặt vé. Vui lòng thử lại!');
        }
    }
    
    giftTicket() {
        if (!this.selectedZone || !this.currentEvent) {
            alert('Vui lòng chọn khu vực chỗ ngồi trước khi tặng vé!');
            return;
        }
        
        // Check if user is logged in
        if (window.authManager && !window.authManager.isLoggedIn()) {
            alert('Vui lòng đăng nhập để tiếp tục tặng vé!');
            window.location.href = 'accounts/SignUp_LogIn_Form.html';
            return;
        }
        
        // Create booking data for gift
        const bookingData = {
            id: 'gift_' + Date.now(),
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
            status: 'gift',
            isGift: true
        };
        
        // Save booking to localStorage
        try {
            const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('userBookings', JSON.stringify(existingBookings));
            
            // Redirect to gift page
            window.location.href = `ticketGift.html?bookingId=${bookingData.id}&type=seat-booking`;
            
        } catch (error) {
            console.error('Error saving gift booking:', error);
            alert('Có lỗi xảy ra khi lưu thông tin tặng vé. Vui lòng thử lại!');
        }
    }
    
    // Method to get booking data (for payment page)
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