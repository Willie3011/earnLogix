import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  onSnapshot,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBG7pWbi1t_A50kJ4uYQSiTIg5ePgarRdA",
  authDomain: "earnlogix.firebaseapp.com",
  projectId: "earnlogix",
  appId: "1:397114869781:web:c69d554385794cfa01e61c",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let userID;

onAuthStateChanged(auth, async (user) => {
  userID = user.uid;
  const db = getFirestore(app);
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("userID", "==", userID));

  let userInfo = {};
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      userInfo = doc.data();
      const username = document.getElementById("username");
      username.innerHTML = `${userInfo.name} ${userInfo.surname}`;
    });
  });
});

//Check if the user signed in before accessing dashboard else redirect user to sign in page
const authenticated = sessionStorage.getItem("authenticated");
if (!authenticated || authenticated !== "true") {
  window.location.href = "signin.html";
  signOut();
} else {
  const loginTime = sessionStorage.getItem("loginTime");
  const currentTime = Date.now();
  const elapsedTime = currentTime - loginTime;
  const logOutTime = 30 * 60 * 1000;

  if (elapsedTime > logOutTime) {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loginTime");

    window.location.href = "signin.html";
  } else {
    sessionStorage.setItem("loginTime", currentTime);
  }
}

//sidebar toggling
let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.addEventListener("click", () => sidebar.classList.toggle("active"));
//toggle button for smaller screens
let headerBtn = document.querySelector("#header-toggle-btn");
headerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  btn.classList.add("bx-x");

  btn.addEventListener("click", () => btn.classList.remove("bx-x"));
});

//logout button
const logout = document.getElementById("log-out");
logout.addEventListener("click", () => {
  auth.signOut();
  sessionStorage.removeItem("authenticated");
  sessionStorage.removeItem("loginTime");
  window.location.href = "signin.html";
});

//Card progress circles
function setProgress(className, value, limit) {
  const progress = document.querySelector(className);
  const radius = progress.getAttribute("r");
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / limit) * circumference;
  progress.style.strokeDasharray = `${circumference} ${circumference}`;
  progress.style.strokeDashoffset = offset;
}

window.onload = () => {
  setProgress(".p1", 2786, 5000);
  setProgress(".p2", 26, 31);
  setProgress(".p3", 9, 15);
  setProgress(".p4", 120, 200);
  loadDays();
};

// Calendar Days
const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function loadDays() {
  let currentDate = new Date();
  //get year
  const year = currentDate.getFullYear();
  //get month
  const month = currentDate.getMonth();

  //previous month days
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();

  //get first day
  const firstDay = new Date(year, month, 1);
  //get last day
  const lastDay = new Date(year, month + 1, 0);
  //get number of days in a month
  const numOfDays = lastDay.getDate();
  //next month days
  const nextMonthDays = 7 - lastDay.getDay() - 1;

  const monthEl = document.getElementById("month");
  monthEl.textContent = `${Months[month]} ${year}`;
  //get the calendar
  const calendar = document.querySelector(".calendar");
  const daysContainer = calendar.querySelector(".month-days");
  let currentDay = 1;
  let days = "";

  //adding previous month days
  // Assuming firstDay is the first day of the current month and prevDays is the number of days in the previous month
  for (
    let i = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    i > 0;
    i--
  ) {
    const day = `<div class="day prev-month">${prevDays - i + 1}</div>`;
    days += day;
  }

  //adding current month days
  for (let i = 1; i <= numOfDays; i++) {
    //check if date is today
    let day;
    if (
      i === currentDate.getDate() &&
      year === currentDate.getFullYear() &&
      month === currentDate.getMonth()
    ) {
      day = `<div class="day today">${i}</div>`;
    } else {
      day = `<div class="day">${currentDay}</div>`;
    }
    days += day;
    currentDay++;
  }

  //adding next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    const day = `<div class="day next-month">${i}</div>`;
    days += day;
  }
  daysContainer.innerHTML = days;
}

//add hours modal
const addHoursModal = document.querySelector("#add-hours-modal");
const addBtn = document.getElementById("addBtn");
const closeModal = document.querySelector("#close-modal");
const cancelBtn = document.querySelector("#cancel-btn");
const addHoursBtn = document.querySelector("#add-hours-btn");
const radioBtns = document.querySelectorAll(".radio-btn");
let dayOff = false;

addBtn.addEventListener("click", () => {
  addHoursModal.classList.add("active");
  document.querySelector(".overlay").style.display = "block";
});

closeModal.addEventListener("click", () => {
  addHoursModal.classList.remove("active");
  document.querySelector(".overlay").style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  addHoursModal.classList.remove("active");
  document.querySelector(".overlay").style.display = "none";
});

radioBtns.forEach((radio) => {
  radio.addEventListener("click", () => {
    if (radio.checked) {
      if (radio.value === "Day-off") {
        document
          .getElementById("hours-worked")
          .attributes.setNamedItem(document.createAttribute("disabled"));
        document.getElementById("hours-worked").value = "0";
        dayOff = true;
      } else if (
        radio.value === "Working-day" ||
        (radio.value === "Working-day" &&
          document.getElementById("hours-worked").disabled)
      ) {
        document.getElementById("hours-worked").disabled = false;
        document.getElementById("hours-worked").value = "";
        dayOff = false;
      }
    }
  });
});
addHoursBtn.addEventListener("click", saveHours);

async function saveHours() {

  //get data from the modal when the user clicks the add hours button
  let hoursWorked = document.getElementById("hours-worked").value;
  let workDate = document.getElementById("date").value;


  if(hoursWorked == ""|| workDate == ""){
    document.querySelector("#error").textContent = "Please fill in all fields";
    document.getElementById("hours-worked").focus();
  }
  else{
    document.querySelector("#error").textContent = "";
    //create a hoursWorked object
  const hoursObj = {
    hours: hoursWorked,
    date: workDate,
    dayOff: dayOff,
  };

  const usersCollection = collection(db, "users");
  let collectionID;
  
  try {
    const querySnapshot = await getDocs(
      query(usersCollection, where("userID", "==", userID))
    );
    if (!querySnapshot.empty) {
      // Get the first document that matches the query
      const userDoc = querySnapshot.docs[0];

      // Return the ID of the document
      collectionID = userDoc.id;
    }
  } catch (error) {
    document.querySelector("#error").textContent = error.message;
  }
  
  try {
    // Ensure collectionID is defined before proceeding
    if (collectionID) {
      const userDocRef = doc(db, "users", collectionID);
      const hoursCollection = collection(userDocRef, "hours");
      await addDoc(hoursCollection, hoursObj);
      
      //close modal and remove overlay
      addHoursModal.classList.remove("active");
      document.querySelector(".overlay").style.display = "none";
    } else {
      document.querySelector("#error").textContent = "User document ID not found."
    }
  } catch (error) {
    document.querySelector("#error").textContent = error.message;
  }
  }
  
}

