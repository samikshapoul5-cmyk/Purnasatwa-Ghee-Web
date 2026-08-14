// ============================================================
// PURNASATWA ADMIN PANEL  (added by opencode)
// localStorage based - no server required
// ============================================================

const INR = n => "₹" + n.toLocaleString("en-IN");

// ---------- Auth ----------
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const adminLogin = document.getElementById("adminLogin");
const adminDash = document.getElementById("adminDash");

function isLoggedIn() {
  return localStorage.getItem("ps_admin_logged") === "yes";
}

function requireLogin() {
  if (isLoggedIn()) {
    adminLogin.style.display = "none";
    adminDash.style.display = "block";
    loadAll();
  } else {
    adminLogin.style.display = "flex";
    adminDash.style.display = "none";
  }
}

const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const u = document.getElementById("adminUser").value.trim();
    const p = document.getElementById("adminPass").value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      localStorage.setItem("ps_admin_logged", "yes");
      requireLogin();
    } else {
      alert("Invalid admin credentials. Try admin / admin123");
    }
  });
}

document.getElementById("adminLogoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("ps_admin_logged");
  adminLoginForm.reset();
  requireLogin();
});

// ---------- Helpers ----------
function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = n => String(n).padStart(2, "0");
  return p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear();
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = n => String(n).padStart(2, "0");
  return fmtDate(iso) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

// ---------- Data access ----------
function getOrders() { return JSON.parse(localStorage.getItem("ps_orders") || "[]"); }
function setOrders(orders) { localStorage.setItem("ps_orders", JSON.stringify(orders)); }

function getProducts() {
  const stored = localStorage.getItem("ps_products");
  if (stored) { try { return JSON.parse(stored); } catch (e) {} }
  return [];
}
function setProducts(products) { localStorage.setItem("ps_products", JSON.stringify(products)); }

function getUsers() { return JSON.parse(localStorage.getItem("ps_users") || "[]"); }
function setUsers(users) { localStorage.setItem("ps_users", JSON.stringify(users)); }

function getMessages() { return JSON.parse(localStorage.getItem("ps_messages") || "[]"); }
function setMessages(messages) { localStorage.setItem("ps_messages", JSON.stringify(messages)); }

function getReviews() { return JSON.parse(localStorage.getItem("ps_reviews") || "[]"); }
function setReviews(reviews) { localStorage.setItem("ps_reviews", JSON.stringify(reviews)); }

// ---------- Stats ----------
function loadStats() {
  document.getElementById("statProducts").textContent = getProducts().length;
  document.getElementById("statOrders").textContent = getOrders().length;
  document.getElementById("statUsers").textContent = getUsers().length;
  document.getElementById("statMessages").textContent = getMessages().length;
  document.getElementById("statReviews").textContent = getReviews().length;
}// ---------- Tabs ----------
document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

// ---------- Orders ----------
function loadOrders() {
  const body = document.getElementById("adminOrdersBody");
  const orders = getOrders();
  if (orders.length === 0) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#999;">No orders yet.</td></tr>`;
    return;
  }
  body.innerHTML = orders.map((o, i) => {
    const items = (o.items || []).map(it => `${it.name} ×${it.qty}`).join(", ");
    const status = o.status || "Pending";
    return `
      <tr>
        <td>${o.id || "PS-ORDER"}</td>
        <td>${o.name || "-"}</td>
        <td>${o.phone || "-"}</td>
        <td>${items || "-"}</td>
        <td>${INR(o.total || 0)}</td>
        <td>${o.method || "-"}</td>
        <td>
          <select class="admin-status" data-idx="${i}">
            ${["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(s =>
              `<option ${s === status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
        <td>
          <button class="admin-del" data-kind="order" data-idx="${i}" title="Delete">Delete</button>
        </td>
      </tr>`;
  }).join("");
}

document.getElementById("adminOrdersBody").addEventListener("change", function (e) {
  if (e.target.classList.contains("admin-status")) {
    const orders = getOrders();
    orders[Number(e.target.dataset.idx)].status = e.target.value;
    setOrders(orders);
  }
});

// ---------- Products ----------
function loadProducts() {
  const body = document.getElementById("adminProductsBody");
  const products = getProducts();
  if (products.length === 0) {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#999;">No products. Add one below.</td></tr>`;
    return;
  }
  body.innerHTML = products.map((p, i) => `
    <tr>
      <td><img src="${p.image || 'img/ghe  about.png'}" alt="${p.name}" style="width:50px;height:40px;object-fit:cover;border-radius:6px;"></td>
      <td>${p.name}</td>
      <td>₹${p.price}${p.unit ? p.unit : ""}</td>
      <td>${p.desc || "-"}</td>
      <td>
        <button class="admin-edit" data-idx="${i}">Edit</button>
        <button class="admin-del" data-kind="product" data-idx="${i}">Delete</button>
      </td>
    </tr>`).join("");
}

const productForm = document.getElementById("productForm");
const pImageFile = document.getElementById("pImageFile");
const pImagePreview = document.getElementById("pImagePreview");

if (pImageFile) {
  pImageFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    if (file.size > 300 * 1024) {
      alert("Image too large. Please upload an image under 300 KB.");
      this.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      document.getElementById("pImage").value = ev.target.result;
      pImagePreview.src = ev.target.result;
      pImagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

productForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const idx = document.getElementById("pIndex").value;
  const products = getProducts();
  const existing = idx !== "" ? products[Number(idx)] : null;
  const product = {
    name: document.getElementById("pName").value.trim(),
    price: Number(document.getElementById("pPrice").value),
    unit: document.getElementById("pUnit").value.trim(),
    image: document.getElementById("pImage").value.trim() || (existing ? existing.image : "img/ghe  about.png"),
    desc: document.getElementById("pDesc").value.trim()
  };
  if (!product.name || isNaN(product.price) || product.price <= 0) {
    alert("Please enter a valid product name and price.");
    return;
  }
  if (idx !== "") {
    products[Number(idx)] = product;
  } else {
    products.push(product);
  }
  setProducts(products);
  productForm.reset();
  document.getElementById("pIndex").value = "";
  document.getElementById("productFormBtn").textContent = "Add Product";
  document.getElementById("productCancelBtn").style.display = "none";
  pImagePreview.style.display = "none";
  pImagePreview.src = "";
  loadProducts();
  loadStats();
});

document.getElementById("adminProductsBody").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const products = getProducts();

  if (btn.classList.contains("admin-edit")) {
    const p = products[idx];
    document.getElementById("pIndex").value = idx;
    document.getElementById("pName").value = p.name;
    document.getElementById("pPrice").value = p.price;
    document.getElementById("pUnit").value = p.unit || "";
    document.getElementById("pImage").value = (p.image && p.image.startsWith("data:")) ? "" : (p.image || "");
    document.getElementById("pDesc").value = p.desc || "";
    if (p.image && p.image.startsWith("data:")) {
      pImagePreview.src = p.image;
      pImagePreview.style.display = "block";
    } else {
      pImagePreview.style.display = "none";
    }
    document.getElementById("productFormBtn").textContent = "Save Changes";
    document.getElementById("productCancelBtn").style.display = "inline-block";
    document.getElementById("productForm").scrollIntoView({ behavior: "smooth" });
  }

  if (btn.classList.contains("admin-del") && btn.dataset.kind === "product") {
    if (confirm("Delete this product?")) {
      products.splice(idx, 1);
      setProducts(products);
      loadProducts();
      loadStats();
    }
  }
});

