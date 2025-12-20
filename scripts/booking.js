// Music Booking JavaScript
import { concerts, liveMusic } from './ObjectForEchoes.js';

class MusicBooking {
    constructor() {
        this.currentEvent = null;
        this.selectedSeats = {};
        this.totalPrice = 0;
        
        this.init();
    }
    
    init() {
        console.log('MusicBooking init started');
        this.loadEventData();
        
        // Setup event listeners after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
            this.updateUI();
            
            // Test button functionality
            this.testButtons();
        }, 100);
        
        // Make updateTotalPrice available globally for seat.js
        window.updateTotalPrice = () => this.updateTotalPrice();
        console.log('updateTotalPrice function made available globally');
        
        // Initialize with any existing seat selection
        setTimeout(() => {
            console.log('Checking for existing seat selection...');
            this.updateTotalPrice();
        }, 500);
    }
    
    testButtons() {
        const nextButton = document.querySelector('#proceedToPayment');
        const giftButton = document.querySelector('#giftTicket');
        
        console.log('Button test results:', {
            nextButton: {
                exists: !!nextButton,
                text: nextButton?.textContent,
                classes: nextButton?.className,
                disabled: nextButton?.disabled
            },
            giftButton: {
                exists: !!giftButton,
                text: giftButton?.textContent,
                classes: giftButton?.className,
                disabled: giftButton?.disabled
            }
        });
    }
    
    loadEventData() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        console.log('Loading event data for eventId:', eventId);
        console.log('Available liveMusic events:', Object.keys(liveMusic));
        console.log('Available concerts events:', Object.keys(concerts));
        
        if (eventId) {
            // Try to find in liveMusic first, then concerts
            let eventData = liveMusic[eventId] || concerts[eventId];
            
            if (eventData) {
                console.log('Found event data:', eventData);
                this.currentEvent = { ...eventData, id: eventId }; // Ensure ID is set
                
                // Force a delay to ensure DOM is ready
                setTimeout(() => {
                    this.displayEventInfo();
                }, 100);
                return;
            } else {
                console.log('Event not found in liveMusic or concerts for ID:', eventId);
            }
        }
        
        // Fallback: try to get from localStorage (from eventDetail page)
        const savedEvent = localStorage.getItem('currentBookingEvent');
        if (savedEvent) {
            try {
                const parsedEvent = JSON.parse(savedEvent);
                console.log('Found saved event in localStorage:', parsedEvent);
                this.currentEvent = parsedEvent;
                
                setTimeout(() => {
                    this.displayEventInfo();
                }, 100);
                
                // Update URL with the correct eventId
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('eventId', this.currentEvent.id);
                window.history.replaceState({}, '', newUrl);
                return;
            } catch (e) {
                console.error('Error parsing saved event:', e);
            }
        }
        
        // Final fallback: show error
        console.error('No event data found');
        this.showNoEventMessage();
    }
    
    displayEventInfo() {
        if (!this.currentEvent) {
            console.error('No current event to display');
            return;
        }
        
        console.log('Displaying event info for:', this.currentEvent);
        
        // Update the event header section
        const titleElement = document.querySelector('#eventTitle');
        const imageElement = document.querySelector('#eventPoster');
        const venueElement = document.querySelector('#eventVenue');
        const timeElement = document.querySelector('#eventDuration');
        const dateElement = document.querySelector('#eventDate');
        const statusElement = document.querySelector('.music-note');
        const breadcrumbElement = document.querySelector('#eventBreadcrumb');
        
        if (titleElement) {
            titleElement.textContent = this.currentEvent.title;
            console.log('Updated title to:', this.currentEvent.title);
        }
        
        if (imageElement) {
            // Force image update by clearing cache and reloading
            const imageUrl = this.currentEvent.image;
            const timestamp = new Date().getTime();
            imageElement.src = '';
            imageElement.onload = () => {
                console.log('Image loaded successfully:', imageUrl);
            };
            imageElement.onerror = () => {
                console.error('Failed to load image:', imageUrl);
            };
            // Add timestamp to prevent caching issues
            setTimeout(() => {
                imageElement.src = imageUrl + '?t=' + timestamp;
                imageElement.alt = this.currentEvent.title;
                console.log('Updated image to:', imageUrl);
            }, 50);
        }
        
        if (venueElement) {
            venueElement.textContent = this.currentEvent.venue;
            console.log('Updated venue to:', this.currentEvent.venue);
        }
        
        if (timeElement) {
            const timeText = `Buổi diễn: ${this.currentEvent.time || '19h30'}`;
            timeElement.textContent = timeText;
            console.log('Updated time to:', timeText);
        }
        
        if (dateElement) {
            dateElement.textContent = this.currentEvent.date;
            console.log('Updated date to:', this.currentEvent.date);
        }
        
        if (breadcrumbElement) {
            breadcrumbElement.textContent = this.currentEvent.title.toUpperCase();
        }
        
        // Update status
        if (statusElement) {
            switch(this.currentEvent.status) {
                case 'available':
                    statusElement.textContent = 'CÒN VÉ';
                    statusElement.style.backgroundColor = 'var(--color-green)';
                    break;
                case 'limited':
                    statusElement.textContent = 'CÒN ÍT';
                    statusElement.style.backgroundColor = 'var(--color-red)';
                    break;
                case 'sold':
                    statusElement.textContent = 'HẾT VÉ';
                    statusElement.style.backgroundColor = '#6c757d';
                    break;
                case 'expired':
                    statusElement.textContent = 'HẾT HẠN';
                    statusElement.style.backgroundColor = '#6c757d';
                    break;
            }
            console.log('Updated status to:', statusElement.textContent);
        }
        
        document.title = `Đặt vé - ${this.currentEvent.title} | Echoes`;
    }
    
    displayTicketOptions() {
        // This method is not needed for the seat-based booking system
        // The seat selection is handled by seat.js
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Use event delegation on document to ensure events are captured
        document.addEventListener('click', (e) => {
            console.log('Document click detected on:', e.target.id, e.target.className);
            
            if (e.target.id === 'proceedToPayment' || e.target.closest('#proceedToPayment')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Payment button clicked via delegation');
                if (!e.target.disabled && !e.target.classList.contains('disabled')) {
                    this.proceedToPayment();
                } else {
                    console.log('Button is disabled, ignoring click');
                    alert('Vui lòng chọn ghế trước khi thanh toán!');
                }
            }
            
            if (e.target.id === 'giftTicket' || e.target.closest('#giftTicket')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Gift button clicked via delegation');
                if (!e.target.disabled && !e.target.classList.contains('disabled')) {
                    this.giftTicket();
                } else {
                    console.log('Button is disabled, ignoring click');
                    alert('Vui lòng chọn ghế trước khi tặng vé!');
                }
            }
            
            // Handle back button
            if (e.target.classList.contains('button-prev') || 
                e.target.closest('.button-prev') || 
                (e.target.innerHTML && e.target.innerHTML.includes('QUAY LẠI'))) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked');
                this.goBack();
            }
        });
        
        // Also try direct binding as backup
        const nextButton = document.querySelector('#proceedToPayment');
        const giftButton = document.querySelector('#giftTicket');
        const backButton = document.querySelector('.button-prev');
        
        console.log('Found buttons:', {
            next: !!nextButton,
            gift: !!giftButton,
            back: !!backButton
        });
        
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Payment button clicked directly');
                if (!e.target.disabled && !e.target.classList.contains('disabled')) {
                    this.proceedToPayment();
                } else {
                    alert('Vui lòng chọn ghế trước khi thanh toán!');
                }
            });
        }
        
        if (giftButton) {
            giftButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Gift button clicked directly');
                if (!e.target.disabled && !e.target.classList.contains('disabled')) {
                    this.giftTicket();
                } else {
                    alert('Vui lòng chọn ghế trước khi tặng vé!');
                }
            });
        }
        
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked directly');
                this.goBack();
            });
        }
    }
    
    updateTotalPrice() {
        console.log('updateTotalPrice called');
        
        // Get selected seats from sessionStorage (set by seat.js)
        const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '{}');
        const totalPrice = parseInt(sessionStorage.getItem('seatTotalPrice') || '0');
        
        console.log('Selected seats:', selectedSeats);
        console.log('Total price from sessionStorage:', totalPrice);
        
        this.selectedSeats = selectedSeats;
        this.totalPrice = totalPrice;
        
        // Update the total price display
        const totalPriceElement = document.querySelector('#totalPrice');
        if (totalPriceElement) {
            const formattedPrice = this.formatPrice(totalPrice);
            totalPriceElement.textContent = formattedPrice;
            console.log('Updated total price display to:', formattedPrice);
        } else {
            console.error('Total price element not found');
        }
        
        // Update seat info display
        this.updateSeatInfoDisplay();
        
        // Update button state
        this.updateUI();
    }
    
    updateSeatInfoDisplay() {
        const seatInfoContainer = document.querySelector('.seat-info-container');
        const seatSelectionAlert = document.querySelector('#seatSelection');
        
        if (!seatInfoContainer) return;
        
        // Clear existing seat info
        seatInfoContainer.innerHTML = '';
        
        const hasSelectedSeats = Object.values(this.selectedSeats).some(seats => seats && seats.length > 0);
        
        if (hasSelectedSeats) {
            // Hide the selection alert
            if (seatSelectionAlert) {
                seatSelectionAlert.style.display = 'none';
            }
            
            // Display selected seats
            Object.keys(this.selectedSeats).forEach(seatType => {
                if (this.selectedSeats[seatType] && this.selectedSeats[seatType].length > 0) {
                    const cleanType = seatType.replace('seat-', '');
                    const typeDisplay = cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
                    const seats = this.selectedSeats[seatType];
                    const seatCount = seats.length;
                    
                    // Get price per seat based on type
                    let pricePerSeat = 0;
                    switch(cleanType.toLowerCase()) {
                        case 'vip':
                            pricePerSeat = 800000;
                            break;
                        case 'standard':
                            pricePerSeat = 500000;
                            break;
                        case 'economy':
                            pricePerSeat = 300000;
                            break;
                    }
                    
                    const totalForType = pricePerSeat * seatCount;
                    
                    const seatInfoDiv = document.createElement('div');
                    seatInfoDiv.className = 'seat-info';
                    seatInfoDiv.innerHTML = `
                        <div class="seat-selected">
                            <div class="seat-total">${seatCount}x Ghế ${typeDisplay}</div>
                            <div class="seat-number">Ghế: ${seats.join(', ')}</div>
                        </div>
                        <div class="seat-price">${this.formatPrice(totalForType)}</div>
                    `;
                    
                    seatInfoContainer.appendChild(seatInfoDiv);
                }
            });
        } else {
            // Show the selection alert
            if (seatSelectionAlert) {
                seatSelectionAlert.style.display = 'block';
            }
        }
    }
    
    updateUI() {
        console.log('updateUI called');
        
        const nextButton = document.querySelector('#proceedToPayment');
        const giftButton = document.querySelector('#giftTicket');
        const hasSelectedSeats = Object.values(this.selectedSeats).some(seats => seats && seats.length > 0);
        
        console.log('Has selected seats:', hasSelectedSeats);
        console.log('Current event:', !!this.currentEvent);
        
        if (nextButton) {
            if (hasSelectedSeats && this.currentEvent) {
                nextButton.disabled = false;
                nextButton.classList.remove('disabled');
                nextButton.innerHTML = '<i class="fas fa-credit-card me-2"></i>THANH TOÁN';
                console.log('Button updated to: THANH TOÁN');
            } else {
                nextButton.disabled = true;
                nextButton.classList.add('disabled');
                nextButton.innerHTML = '<i class="fas fa-credit-card me-2"></i>CHỌN GHẾ TRƯỚC';
                console.log('Button updated to: CHỌN GHẾ TRƯỚC');
            }
        }
        
        if (giftButton) {
            if (hasSelectedSeats && this.currentEvent) {
                giftButton.disabled = false;
                giftButton.classList.remove('disabled');
                giftButton.innerHTML = '<i class="fas fa-gift me-2"></i>TẶNG VÉ';
            } else {
                giftButton.disabled = true;
                giftButton.classList.add('disabled');
                giftButton.innerHTML = '<i class="fas fa-gift me-2"></i>CHỌN GHẾ TRƯỚC';
            }
        }
    }
    
    // Unified method to create booking data
    createBookingData(isGift = false) {
        console.log('Creating booking data...');
        console.log('Current event:', this.currentEvent);
        console.log('Selected seats:', this.selectedSeats);
        
        if (!this.currentEvent) {
            console.error('No current event for booking data');
            return null;
        }
        
        // Get selected seats info
        const selectedSeats = this.selectedSeats || {};
        const seatDetails = [];
        let ticketType = 'VIP';
        let totalQuantity = 0;
        
        // Process selected seats
        Object.keys(selectedSeats).forEach(seatType => {
            if (selectedSeats[seatType] && selectedSeats[seatType].length > 0) {
                const cleanType = seatType.replace('seat-', '');
                seatDetails.push({
                    type: cleanType,
                    seats: selectedSeats[seatType],
                    count: selectedSeats[seatType].length
                });
                
                totalQuantity += selectedSeats[seatType].length;
                
                if (seatDetails.length === 1) {
                    ticketType = cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
                }
            }
        });
        
        // If no seats selected, create default data
        if (seatDetails.length === 0) {
            console.log('No seats selected, using default data');
            seatDetails.push({
                type: 'vip',
                seats: ['V1', 'V2'],
                count: 2
            });
            totalQuantity = 2;
            ticketType = 'VIP';
        }
        
        const bookingData = {
            id: (isGift ? 'gift_' : 'booking_') + Date.now(),
            eventId: this.currentEvent.id || 'test-event',
            eventName: this.currentEvent.title || 'Test Event',
            eventDate: this.currentEvent.date || '2025-01-01',
            eventTime: this.currentEvent.time || '20:00',
            venue: this.currentEvent.venue || 'Test Venue',
            ticketType: ticketType,
            seatDetails: seatDetails,
            seatSection: seatDetails.map(d => `${d.type}: ${d.seats.join(', ')}`).join(' | '),
            price: this.totalPrice > 0 ? Math.floor(this.totalPrice / totalQuantity) : 800000,
            quantity: totalQuantity,
            totalAmount: this.totalPrice > 0 ? this.totalPrice : (totalQuantity * 800000),
            timestamp: new Date().toISOString(),
            status: isGift ? 'gift' : 'pending',
            isGift: isGift,
            bookingType: 'seat-booking',
            eventImage: this.currentEvent.image || 'assets/images/music/lc1.jpg'
        };
        
        console.log('Created booking data:', bookingData);
        return bookingData;
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
        console.log('=== PROCEED TO PAYMENT CALLED ===');
        
        try {
            // Validate we have event and seats
            if (!this.currentEvent) {
                console.log('No current event found');
                alert('Không tìm thấy thông tin sự kiện!');
                return;
            }
            
            const hasSelectedSeats = Object.values(this.selectedSeats).some(seats => seats && seats.length > 0);
            console.log('Has selected seats:', hasSelectedSeats, 'Selected seats:', this.selectedSeats);
            
            if (!hasSelectedSeats) {
                console.log('No seats selected');
                alert('Vui lòng chọn ghế trước khi thanh toán!');
                return;
            }
            
            // Create and save booking data
            const bookingData = this.createBookingData(false);
            console.log('Created booking data:', bookingData);
            
            if (bookingData && this.saveBooking(bookingData)) {
                console.log('Booking saved successfully, attempting redirect...');
                
                // Add a small delay and try redirect
                setTimeout(() => {
                    console.log('Executing redirect to payment.html');
                    try {
                        window.location.href = 'payment.html';
                        console.log('Redirect command executed');
                    } catch (redirectError) {
                        console.error('Redirect failed:', redirectError);
                        // Try alternative method
                        window.location.replace('payment.html');
                    }
                }, 100);
                
            } else {
                console.error('Failed to save booking data');
                alert('Có lỗi xảy ra khi lưu thông tin đặt vé. Vui lòng thử lại!');
            }
            
        } catch (error) {
            console.error('Error in proceedToPayment:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    }
    
    giftTicket() {
        console.log('=== GIFT TICKET CALLED ===');
        
        try {
            // Validate we have event and seats
            if (!this.currentEvent) {
                console.log('No current event found');
                alert('Không tìm thấy thông tin sự kiện!');
                return;
            }
            
            const hasSelectedSeats = Object.values(this.selectedSeats).some(seats => seats && seats.length > 0);
            console.log('Has selected seats:', hasSelectedSeats, 'Selected seats:', this.selectedSeats);
            
            if (!hasSelectedSeats) {
                console.log('No seats selected');
                alert('Vui lòng chọn ghế trước khi tặng vé!');
                return;
            }
            
            // Create and save gift booking data
            const bookingData = this.createBookingData(true);
            console.log('Created gift booking data:', bookingData);
            
            if (bookingData && this.saveBooking(bookingData)) {
                console.log('Gift booking saved successfully, attempting redirect...');
                
                // Add a small delay and try redirect
                const redirectUrl = `ticketGift.html?bookingId=${bookingData.id}&type=booking`;
                console.log('Redirect URL:', redirectUrl);
                
                setTimeout(() => {
                    console.log('Executing redirect to gift page');
                    try {
                        window.location.href = redirectUrl;
                        console.log('Redirect command executed');
                    } catch (redirectError) {
                        console.error('Redirect failed:', redirectError);
                        // Try alternative method
                        window.location.replace(redirectUrl);
                    }
                }, 100);
                
            } else {
                console.error('Failed to save gift booking data');
                alert('Có lỗi xảy ra khi lưu thông tin tặng vé. Vui lòng thử lại!');
            }
            
        } catch (error) {
            console.error('Error in giftTicket:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    }
    
    goBack() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        if (eventId) {
            window.location.href = `eventDetail.html?id=${eventId}&type=live-music`;
        } else {
            window.location.href = 'music.html';
        }
    }
    
    showNoEventMessage() {
        document.getElementById('eventTitle').textContent = 'Không tìm thấy sự kiện';
        document.getElementById('eventDate').textContent = 'N/A';
        document.getElementById('eventVenue').textContent = 'N/A';
        document.getElementById('eventDuration').textContent = 'N/A';
        
        document.getElementById('ticketOptions').innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <h4>Không tìm thấy sự kiện</h4>
                    <p>Vui lòng chọn một sự kiện hợp lệ để tiếp tục đặt vé.</p>
                    <a href="music.html" class="btn btn-danger">Quay lại danh sách Nhạc sống</a>
                </div>
            </div>
        `;
    }
    
    formatPrice(price) {
        if (!price || price === 0) {
            return '0 đ';
        }
        
        // Format the price with Vietnamese locale
        const formatted = new Intl.NumberFormat('vi-VN').format(price);
        return formatted + ' đ';
    }
}

// Initialize booking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicBookingInstance = new MusicBooking();
});