// ===============================
// Sticky Header
// ===============================

window.addEventListener("scroll", function () {

const header = document.querySelector("header");

header.classList.toggle("sticky", window.scrollY > 50);

});

// ===============================
// Active Navbar
// ===============================

const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(link => {

link.addEventListener("click", function () {

navLinks.forEach(item => item.classList.remove("active"));

this.classList.add("active");

});

});

// ===============================
// Scroll Animation
// ===============================

const observer = new IntersectionObserver((entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

const hiddenElements = document.querySelectorAll(".feature-box,.product-card,.hero-text,.hero-image");

hiddenElements.forEach((el)=>observer.observe(el));

// ===============================
// Button Hover Effect
// ===============================

const buttons = document.querySelectorAll(".btn,.buy-btn,.login-btn");

buttons.forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="scale(1.05)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="scale(1)";

});

});

// ===============================
// Product Card Hover
// ===============================

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

card.addEventListener("mousemove",()=>{

card.style.transform="translateY(-12px)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0)";

});

});

// ===============================
// Contact Form
// ===============================

const form=document.getElementById("contactForm");

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

const name = form.querySelector("input[placeholder='Your Name']").value.trim();
const email = form.querySelector("input[placeholder='Your Email']").value.trim();
const subject = form.querySelector("input[placeholder='Subject']").value.trim();
const message = form.querySelector("textarea").value.trim();

const messages = JSON.parse(localStorage.getItem("ps_messages") || "[]");
messages.unshift({ name, email, subject, message, date: new Date().toISOString() });
localStorage.setItem("ps_messages", JSON.stringify(messages));

alert("Your message has been sent successfully!");

form.reset();

});

}



document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target = this.getAttribute("href");

if (target === "#") return;

e.preventDefault();

document.querySelector(target).scrollIntoView({

behavior:"smooth"

});

});

});

console.log("PURNASATWA Website Loaded Successfully");



// ============================================================
// CHECKOUT PAGE - collect delivery details, go to payment
// ============================================================

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("coName").value.trim();
    const phone = document.getElementById("coPhone").value.trim();
    const address = document.getElementById("coAddress").value.trim();
    const city = document.getElementById("coCity").value.trim();
    const pin = document.getElementById("coPin").value.trim();

    if (name.length < 3) { alert("Please enter your full name"); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { alert("Please enter a valid 10-digit mobile number"); return; }
    if (address.length < 8) { alert("Please enter your complete delivery address"); return; }
    if (city.length < 2) { alert("Please enter your city"); return; }
    if (!/^\d{6}$/.test(pin)) { alert("Please enter a valid 6-digit PIN code"); return; }

    localStorage.setItem("ps_delivery", JSON.stringify({ name, phone, address, city, pin }));
    location.href = "payment.html";
  });

}

// ============================================================
// PAYMENT PAGE  (added by opencode)
// ============================================================

const payPage = document.querySelector(".checkout-grid");

if (payPage) {

// ---------- Pre-fill delivery details from checkout page ----------
const savedDelivery = JSON.parse(localStorage.getItem("ps_delivery") || "null");
if (savedDelivery) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set("cName", savedDelivery.name);
  set("cPhone", savedDelivery.phone);
  set("cAddress", savedDelivery.address);
  set("cCity", savedDelivery.city);
  set("cPin", savedDelivery.pin);
  const emailEl = document.getElementById("cEmail");
  const logged = JSON.parse(localStorage.getItem("ps_user") || "null");
  if (!emailEl.value && logged && logged.email) emailEl.value = logged.email;
  localStorage.removeItem("ps_delivery");
}

// ---------- Order Data (synced from the cart page) ----------
const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
const ORDER_ITEMS = savedCart.length
  ? savedCart.map(it => ({ name: it.name, img: it.image, qty: it.quantity, price: it.price }))
  : [
      { name: "A2 Cow Ghee", img: "img/pure ghee about.png", qty: 1, price: 899 },
      { name: "Buffalo Ghee", img: "img/buffelo.png", qty: 2, price: 799 }
    ];
const DELIVERY_FREE_ABOVE = 999;
const GST_RATE = 5;
const SHIPPING = 0;

