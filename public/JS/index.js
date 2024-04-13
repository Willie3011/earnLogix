const toggle = document.querySelector('.toggle');
const nav = document.querySelector('nav');


toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
})

const listElemnts = nav.querySelectorAll('ul li');

listElemnts.forEach(li => {
    li.addEventListener("click", () =>{
        nav.classList.toggle("active");
    });

})
