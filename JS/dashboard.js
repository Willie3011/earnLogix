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