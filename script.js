/* Variables Globales */
var APIKey = "82ec049d39033e14bb1857a732520ca9";

// Almacenar la ciudad buscada
var ciudad = "";

/* Acciones de Almacenamiento Local */
// Almacenar ciudades buscadas
var botonBuscar = document.getElementById("search-button");
botonBuscar.addEventListener("click", obtenerCiudad, false);

// Borrar historial de búsqueda
var botonBorrar = document.getElementById("clear-history");
botonBorrar.addEventListener("click", borrarHistorial, false);

// Establecer la ciudad buscada en el almacenamiento local y mostrarla en la página
function obtenerCiudad() {
  // Variable para la entrada de ciudad del usuario
  var ciudadBuscada = document.getElementById("search-city").value;

  // Comprobar si la ciudad ya está en el historial
  var historialCiudades = JSON.parse(localStorage.getItem("ciudades")) || [];
  if (!historialCiudades.includes(ciudadBuscada)) {
    historialCiudades.push(ciudadBuscada);
    localStorage.setItem("ciudades", JSON.stringify(historialCiudades));
  }

  // Recorrer el historial de ciudades y agregarlas a la página como elementos de la lista de historial de búsqueda
  var listaCiudades = document.querySelector(".list-group");
  listaCiudades.innerHTML = ""; // Limpiar la lista

  historialCiudades.forEach(function (historialCiudad) {
    listaCiudades.innerHTML += `
      <li class="list-group-item list-group-item-action list-group-item-secondary text-center rounded mb-2" type="button">${historialCiudad}</li>
    `;
  });

  // La variable "ciudad" es igual al valor de "ciudadBuscada"
  ciudad = ciudadBuscada;

  // Ejecutar las funciones para obtener el clima y el pronóstico
  obtenerTiempo(ciudad);
  pronostico(ciudad);
}

// Borrar el historial de búsqueda y eliminar las ciudades buscadas de la página
function borrarHistorial() {
  localStorage.removeItem("ciudades");
  var listaCiudades = document.querySelector(".list-group");
  listaCiudades.innerHTML = ""; // Limpiar la lista en la página
}

// Obtener datos del clima actual de la API
function obtenerTiempo(nombreCiudad) {
  var urlConsulta =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    nombreCiudad +
    "&units=imperial&appid=" +
    APIKey;

  fetch(urlConsulta)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      var template = `
                <h1 class="d-inline" id="current-city">${datos.name}</h1>
                <img class="d-inline" id="city-name-icon" src="https://openweathermap.org/img/wn/${datos.weather[0].icon}.png"
                alt="ícono del clima">
                <p>Temperatura:<span class="current" id="temperature"> ${datos.main.temp}&deg</span></p>
                <p>Humedad:<span class="current" id="humidity"> ${datos.main.humidity}%</span></p>
                <p>Velocidad del Viento:<span class="current" id="wind speed"> ${datos.wind.speed} m/s</span></p>
            `;
      $("#weatherData").css("display", "block");
      document.querySelector("#current-weather").innerHTML = template;
    });
}




// Obtener datos del pronóstico de 5 días de la API
function pronostico(nombreCiudad) {
  var urlConsulta =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    nombreCiudad +
    "&units=metric&appid=" +
    APIKey;

  fetch(urlConsulta)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      var lista = datos.list.filter(function (dato) {
        if (dato.dt_txt.includes("12:00:00")) {
          return true;
        } else {
          return false;
        }
      });
      var template = "";
      lista.forEach(function (item) {
        template += `
                    <div class="col-sm pronostico text-white me-2 mb-2 p-2 mt-2">
                        <div class="card bg-dark text-light">
                            <div class="card-body">
                                <h5 class="card-title-date" id="day1-date">${new Date(
                                  item.dt_txt
                                ).toLocaleDateString()}</h5>
                                <p class="emoji" id="day-1-weather-emoji"><img class="d-inline" id="city-name-icon" src="https://openweathermap.org/img/wn/${
                                  item.weather[0].icon
                                }.png"
                                alt="ícono del clima"></p>
                                <p class="card-text temp" id="day-1-temp">Temperatura: ${
                                  item.main.temp
                                }&deg</p>
                                <p class="card-text wind" id="day-1-wind">Viento: ${
                                  item.wind.speed
                                } m/s</p>
                                <p class="card-text humidity" id="day-1-humidity">Humedad: ${
                                  item.main.humidity
                                }%</p>
                            </div>
                        </div>
                    </div>
                `;
      });
      // Agregar el pronóstico a la página
      document.querySelector("#forecast").innerHTML = template;
    });
}


function obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      obtenerTiempoPorCoordenadas(lat, lon);
      obtenerPronosticoPorCoordenadas(lat , lon);
    });
  } else {
    alert("Tu navegador no admite la geolocalización.");
  }
}




// Agregar un evento de clic al botón de "Obtener Tiempo y Pronóstico Actual"
var getLocationButton = document.getElementById("get-location-button");
getLocationButton.addEventListener("click", obtenerUbicacion);





// Función para obtener el clima actual por coordenadas geográficas
function obtenerTiempoPorCoordenadas(lat, lon) {
  var urlConsulta =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric&appid=" +
    APIKey;

  fetch(urlConsulta)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      var template = `
        <h1 class="d-inline" id="current-city">${datos.name}</h1>
        <img class="d-inline" id="city-name-icon" src="https://openweathermap.org/img/wn/${datos.weather[0].icon}.png"
        alt="ícono del clima">
        <p>Temperatura:<span class="current" id="temperature"> ${datos.main.temp}&deg;C</span></p>
        <p>Humedad:<span class="current" id="humidity"> ${datos.main.humidity}%</span></p>
        <p>Velocidad del Viento:<span class="current" id="wind speed"> ${datos.wind.speed} m/s</span></p>
      `;
      $("#weatherData").css("display", "block");
      document.querySelector("#current-weather").innerHTML = template;
    })
    .catch(function (error) {
      console.error("Error al obtener datos de clima por coordenadas:", error);
    });
}

// Función para obtener el pronóstico por coordenadas geográficas
function obtenerPronosticoPorCoordenadas(lat, lon) {
  var urlConsulta =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric&appid=" +
    APIKey;

  fetch(urlConsulta)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      var lista = datos.list.filter(function (dato) {
        if (dato.dt_txt.includes("12:00:00")) {
          return true;
        } else {
          return false;
        }
      });
      var template = "";
      lista.forEach(function (item) {
        template += `
          <div class="col-sm pronostico text-white me-2 mb-2 p-2 mt-2">
            <div class="card bg-dark text-light">
              <div class="card-body">
                <h5 class="card-title-date" id="day1-date">${new Date(item.dt_txt).toLocaleDateString()}</h5>
                <p class="emoji" id="day-1-weather-emoji">
                  <img class="d-inline" id="city-name-icon" src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"
                  alt="ícono del clima">
                </p>
                <p class="card-text temp" id="day-1-temp">Temperatura: ${item.main.temp}&deg;C</p>
                <p class="card-text wind" id="day-1-wind">Viento: ${item.wind.speed} m/s</p>
                <p class="card-text humidity" id="day-1-humidity">Humedad: ${item.main.humidity}%</p>
              </div>
            </div>
          </div>
        `;
      });
      // Agregar el pronóstico a la página
      document.querySelector("#forecast").innerHTML = template;
    })
    .catch(function (error) {
      console.error("Error al obtener datos de pronóstico por coordenadas:", error);
    });
}


// Llamar a la función para obtener el clima por ubicación al cargar la página
window.addEventListener("load", obtenerUbicacion);


// Ejecutar las funciones de clima cuando el usuario hace clic en Buscar
botonBuscar.addEventListener("click", function () {
  // Obtener la entrada del usuario
  var nombreCiudad = document.querySelector("#search-city").value;
  // Ejecutar la función para obtener el clima
  obtenerTiempo(nombreCiudad);
  // Ejecutar la función del pronóstico
  pronostico(nombreCiudad);
});

// Delegación de eventos para elementos de lista generados dinámicamente
$("#list").on("click", "li", function (evento) {
  evento.preventDefault();
  var nombreCiudad = $(this).text();
  // Ejecutar la función para obtener el clima
  obtenerTiempo(nombreCiudad);
  // Ejecutar la función del pronóstico
  pronostico(nombreCiudad);
});
