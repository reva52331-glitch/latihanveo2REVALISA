const products = [
  {
    id: 1,
    name: "Kopi Arabika",
    price: 75000,
    description: "Biji kopi pilihan, cocok untuk kopi pagi Anda.",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Tas Kulit",
    price: 185000,
    description: "Tas multifungsi untuk kerja dan jalan-jalan.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Sepatu Sport",
    price: 320000,
    description: "Nyaman untuk olahraga dan aktivitas harian.",
    image: "https://images.unsplash.com/photo-1519741490584-0758d7331e5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Lampu Meja",
    price: 95000,
    description: "Lampu LED stylish untuk ruang kerja atau kamar.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
];

const cart = {};
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const checkoutButton = document.getElementById("checkoutButton");

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-image" style="background-image: url('${product.image}')"></div>
        <div class="product-content">
          <h3>${product.name}</h3>
          <p class="price">${formatCurrency(product.price)}</p>
          <p>${product.description}</p>
          <div class="product-actions">
            <button class="button button-primary" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function updateCartDisplay() {
  const keys = Object.keys(cart);
  const quantity = keys.reduce((sum, id) => sum + cart[id].quantity, 0);

  cartToggle.textContent = `Keranjang (${quantity})`;

  if (keys.length === 0) {
    cartItems.innerHTML = "<p>Keranjang kosong. Tambahkan produk terlebih dahulu.</p>";
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  let subtotal = 0;
  cartItems.innerHTML = keys
    .map((id) => {
      const item = cart[id];
      const totalPrice = item.price * item.quantity;
      subtotal += totalPrice;
      return `
        <div class="cart-item">
          <div class="cart-item-details">
            <p class="cart-item-title">${item.name}</p>
            <p class="cart-item-meta">${formatCurrency(item.price)} x ${item.quantity}</p>
          </div>
          <div class="cart-item-actions">
            <button class="button" onclick="changeQuantity(${item.id}, -1)">-</button>
            <button class="button" onclick="changeQuantity(${item.id}, 1)">+</button>
            <button class="button" style="background: var(--danger); color:#fff;" onclick="removeFromCart(${item.id})">Hapus</button>
          </div>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = formatCurrency(subtotal);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 0 };
  }

  cart[productId].quantity += 1;
  updateCartDisplay();
  openCart();
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;

  cart[productId].quantity += delta;
  if (cart[productId].quantity <= 0) {
    delete cart[productId];
  }
  updateCartDisplay();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCartDisplay();
}

function openCart() {
  cartPanel.classList.add("open");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
}

cartToggle.addEventListener("click", () => {
  if (cartPanel.classList.contains("open")) {
    closeCartPanel();
  } else {
    openCart();
  }
});

closeCart.addEventListener("click", closeCartPanel);
checkoutButton.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("Keranjang masih kosong. Tambahkan produk dulu.");
    return;
  }
  alert("Terima kasih! Pesanan Anda sudah diterima.");
  Object.keys(cart).forEach((key) => delete cart[key]);
  updateCartDisplay();
  closeCartPanel();
});

window.addEventListener("load", () => {
  renderProducts();
  updateCartDisplay();
});
