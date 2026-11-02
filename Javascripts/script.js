
const dashboard = document.querySelector("main");
const rewardScreen = document.getElementById("reward-screen");
const grantRewardButton = document.getElementById("grant-reward");
const confirmButton = document.getElementById("confirm-reward");
const nextButton = document.getElementById("next-button");
const hoursScreen = document.getElementById("hours-screen");

let selectedReward = null;

// Open reward screen
if (grantRewardButton && rewardScreen) {
    grantRewardButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        rewardScreen.classList.remove("hidden");
    });
}

// Select reward
if (rewardScreen && confirmButton) {
    document.querySelectorAll(".reward-option").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".reward-option").forEach(option => {
                option.classList.remove("selected");
            });

            button.classList.add("selected");
            selectedReward = button.dataset.reward;

            const selectedText = document.getElementById("selected-reward");
            if (selectedText) {
                selectedText.textContent = `Selected: ${selectedReward}`;
            }

            confirmButton.disabled = false;
        });
    });
}

// Back to dashboard
document.getElementById("back-dashboard")?.addEventListener("click", () => {
    rewardScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

// Confirm reward
if (confirmButton && rewardScreen) {
    confirmButton.addEventListener("click", () => {
        if (!selectedReward) return;

        localStorage.setItem("childReward", selectedReward);

        rewardScreen.classList.add("hidden");
        dashboard.classList.remove("hidden");
    });
}

// Reset demo
document.getElementById("reset-demo")?.addEventListener("click", () => {
    localStorage.removeItem("childReward");
    alert("Demo reset! Child rewards cleared.");
});

// Next button - Open active hours screen
if (nextButton && hoursScreen) {
    nextButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        hoursScreen.classList.remove("hidden");
    });
}
