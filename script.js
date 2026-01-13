const apiKey = "75dd659c25739c2473282716acb1a78f";
const lat = -17.9833;
const lon = -67.1500;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    document.getElementById("temp").textContent =
      `🌡 Temperatura: ${data.main.temp} °C`;

    document.getElementById("desc").textContent =
      `📝 ${data.weather[0].description}`;

    document.getElementById("humidity").textContent =
      `💧 Humedad: ${data.main.humidity}%`;

    document.getElementById("wind").textContent =
      `💨 Viento: ${data.wind.speed} m/s`;
  })
  .catch(error => {
    document.getElementById("temp").textContent =
      "Error al cargar el clima 😢";
    console.error(error);
  });
