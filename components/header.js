async function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    const user = localStorage.getItem('user'); // giả sử lưu trạng thái đăng nhập ở đây
    
    let headerFile = 'guest_header.html'; // mặc định chưa đăng nhập
    if (user) {
      headerFile = 'user_header.html';
    }

    try {
      const response = await fetch(headerFile);
      if (response.ok) {
        const headerHTML = await response.text();
        headerContainer.innerHTML = headerHTML;

        // Nếu cần set thêm username trong header-user.html
        if (user) {
          const userObj = JSON.parse(user);
          const usernameElem = document.getElementById('username');
          if (usernameElem) {
            usernameElem.textContent = userObj.username;
          }
        }
      } else {
        headerContainer.innerHTML = '<p>Không thể tải header</p>';
      }
    } catch (error) {
      headerContainer.innerHTML = '<p>Lỗi khi tải header</p>';
    }
  }

  window.onload = loadHeader;

