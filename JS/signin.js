const signUpBtn = document.querySelector(".sign-up-btn");
const toggle = document.querySelector('.toggle');
const nav = document.querySelector('nav');

toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
})

signUpBtn.addEventListener("click", () => {
    window.location = "register.html";
})