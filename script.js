console.log("This is a test")

//logging time////////////////////////////////////////////////////////////////////////////////////////////////////

let timeMultiplier = 1; // Speed multiplier for time 


let time = document.getElementById("timecode");

function updateTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let timeString = `${hours}:${minutes}:${seconds}`;
    time.innerText = timeString;
    let timeArray = [hours, minutes, seconds];
    // let timeArray = ['18','50','00']
    // console.log(`${hours}:${minutes}:${seconds}`)
    // console.log(timeArray)
    return timeArray;
}

console.log(updateTime())

setInterval(updateTime, 1000); // Update every second

//Setting global day based on season
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

    let skyRiseStart = startTime - (30 * 60);
    let skyRiseEnd = startTime + (30 * 60);
    let skySetStart = endTime - (10 * 60);
    let skySetEnd = endTime + (30 * 60);
    let topLum;
    let bottomLum;
    let delay = 600;

    if(totalSeconds >= skyRiseStart && totalSeconds < skySetEnd) {
        if(totalSeconds < skyRiseEnd) {
            topLum = (totalSeconds - skyRiseStart) / (skyRiseEnd - skyRiseStart);
            

            bottomLum = ((totalSeconds - delay) - skyRiseStart) / (skyRiseEnd - skyRiseStart);
           
        } else if(totalSeconds >= skySetStart) {
            topLum = (totalSeconds + delay - skySetStart) / (skySetEnd - skySetStart);
            

            bottomLum = (totalSeconds - skySetStart) / (skySetEnd - skySetStart);
            
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

setInterval(changeSky, 1000); // Update sky background every second


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

    if(totalSeconds > endTime) {
        sun.style.display = 'none';
    }

}


// Map value from the range [a, b] to the range [c, d]
function mapValue(value, a, b, c, d) {
    return c + ((value - a) * (d - c)) / (b - a);
}

setInterval(moveSun, 2000); // Update sun position 


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
      let mappedMoonOpacity = mapValue(moonOpacity,0,1,0.2,1) * 100;

      moon.style.backgroundColor = `hsla(37, 100%, 97%, ${mappedMoonOpacity}%)`
    
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

setInterval(moveMoon, 2000);