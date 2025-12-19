let qty = 1;

function changeQty(value) {
    qty += value;
    if (qty < 1) qty = 1;
    document.getElementById("qty").value = qty;
}

function openTab(index) {
    const tabs = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-buttons button");

    tabs.forEach(tab => tab.classList.remove("active"));
    buttons.forEach(btn => btn.classList.remove("active"));

    tabs[index].classList.add("active");
    buttons[index].classList.add("active");
}
function changeQty(value) {
    qty += value;
    if (qty < 1) qty = 1;
    document.getElementById("qty").value = qty;
}
const productImg = document.getElementById("productImg");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

productImg.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = productImg.src;
});

function closeModal() {
    modal.style.display = "none";
}
