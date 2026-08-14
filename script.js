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

const form=document.querySelector(".contact-form");

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

alert("Your message has been sent successfully!");

form.reset();

});

}



document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({

behavior:"smooth"

});

});

});

console.log("Gaushree Website Loaded Successfully");
// ===============================
// CART SYSTEM - PART 1
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {

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

    let badge = document.querySelector(".cart-count");

    let total = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (!badge) {

        badge = document.createElement("span");

        badge.className = "cart-count";

        cartIcon.parentElement.style.position = "relative";

        cartIcon.parentElement.appendChild(badge);

    }

    badge.innerText = total;

}

updateCartCount();
// ===============================
// CART SYSTEM - PART 2
// SUCCESS MESSAGE
// ===============================

function showSuccessMessage() {

    const oldMessage = document.querySelector(".cart-success");

    if (oldMessage) {
        oldMessage.remove();
    }

    const message = document.createElement("div");

    message.className = "cart-success";

    message.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        Your Product Added To Cart Successfully
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.classList.add("show-success");
    }, 100);

    setTimeout(() => {

        message.classList.remove("show-success");

        setTimeout(() => {
            message.remove();
        }, 500);

    }, 2500);

}
// =================================
// CART SYSTEM - PART 3
// DISPLAY CART PRODUCTS
// =================================

function displayCart(){

    const cartContainer = document.getElementById("cart-container");

    if(!cartContainer){
        return;
    }


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cartContainer.innerHTML = "";


    if(cart.length === 0){

        cartContainer.innerHTML = `
        <div class="empty-cart">
            Your Cart is Empty 🛒
        </div>
        `;

        document.getElementById("cart-total").innerText = 0;

        return;
    }



    cart.forEach((item,index)=>{


        cartContainer.innerHTML += `

        <div class="cart-item">


            <img src="${item.image}">


            <div>

                <h3>${item.name}</h3>

                <p class="cart-price">
                Price : ₹${item.price}
                </p>


                <div class="qty-box">

                    <button class="qty-btn"
                    onclick="decreaseQty(${index})">
                    -
                    </button>


                    <span class="qty-number">
                    ${item.quantity}
                    </span>


                    <button class="qty-btn"
                    onclick="increaseQty(${index})">
                    +
                    </button>

                </div>


                <button class="remove-btn"
                onclick="removeItem(${index})">

                Remove

                </button>


            </div>


        </div>

        `;


    });



    updateTotal();

}



displayCart();
// =================================
// CART SYSTEM - PART 4
// QUANTITY + REMOVE + TOTAL
// =================================


function increaseQty(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart[index].quantity++;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

    updateCartCount();

}





function decreaseQty(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }
    else{

        cart.splice(index,1);

    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

    updateCartCount();

}





function removeItem(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.splice(index,1);



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    displayCart();

    updateCartCount();

}




function updateTotal(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let total = 0;


    cart.forEach(item=>{

        total += item.price * item.quantity;

    });



    const totalElement = document.getElementById("cart-total");


    if(totalElement){

        totalElement.innerText = total;

    }

}