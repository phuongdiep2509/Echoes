* ======================
   QUANTITY
====================== */
let qty = 1;

function changeQty(value) {
    qty += value;
    if (qty < 1) qty = 1;
    document.getElementById("qty").value = qty;
}

/* ======================
   TABS
====================== */
function openTab(index) {
    const tabs = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-buttons button");

    tabs.forEach(tab => tab.classList.remove("active"));
    buttons.forEach(btn => btn.classList.remove("active"));

    tabs[index].classList.add("active");
    buttons[index].classList.add("active");
}

/* ======================
   IMAGE MODAL
====================== */
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

/* ======================
   ADD TO CART + TOAST
====================== */
const addCartBtn = document.querySelector(".add-cart");

// tạo toast 1 lần
const toast = document.createElement("div");
toast.className = "toast";
toast.innerHTML = "Đã thêm vào giỏ hàng";
document.body.appendChild(toast);

addCartBtn.addEventListener("click", () => {
    // (sau này có thể push vào localStorage / cart array)
    console.log("Added to cart:", {
        product: "Castle Veil Bandana",
        quantity: qty
    });

    showToast();
});

function showToast() {
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}
