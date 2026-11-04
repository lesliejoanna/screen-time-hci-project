//Local storage for daily routines
//localStorage.setItem("Routine Name", "Morning Routine")

const isitactive = document.getElementById("isitactive");

isitactive.addEventListener("click", function() 
{
    if (isitactive.innerHTML === "Active")
    {
        isitactive.className = "routine-status-red";
        isitactive.innerHTML = "Not Set";
    }
    else
    {
        isitactive.className = "routine-status-green";
        isitactive.innerHTML = "Active";
    }
}
)

isitactive2.addEventListener("click", function()
{
    if (isitactive2.innerHTML === "Active")
    {
        isitactive2.className = "routine-status-red";
        isitactive2.innerHTML = "Not Set";
    }
    else
    {
        isitactive2.className = "routine-status-green";
        isitactive2.innerHTML = "Active";
    }
}
)