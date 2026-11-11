const dashboard = document.querySelector("main");
const rewardScreen = document.getElementById("reward-screen");
const grantRewardButton = document.getElementById("grant-reward");
const confirmButton = document.getElementById("confirm-reward");

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

    localStorage.setItem("childReward", selectedReward);

    rewardScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
})

updateChildStatus();

document.getElementById("reset-demo").addEventListener("click", () => {
    localStorage.removeItem("childReward");
    updateChildStatus();
    alert("Demo reset! Child rewards cleared.");
});

updateChildStatus();