document.getElementById("productCancelBtn").addEventListener("click", function () {
  productForm.reset();
  document.getElementById("pIndex").value = "";
  document.getElementById("productFormBtn").textContent = "Add Product";
  this.style.display = "none";
});

// ---------- Users ----------
function loadUsers() {
  const body = document.getElementById("adminUsersBody");
  const users = getUsers();
  if (users.length === 0) {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#999;">No registered users yet.</td></tr>`;
    return;
  }
  body.innerHTML = users.map((u, i) => `
    <tr>
      <td>${u.name || "-"}</td>
      <td>${u.email || "-"}</td>
      <td>${u.phone || "-"}</td>
      <td>${fmtDateTime(u.joined)}</td>
      <td><button class="admin-del" data-kind="user" data-idx="${i}">Delete</button></td>
    </tr>`).join("");
}

document.getElementById("adminUsersBody").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.classList.contains("admin-del") || btn.dataset.kind !== "user") return;
  if (confirm("Delete this user?")) {
    const users = getUsers();
    users.splice(Number(btn.dataset.idx), 1);
    setUsers(users);
    loadUsers();
    loadStats();
  }
});

// ---------- Messages ----------
function loadMessages() {
  const body = document.getElementById("adminMessagesBody");
  const messages = getMessages();
  if (messages.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;">No messages yet.</td></tr>`;
    return;
  }
  body.innerHTML = messages.map((m, i) => `
    <tr>
      <td>${m.name || "-"}</td>
      <td>${m.email || "-"}</td>
      <td>${m.subject || "-"}</td>
      <td style="max-width:280px;">${m.message || "-"}</td>
      <td>${fmtDateTime(m.date)}</td>
      <td><button class="admin-del" data-kind="message" data-idx="${i}">Delete</button></td>
    </tr>`).join("");
}

document.getElementById("adminMessagesBody").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.classList.contains("admin-del") || btn.dataset.kind !== "message") return;
  if (confirm("Delete this message?")) {
    const messages = getMessages();
    messages.splice(Number(btn.dataset.idx), 1);
    setMessages(messages);
    loadMessages();
    loadStats();
  }
});

// ---------- Global delete for orders ----------
document.getElementById("adminOrdersBody").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.classList.contains("admin-del") || btn.dataset.kind !== "order") return;
  if (confirm("Delete this order?")) {
    const orders = getOrders();
    orders.splice(Number(btn.dataset.idx), 1);
    setOrders(orders);
    loadOrders();
    loadStats();
  }
});

// ---------- Reviews ----------
function starsHTML(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? '<i class="fa-solid fa-star" style="color:#f5b301;"></i>'
      : '<i class="fa-regular fa-star" style="color:#ccc;"></i>';
  }
  return html;
}

function loadReviews() {
  const body = document.getElementById("adminReviewsBody");
  const reviews = getReviews();
  if (reviews.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;">No reviews yet.</td></tr>`;
    return;
  }
  body.innerHTML = reviews.map((r, i) => `
    <tr>
      <td>${r.name || "-"}</td>
      <td>${r.email || "-"}</td>
      <td>${starsHTML(Number(r.rating) || 0)}</td>
      <td style="max-width:280px;">${r.message || "-"}</td>
      <td>${r.date || "-"}</td>
      <td><button class="admin-del" data-kind="review" data-idx="${i}">Delete</button></td>
    </tr>`).join("");
}

document.getElementById("adminReviewsBody").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn || !btn.classList.contains("admin-del") || btn.dataset.kind !== "review") return;
  if (confirm("Delete this review?")) {
    const reviews = getReviews();
    reviews.splice(Number(btn.dataset.idx), 1);
    setReviews(reviews);
    loadReviews();
    loadStats();
  }
});

// ---------- Init ----------
function loadAll() {
  loadStats();
  loadOrders();
  loadProducts();
  loadUsers();
  loadMessages();
  loadReviews();
}

requireLogin();
