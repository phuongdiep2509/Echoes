// ===== COMMON UTILITIES FOR ALL PAGES =====

/**
 * Load header component
 */
function loadHeader() {
    const headerContainer = document.getElementById('header');
    if (!headerContainer) return;

    fetch('components/user_header.html')
        .then(res => res.text())
        .then(data => {
            headerContainer.innerHTML = data;
            
            // Set header offset for CSS variables
            function setHeaderOffset() {
                const h = document.getElementById('header')?.offsetHeight || 0;
                document.documentElement.style.setProperty('--header-h', h + 'px');
            }
            
            setHeaderOffset();
            window.addEventListener('resize', setHeaderOffset);
            
            // Update header UI with AuthManager
            if (window.authManager) {
                authManager.updateHeaderUI();
            }
            
            // Load scroll header script
            const script = document.createElement('script');
            script.src = 'components/scroll_header.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading header:', error));
}

/**
 * Load footer component
 */
function loadFooter() {
    const footerContainer = document.getElementById('footer');
    if (!footerContainer) return;

    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

/**
 * Setup common modal functionality
 */
function setupModal() {
    // Modal functions
    window.openModal = function() {
        const modal = document.getElementById("loginModal");
        if (modal) modal.classList.add("show");
    };
    
    window.closeModal = function() {
        const modal = document.getElementById("loginModal");
        if (modal) modal.classList.remove("show");
    };
    
    // Close modal when clicking outside
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
}

/**
 * Initialize common components
 */
function initCommonComponents() {
    loadHeader();
    loadFooter();
    setupModal();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonComponents);
} else {
    initCommonComponents();
}