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

