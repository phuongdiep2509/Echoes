import { news } from './ObjectForEchoes.js';
const POSTS_PER_PAGE = 3; // Số bài mỗi trang
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    renderNewsList();
});


async function loadLayout() {
    try {
        // Cùng nằm trong thư mục components nên gọi trực tiếp
        const [h, f] = await Promise.all([
            fetch('../components/user_header.html').then(res => res.text()),
            fetch('../components/user_footer.html').then(res => res.text())
        ]);
        document.getElementById('header-placeholder').innerHTML = h;
        document.getElementById('footer-placeholder').innerHTML = f;
    } catch (err) { console.error("Lỗi nạp layout:", err); }
}


function renderNewsList() {
    const main = document.getElementById('news-list-container');
    const sidebar = document.getElementById('sidebar-news');
    const entries = Object.entries(news);
     // Phân trang
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pageEntries = entries.slice(start, end);

    main.innerHTML = entries.map(([id, data]) => `
        <div class="news-item mb-4 shadow-sm" onclick="location.href='NewDetail.html?id=${id}'" style="cursor:pointer; background:#fff; border-radius:10px; overflow:hidden;">
            <div class="row g-0">
                <div class="col-md-4 p-4 d-flex align-items-center justify-content-center" style="background:${data.bgColor}; min-height:160px;">
                    <h3 class="fw-bold m-0">${data.label}</h3>
                </div>
                <div class="col-md-8 p-4">
                    <span class="text-danger small fw-bold">[${data.category}]</span>
                    <h5 class="fw-bold mt-2">${data.title}</h5>
                    <p class="text-muted small">${data.intro}</p>
                    <small class="text-secondary">📅 ${data.date}</small>
                </div>
            </div>
        </div>
    `).join('');


    sidebar.innerHTML = entries.slice(0, 3).map(([id, data]) => `
        <div class="mb-3 border-bottom pb-2" style="cursor:pointer" onclick="location.href='NewDetail.html?id=${id}'">
            <strong class="small d-block">${data.title}</strong>
            <small class="text-muted" style="font-size:0.7rem;">${data.date}</small>
        </div>
    `).join('');
    
}



