// Hệ thống quản lý xác thực người dùng với sessionStorage
class AuthManager {
    constructor() {
        this.USERS_KEY = 'echoes_users';
        this.CURRENT_USER_KEY = 'echoes_current_user';
    }

    // Lấy danh sách tất cả users từ sessionStorage
    getAllUsers() {
        const users = sessionStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Lưu danh sách users vào sessionStorage
    saveUsers(users) {
        sessionStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    // Kiểm tra username đã tồn tại
    isUsernameExists(username) {
        const users = this.getAllUsers();
        return users.some(user => user.username === username);
    }

    // Kiểm tra email đã tồn tại
    isEmailExists(email) {
        const users = this.getAllUsers();
        return users.some(user => user.email === email);
    }

    // Đăng ký user mới
    register(userData) {
        const { username, email, password } = userData;

        // Validation
        if (!username || !email || !password) {
            throw new Error('Vui lòng nhập đầy đủ thông tin');
        }

        if (this.isUsernameExists(username)) {
            throw new Error('Tên người dùng đã tồn tại');
        }

        if (this.isEmailExists(email)) {
            throw new Error('Email đã được sử dụng');
        }

        // Tạo user mới
        const users = this.getAllUsers();
        const newUser = {
            id: Date.now(), // ID đơn giản
            username,
            email,
            password: btoa(password), // Mã hóa đơn giản với base64
            createdAt: new Date().toISOString(),
            isActive: true
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Đăng ký thành công!' };
    }

    // Đăng nhập
    login(username, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }

        if (user.password !== btoa(password)) {
            throw new Error('Mật khẩu không đúng');
        }

        if (!user.isActive) {
            throw new Error('Tài khoản đã bị khóa');
        }

        // Lưu thông tin đăng nhập
        const currentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };

        sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    // Đăng xuất
    logout() {
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
        return { success: true, message: 'Đăng xuất thành công' };
    }

    // Lấy thông tin user hiện tại
    getCurrentUser() {
        const userStr = sessionStorage.getItem(this.CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    // Kiểm tra trạng thái đăng nhập
    isLoggedIn() {
        const user = this.getCurrentUser();
        return user && user.isLoggedIn;
    }

    // Cập nhật header UI
    updateHeaderUI() {
        const accountLink = document.querySelector('a[onclick="openModal()"]');
        const userBox = document.getElementById('userBox');
        const accountName = document.getElementById('account-name');
        const logoutBtn = document.getElementById('logoutBtn');

        if (!accountLink || !userBox || !accountName || !logoutBtn) return;

        const currentUser = this.getCurrentUser();

        if (currentUser && currentUser.isLoggedIn) {
            // Đã đăng nhập - hiển thị tên user và nút đăng xuất
            accountLink.style.display = 'none';
            userBox.style.display = 'inline-flex';
            accountName.textContent = currentUser.username;

            // Xử lý sự kiện đăng xuất
            logoutBtn.onclick = () => {
                this.logout();
                this.updateHeaderUI(); // Cập nhật lại UI
                alert('Đăng xuất thành công!');
                // Reload trang để cập nhật trạng thái
                window.location.reload();
            };
        } else {
            // Chưa đăng nhập - hiển thị nút tài khoản
            accountLink.style.display = 'inline';
            userBox.style.display = 'none';
        }
    }
}

// Tạo instance global
window.authManager = new AuthManager();