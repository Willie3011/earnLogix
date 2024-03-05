const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");



const comingSoon = function(){
    //Create the date for the coming of this website page
    const comingSoonDate = new Date('2024-03-15').getTime();
    const now = new Date().getTime();
    const distance = comingSoonDate - now;
    

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    if(days < 10){
        days = `0${days}`;
    }

    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if(hours < 10){
        hours = `0${hours}`;
    }

    let minutes = Math.floor((distance % (1000 * 60 * 60) /(1000 * 60)));
    if(minutes < 10){
        minutes = `0${minutes}`;
    }

    let seconds = Math.floor((distance % (1000 * 60) / 1000));
    if(seconds < 10){
        seconds = `0${seconds}`;
    }
    //Show the days, hours, minutes, seconds on the document.
    daysEl.innerHTML = days;
    hoursEl.innerHTML = hours;
    minutesEl.innerHTML = minutes;
    secondsEl.innerHTML = seconds;

}

setInterval(comingSoon, 1000);