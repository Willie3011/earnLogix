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

let headerBtn = document.querySelector("#header-toggle-btn");

headerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    btn.classList.add("bx-x");

    btn.addEventListener("click", () => btn.classList.remove("bx-x"))

});

const logout = document.getElementById("log-out");

logout.addEventListener("click", () => window.location.href = "signin.html");

//Card progress circles

function setProgress(className, value, limit){
    const progress = document.querySelector(className);
    const radius = progress.getAttribute("r");
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / limit) * circumference;
    progress.style.strokeDasharray = `${circumference} ${circumference}`;
    progress.style.strokeDashoffset = offset;
    console.log(progress)

}

window.onload = () => {
    setProgress(".p1", 2786, 5000);
    setProgress(".p2", 26, 31);
    setProgress(".p3", 9, 15);
    setProgress(".p4", 120, 200);
}