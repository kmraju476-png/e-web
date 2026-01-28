document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;
    const payment = document.getElementById("payment").value;

    // Save order
    const order = {
        name: name,
        address: address,
        state: state,
        pincode: pincode,
        payment: payment,
        cart: JSON.parse(localStorage.getItem("cart") || "[]")
    };

    localStorage.setItem("order", JSON.stringify(order));

    // Show popup ONLY
    document.getElementById("orderPopup").style.display = "flex";
});

function closePopup() {
    document.getElementById("orderPopup").style.display = "none";
}


// Clear cart after order is placed

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

let total = 0;

cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
        <span>${item.name} (x${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
    `;
    orderItems.appendChild(div);
    total += item.price * item.quantity;
});

orderTotal.innerText = total;
