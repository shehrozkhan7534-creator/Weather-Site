const apiKey = "e9bccda056b0e63cd4dc9292c5a27f8f"; // Replace with your OpenWeatherMap API key

// Auto detect location on load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    }, () => {
      document.getElementById("cityName").innerText = "Allow location or search manually";
    });
  }
};

// Manual search
function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (city) {
    fetchWeather(city);
  }
}

// Fetch weather by city name
function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayWeather(data));

  fetchForecast(city);
}

// Fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayWeather(data));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

// Display current weather
function displayWeather(data) {
  if (!data || data.cod !== 200) {
    document.getElementById("cityName").innerText = "City not found";
    return;
  }
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText = Math.round(data.main.temp) + "°C";
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = data.wind.speed;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("date").innerText = new Date().toDateString();
}

// Fetch forecast by city
function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

// Display 5-day forecast
function displayForecast(data) {
  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  if (!data.list) return;

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach(day => {
    let date = new Date(day.dt_txt);
    let options = { weekday: 'short' };
    let dayName = new Intl.DateTimeFormat('en-US', options).format(date);

    forecastEl.innerHTML += `
      <div class="forecast-day">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });
}
