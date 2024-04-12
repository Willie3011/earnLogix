//Check if the user signed in before accessing dashboard else redirect user to sign in page
const authenticated = sessionStorage.getItem("authenticated");
if(!authenticated || authenticated !== "true"){
    window.location.href = "signin.html";
}
else{
    const loginTime = sessionStorage.getItem("loginTime");
    const currentTime = Date.now();
    const elapsedTime = currentTime - loginTime;
    const logOutTime = 30 * 60 * 1000;

    if(elapsedTime > logOutTime){
        sessionStorage.removeItem("authenticated");
        sessionStorage.removeItem("loginTime");

        window.location.href = "signin.html";
    }
    else{
        sessionStorage.setItem("loginTime", currentTime);

    }
}

const username = document.getElementById("username");

username.textContent = sessionStorage.getItem("username");

function toggleDropdown(){
    let dropDownContent = document.querySelector(".dropdownContent");
    dropDownContent.classList.toggle("active");
}

//sidebar toggling
let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.addEventListener("click", () => sidebar.classList.toggle("active"));

//toggle button for smaller screens
let headerBtn = document.querySelector("#header-toggle-btn");

headerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    btn.classList.add("bx-x");

    btn.addEventListener("click", () => btn.classList.remove("bx-x"))
});


//logout button
const logout = document.getElementById("log-out");

logout.addEventListener("click", () => {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loginTime");
    window.location.href = "signin.html"

});

//Card progress circles

function setProgress(className, value, limit){
    const progress = document.querySelector(className);
    const radius = progress.getAttribute("r");
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / limit) * circumference;
    progress.style.strokeDasharray = `${circumference} ${circumference}`;
    progress.style.strokeDashoffset = offset;
}

window.onload = () => {
    setProgress(".p1", 2786, 5000);
    setProgress(".p2", 26, 31);
    setProgress(".p3", 9, 15);
    setProgress(".p4", 120, 200);
}

const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

// Calendar Days
function loadDays(){
    let currentDate = new Date();
    //get year
    const year = currentDate.getFullYear();
    //get month
    const month = currentDate.getMonth();

    //previous month days
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();

    //get first day
    const firstDay = new Date(year, month, 1);
    //get last day
    const lastDay = new Date(year, month + 1, 0);
    //get number of days in a month
    const numOfDays = lastDay.getDate();
    //next month days
    const nextMonthDays = 7 - lastDay.getDay() - 1;
    
    const monthEl = document.getElementById("month");
    monthEl.textContent = `${Months[month]} ${year}`
    //get the calendar
    const calendar = document.querySelector(".calendar");
    const daysContainer = calendar.querySelector(".month-days");
    let currentDay = 1;
    let days = "";

    //adding previous month days
    // Assuming firstDay is the first day of the current month and prevDays is the number of days in the previous month
for (let i = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; i > 0; i--) {
    const day = `<div class="day prev-month">${prevDays - i + 1}</div>`;
    days += day;
}

    //adding current month days
    for(let i = 1; i <= numOfDays; i++){
        //check if date is today
        let day;
        if(i === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()){
            day = `<div class="day today">${i}</div>`
        }
        else{
            day = `<div class="day">${currentDay}</div>`
            
        }
        days += day;
        currentDay++;
    }
    
    //adding next month days
    console.log(nextMonthDays);
    for( let i = 1; i <= nextMonthDays; i++){
        const day = `<div class="day next-month">${i}</div>`
        days += day;
    }
    daysContainer.innerHTML = days;
}

loadDays();