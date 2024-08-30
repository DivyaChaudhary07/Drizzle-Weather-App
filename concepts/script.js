const API_KEY = "168771779c71f3d64106d8a88376808a";
//const weatherId = document.querySelector("#weather");

function renderData(data)
{
    const newPara=document.createElement("p");
    document.body.append(newPara);
    console.log(data.main.temp);
    newPara.textContent=data.main.temp+" °C.";
}

// async function getWeather() {
//     console.log('hello');
//     let city = 'dehradun';
//     try{
//         const response = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//         );
//         const data = await response.json();
//         console.log(data);
//         renderData(data);
//     }
//     catch(e){
//         console.log("error Data can't be fetched");
//     }
    
//     // weatherId.innerText = data.main.temp_min;
//     // weatherId.innerText = data?.main?.temp_min;
// }
//  getWeather();

 let lat,lon;
 async function getWeather2() {
    
    navigator.geolocation.getCurrentPosition((position)=>{
        lat=position.coords.latitude;
        console.log(lat);
        lon=position.coords.longitude;
        console.log(lon);
    })
    
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        console.log(data);
        renderData(data);
    }
    catch(e){
        console.log("error Data can't be fetched");
    }
    
    // weatherId.innerText = data.main.temp_min;
    // weatherId.innerText = data?.main?.temp_min;
}
 getWeather2();