let cart = { subtotal: 0, delivery: 0, gst: 0, total: 0 };
let selectedMethod = "upi";
let selectedUpiApp = "";
let selectedWallet = "";

const INR = n => "₹" + n.toLocaleString("en-IN");

// ---------- Money in words ----------
function amountInWords(num) {
  if (num === 0) return "Zero Rupees Only";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = n => n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  let words = "";
  if (num >= 10000000) { words += two(Math.floor(num / 10000000)) + " Crore "; num %= 10000000; }
  if (num >= 100000) { words += two(Math.floor(num / 100000)) + " Lakh "; num %= 100000; }
  if (num >= 1000) { words += two(Math.floor(num / 1000)) + " Thousand "; num %= 1000; }
  if (num >= 100) { words += two(Math.floor(num / 100)) + " Hundred "; num %= 100; }
  if (num > 0) words += two(num);
  return words.trim() + " Rupees Only";
}

// ---------- Build summary ----------
function buildCart() {
  const subtotal = ORDER_ITEMS.reduce((s, it) => s + it.price * it.qty, 0);
  cart.subtotal = subtotal;
  cart.delivery = subtotal >= DELIVERY_FREE_ABOVE ? 0 : 60;
  cart.gst = Math.round(subtotal * GST_RATE / 100);
  cart.total = subtotal + cart.delivery + cart.gst;
  const wrap = document.getElementById("summaryItems");
  wrap.innerHTML = ORDER_ITEMS.map(it => `
    <div class="sum-item">
      <img src="${it.img}" alt="">
      <div class="sum-item-info"><h4>${it.name}</h4><p>Qty : ${it.qty}</p></div>
      <span class="sum-price">${INR(it.price * it.qty)}</span>
    </div>`).join("");
  document.getElementById("sSubtotal").textContent = INR(cart.subtotal);
  document.getElementById("sDelivery").textContent = cart.delivery === 0 ? "FREE" : INR(cart.delivery);
  document.getElementById("sGst").textContent = INR(cart.gst);
  document.getElementById("sTotal").textContent = INR(cart.total);
  document.getElementById("payAmt").textContent = INR(cart.total);
  document.getElementById("codAmt").textContent = INR(cart.total);
}

// ---------- Tabs ----------
document.querySelectorAll(".pay-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pay-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".pay-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    selectedMethod = tab.dataset.tab;
    document.getElementById("panel-" + selectedMethod).classList.add("active");
  });
});

// ---------- App / wallet selection ----------
document.querySelectorAll(".upi-app").forEach(app => {
  app.addEventListener("click", () => {
    app.parentElement.querySelectorAll(".upi-app").forEach(x => x.classList.remove("selected"));
    app.classList.add("selected");
    if (app.parentElement.closest("#panel-upi")) { selectedUpiApp = app.dataset.upi; selectedWallet = ""; }
    else { selectedWallet = app.dataset.upi; selectedUpiApp = ""; }
  });
});

// ---------- Live card preview ----------
const cardNum = document.getElementById("cardNum");
const cardName = document.getElementById("cardName");
const cardExp = document.getElementById("cardExp");
if (cardNum) {
  cardNum.addEventListener("input", () => {
    let v = cardNum.value.replace(/\D/g, "").slice(0, 16);
    cardNum.value = v.replace(/(.{4})/g, "$1 ").trim();
    document.getElementById("cpNum").textContent = cardNum.value || "•••• •••• •••• ••••";
  });
  cardName.addEventListener("input", () => {
    document.getElementById("cpName").textContent = cardName.value.toUpperCase() || "CARD HOLDER NAME";
  });
  cardExp.addEventListener("input", () => {
    let v = cardExp.value.replace(/\D/g, "").slice(0, 4);
    cardExp.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
    document.getElementById("cpExp").textContent = cardExp.value || "MM/YY";
  });
}

// ---------- Validation ----------
function getField(id) { return document.getElementById(id).value.trim(); }

