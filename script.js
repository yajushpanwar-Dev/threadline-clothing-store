// THREADLINE storefront interactions — front-end demo data only.
const products = [
  { id: 1, name: "Essential Heavy Tee", category: "Tops", price: 899, tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Relaxed Everyday Shirt", category: "Tops", price: 1499, tag: "NEW", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Straight Fit Trousers", category: "Bottoms", price: 1899, tag: "", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "Everyday Denim", category: "Bottoms", price: 2199, tag: "POPULAR", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85" },
  { id: 5, name: "Utility Overshirt", category: "Layers", price: 2499, tag: "NEW", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=85" },
  { id: 6, name: "Minimal Zip Hoodie", category: "Layers", price: 2799, tag: "", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85" }
];
let activeCategory = "All";
let cart = [];
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
const formatPrice = (price) => "₹" + price.toLocaleString("en-IN");
function renderProducts() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const sort = document.getElementById("sortSelect").value;
  let visible = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  productGrid.innerHTML = visible.map((product) => `
    <article class="product-card"><div class="product-image-wrap"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      <button class="quick-add" data-add="${product.id}">ADD TO BAG +</button></div>
      <div class="product-info"><div><p class="product-name">${product.name}</p><span class="product-category">${product.category}</span></div><span class="product-price">${formatPrice(product.price)}</span></div></article>`).join("");
  emptyState.hidden = visible.length !== 0;
}
function showToast(message) {
  toast.textContent = message; toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.quantity += 1; else cart.push({ id: productId, quantity: 1 });
  renderCart(); showToast("Added to your bag");
}
function changeQuantity(productId, amount) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== productId);
  renderCart();
}
function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + product.price * item.quantity;
  }, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartEmpty").hidden = count > 0;
  document.getElementById("cartFooter").hidden = count === 0;
  document.getElementById("cartItems").innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<div class="cart-item"><img src="${product.image}" alt="${product.name}"><div><h3>${product.name}</h3><p>${formatPrice(product.price)}</p>
      <div class="quantity-controls"><button data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button></div></div>
      <button class="remove-item" data-remove="${product.id}" aria-label="Remove ${product.name}">×</button></div>`;
  }).join("");
}
function openCart() {
  cartDrawer.classList.add("open"); overlay.classList.add("visible"); cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open"); overlay.classList.remove("visible"); cartDrawer.setAttribute("aria-hidden", "true");
}
function closeModal() { document.getElementById("checkoutModal").classList.remove("visible"); }
document.getElementById("filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]"); if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderProducts();
});
document.getElementById("sortSelect").addEventListener("change", renderProducts);
document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]"); if (button) addToCart(Number(button.dataset.add));
});
document.getElementById("cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) { cart = cart.filter((item) => item.id !== Number(removeButton.dataset.remove)); renderCart(); }
});
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("searchToggle").addEventListener("click", () => {
  const panel = document.getElementById("searchPanel"); panel.classList.toggle("visible");
  if (panel.classList.contains("visible")) document.getElementById("searchInput").focus();
});
document.getElementById("closeSearch").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.remove("visible");
  document.getElementById("searchInput").value = ""; renderProducts();
});
document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav"); const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", () => {
  document.getElementById("mainNav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
}));
document.getElementById("checkoutButton").addEventListener("click", () => {
  closeCart(); document.getElementById("checkoutModal").classList.add("visible");
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalDone").addEventListener("click", closeModal);
document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault(); showToast("Thanks for signing up — this is a demo form!"); event.target.reset();
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeCart(); closeModal(); } });
renderProducts(); renderCart();