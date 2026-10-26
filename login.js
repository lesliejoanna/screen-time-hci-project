const parentBtn = document.getElementById("parent-btn");
const childBtn = document.getElementById("child-btn");
const passwordContainer = document.getElementById("password-container");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");

let userType = "parent";

parentBtn.addEventListener("click", () => {
    userType = "parent";

    passwordContainer.classList.remove("hidden");
    password.required = true;

    parentBtn.classList.add("active");
    childBtn.classList.remove("active");
});

childBtn.addEventListener("click", () => {
    userType = "child";

    passwordContainer.classList.add("hidden");
    password.required = false;
    password.value = "";

    childBtn.classList.add("active");
    parentBtn.classList.remove("active");
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (userType === "parent") {
        window.location.href = "index.html";
    } else {
        window.location.href = "child.html";
    }
});
