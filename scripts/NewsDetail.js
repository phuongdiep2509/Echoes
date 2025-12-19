import { news } from './ObjectForEchoes.js';


document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    renderDetail();
});


async function loadLayout() {
    try {
        // Cùng thư mục components
        const [h, f] = await Promise.all([
            fetch('../components/user_header.html').then(res => res.text()),
            fetch('../components/user_footer.html').then(res => res.text())
        ]);
        document.getElementById('header-placeholder').innerHTML = h;
        document.getElementById('footer-placeholder').innerHTML = f;
    } catch (err) { console.error(err); }
}


function renderDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const data = news[id];


    if (!data) return;


    document.getElementById('news-title').textContent = data.title;
    document.getElementById('news-date').textContent = "Đăng ngày: " + data.date;


    const content = document.getElementById('news-content');
    content.innerHTML = `
        <p class="lead fw-bold mb-4" style="color:#3d3d29;">${data.intro}</p>
        ${data.images.map(img => {
            // Nếu src bắt đầu bằng /, ta bỏ / và thêm ../ để lùi ra khỏi thư mục components
            const fixedSrc = img.src.startsWith('/') ? `..${img.src}` : `../${img.src}`;
            return `
                <figure class="my-4 text-center">
                    <img src="${fixedSrc}" class="img-fluid rounded shadow" style="max-height:500px;">
                    <figcaption class="text-muted mt-2 small">${img.caption}</figcaption>
                </figure>
            `;
        }).join('')}
        <div class="fs-5 lh-lg text-justify">
            ${data.paragraphs.map(p => `<p class="mb-3">${p}</p>`).join('')}
        </div>
        <div class="mt-5"><a href="News.html" class="btn btn-outline-dark"> Quay lại</a></div>
    `;
}