function validate() {
  const name = getField("cName"), phone = getField("cPhone"), email = getField("cEmail");
  const addr = getField("cAddress"), city = getField("cCity"), pin = getField("cPin");
  const err = msg => { alert(msg); return false; };
  if (name.length < 3) return err("Please enter your full name");
  if (!/^[6-9]\d{9}$/.test(phone)) return err("Please enter a valid 10-digit mobile number");
  if (!/^\S+@\S+\.\S+$/.test(email)) return err("Please enter a valid email address");
  if (addr.length < 8) return err("Please enter your complete delivery address");
  if (city.length < 2) return err("Please enter your city");
  if (!/^\d{6}$/.test(pin)) return err("Please enter a valid 6-digit PIN code");
  if (selectedMethod === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(getField("upiId")))
    return err("Please enter a valid UPI ID (e.g. name@upi)");
  if (selectedMethod === "card") {
    if (cardNum.value.replace(/\s/g, "").length !== 16) return err("Please enter a valid 16-digit card number");
    if (cardName.value.trim().length < 3) return err("Please enter the name on card");
    if (!/^\d{2}\/\d{2}$/.test(getField("cardExp"))) return err("Please enter card expiry as MM/YY");
    if (!/^\d{3}$/.test(getField("cardCvv"))) return err("Please enter a valid 3-digit CVV");
  }
  if (selectedMethod === "bank" && !getField("bankSelect")) return err("Please select your bank");
  return true;
}

function methodLabel() {
  const map = {
    upi: selectedUpiApp ? selectedUpiApp + " UPI" : "UPI",
    card: "Credit / Debit Card",
    bank: getField("bankSelect") || "Net Banking",
    wallet: selectedWallet || "Wallet",
    cod: "Cash on Delivery"
  };
  return map[selectedMethod];
}

// ---------- Order + Invoice ----------
function makeOrderId() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return "PS" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase();
}

function buildInvoice(order) {
  const d = new Date(order.date);
  const p = n => String(n).padStart(2, "0");
  const dateStr = p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear();
  const rows = order.items.map((it, i) => `
    <tr><td>${i + 1}</td><td>${it.name}</td><td class="a">${it.qty}</td><td class="a">${INR(it.price)}</td><td class="a">${INR(it.price * it.qty)}</td></tr>`).join("");
  return `
    <div class="inv-head">
      <h2>PURNASATWA <span style="color:#b88a44">DAIRY</span></h2>
      <div class="inv-company">
        <b>Bill / Tax Invoice</b><br>
        Anand, Gujarat, India<br>
        +91 9876543210 | info@PURNASATWA.com<br>
        GSTIN : 24AAAAA0000A1Z5
      </div>
    </div>
    <div class="inv-meta">
      <div>
        <b>Bill To :</b> ${order.name}<br>
        ${order.address}, ${order.city} - ${order.pin}<br>
        <b>Phone :</b> ${order.phone} &nbsp;|&nbsp; <b>Email :</b> ${order.email}
      </div>
      <div style="text-align:right">
        <b>Invoice No :</b> INV-${order.id}<br>
        <b>Order Date :</b> ${dateStr}<br>
        <b>Payment :</b> ${order.method}
      </div>
    </div>
    <table class="inv-table">
      <thead><tr><th>#</th><th>Item</th><th class="a">Qty</th><th class="a">Rate</th><th class="a">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="inv-total-rows">
      <div><span>Subtotal</span><span>${INR(order.subtotal)}</span></div>
      <div><span>Delivery Charges</span><span>${order.delivery === 0 ? "FREE" : INR(order.delivery)}</span></div>
      <div><span>GST (CGST 2.5% + SGST 2.5%)</span><span>${INR(order.gst)}</span></div>
      <div class="inv-grand"><span>Grand Total</span><span>${INR(order.total)}</span></div>
    </div>
    <div class="inv-pay"><b>Amount in Words :</b> ${amountInWords(order.total)}</div>
    <div class="inv-pay" style="margin-top:8px"><b>Payment Method :</b> ${order.method} &nbsp;|&nbsp; <b>Order ID :</b> ${order.id} &nbsp;|&nbsp; <b>Status :</b> CONFIRMED ✓</div>
    <div class="inv-foot">
      <b>Thank you for shopping with PURNASATWA!</b><br>
      This is a computer generated invoice and does not require a physical signature.<br>
      For queries call +91 9876543210
    </div>
    <p class="inv-note">* This is a demo invoice for the frontend project — no real payment was processed.</p>`;
}

