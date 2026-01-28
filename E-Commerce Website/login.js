// LOGIN FORM SUBMIT
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // input values lo
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // localStorage se users lao
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // check karo user valid hai ya nahi
    const validUser = users.find(
        user => user.username === username && user.password === password
    );

    if (validUser) {
        // login user save karo
        localStorage.setItem("loggedInUser", username);

        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid username or password");
    }
});
