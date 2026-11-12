//Local storage for daily routines
let routine_database = 
[
    {id: 1, name: "Morning Routine", status: "Active"},
    {id: 2, name: "After School", status: "Inactive"}
];

let tasks = 
[
    {id: 1, name: "Finish Math Homework", status: "Not Selected"},
    {id: 2, name: "Clean Dishes", status: "Not Selected"},
];

const isitactive = document.getElementById("isitactive");
const isitactive2 = document.getElementById("isitactive2");
const isitSelected1 = document.getElementById("isitSelected1");
const isitSelected2 = document.getElementById("isitSelected2");

isitactive.addEventListener("click", function() 
{
    if (routine_database[0].status === "Active") 
    {
        isitactive.className = "routine-status-red";
        routine_database[0].status = "Inactive";
        isitactive.textContent = "Inactive";
    } 
    else 
    {
        isitactive.className = "routine-status-green";
        routine_database[0].status = "Active";
        isitactive.textContent = "Active";
    }
}
)

isitactive2.addEventListener("click", function()
{
    if (routine_database[1].status === "Active")
    {
        isitactive2.className = "routine-status-red";
        routine_database[1].status = "Inactive";
        isitactive2.textContent = "Inactive";
    }
    else
    {
        isitactive2.className = "routine-status-green";
        routine_database[1].status = "Active";
        isitactive2.textContent = "Active";
    }
}
)

isitSelected1.addEventListener('click', () => 
{
    if (tasks[0].status === "Not Selected") 
    {
        isitSelected1.className = "task-selected";
        tasks[0].status = "Selected";
    } 
    else 
    {
        isitSelected1.className = "task-not-selected";
        tasks[0].status = "Not Selected";
    }
});

isitSelected2.addEventListener('click', () => 
{
    if (tasks[1].status === "Not Selected")
    {
        isitSelected2.className = "task-selected";
        tasks[1].status = "Selected";
    } 
    else 
    {
        isitSelected2.className = "task-not-selected";
        tasks[1].status = "Not Selected";
    }
});