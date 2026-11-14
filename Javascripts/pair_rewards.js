let rewards = 
[
    {id: 1, name: "Language App", status: "Not Selected", image: "../../Images/duolingo.png"},
    {id: 2, name: "Minecraft", status: "Not Selected", image: "../../Images/minecraft.png"},
    {id: 3, name: "YouTube", status: "Not Selected", image: "../../Images/youtube.png"},
];

const reward1 = document.getElementById("reward1");
const reward2 = document.getElementById("reward2");
const reward3 = document.getElementById("reward3");
const allowanceForm = document.getElementById("allowance-form");
const allowance = document.getElementById("allowance");
let timer = 0;

//First button for reward 1
reward1.textContent = rewards[0].name;
reward1.style.backgroundImage = `url(${rewards[0].image})`;
reward1.style.backgroundSize = "cover";
reward1.style.backgroundPosition = "center";

reward1.addEventListener('click', () => {
    if (rewards[0].status === "Not Selected")
        {
            rewards[0].status = "Selected";
            reward1.classList.add("reward-selected");
            reward1.classList.remove("reward-not-selected");
        }
    else if (rewards[0].status === "Selected")
        {
            rewards[0].status = "Not Selected";
            reward1.classList.remove("reward-selected");
            reward1.classList.add("reward-not-selected");
        }
});

//Second button for reward 2
reward2.textContent = rewards[1].name;
reward2.style.backgroundImage = `url(${rewards[1].image})`;
reward2.style.backgroundSize = "cover";
reward2.style.backgroundPosition = "center";

reward2.addEventListener('click', () => {
    if (rewards[1].status === "Not Selected")
        {
            rewards[1].status = "Selected";
            reward2.classList.add("reward-selected");
            reward2.classList.remove("reward-not-selected");
        }
    else if (rewards[1].status === "Selected")
        {
            rewards[1].status = "Not Selected";
            reward2.classList.remove("reward-selected");
            reward2.classList.add("reward-not-selected");
        }
});


//Third button for reward 3
reward3.textContent = rewards[2].name;
reward3.style.backgroundImage = `url(${rewards[2].image})`;
reward3.style.backgroundSize = "cover";
reward3.style.backgroundPosition = "center";

reward3.addEventListener('click', () => {
    if (rewards[2].status === "Not Selected")
        {
            rewards[2].status = "Selected";
            reward3.classList.add("reward-selected");
            reward3.classList.remove("reward-not-selected");
        }
    else if (rewards[2].status === "Selected")
        {
            rewards[2].status = "Not Selected";
            reward3.classList.remove("reward-selected");
            reward3.classList.add("reward-not-selected");
        }
});

//Verfication of allowance
allowance.addEventListener('input', () => {
    const allowanceValue = parseFloat(allowance.value);
    if (isNaN(allowanceValue) || allowanceValue <= 0) 
    {
        allowance.setCustomValidity("Please enter a valid positive number.");
        timer = 0; //reset the variable allowance to 0 if the user enters an invalid number
    } 
    else
    {
        allowance.setCustomValidity("");
        timer = allowanceValue; //save the number into the variable allowance for later use in the program
    }
});

allowanceForm.addEventListener('submit', (event) => 
{
    event.preventDefault();
});