document.addEventListener('DOMContentLoaded', () => {
    
    // Khởi tạo AuthManager
    const authManager = new AuthManager();

    // 1. KHAI BÁO BIẾN (Tất cả các thành phần)
    const modalOverlay = document.getElementById('modalOverlay');
    const authModal = document.querySelector('.auth-modal'); // Modal chính
    const container = document.querySelector('.container');
    
    // Nút chuyển đổi
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const closeBtn = document.getElementById('closeBtn'); // Nút đóng modal chính
    
    // Mobile navigation buttons
    const mobileLoginBtn = document.querySelector('.mobile-login-btn');
    const mobileRegisterBtn = document.querySelector('.mobile-register-btn');

    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Forgot Password elements
    const forgotLink = document.querySelector('#forgotLink'); // Đã thêm ID vào HTML
    const forgotModal = document.getElementById('forgotModal'); 
    const forgotForm = document.getElementById('forgotForm');
    const forgotCloseBtn = document.getElementById('closeForgotBtn'); // Đã sửa ID trong HTML
    const forgotSuccessMessage = document.getElementById('forgotSuccessMessage');
    const forgotCloseSuccessBtn = document.getElementById('forgotCloseSuccess');

    // Password Validation (Register)
    const passwordMain = document.querySelector('.register input[name="reg_password"]');
    const passwordValidationBox = document.querySelector('.password-validation-box');
    const passwordRules = passwordValidationBox ? passwordValidationBox.querySelectorAll('li') : [];
    const passwordTitle = passwordValidationBox ? passwordValidationBox.querySelector('.error-title') : null;
    
    // 2. RULES & VALIDATION
    const rules = {
        length: (p) => p.length >= 8 && p.length <= 32,
        lower_digit: (p) => /[a-z]/.test(p) && /\d/.test(p),
        special: (p) => /[!@#$%^&*_]/.test(p),
        upper: (p) => /[A-Z]/.test(p),
    };
    // 2. Hàm đóng modal và chuyển trang
    
    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    function checkPassword(password) {
        if (!passwordRules.length) return false;

        let valid = true;

        passwordRules.forEach(li => {
            const ruleName = li.dataset.rule;
            const check = rules[ruleName];
            const icon = li.querySelector('.check-icon');

            if (!check(password)) {
                if (icon) icon.textContent = '✗';
                li.style.color = "#fff";
                if (icon) icon.style.color = "#fff";
                valid = false;
            } else {
                if (icon) icon.textContent = '✓';
                li.style.color = "#38c172";
                if (icon) icon.style.color = "#38c172";
            }
        });

        return valid;
    }

    function updatePasswordValidation() {
        if (!passwordMain || !passwordValidationBox || !passwordTitle) return;
        const isValid = checkPassword(passwordMain.value);

        if (isValid) {
            passwordValidationBox.classList.add("valid");
            passwordValidationBox.classList.remove("error");
            passwordTitle.textContent = "✓ Mật khẩu hợp lệ";
            passwordTitle.style.color = "#38c172";
        } else {
            passwordValidationBox.classList.remove("valid");
            passwordValidationBox.classList.add("error");
            passwordTitle.textContent = "❌ Mật khẩu chưa hợp lệ";
            passwordTitle.style.color = "#fff";
        }
    }

    if (passwordMain) {
        passwordMain.addEventListener("input", updatePasswordValidation);
        // run once to set initial state
        updatePasswordValidation();
    }


    // 3. HANDLERS MODAL CHÍNH (ĐĂNG NHẬP/ĐĂNG KÝ)
    
    /* --- TOGGLE FORM --- */
    function openRegister() {
        if (container) container.classList.add("active");
        // set ARIA visibility
        document.querySelector('.form-box.register').setAttribute('aria-hidden', 'false');
        document.querySelector('.form-box.login').setAttribute('aria-hidden', 'true');
    }
    function openLogin() {
        if (container) container.classList.remove("active");
        document.querySelector('.form-box.register').setAttribute('aria-hidden', 'true');
        document.querySelector('.form-box.login').setAttribute('aria-hidden', 'false');
    }

    if (registerBtn) registerBtn.addEventListener("click", openRegister);
    if (loginBtn) loginBtn.addEventListener("click", openLogin);
    
    // Mobile navigation events
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", openLogin);
    if (mobileRegisterBtn) mobileRegisterBtn.addEventListener("click", openRegister);
    

    /* --- CLOSE MODAL CHÍNH --- */
    if (closeBtn && modalOverlay) {
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
            // Đóng cả form quên mật khẩu nếu nó đang mở
            if (forgotModal) forgotModal.style.display = 'none'; 
            if (authModal) authModal.style.display = 'block'; // Đảm bảo form chính hiện lại khi mở lần sau
        });
    }

    // 4. HANDLERS FORGOT PASSWORD
    function openForgotModal() {
        if (forgotModal) {
            forgotModal.style.display = 'flex'; // Hiển thị modal quên mật khẩu
            
            // Đảm bảo form gửi email hiện và thông báo thành công ẩn
            if (forgotForm) forgotForm.style.display = 'block'; 
            if (forgotSuccessMessage) forgotSuccessMessage.style.display = 'none';
        }
    }

    function closeForgotModal() {
        if (forgotModal) {
            forgotModal.style.display = 'none'; // Ẩn form quên mật khẩu
        }
    }

    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            openForgotModal();
        });
    }

    if (forgotCloseBtn) forgotCloseBtn.addEventListener('click', closeForgotModal);
    if (forgotCloseSuccessBtn) forgotCloseSuccessBtn.addEventListener('click', closeForgotModal);

    // 5. EVENT LISTENERS FORM SUBMIT

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username') || '';
            const password = formData.get('password') || '';

            if (!username.trim() || !password.trim()) {
                alert('Vui lòng nhập đầy đủ thông tin đăng nhập.');
                return;
            }

            try {
                // Đăng nhập với AuthManager
                const result = authManager.login(username, password);
                alert('Đăng nhập thành công!');
                loginForm.reset();
                
                // Chuyển hướng
                if (window.parent !== window) {
                    // Đang chạy trong iframe
                    window.parent.postMessage(
                        { action: 'closeModalAndRedirect', url: '../index.html' },
                        '*'
                    );
                } else {
                    // Mở trực tiếp
                    window.location.href = '../index.html';
                }
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('reg_username') || '';
            const email = formData.get('reg_email') || '';
            const pwd = formData.get('reg_password') || '';

            if (!username.trim() || !email.trim() || !pwd.trim()) {
                alert('Vui lòng nhập đầy đủ thông tin đăng ký.');
                return;
            }
            if (!isValidEmail(email)) {
                alert('Email không đúng định dạng. Ví dụ hợp lệ: ten@gmail.com');
                return;
            }   
            if (!checkPassword(pwd)) {
                alert('Mật khẩu chưa đạt yêu cầu.');
                return;
            }
            try {
                // Đăng ký với AuthManager
                authManager.register({ username, email, password: pwd });
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                registerForm.reset();
                updatePasswordValidation();
                openLogin(); // Chuyển về form đăng nhập
            } catch (error) {
                alert(error.message);
            }
        });
    }
    
    // Xử lý sự kiện GỬI EMAIL
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = new FormData(forgotForm).get('forgot_email');
            
            if (!email || !isValidEmail(email)) {
                alert('Vui lòng nhập email hợp lệ.');
                return;
            }

            // --- GIẢ LẬP GỬI EMAIL ---
            console.log(`Đang gửi liên kết đặt lại mật khẩu đến: ${email}`);

            // Ẩn form và hiện thông báo thành công
            if (forgotForm) forgotForm.style.display = 'none';
            if (forgotSuccessMessage) forgotSuccessMessage.style.display = 'block';
            
            // Reset form
            forgotForm.reset();
        });
    }

    // 6. OVERLAY CLICK TO CLOSE
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            // Chỉ đóng nếu click chính xác vào lớp phủ (không phải modal con)
            if (e.target === modalOverlay) { 
                modalOverlay.style.display = 'none';
                if (forgotModal) forgotModal.style.display = 'none';
                if (authModal) authModal.style.display = 'block'; // Đảm bảo form chính hiện lại khi mở lần sau
            }
        });
    }

    // Xử lý click overlay cho modal quên mật khẩu
    if (forgotModal) {
        forgotModal.addEventListener('click', (e) => {
            if (e.target === forgotModal) {
                closeForgotModal();
            }
        });
    }
});