// ---------- Pay button ----------
document.getElementById("payNowBtn").addEventListener("click", function () {
  if (!validate()) return;
  const btn = this;
  btn.classList.add("loading");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...';

  setTimeout(() => {
    const order = {
      id: makeOrderId(),
      date: new Date(),
      name: getField("cName"),
      phone: getField("cPhone"),
      email: getField("cEmail"),
      address: getField("cAddress"),
      city: getField("cCity"),
      pin: getField("cPin"),
      method: methodLabel(),
      items: ORDER_ITEMS,
      subtotal: cart.subtotal,
      delivery: cart.delivery,
      gst: cart.gst,
      total: cart.total
    };

    const eta = new Date(order.date.getTime() + 4 * 86400000);
    const p = n => String(n).padStart(2, "0");
    const etaStr = p(eta.getDate()) + "-" + p(eta.getMonth() + 1) + "-" + eta.getFullYear();

    document.getElementById("okOrderId").textContent = order.id;
    document.getElementById("okPayMethod").textContent = order.method;
    document.getElementById("okAmount").textContent = INR(order.total);
    document.getElementById("okEta").textContent = etaStr;
    document.getElementById("invoiceBody").innerHTML = buildInvoice(order);
    document.getElementById("successOverlay").classList.add("show");

    const legacy = JSON.parse(localStorage.getItem("gd_orders") || "[]");
    const orders = JSON.parse(localStorage.getItem("ps_orders") || "[]");
    orders.unshift({ ...order, date: order.date.toISOString(), eta: etaStr, status: "Pending" });
    localStorage.setItem("ps_orders", JSON.stringify(orders));
    if (legacy.length) localStorage.removeItem("gd_orders");

    localStorage.removeItem("cart");
    updateCartCount();

    btn.classList.remove("loading");
    btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Pay <span id="payAmt">' + INR(cart.total) + '</span> Securely';
  }, 1600);
});

// ---------- Overlay controls ----------
document.getElementById("viewInvoiceBtn").addEventListener("click", () => {
  document.getElementById("successOverlay").classList.remove("show");
  document.getElementById("invoiceOverlay").classList.add("show");
});
document.getElementById("continueBtn").addEventListener("click", () => location.href = "products.html");
document.getElementById("closeInvoice").addEventListener("click", () => {
  document.getElementById("invoiceOverlay").classList.remove("show");
  document.getElementById("successOverlay").classList.add("show");
});
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.querySelectorAll(".overlay").forEach(ov => {
  ov.addEventListener("click", e => { if (e.target === ov) ov.classList.remove("show"); });
});

buildCart();
}


// ============================================================
// REGISTRATION PAGE  (added by opencode)
// ============================================================

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const pass = document.getElementById("regPass").value;
  const confirm = document.getElementById("regConfirm").value;
  const btn = document.getElementById("regBtn");

  if (name.length < 3) { alert("Please enter your full name"); return false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { alert("Please enter a valid email address"); return false; }
  if (!/^[6-9]\d{9}$/.test(phone)) { alert("Please enter a valid 10-digit mobile number"); return false; }
  if (pass.length < 6) { alert("Password must be at least 6 characters"); return false; }
  if (pass !== confirm) { alert("Passwords do not match"); return false; }

  const users = JSON.parse(localStorage.getItem("ps_users") || "[]");
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    alert("An account with this email already exists. Please login.");
    return false;
  }

  users.push({ name, email, phone, password: pass, joined: new Date().toISOString() });
  localStorage.setItem("ps_users", JSON.stringify(users));

  btn.textContent = "Registering...";
  setTimeout(() => {
    alert("Registration successful! Please login to continue.");
    location.href = "login.html";
  }, 600);
  return false;
}

// ============================================================
// LOGIN PAGE  (validate against registered users)
// ============================================================

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = loginForm.querySelector("input[type=email]").value.trim();
    const pass = loginForm.querySelector("input[type=password]").value;
    const users = JSON.parse(localStorage.getItem("ps_users") || "[]");
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (found) {
      localStorage.setItem("ps_user", JSON.stringify({ name: found.name, email: found.email }));
      alert("Welcome back, " + found.name + "! 🙂");
      location.href = "index.html";
    } else {
      alert("Invalid email or password. Please try again or register first.");
    }
    return false;
  });
}

