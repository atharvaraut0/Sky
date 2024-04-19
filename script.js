console.log("This is a test")

//logging time////////////////////////////////////////////////////////////////////////////////////////////////////

let initialTime = Date.now(); // Store the initial time for reference
let timeMultiplier = 1; // Speed multiplier for time
let time = document.getElementById("timecode");
let startTimeSpeed = initialTime; // Store the start time for speed calculation

function updateTime() {
    let elapsed = (Date.now() - startTimeSpeed) * timeMultiplier; // Calculate the elapsed time
    let now = new Date(initialTime + elapsed); // Calculate the current time based on initial time and elapsed time
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let timeString = `${hours}:${minutes}:${seconds}`;
    time.innerText = timeString;
    let timeArray = [hours, minutes, seconds];
    return timeArray;
}

console.log(updateTime())



let updateTimeIntervalId;
let changeSkyIntervalId;
let moveSunIntervalId;
let moveMoonIntervalId;

function startIntervals() {
    updateTimeIntervalId = setInterval(updateTime, 1000 / timeMultiplier);
    changeSkyIntervalId = setInterval(changeSky, 1000 / timeMultiplier);
    moveSunIntervalId = setInterval(moveSun, 2000 / timeMultiplier);
    moveMoonIntervalId = setInterval(moveMoon, 2000 / timeMultiplier);
}

function stopIntervals() {
    clearInterval(updateTimeIntervalId);
    clearInterval(changeSkyIntervalId);
    clearInterval(moveSunIntervalId);
    clearInterval(moveMoonIntervalId);
}

// Event listeners for time speed buttons
document.querySelectorAll("#time-speedup .list-item").forEach(button => {
    button.addEventListener("click", () => {
        stopIntervals(); // Stop existing intervals
        timeMultiplier = parseInt(button.textContent); // Set time multiplier to button's text content
        console.log(`Time multiplier set to ${timeMultiplier}x`);
        startIntervals(); // Start new intervals with the updated time multiplier
        document.getElementById("show-speed").innerText = `${timeMultiplier}X`; // Update the button text
    });
});

// Event listener for reset button
document.getElementById("reset-button").addEventListener("click", () => {
    stopIntervals(); // Stop existing intervals
    timeMultiplier = 1; // Reset time multiplier
    startTimeSpeed = Date.now(); // Reset start time to current time
    console.log("Time reset to current time");
    startIntervals(); // Start new intervals with the updated time multiplier
    document.getElementById("show-speed").innerText = `${timeMultiplier}X`; // Update the button text
});

// Initial start of intervals
startIntervals();

//Setting global day based on season///////////////////////////////////////////////////////////////
// Add functionality with buttons here
let startTime = 6 * 3600;
let endTime = (19 * 3600) + (30 * 60); // 7:30 PM

//Setting the color of the sky/////////////////////////////////////////////////////////////////////////////////

let sky = document.getElementById("sky");

function changeSky() {
    
    let timeArray = updateTime();

    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    let skyRiseStart = startTime - (40 * 60);
    let skyRiseEnd = startTime ;
    let skySetStart = endTime - (30 * 60);
    let skySetEnd = endTime + (30 * 60);
    let topLum;
    let bottomLum;
   
    let delay = 800;

    if(totalSeconds >= skyRiseStart && totalSeconds < skySetEnd) {
        if(totalSeconds < skyRiseEnd && totalSeconds >= skyRiseStart) {
            topLum = (totalSeconds - skyRiseStart) / (skyRiseEnd - skyRiseStart);
            

            bottomLum = ((totalSeconds - delay) - skyRiseStart) / (skyRiseEnd - skyRiseStart);
           
        } else if(totalSeconds >= skySetStart && totalSeconds < skySetEnd) {
            topLum = (totalSeconds + delay - skySetStart) / (skySetEnd - skySetStart);
            topLum = Math.abs(1 - topLum);
            

            bottomLum = (totalSeconds - skySetStart) / (skySetEnd - skySetStart);
            bottomLum = Math.abs(1 - bottomLum);
        } else {
            topLum = 1;
            bottomLum = 1;
        }
    } else {
        topLum = 0;
        bottomLum = 0;
    }

    let mappedTopLum = mapValue(topLum,0,1,0,50);
    let mappedBottomLum = mapValue(bottomLum,0,1,0,50);

    console.log('topLum: ' + mappedTopLum)
    console.log('bottomLum:' + mappedBottomLum)
    sky.style.background = `linear-gradient(180deg, hsl(201, 100%, ${mappedTopLum}%) 0%, hsl(201, 100%, ${mappedBottomLum}%) 100%)`;
}

