const dashboard = document.querySelector("main");
const rewardScreen = document.getElementById("reward-screen");
const grantRewardButton = document.getElementById("grant-reward");
const confirmButton = document.getElementById("confirm-reward");

let selectedReward = null;

grantRewardButton.addEventListener("click", () => {
    dashboard.classList.add("hidden");
    rewardScreen.classList.remove("hidden");
});

document.querySelectorAll(".reward-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".reward-option").forEach(option => {
            option.classList.remove("selected");
        });

        button.classList.add("selected");
        selectedReward = button.dataset.reward;

        document.getElementById("selected-reward").textContent =
            `Selected: ${selectedReward}`;

        confirmButton.disabled = false;
    });
});

document.getElementById("back-dashboard").addEventListener("click", () => {
    rewardScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
});

confirmButton.addEventListener("click", () => {
    if (!selectedReward) {
        return;
    }

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

    alert("Reward granted successfully!");
});

document.getElementById("reset-demo").addEventListener("click", () => {
    localStorage.removeItem("childReward");
    localStorage.removeItem("playtimeMinutes");
    localStorage.removeItem("appsUnlocked");
    localStorage.removeItem("playtimeEndTime");
    alert("Demo reset! Child rewards cleared.");
});
