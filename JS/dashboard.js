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