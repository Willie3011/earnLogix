const signUpBtn = document.querySelector(".sign-up-btn");
const toggle = document.querySelector('.toggle');
const nav = document.querySelector('nav');

toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
})

signUpBtn.addEventListener("click", () => {
    window.location = "register.html";
})

const form = document.querySelector("form");
let person = {};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInputs();
})

function validateInputs(){
    
    //get all inputs
    const emailEl = document.getElementById("email"),
    passwordEl = document.getElementById("password");

    //get input values
    const email = emailEl.value.trim(),
    password = passwordEl.value.trim();

    // get error paragraph elements
    const emailError = document.getElementById("email-error"),
    passwordError = document.getElementById("password-error");


    //check if inputs are empty and throw an error
    if(email === "" || email === null){
        emailError.textContent = "Email field cannot be empty"
        emailEl.classList.add("error");
        emailEl.focus();
    }
    else{
        emailError.textContent = "";
        emailEl.classList.remove("error");
        person.email = email;
    }

    if(password === "" || password === null){
        passwordError.textContent = "Password field cannot be empty";
        passwordEl.classList.add("error");
    }
    else{
        passwordError.textContent = "";
        passwordEl.classList.remove("error");
        person.password = password;
        console.log(person);
    }

}