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
    let request = window.indexedDB.open("earnLogix", 1);
    request.onsuccess = function(event){
        let db = event.target.result;

        let transaction = db.transaction(["users"], "readonly");
        let objectStore = transaction.objectStore("users");


        let getRequest = objectStore.get(person.email);


        getRequest.onsuccess = function(event){
            let user = event.target.result;
            let name = user.name,
            surname = user.surname,
            fullName = `${name} ${surname}`;

            sessionStorage.setItem("username", fullName);
            if(user && user.password === person.password){
                //set authentication to true
                sessionStorage.setItem("authenticated", "true");
                
                //set login time
                sessionStorage.setItem("loginTime", Date.now());
                window.location.href = "dashboard.html"
            }
            else{
                const passwordError = document.getElementById("password-error");
                passwordError.textContent = "Email Address or Password does not match";
            }
        };


        getRequest.onerror = function(event){
            console.error("Error retrieving person from IndexDB", event.target.error);
        }
    }
}