// setInterval(changeSky, 1000 / timeMultiplier); // Update sky background every second


//Setting movement of the sun///////////////////////////////////////////////////////////////////////////////////

let sun = document.getElementById("sun");

function moveSun() {
    // console.clear()
    let timeArray = updateTime();

    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    // let startTime = 6 * 3600;
    // let endTime = (19 * 3600) + (30 * 60); // 7:30 PM

    // Normalize position from 0 to 1
    let sunPosition = (totalSeconds - startTime) / (endTime - startTime);
    console.log('sun position: ' + sunPosition)

    // Map sunPosition from the range [0, 1] to the range [-10, 99]
    let mappedSunPosition = mapValue(sunPosition, 0, 1, -10, 99);
    console.log(mappedSunPosition)

    // Set the top property of the sun div
    sun.style.top = `${mappedSunPosition}vh`;
    
    //Setting sunrise and sunset values

    let sunRiseStart = startTime;
    let sunRiseEnd = startTime + (30 * 60);

    let sunSetStart = endTime - (2 * 3600);
    let sunSetEnd = endTime - (1000);

    if(totalSeconds <= sunRiseEnd) {
        let val = (totalSeconds - sunRiseStart) / (sunRiseEnd - sunRiseStart);
        let mappedVal = mapValue(val,0,1,50,100);
        sun.style.backgroundColor = `hsl(37,100%,${mappedVal}%)`
        console.log(mappedVal)
    } else if(totalSeconds > sunSetStart) {
        let val = (totalSeconds - sunSetStart) / (sunSetEnd - sunSetStart);
        let mappedVal = mapValue(val,0,1,100,50);
        sun.style.backgroundColor = `hsl(29,100%,${mappedVal}%)` 
    } else {
            sun.style.backgroundColor = `hsl(37,100%,100%)`
        }

    // if(totalSeconds > endTime) {
    //     sun.style.display = 'none';
    // }

}


// Map value from the range [a, b] to the range [c, d]
function mapValue(value, a, b, c, d) {
    return c + ((value - a) * (d - c)) / (b - a);
}

// setInterval(moveSun, 2000 / timeMultiplier); // Update sun position 


//Setting movement of the moon ////////////////////////////////////////////////////////////////////////////////////////////////////


let moon = document.getElementById("moon");

function moveMoon() {
    let timeArray = updateTime();

    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    let moonStart = endTime - (1.5 * 3600);
    let moonFull = moonStart + (3 * 60);
    let moonEnd = startTime - (10 * 60);
    let midnight = 86399;
    let moonPosition;
    let mappedMoonPosition

    if(totalSeconds <= midnight && totalSeconds >= moonStart) {
    // Normalize position from 0 to 1
      moonPosition = (totalSeconds - moonStart) / (midnight - moonStart);

      mappedMoonPosition = mapValue(moonPosition, 0, 1, -10, 50);

      let moonOpacity = (totalSeconds - moonStart) / (moonFull - moonStart);
      let mappedMoonOpacity = mapValue(moonOpacity, 0, 1, 0.2, 1);
      console.log('opacity moon :' + mappedMoonOpacity);

      moon.style.backgroundColor = `hsla(37, 100%, 97%, ${mappedMoonOpacity})`;
    
    } else {
        moonPosition = (totalSeconds) / moonEnd;

        mappedMoonPosition = mapValue(moonPosition,0,1,50,99);
    }

    console.log('moon position: ' + mappedMoonPosition)
    // Set the top property of the moon div
    moon.style.top = `${mappedMoonPosition}vh`;

    // if(totalSeconds < moonStart || totalSeconds >= moonEnd) {
    //     moon.style.display = 'none';
    // }
}

// setInterval(moveMoon, 2000 / timeMultiplier);