// ============================================================
// PRODUCT CATALOG - seeded from localStorage (managed by Admin)
// ============================================================

const DEFAULT_PRODUCTS = [
  { name: "Cow Ghee", price: 899, image: "img/ghe  about.png", desc: "100% Pure Bilona Method Ghee." },
  { name: "Buffalo Ghee", price: 799, image: "img/buffelo.png", desc: "Traditional Homemade Taste." },
  { name: "Organic Ghee", price: 999, image: "img/gheeeeeeee.png", desc: "Fresh & Healthy Everyday." },
  { name: "Fresh Cow Milk", price: 80, image: "img/milk.png", desc: "Farm Fresh Everyday.", unit: "/Litre" },
  { name: "Fresh Curd", price: 120, image: "img/curd.png", desc: "Healthy Homemade Curd." },
  { name: "Fresh Paneer", price: 350, image: "img/paneer.png", desc: "Soft & Pure Paneer.", unit: "/kg" },
  { name: "White Butter", price: 450, image: "img/butter.png", desc: "Traditional Makhan." },
  { name: "Sweet Lassi", price: 60, image: "img/lasiii.png", desc: "Refreshing & Natural." }
];

function getProducts() {
  const stored = localStorage.getItem("ps_products");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fall through */ }
  }
  localStorage.setItem("ps_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS.slice();
}

