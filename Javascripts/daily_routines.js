//Local storage for daily routines
let routine_database = 
[
    {id: 1, name: "Morning Routine", status: "Active"},
    {id: 2, name: "After School", status: "Inactive"}
];

const isitactive = document.getElementById("isitactive");
const isitactive2 = document.getElementById("isitactive2");

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
