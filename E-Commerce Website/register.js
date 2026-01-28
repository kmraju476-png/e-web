document.getElementById("registerForm").addEventListener("submit", function(e){
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        alert("Username already exists!");
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
});
