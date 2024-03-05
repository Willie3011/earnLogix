const signInBtn = document.querySelector(".sign-in-btn");
const toggle = document.querySelector('.toggle');
const nav = document.querySelector('nav');


toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
})

signInBtn.addEventListener("click", () => {
    window.location = "signin.html";
})

