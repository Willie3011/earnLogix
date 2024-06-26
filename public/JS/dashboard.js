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
  deleteDoc,
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
  await updateCalendarHours(userID);
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
let currentDate = new Date();
//get year
let year = currentDate.getFullYear();
//get month
let month = currentDate.getMonth();


function loadDays() {
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
    const dateAttribute = `${year}-${(
      month + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;
    if (
      i === currentDate.getDate() &&
      year === currentDate.getFullYear() &&
      month === currentDate.getMonth()
    ) {
      day = `<div class="day today" data-date="${dateAttribute}">${i}</div>`;
    } else {
      day = `<div class="day" data-date="${dateAttribute}">${currentDay}</div>`;
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
//add functionality to the calendar buttons
const prevMonth = document.querySelector(".prev-month");
const nextMonth = document.querySelector(".next-month");

prevMonth.addEventListener("click", () => {
  month = month - 1;

  if (month < 0) {
    month = 11;
    year = year - 1;
    loadDays();
    updateCalendarHours(userID);
    updateCards(userID);
    displayHoursInTable(userID);
  } else {
    loadDays();
    updateCalendarHours(userID);
    updateCards(userID);
    displayHoursInTable(userID);
  }
});

nextMonth.addEventListener("click", () => {
  month = month + 1;
  if (month > 11) {
    month = 0;
    year = year + 1;
    loadDays();
    updateCalendarHours(userID);
    updateCards(userID);
    displayHoursInTable(userID);
  } else {
    loadDays();
    updateCalendarHours(userID);
    updateCards(userID);
    displayHoursInTable(userID);
  }
});

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
          .getElementById("hours-worked-input")
          .attributes.setNamedItem(document.createAttribute("disabled"));
        document.getElementById("hours-worked-input").value = "0";
        dayOff = true;
      } else if (
        radio.value === "Working-day" ||
        (radio.value === "Working-day" &&
          document.getElementById("hours-worked-input").disabled)
      ) {
        document.getElementById("hours-worked-input").disabled = false;
        document.getElementById("hours-worked-input").value = "";
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
      const userDocID = await getUserDocID(userID);
      // Ensure collectionID is defined before proceeding
      if (userDocID) {
        const userDocRef = doc(db, "users", userDocID);
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

          //reload the UI elements
          await updateCards(userID);
          await displayHoursInTable(userID);
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
    //get the user document ID
    let userDocID = await getUserDocID(userID);
    let hourlyRate;
    // Ensure user document ID is defined before proceeding
    const userDocRef = doc(db, "users", userDocID);

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
      let hoursMonth = new Date(data.date).getMonth();

      //get hour document ID
      const hoursID = doc.id;
      if (month === hoursMonth) {
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
        hoursWorkedCell.textContent =
          data.hours === "0" ? "Day off" : data.hours;
        row.appendChild(hoursWorkedCell);

        const totalAmountCell = document.createElement("td");
        const totalAmount = data.hours * hourlyRate;
        totalAmountCell.textContent = totalAmount.toFixed(2);
        row.appendChild(totalAmountCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        const icon = document.createElement("i");
        icon.classList = "bx bxs-trash";
        deleteButton.append(icon);
        deleteButton.classList.add("deleteBtn");
        // Add event listener to delete button
        deleteButton.addEventListener("click", () => deleteHoursDoc(hoursID));
        actionCell.append(deleteButton);
        row.append(actionCell);
        rows.push(row);
      }
      // Create a table row for each document
    });

    //sort the rows by date
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

async function deleteHoursDoc(hoursDocID) {
  // Reference to the user document
  try {
    //get the user document ID
    const userDocID = await getUserDocID(userID);
    const userDocRef = doc(db, "users", userDocID);

    // Reference to the specific document within the nested 'hours' collection
    const hoursDocRef = doc(collection(userDocRef, "hours"), hoursDocID);

    await deleteDoc(hoursDocRef).then(() => {
      updateCards(userID);
      displayHoursInTable(userID);
      updateCalendarHours(userID);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getUserDocID(userID) {
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
  //get the user document ID
  const userDocID = await getUserDocID(userID);

  if (userDocID) {
    try {
      const userDocRef = doc(db, "users", userDocID);
      const querySnapshot = await getDocs(collection(userDocRef, "hours"));

      let salary = 0;
      let workingDays = 0;
      let daysOff = 0;
      let totalHours = 0;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let hoursMonth = new Date(data.date).getMonth();

          //check if month from database matches the current month on the calendar
          if (month === hoursMonth) {
            if (data.hours > 0) {
              workingDays++;
              totalHours += parseInt(data.hours);
            } else if (data.hours) {
              daysOff++;
            }
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

async function getHoursCollection(userDocID) {
  if (userDocID) {
    try {
      const userDocRef = await doc(db, "users", userDocID);
      const hoursCollection = await collection(userDocRef, "hours");

      return hoursCollection;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    return null;
  }
}

async function updateCalendarHours(userID) {
  const userDocID = await getUserDocID(userID);

  const hoursCollection = await getHoursCollection(userDocID);
  const calendarDays = document.querySelectorAll(".day");
  const querySnapshot = await getDocs(hoursCollection);

  //if the user has hours in the database
  if (!querySnapshot.empty) {
    const userDates = [];
    //add the hours documents in an array
    querySnapshot.forEach((doc) => {
      const date = doc.data().date;
      const hours = doc.data().hours;
      userDates.push({
        date: date,
        hours: hours,
      });
    });

    //add the hours to the calendar
    calendarDays.forEach((day) => {
      let date = day.dataset.date;
      for (let i = 0; i < userDates.length; i++) {
        let hoursMonth = new Date(userDates[i].date).getMonth();
        //if the date is in the current month
        if (hoursMonth === month) {
          //compare the current date with the date from the database
          if (userDates[i].date === date) {
            // Create a div to display hours
            const hoursDiv = document.createElement("div");
            hoursDiv.classList.add("hours");
            if (userDates[i].hours === "0") {
              //Display day off
              hoursDiv.textContent = "Day off";
              hoursDiv.classList.add("day-off");
            } else {
              //Display hours
              hoursDiv.textContent = userDates[i].hours + " hours";
            }
            day.appendChild(hoursDiv);
          }
        }
      }
    });
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
