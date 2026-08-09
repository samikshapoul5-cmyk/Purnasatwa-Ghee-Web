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

console.log("PURNASATVA Website Loaded Successfully");



// ============================================================
// PAYMENT PAGE  (added by opencode)
// ============================================================

const payPage = document.querySelector(".checkout-grid");

if (payPage) {

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
  return "GD" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" +
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
      <h2>PURNASATVA <span style="color:#b88a44">DAIRY</span></h2>
      <div class="inv-company">
        <b>Bill / Tax Invoice</b><br>
        Anand, Gujarat, India<br>
        +91 9876543210 | info@PURNASATVA.com<br>
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
      <b>Thank you for shopping with PURNASATVA!</b><br>
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

    const orders = JSON.parse(localStorage.getItem("gd_orders") || "[]");
    orders.unshift({ ...order, date: order.date.toISOString(), eta: etaStr });
    localStorage.setItem("gd_orders", JSON.stringify(orders));

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
