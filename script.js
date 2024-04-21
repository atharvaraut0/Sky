console.log("This is a test")
let globalSeed = Math.random();

//defining console within the UI/////////////////////////////////////////////////////////////////////
let consoleSpan = document.getElementById("console");
consoleSpan.innerHTML = 'CONSOLE';
console.log(consoleSpan.textContent);

function clearConsole() {
    consoleSpan.innerHTML = '';
}



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

let clearConsoleIntervalId;
let updateTimeIntervalId;
let changeSkyIntervalId;
let moveSunIntervalId;
let moveMoonIntervalId;
let moveCloudsIntervalId;

function startIntervals() {
    clearConsoleIntervalId = setInterval(clearConsole, 5005 / timeMultiplier);
    updateTimeIntervalId = setInterval(updateTime, 1000 / timeMultiplier);
    changeSkyIntervalId = setInterval(changeSky, 1000 / timeMultiplier);
    moveSunIntervalId = setInterval(moveSun, 2000 / timeMultiplier);
    moveMoonIntervalId = setInterval(moveMoon, 2000 / timeMultiplier);
    moveCloudsIntervalId = setInterval(moveClouds, 5000 / timeMultiplier);
}

function stopIntervals() {
    clearInterval(updateTimeIntervalId);
    clearInterval(changeSkyIntervalId);
    clearInterval(moveSunIntervalId);
    clearInterval(moveMoonIntervalId);
    clearInterval(moveCloudsIntervalId);
    clearInterval(clearConsoleIntervalId);
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



//Setting global day based on season///////////////////////////////////////////////////////////////

let startTime = 6 * 3600;
let endTime = (19 * 3600) + (30 * 60); // 7:30 PM

let seasonSelector = document.querySelector("#season .dropup-btn");
let seasonButtons = document.querySelectorAll("#season .list-item");

seasonSelector.textContent = 'Summer';


seasonButtons.forEach(button => {
    button.addEventListener("click", () => {

        if(button.textContent === 'Fall') {
            startTime = 7 * 3600;
            endTime = 17 * 3600;

        } else if(button.textContent === 'Spring') {
            startTime = (6 * 3600) + (30 * 60);
            endTime = (19 * 3600) + (30 * 60);
        } else {
            startTime = 6 * 3600;
            endTime = (19 * 3600) + (30 * 60);
        }

        seasonSelector.textContent = button.textContent;
        
        stopIntervals(); // Stop existing intervals
        timeMultiplier = 1; // Reset time multiplier
        startTimeSpeed = Date.now(); // Reset start time to current time
        console.log("Time reset to current time");
        startIntervals(); // Start new intervals with the updated time multiplier
        document.getElementById("show-speed").innerText = `${timeMultiplier}X`; // Update the button text
        

    });
});

// Initial start of intervals
startIntervals();

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
    let cloudOpacity;
   
    let delay = 800;

    if(totalSeconds >= skyRiseStart && totalSeconds < skySetEnd) {
        if(totalSeconds < skyRiseEnd && totalSeconds >= skyRiseStart) {
            topLum = (totalSeconds - skyRiseStart) / (skyRiseEnd - skyRiseStart);
            bottomLum = ((totalSeconds - delay) - skyRiseStart) / (skyRiseEnd - skyRiseStart);
            cloudOpacity = topLum;
           
        } else if(totalSeconds >= skySetStart && totalSeconds < skySetEnd) {
            topLum = (totalSeconds + delay - skySetStart) / (skySetEnd - skySetStart);
            topLum = Math.abs(1 - topLum);
            
            bottomLum = (totalSeconds - skySetStart) / (skySetEnd - skySetStart);
            bottomLum = Math.abs(1 - bottomLum);
            cloudOpacity = bottomLum;
        } else {
            topLum = 1;
            bottomLum = 1;
            cloudOpacity = topLum;
        }
    } else {
        topLum = 0;
        bottomLum = 0;
        cloudOpacity = topLum;
    }

    let mappedTopLum = mapValue(topLum,0,1,0,50);
    let mappedBottomLum = mapValue(bottomLum,0,1,0,50);
    let mappedCloudOpacity = mapValue(cloudOpacity,0,1,0.3,1); 

    console.log('topLum: ' + mappedTopLum)
    console.log('bottomLum:' + mappedBottomLum)
    console.log('cloud opacity:' + mappedCloudOpacity)

    
    
    consoleSpan.innerHTML += `<br> top sky = ${topLum} <br> bottom sky = ${bottomLum}`;
    
    sky.style.background = `linear-gradient(180deg, hsl(201, 100%, ${mappedTopLum}%) 0%, hsl(201, 100%, ${mappedBottomLum}%) 100%)`;
    clouds.style.opacity = mappedCloudOpacity;
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
    consoleSpan.innerHTML += `<br> sun positon = ${mappedSunPosition.toFixed(3)}`;

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
        //user-console
        consoleSpan.innerHTML += `<br>sun color = hsl(37,100%,${mappedVal.toFixed(3)}%)`
        console.log(mappedVal)
    } else if(totalSeconds > sunSetStart) {
        let val = (totalSeconds - sunSetStart) / (sunSetEnd - sunSetStart);
        let mappedVal = mapValue(val,0,1,100,50);
        sun.style.backgroundColor = `hsl(29,100%,${mappedVal}%)` 
        //user-console
        consoleSpan.innerHTML += `<br>sun color = hsl(29,100%,${mappedVal.toFixed(3)}%)`
    } else {
            sun.style.backgroundColor = `hsl(37,100%,100%)`
            //user-console
            consoleSpan.innerHTML += `<br>sun color = hsl(37,100%,100%)`
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
    //user-console
    consoleSpan.innerHTML += `<br>Moon position = ${mappedMoonPosition.toFixed(3)}`

    // if(totalSeconds < moonStart || totalSeconds >= moonEnd) {
    //     moon.style.display = 'none';
    // }
}



