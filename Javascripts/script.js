
const dashboard = document.querySelector("main");
const rewardScreen = document.getElementById("reward-screen");
const grantRewardButton = document.getElementById("grant-reward");
const confirmButton = document.getElementById("confirm-reward");
const nextButton = document.getElementById("next-button");
const hoursScreen = document.getElementById("hours-screen");

let selectedReward = null;
function updateChildStatus() {
    const statusBadge = document.getElementById("child-lock-status");

    if (!statusBadge) return;

    const activeReward = localStorage.getItem("childReward");

    if (activeReward) {
        statusBadge.textContent = "Unlocked";
        statusBadge.classList.remove("locked");
        statusBadge.classList.add("unlocked");
    } else {
        statusBadge.textContent = "Locked";
        statusBadge.classList.remove("unlocked");
        statusBadge.classList.add("locked");
    }
}

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
    ["childReward", "screenTimeSetup", "screenTimeSession", "Routine Name", "childActivity"].forEach(key => {
        localStorage.removeItem(key);
    });
    selectedReward = null;
    document.querySelectorAll(".reward-option").forEach(button => button.classList.remove("selected"));
    const selectedText = document.getElementById("selected-reward");
    if (selectedText) selectedText.textContent = "No reward selected";
    if (confirmButton) confirmButton.disabled = true;
    alert("Demo reset! Saved profiles, sessions, rewards, and activity history cleared.");
    if (window.location.protocol === "file:") {
        window.location.href = "setup.html#reset-demo";
    }
});

// Next button - Open active hours screen
if (nextButton && hoursScreen) {
    nextButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        hoursScreen.classList.remove("hidden");
    });
}
