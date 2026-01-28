/* ===== MOBILE NAVBAR ===== */
const bar = document.getElementById("bar");
const navbar = document.getElementById("navbar");

bar.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

/* ===== LOGIN STATUS ===== */
const user = localStorage.getItem("loggedInUser");

const userName = document.getElementById("userName");
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

if (user) {
  // Show username
  userName.innerText = "Hi, " + user;

  // Hide login & show logout
  if (loginLink) loginLink.style.display = "none";
  if (logoutLink) logoutLink.style.display = "block";
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

/* ===== DAY / NIGHT MODE ===== */
const themeBtn = document.getElementById("themeToggle");

// page load pe theme check
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.innerText = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.innerText = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.innerText = "🌙";
    localStorage.setItem("theme", "light");
  }
});




/* ===== ADD TO CART ===== */
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = {
    name: name,
    price: price,
    quantity: 1
  };

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " added to cart 🛒");
}

/* HEADER */
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* PLACE ORDER BUTTON */
document.getElementById("placeOrder").onclick = function () {
  window.location.href = "checkout.html";
};

