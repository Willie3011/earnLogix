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

  loadDays();
  await updateCards(userID);
  await displayHoursInTable(userID);
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
  let hoursWorked = document.getElementById("hours-worked-input").value;
  let workDate = document.getElementById("date").value;

  if (hoursWorked == "" || workDate == "") {
    document.querySelector("#error").textContent = "Please fill in all fields";
    document.getElementById("hours-worked-input").focus();
  } else {
    document.querySelector("#error").textContent = "";
    //create a hoursWorked object
    const hoursObj = {
      hours: hoursWorked,
      date: workDate,
      dayOff: dayOff,
    };

    try {
      const collectionID = await getUserCollectionID(userID);
      // Ensure collectionID is defined before proceeding
      if (collectionID) {
        const userDocRef = doc(db, "users", collectionID);
        const hoursCollection = collection(userDocRef, "hours");

        //check if the date entered already exists in the database
        const querySnapshot = await getDocs(
          query(hoursCollection, where("date", "==", workDate))
        );
        if (!querySnapshot.empty) {
          //if the date exists, throw an error
          document.querySelector("#error").textContent =
            "You have already inputted hours for this date.";
        } else {
          //create new document
          await addDoc(hoursCollection, hoursObj);
          await updateCards(userID);
          await displayHoursInTable(userID);
          //close modal and remove overlay
          addHoursModal.classList.remove("active");
          document.querySelector(".overlay").style.display = "none";
        }
      } else {
        document.querySelector("#error").textContent =
          "User document ID not found.";
      }
    } catch (error) {
      document.querySelector("#error").textContent = error.message;
      console.log(error);
    }
  }
}

//update input history with data
async function displayHoursInTable(userID) {
  const hoursTable = document.getElementById("input-history");
  try {
    let collectionID = await getUserCollectionID(userID);
    let hourlyRate;
    // Ensure collectionID is defined before proceeding
    const userDocRef = doc(db, "users", collectionID);

    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const user = userDoc.data();
      hourlyRate = user.hourlyRate;
    }

    const querySnapshot = await getDocs(collection(userDocRef, "hours"));

    // Clear existing table rows
    hoursTable.innerHTML = "";

    const rows = [];
    // Loop through the query snapshot
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Create a table row for each document
      const row = document.createElement("tr");

      // Add cells for each data field
      let date = new Date(data.date);
      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(date);
      row.appendChild(dateCell);

      const dayOfWeekCell = document.createElement("td");
      const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"][
        date.getDay()
      ];
      dayOfWeekCell.textContent = dayOfWeek;
      row.appendChild(dayOfWeekCell);

      const hoursWorkedCell = document.createElement("td");
      hoursWorkedCell.textContent = data.hours === "0" ? "Day off" : data.hours;
      row.appendChild(hoursWorkedCell);

      const totalAmountCell = document.createElement("td");
      const totalAmount = data.hours * hourlyRate;
      totalAmountCell.textContent = totalAmount.toFixed(2); // Assuming you want to display the amount with two decimal places
      row.appendChild(totalAmountCell);
      rows.push(row);
    });
    rows.sort((a, b) => {
      const dateA = new Date(a.cells[0].textContent);
      const dateB = new Date(b.cells[0].textContent);
      return dateA - dateB;
    });

    // Append the sorted rows to the table
    rows.forEach((row) => hoursTable.appendChild(row));
  } catch (error) {
    console.log("Error displaying hours: ", error);
  }
}

async function getUserCollectionID(userID) {
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
      return collectionID;
    } else {
      // If no document matches the query, return null
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function updateCards(userID) {
  const collectionID = await getUserCollectionID(userID);

  if (collectionID) {
    try {
      const userDocRef = doc(db, "users", collectionID);
      const querySnapshot = await getDocs(collection(userDocRef, "hours"));
      let salary = 0;
      let workingDays = 0;
      let daysOff = 0;
      let totalHours = 0;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.hours > 0) {
            workingDays++;
            totalHours += parseInt(data.hours);
          } else if (data.hours) {
            daysOff++;
          }
        });
      }

      let hourlyRate;
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const user = userDoc.data();
        hourlyRate = user.hourlyRate;
      }

      salary = hourlyRate * totalHours;
      //update the card data
      document.querySelector("#salary").innerHTML = `R ${salary.toFixed(2)}`;
      document.querySelector(
        "#days-worked"
      ).innerHTML = `${workingDays} <span>Days</span>`;
      document.querySelector(
        "#days-off"
      ).innerHTML = `${daysOff} <span>Days</span>`;
      document.querySelector(
        "#hours-worked"
      ).innerHTML = `${totalHours} <span>Hours</span>`;

      //set the progress bars
      setProgress(".p1", salary, 5000);
      setProgress(".p2", workingDays, 31);
      setProgress(".p3", daysOff, 15);
      setProgress(".p4", totalHours, 200);
    } catch (error) {
      console.log(error.message);
    }
  }
}

//formatting the date for the table
function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
