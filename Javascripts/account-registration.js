const parentBtn = document.getElementById("parent-btn");
const childBtn = document.getElementById("child-btn");
const passwordFields = document.getElementById("signup-passwords");
const usernameInput = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupForm = document.getElementById("signup-form");
const signupError = document.getElementById("signup-error");

let accountType = "parent";

function showSignupError(message) {
    signupError.textContent = message;
    signupError.classList.remove("hidden");
}

parentBtn.addEventListener("click", () => {
    accountType = "parent";

    passwordFields.classList.remove("hidden");
    signupError.classList.add("hidden");

    parentBtn.classList.add("active");
    childBtn.classList.remove("active");
});

childBtn.addEventListener("click", () => {
    accountType = "child";

    passwordFields.classList.add("hidden");
    password.value = "";
    confirmPassword.value = "";
    signupError.classList.add("hidden");

    childBtn.classList.add("active");
    parentBtn.classList.remove("active");
});

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    signupError.classList.add("hidden");

    if (accountType === "parent" && password.value !== confirmPassword.value) {
        showSignupError("Passwords don't match.");
        return;
    }

    try {
        const result = await createAccount(usernameInput.value, password.value, accountType);

        if (!result.ok) {
            showSignupError(result.error);
            return;
        }

        setCurrentUser(result.account);
        redirectToDashboard(result.account.role);
    } catch (error) {
        console.error(error);
        showSignupError("Sign-up isn't available here. Open the site from localhost or HTTPS.");
    }
});
