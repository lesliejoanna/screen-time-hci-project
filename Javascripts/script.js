const dashboardPanels = document.querySelectorAll("main > section");
const rewardScreen = document.getElementById("reward-screen");
const grantRewardButton = document.getElementById("grant-reward");
const confirmButton = document.getElementById("confirm-reward");

let selectedReward = null;

// The sidebar stays visible, so only the panels swap with the reward screen.
function showRewardScreen(isVisible) {
    dashboardPanels.forEach(panel => panel.classList.toggle("hidden", isVisible));
    rewardScreen.classList.toggle("hidden", !isVisible);
}

grantRewardButton.addEventListener("click", () => {
    showRewardScreen(true);
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
    showRewardScreen(false);
});

confirmButton.addEventListener("click", () => {
    if (!selectedReward) {
        return;
    }

    localStorage.setItem("childReward", selectedReward);

    showRewardScreen(false);
})

document.getElementById("reset-demo").addEventListener("click", () => {
    localStorage.removeItem("childReward");
    alert("Demo reset! Child rewards cleared.");
});
