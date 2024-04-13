import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyBG7pWbi1t_A50kJ4uYQSiTIg5ePgarRdA",
    authDomain: "earnlogix.firebaseapp.com",
    projectId: "earnlogix",
    appId: "1:397114869781:web:c69d554385794cfa01e61c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signInBtn = document.querySelector(".sign-in-btn");
const toggle = document.querySelector(".toggle");
const nav = document.querySelector("nav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

signInBtn.addEventListener("click", () => {
  window.location = "signin.html";
});

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateInput();
});

async function validateInput() {
  let person = {};
  //Get all inputs and the form
  const nameEl = document.getElementById("name"),
    surnameEl = document.getElementById("surname"),
    emailEl = document.getElementById("email"),
    passwordEl = document.getElementById("password"),
    confirmPasswordEl = document.getElementById("confirm-password");

  //get all the error paragraph elements for each input
  const nameError = document.getElementById("name-error"),
    surnameError = document.getElementById("surname-error"),
    emailError = document.getElementById("email-error"),
    passwordError = document.getElementById("password-error"),
    confirmPasswordError = document.getElementById("confirm-password-error");

  //get the values of the inputs
  const name = nameEl.value.trim(),
    surname = surnameEl.value.trim(),
    email = emailEl.value.trim(),
    password = passwordEl.value.trim(),
    confirmPassword = confirmPasswordEl.value.trim();

  //Regex code for the password and email
  const minlength = 8,
    hasUpperCase = /[A-Z]/.test(password),
    hasLowerCase = /[a-z]/.test(password),
    hasNumber = /\d/.test(password),
    hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password),
    emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9]+\.[a-z]{2,4}$/;

  //check if inputs are empty
  if (name === "" || name === null) {
    nameError.textContent = "Name field cannot be empty";
    nameEl.classList.add("error");
    nameEl.focus();
  } else {
    nameError.textContent = "";
    nameEl.classList.remove("error");
    person.name = name;
  }

  if (surname === "" || surname === null) {
    surnameError.textContent = "Surname field cannot be empty";
    surnameEl.classList.add("error");
  } else {
    surnameError.textContent = "";
    surnameEl.classList.remove("error");
    person.surname = surname;
  }

  if (email === "" || email === null) {
    emailError.textContent = "Email field cannot be empty";
    emailEl.classList.add("error");
  } else {
    emailError.textContent = "";
    emailEl.classList.remove("error");
  }

  if (password === "" || password === null) {
    passwordError.textContent = "Password field cannot be empty";
    passwordEl.classList.add("error");
  } else {
    passwordError.textContent = "";
    passwordEl.classList.remove("error");
  }

  if (confirmPassword === "" || confirmPassword === null) {
    confirmPasswordError.textContent = "This field cannot be empty";
    passwordEl.classList.add("error");
  } else {
    confirmPasswordError.textContent = "";
    confirmPasswordEl.classList.remove("error");
  }
  //check if email is in the correct format
  if (emailPattern.test(email)) {
    emailError.textContent = "";
    emailEl.classList.remove("error");
    person.email = email;
  } else {
    emailError.textContent = " Please use the correct format";
    emailEl.classList.add("error");
    emailEl.focus();
  }
  // check if password meets the password requiremets
  if (password.length >= minlength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    // check if password matches confirmed password
    if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match";
      confirmPasswordEl.classList.add("error");
    } else {
      confirmPasswordError.textContent = "";
      confirmPasswordEl.classList.remove("error");
      person.password = password;
    }

    try {
      await saveToDatabase(person);
    } catch (error) {
      throw new error("An error occured while saving data");
    }
  } else {
    passwordError.textContent = "Please use the correct format!";
  }
}

// save to database
async function saveToDatabase(person) {
  createUserWithEmailAndPassword(auth, person.email, person.password)
  .then(() => window.location.href = "signin.html")
}