// setInterval(moveMoon, 2000 / timeMultiplier);

//Setting haze and clouds///////////////////////////////////////////////////////////////////////////

let fog = document.getElementById("fog");

let weatherSelector = document.querySelector("#weather .dropup-btn");
let weatherButtons = document.querySelectorAll("#weather .list-item");


weatherSelector.textContent = 'Clear';
fog.style.opacity = 0;

weatherButtons.forEach(button => {
    button.addEventListener("click", () => {
        let seed = Math.random();

        if (button.textContent === 'Hazy' || button.textContent === 'Cloudy') {
            // fog.style.display = 'flex';
            fog.style.opacity = seed * 0.35;
            console.log('fog opacity: ' + fog.style.opacity);
            sun.style.filter = `url(#glow) blur(${seed * 51}px)`;
            console.log('sun blur:' + seed);
            moon.style.filter = `url(#glow-moon) blur(${seed * 31}px)`;
            console.log('moon blur:' + seed);
            stars.style.filter = `blur(${seed * 11}px`;
            clouds.style.display = 'none';

            if(button.textContent === 'Cloudy') {
            clouds.style.display = 'flex';
            }

        } else {
            fog.style.opacity = 0;
            sun.style.filter = ''; // Reset the filter when not hazy or cloudy
            moon.style.filter = '';
            stars.style.filter = '';
            clouds.style.display = 'none';
        }

        weatherSelector.textContent = button.textContent;
        
    });
});

function updateHaze() {
    let timeArray = updateTime();
    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

   
    if(totalSeconds >= startTime && totalSeconds < endTime) {
        fog.style.display = 'flex';
    }  else {
        fog.style.display = 'none';
    }
   
}

setInterval(updateHaze, 500);

// adding stars /////////////////////////////////////////////////////////////////////////

let stars = document.getElementById("stars");
let singleStar = document.getElementsByClassName("single-star");


function scatterStarsIfNighttime(numStars) {
    let timeArray = updateTime();
    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds < startTime || totalSeconds > endTime) {
        if(stars.children.length === 0) {
        for (let i = 0; i < numStars; i++) {
            let star = document.createElement("div");
            star.classList.add("single-star");
            star.style.left = `${Math.random(i) * 100}vw`;
            star.style.top = `${Math.random(i) * 100}vh`;
            star.style.width = `${Math.random(i) * 0.4}vw`
            star.style.height = star.style.width;
            star.style.opacity = `${mapValue((Math.random(i) * 0.4),0,0.4,0.5,1)}`;
            stars.appendChild(star);
            consoleSpan.innerhTML += `<br>Stars = ${stars.children.length}`;
        }
        }
    } else if (totalSeconds >= startTime && totalSeconds <= endTime) {
        stars.innerHTML = "";
    }
}

setInterval(() => scatterStarsIfNighttime((globalSeed + 15) * 25), 500); // Scatter stars

// Scatter clouds //////////////////////////////////////////////////////////////////////////

let clouds = document.getElementById("clouds");
let singleCloud = document.getElementsByClassName("single-cloud");
let cloudSeed = Math.random();
clouds.innerHTML = '';


function scatterClouds(numClouds) {
    
    if(clouds.children.length === 0) {
        for (let i = 0; i < numClouds; i++) {
            let cloud = document.createElement("div");
            cloud.classList.add("single-cloud");
            cloud.style.left = `${Math.random(i) * 100}vw`;
            cloud.style.top = `${Math.random(i) * 100}vh`;
            
            let cloudWidth = mapValue(Math.random(i),0,1,15,35);
            let cloudHeight = (cloudWidth / 2) + (mapValue(Math.random(i),0,1,-2,2));

            cloud.style.width = `${cloudWidth}vw`;
            cloud.style.height = `${cloudHeight}vw`;
            // cloud.style.opacity = `${mapValue((Math.random(i),0,1,0.5,1))}`;
            clouds.appendChild(cloud);
        }
    }
}

scatterClouds((globalSeed + 1) * 16);

//Move Clouds ////////////////////////////////////////////////////////////////////////

function moveClouds() {
    let timeArray = updateTime();

    let hours = parseInt(timeArray[0]);
    let minutes = parseInt(timeArray[1]);
    let seconds = parseInt(timeArray[2]);
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    let midnight = 86399;

    let cloudMove = Math.sin((totalSeconds / midnight) * Math.PI * 1).toFixed(3);
    console.log('cloud move:' + cloudMove)

    let mappedCloudMove = mapValue(cloudMove,0,1,-25,25);
    clouds.style.left = `${mappedCloudMove}vw`;

}


//initialize functions before interval
changeSky();
moveMoon();
moveSun();
moveClouds();