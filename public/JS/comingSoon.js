const toggleBtn = document.querySelector(".toggle");
const nav = document.querySelector("nav");

toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    const icon = toggleBtn.querySelector("i");
    icon.classList.toggle("bx-x")
})