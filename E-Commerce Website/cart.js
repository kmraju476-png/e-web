const cartItems = document.getElementById("cartItems");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

cart.forEach((item, index) => {
  total += item.price;

  cartItems.innerHTML += `
    <div class="cart-item">
      <p>${item.name}</p>
      <p>₹${item.price}</p>
      <button onclick="removeItem(${index})">Remove</button>
    </div>
  `;
});

document.getElementById("total").innerText =
  "Total: ₹" + total;

/* REMOVE ITEM */
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

/* PLACE ORDER */
document.getElementById("placeOrderBtn").addEventListener("click", function() {
    window.location.href = "checkout.html";
});
