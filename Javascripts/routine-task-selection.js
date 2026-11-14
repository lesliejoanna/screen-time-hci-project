let tasks = 
[
    {id: 1, name: "Finish Math Homework", status: "Not Selected"},
    {id: 2, name: "Clean Dishes", status: "Not Selected"},
];


const isitSelected1 = document.getElementById("isitSelected1");
const isitSelected2 = document.getElementById("isitSelected2");

//First button for task 1
isitSelected1.textContent = tasks[0].name;

isitSelected1.addEventListener("click", function() 
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
}
)


//Second button for task 2
isitSelected2.textContent = tasks[1].name;

isitSelected2.addEventListener("click", function() 
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
}
)