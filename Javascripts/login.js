document.querySelectorAll("[data-logout]").forEach(button => {
    button.addEventListener("click", () => {
        logout();
        window.location.href = new URL("login.html", siteRoot).href;
    });
});

const parentBtn = document.getElementById("parent-btn");
const childBtn = document.getElementById("child-btn");
const passwordContainer = document.getElementById("password-container");
const usernameInput = document.getElementById("username");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove("hidden");
}

if (loginForm) {
    let userType = "parent";

    parentBtn.addEventListener("click", () => {
        userType = "parent";

        passwordContainer.classList.remove("hidden");
        password.required = true;
        loginError.classList.add("hidden");

        parentBtn.classList.add("active");
        childBtn.classList.remove("active");
    });

    childBtn.addEventListener("click", () => {
        userType = "child";

        passwordContainer.classList.add("hidden");
        password.required = false;
        password.value = "";
        loginError.classList.add("hidden");

        childBtn.classList.add("active");
        parentBtn.classList.remove("active");
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        loginError.classList.add("hidden");

        try {
            const result = await verifyLogin(usernameInput.value, password.value, userType);

            if (!result.ok) {
                showLoginError(result.error);
                return;
            }

            setCurrentUser(result.account);
            redirectToDashboard(result.account.role);
        } catch (error) {
            console.error(error);
            showLoginError("Sign-in isn't available here. Open the site from localhost or HTTPS.");
        }
    });
}
