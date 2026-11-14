
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

    const activeReward = Number(localStorage.getItem("playtimeMinutes") || 0) > 0
        || localStorage.getItem("appsUnlocked") === "true"
        || Number(localStorage.getItem("playtimeEndTime") || 0) > Date.now();

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

if (grantRewardButton && rewardScreen) {
    grantRewardButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        rewardScreen.classList.remove("hidden");
    });
}

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

document.getElementById("back-dashboard")?.addEventListener("click", () => {
    rewardScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

if (confirmButton && rewardScreen) {
    confirmButton.addEventListener("click", () => {
        if (!selectedReward) return;

    if (selectedReward === "15 minutes" ||
        selectedReward === "30 minutes") {

        const minutes = parseInt(selectedReward, 10);

        const currentMinutes = Number(
            localStorage.getItem("playtimeMinutes") || 0
        );

        localStorage.setItem(
            "playtimeMinutes",
            currentMinutes + minutes
        );

    } else if (selectedReward === "Unlock app") {

        localStorage.setItem("appsUnlocked", "true");

    }

    rewardScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");

    updateChildStatus();
    alert("Reward granted successfully!");
});
}

document.getElementById("reset-demo")?.addEventListener("click", () => {
    [
        "childReward",
        "playtimeMinutes",
        "appsUnlocked",
        "playtimeEndTime",
        "screenTimeSetup",
        "screenTimeSession",
        "Routine Name",
        "childActivity"
    ].forEach(key => {
        localStorage.removeItem(key);
    });

    updateChildStatus();
    selectedReward = null;

    document.querySelectorAll(".reward-option").forEach(button => {
        button.classList.remove("selected");
    });

    const selectedText = document.getElementById("selected-reward");
    if (selectedText) {
        selectedText.textContent = "No reward selected";
    }

    if (confirmButton) {
        confirmButton.disabled = true;
    }

    alert("Demo reset! Saved profiles, sessions, rewards, and activity history cleared.");

    if (window.location.protocol === "file:") {
        window.location.href = "setup.html#reset-demo";
    }
});

if (nextButton && hoursScreen) {
    nextButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        hoursScreen.classList.remove("hidden");
    });
}

window.addEventListener("storage", updateChildStatus);
window.addEventListener("focus", updateChildStatus);
updateChildStatus();