function renderProducts() {
  const container = document.getElementById("productContainer");
  if (!container) return;
  const products = getProducts();
  container.innerHTML = products.map((p, i) => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-content">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <h4 class="price">₹${p.price}${p.unit ? p.unit : ""}</h4>
        <button class="buy-btn add-cart" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">
          Add to Cart
        </button>
      </div>
    </div>`).join("");
}

renderProducts();

// ============================================================
// CART SYSTEM - Add To Cart + Cart Count Badge
// ============================================================

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const product = {
      name: this.dataset.name,
      price: Number(this.dataset.price),
      image: this.dataset.image,
      quantity: 1
    };
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showSuccessMessage();
    updateCartCount();
  });
});

function updateCartCount() {
  const cartIcon = document.querySelector(".fa-cart-shopping");
  if (!cartIcon) return;
  const items = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  let badge = document.querySelector(".cart-count");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    cartIcon.parentElement.style.position = "relative";
    cartIcon.parentElement.appendChild(badge);
  }
  badge.textContent = total;
}

updateCartCount();

// ============================================================
// CART SYSTEM - Success Message Toast
// ============================================================

function showSuccessMessage() {
  const oldMessage = document.querySelector(".cart-success");
  if (oldMessage) oldMessage.remove();

  const message = document.createElement("div");
  message.className = "cart-success";
  message.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    Your Product Added To Cart Successfully
  `;
  document.body.appendChild(message);

  setTimeout(() => message.classList.add("show-success"), 100);
  setTimeout(() => {
    message.classList.remove("show-success");
    setTimeout(() => message.remove(), 500);
  }, 2500);
}

// ============================================================
// CART SYSTEM - Display Cart Products
// ============================================================

function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  const items = JSON.parse(localStorage.getItem("cart") || "[]");
  cartContainer.innerHTML = "";

  if (items.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        🛒 Your Cart is Empty<br><br>
        <a href="products.html" class="checkout-btn">Continue Shopping</a>
      </div>
    `;
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  items.forEach((item, index) => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p class="cart-price">Price : ₹${item.price}</p>
          <div class="qty-box">
            <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQty(${index})">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  updateTotal();
}

// ============================================================
// CART SYSTEM - Quantity + Remove + Total
// ============================================================

function increaseQty(index) {
  let items = JSON.parse(localStorage.getItem("cart") || "[]");
  items[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(items));
  cart = items;
  displayCart();
  updateCartCount();
}

function decreaseQty(index) {
  let items = JSON.parse(localStorage.getItem("cart") || "[]");
  if (items[index].quantity > 1) {
    items[index].quantity--;
  } else {
    items.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(items));
  cart = items;
  displayCart();
  updateCartCount();
}

function removeItem(index) {
  let items = JSON.parse(localStorage.getItem("cart") || "[]");
  items.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(items));
  cart = items;
  displayCart();
  updateCartCount();
}

function updateTotal() {
  const items = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalElement = document.getElementById("cart-total");
  if (totalElement) totalElement.textContent = "₹" + total.toLocaleString("en-IN");
}

displayCart();

// ============================================================
// REVIEWS SECTION - star rating + localStorage (added by opencode)
// ============================================================

const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {

  const stars = document.querySelectorAll("#reviewStars i");
  const ratingInput = document.getElementById("reviewRating");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const val = Number(star.dataset.val);
      ratingInput.value = val;
      stars.forEach(s => {
        const sv = Number(s.dataset.val);
        s.className = sv <= val ? "fa-solid fa-star active" : "fa-regular fa-star";
      });
    });
    star.addEventListener("mouseenter", () => {
      const val = Number(star.dataset.val);
      stars.forEach(s => {
        const sv = Number(s.dataset.val);
        s.className = sv <= val ? "fa-solid fa-star active" : "fa-regular fa-star";
      });
    });
  });

  document.getElementById("reviewStars").addEventListener("mouseleave", () => {
    const val = Number(ratingInput.value);
    stars.forEach(s => {
      const sv = Number(s.dataset.val);
      s.className = sv <= val ? "fa-solid fa-star active" : "fa-regular fa-star";
    });
  });

  function renderStarsHTML(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<i class="fa-solid fa-star active"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

  function loadReviews() {
    const list = document.getElementById("reviewList");
    if (!list) return;
    const reviews = JSON.parse(localStorage.getItem("ps_reviews") || "[]");
    if (reviews.length === 0) {
      list.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    } else {
      list.innerHTML = reviews.map(r => `
        <div class="review-card">
          <div class="review-head">
            <span class="review-name">${r.name}</span>
            <span class="review-stars">${renderStarsHTML(r.rating)}</span>
          </div>
          <p class="review-text">${r.message}</p>
          <span class="review-date">${r.date}</span>
        </div>`).join("");
    }

    const summary = document.getElementById("reviewSummary");
    if (summary) {
      if (reviews.length === 0) {
        summary.innerHTML = "";
      } else {
        const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        summary.innerHTML = `
          <div class="review-avg"><span class="avg-num">${avg.toFixed(1)}</span>
          <span class="avg-stars">${renderStarsHTML(Math.round(avg))}</span>
          <span class="avg-count">Based on ${reviews.length} review${reviews.length > 1 ? "s" : ""}</span></div>`;
      }
    }
  }

  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("reviewName").value.trim();
    const email = document.getElementById("reviewEmail").value.trim();
    const message = document.getElementById("reviewText").value.trim();
    const rating = Number(ratingInput.value);

    if (name.length < 2) { alert("Please enter your name"); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { alert("Please enter a valid email"); return; }
    if (message.length < 5) { alert("Please write a short review"); return; }
    if (rating < 1) { alert("Please select a star rating"); return; }

    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    const dateStr = p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear();

    const reviews = JSON.parse(localStorage.getItem("ps_reviews") || "[]");
    reviews.unshift({ name, email, rating, message, date: dateStr });
    localStorage.setItem("ps_reviews", JSON.stringify(reviews));

    alert("Thank you for your review!");
    reviewForm.reset();
    ratingInput.value = 0;
    stars.forEach(s => s.className = "fa-regular fa-star");
    loadReviews();
  });

  loadReviews();
}

// ============================================================
// SUBSCRIPTIONS PAGE - FAQ Toggle (added by opencode)
// ============================================================

function toggleFaq(el) {
  const item = el.closest(".faq-item");
  item.classList.toggle("open");
}

// ============================================================
// LOGIN PAGE - Logged-in user detection (added by opencode)
// ============================================================

(function() {
  const loginBtn = document.querySelector("a.login-btn");
  if (!loginBtn) return;

  const user = JSON.parse(localStorage.getItem("ps_user") || "null");
  if (user) {
    loginBtn.textContent = "Account";
    loginBtn.href = "account/dashboard.html";
  }
})();
