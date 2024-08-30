const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const setDate=document.querySelector(".date");
const currentDate= new Date();
setDate.textContent=currentDate.toDateString();
//initially variables needed?
let currentTab = userTab;
const API_KEY = "168771779c71f3d64106d8a88376808a";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //mai phle search tab pr tha ab  weather-info ko visible krwana hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");

      //This means you have clicked on your weather tab
      //So, we want to show the weather of your current location
      //first let's check local storage for the coordinates,if we have saved them.
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as user input
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as user input
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active"); 
  loadingScreen.classList.add("active");
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err)
  {
    loadingScreen.classList.remove("active");
    //rest h.w
  }
   
}

function renderWeatherInfo(weatherInfo) {

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-clouds]");

  //fetch values from weatherInfo object and put it to UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText=weatherInfo?.weather?.[0]?.description;
  weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText=weatherInfo?.main?.temp+" °C.";
  windSpeed.innerText=weatherInfo?.wind?.speed+" m/s";
  humidity.innerText=weatherInfo?.main?.humidity+"%";
  cloudiness.innerText=weatherInfo?.clouds?.all+"%";

}

const grantAccessButton=document.querySelector("[data-grantAccess]");

function getLocation()
{
  // if geolocation api is supported
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //h.w show an alert for no geolocation support
    alert("no geoloaction api is supported on your system !");
  }

}

function showPosition(position)
{
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  notFound.classList.remove('active');
  const cityName=searchInput.value;
  if(cityName===""){
    return;
  } 
  else{
    fetchSearchWeatherInfo(cityName);
  }

})

const notFound=document.querySelector(".errorContainer");
const errorText=document.querySelector("[data-errorText]");
const errorBtn=document.querySelector("[data-errorButton]");

async function fetchSearchWeatherInfo(city)
{
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");//ho skta hai hum dubra koi dusri city dalke search kr rhe ho
  grantAccessContainer.classList.remove("active"); //iski kya zrurat thi?

  try{
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    if (!data.main) {
      throw data;
    }

    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);  
    
  }
  catch(err)
  {
    loadingScreen.classList.remove('active');
    userInfoContainer.classList.remove('active');
    notFound.classList.add('active');
    errorText.innerText = `${err?.message}`;
    errorBtn.classList.add("active");

  }

}

errorBtn.addEventListener("click",()=>{
  notFound.classList.remove('active');
  loadingScreen.classList.add('active');
   setTimeout(() => {
    loadingScreen.classList.remove('active');
    searchInput.value="";
  }, 200);
})
