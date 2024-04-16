import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBG7pWbi1t_A50kJ4uYQSiTIg5ePgarRdA",
    authDomain: "earnlogix.firebaseapp.com",
    projectId: "earnlogix",
    appId: "1:397114869781:web:c69d554385794cfa01e61c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
        signIn(person);
    }
}

function signIn(person){
    signInWithEmailAndPassword(auth, person.email, person.password)
    .then(() => {
        sessionStorage.setItem("authenticated", "true");
                
        //set login time
        sessionStorage.setItem("loginTime", Date.now());
        window.location = "dashboard.html";
    })
    .catch((error) => {
        let passwordError = document.getElementById("password-error");
        passwordError.textContent = error.message;

    })
}