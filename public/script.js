// Weather App JavaScript

// Global variables
let currentCity = '';
let currentWeatherData = null;
let forecastData = null;
let userProfile = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    // Try to get user's location on app load
    if ('geolocation' in navigator) {
        showLoadingSpinner();
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.log('Geolocation error:', error.message);
                    // Fall back to default city if geolocation fails
                    fetchWeatherByCity('London');
                }
            );
        } catch (error) {
            console.error('Geolocation error:', error);
            fetchWeatherByCity('London');
        }
    } else {
        // Fallback if geolocation is not supported
        fetchWeatherByCity('London');
    }
}

function setupEventListeners() {
    // Current location button
    document.getElementById('currentLocationBtn').addEventListener('click', () => {
        if ('geolocation' in navigator) {
            showLoadingSpinner();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    showError('Unable to get your location. Please enable location access.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            showError('Geolocation is not supported by your browser.');
        }
    });

    // City search
    const searchInput = document.getElementById('citySearch');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
            searchCities(query);
        } else {
            hideSuggestions();
        }
    });

    // Search button click
    document.getElementById('searchBtn').addEventListener('click', () => {
        const city = document.getElementById('citySearch').value.trim();
        if (city) {
            fetchWeatherByCity(city);
            document.getElementById('citySearch').value = '';
            hideSuggestions();
        } else {
            alert('Please enter a city name');
        }
    });

    // Enter key on search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = e.target.value.trim();
            if (city) {
                fetchWeatherByCity(city);
                e.target.value = '';
                hideSuggestions();
            }
        }
    });

    // Settings modal - Save Profile
    document.getElementById('savProfileBtn').addEventListener('click', saveUserProfile);

    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
            modal.show();
        });
    }
}

async function searchCities(query) {
    try {
        const response = await fetch(`/api/search-cities?q=${encodeURIComponent(query)}`);
        const cities = await response.json();
        displaySuggestions(cities);
    } catch (error) {
        console.error('Error searching cities:', error);
    }
}

function displaySuggestions(cities) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (cities.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    suggestionsContainer.innerHTML = cities.map(city => {
        const displayName = typeof city === 'string' ? city : city.name;
        const cityName = typeof city === 'string' ? city : city.city;
        return `
            <div class="search-suggestion-item" onclick="selectCity('${cityName}')">
                <i class="fas fa-city"></i> ${displayName}
            </div>
        `;
    }).join('');

    suggestionsContainer.classList.remove('hidden');
}

function hideSuggestions() {
    document.getElementById('searchSuggestions').classList.add('hidden');
}

function selectCity(city) {
    document.getElementById('citySearch').value = '';
    hideSuggestions();
    fetchWeatherByCity(city);
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        showLoadingSpinner();
        hideError();

        const response = await fetch(
            `/api/weather/current?lat=${lat}&lon=${lon}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        currentWeatherData = await response.json();
        currentCity = currentWeatherData.name;
        
        // Fetch forecast data
        await fetchForecastByCoordinates(lat, lon);
        
        // Display weather
        displayCurrentWeather();
        hideLoadingSpinner();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please try again.');
        hideLoadingSpinner();
    }
}

async function fetchWeatherByCity(city) {
    try {
        showLoadingSpinner();
        hideError();

        const response = await fetch(`/api/weather/city?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        currentWeatherData = await response.json();
        currentCity = currentWeatherData.name;
        
        // Fetch forecast data
        await fetchForecastByCity(city);
        
        // Display weather
        displayCurrentWeather();
        hideLoadingSpinner();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('City not found. Please try another city.');
        hideLoadingSpinner();
    }
}

async function fetchForecastByCoordinates(lat, lon) {
    try {
        const response = await fetch(
            `/api/forecast/coords?lat=${lat}&lon=${lon}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }

        forecastData = await response.json();
        displayForecast();
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

async function fetchForecastByCity(city) {
    try {
        const response = await fetch(
            `/api/forecast?city=${encodeURIComponent(city)}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }

        forecastData = await response.json();
        displayForecast();
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayCurrentWeather() {
    if (!currentWeatherData) return;

    const {
        name,
        sys,
        main,
        weather,
        wind,
        clouds,
        visibility
    } = currentWeatherData;

    // Update location and description
    document.getElementById('cityName').textContent = name;
    document.getElementById('weatherDescription').textContent = 
        weather[0].main + ' - ' + weather[0].description.charAt(0).toUpperCase() + 
        weather[0].description.slice(1);
    
    // Update temperature details
    document.getElementById('temperature').textContent = Math.round(main.temp) + '°C';
    document.getElementById('feelsLike').textContent = Math.round(main.feels_like) + '°C';
    document.getElementById('humidity').textContent = main.humidity + '%';
    document.getElementById('windSpeed').textContent = wind.speed + ' m/s';
    document.getElementById('pressure').textContent = main.pressure + ' hPa';

    // Update weather icon
    updateWeatherIcon(weather[0].main, weather[0].icon);

    // Update additional details
    document.getElementById('visibility').textContent = (visibility / 1000).toFixed(1) + ' km';
    document.getElementById('uvIndex').textContent = getUVIndex(main.temp);
    document.getElementById('dewPoint').textContent = calculateDewPoint(main.temp, main.humidity).toFixed(1) + '°C';
    document.getElementById('precipitation').textContent = (currentWeatherData.rain?.['1h'] || 0) + ' mm';

    // Update last updated time
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        'Updated at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateWeatherIcon(weatherMain, iconCode) {
    const iconElement = document.getElementById('weatherIcon');
    let iconClass = 'fas fa-cloud';
    let colorClass = '';

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            iconClass = 'fas fa-sun';
            colorClass = 'weather-clear';
            break;
        case 'clouds':
            iconClass = 'fas fa-cloud';
            colorClass = 'weather-clouds';
            break;
        case 'rain':
            iconClass = 'fas fa-cloud-rain';
            colorClass = 'weather-rain';
            break;
        case 'drizzle':
            iconClass = 'fas fa-cloud-rain';
            colorClass = 'weather-rain';
            break;
        case 'thunderstorm':
            iconClass = 'fas fa-bolt';
            colorClass = 'weather-thunderstorm';
            break;
        case 'snow':
            iconClass = 'fas fa-snowflake';
            colorClass = 'weather-snow';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            iconClass = 'fas fa-smog';
            colorClass = 'weather-mist';
            break;
        default:
            iconClass = 'fas fa-cloud';
            colorClass = 'weather-clouds';
    }

    iconElement.innerHTML = `<i class="${iconClass}"></i>`;
    iconElement.className = `weather-icon-large ${colorClass}`;
}

function displayForecast() {
    if (!forecastData || !forecastData.list) return;

    const forecastContainer = document.getElementById('forecastContainer');
    const daily = {};

    // Group forecast by day
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString();

        if (!daily[day]) {
            daily[day] = {
                date: date,
                temps: [],
                weathers: [],
                rainProbability: 0
            };
        }

        daily[day].temps.push(item.main.temp);
        daily[day].weathers.push(item.weather[0]);
        daily[day].rainProbability = Math.max(daily[day].rainProbability, (item.pop || 0) * 100);
    });

    // Convert to array and limit to 7 days
    const forecastArray = Object.values(daily).slice(0, 7);

    forecastContainer.innerHTML = forecastArray.map((day, index) => {
        const minTemp = Math.round(Math.min(...day.temps));
        const maxTemp = Math.round(Math.max(...day.temps));
        const mainWeather = day.weathers[0];
        const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
            <div class="forecast-card">
                <div class="day">${dayName}</div>
                <div class="date">${dateStr}</div>
                <div class="icon">${getWeatherIconByMain(mainWeather.main)}</div>
                <div class="temp">${maxTemp}°C</div>
                <div class="temp-range">${minTemp}°C</div>
                <div class="condition">${mainWeather.main}</div>
                <div class="rain">
                    <i class="fas fa-droplets"></i>
                    ${Math.round(day.rainProbability)}%
                </div>
            </div>
        `;
    }).join('');
}

function getWeatherIconByMain(weatherMain) {
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            return '<i class="fas fa-sun weather-clear"></i>';
        case 'clouds':
            return '<i class="fas fa-cloud weather-clouds"></i>';
        case 'rain':
            return '<i class="fas fa-cloud-rain weather-rain"></i>';
        case 'drizzle':
            return '<i class="fas fa-cloud-rain weather-rain"></i>';
        case 'thunderstorm':
            return '<i class="fas fa-bolt weather-thunderstorm"></i>';
        case 'snow':
            return '<i class="fas fa-snowflake weather-snow"></i>';
        case 'mist':
        case 'fog':
            return '<i class="fas fa-smog weather-mist"></i>';
        default:
            return '<i class="fas fa-cloud weather-clouds"></i>';
    }
}


function getUVIndex(temp) {
    // Rough estimation based on temperature
    if (temp > 30) return 'Very High';
    if (temp > 25) return 'High';
    if (temp > 20) return 'Moderate';
    if (temp > 10) return 'Low';
    return 'Minimal';
}

function calculateDewPoint(temp, humidity) {
    // Magnus formula for dew point calculation
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
}

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.remove('d-none');
    document.getElementById('weatherContent').style.opacity = '0.5';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.add('d-none');
    document.getElementById('weatherContent').style.opacity = '1';
}

function showError(message) {
    const errorContainer = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorContainer.classList.remove('d-none');
}

function hideError() {
    document.getElementById('errorMessage').classList.add('d-none');
}

// Click outside to close suggestions
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    const suggestions = document.getElementById('searchSuggestions');
    
    if (!searchContainer.contains(e.target)) {
        suggestions.classList.add('hidden');
    }
});

// Profile Management Functions
function saveUserProfile() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const city = document.getElementById('userCity').value.trim();
    const pincode = document.getElementById('userPincode').value.trim();

    if (!name || !email || !city || !pincode) {
        alert('Please fill in all fields');
        return;
    }

    userProfile = { name, email, city, pincode };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Display profile section
    displayUserProfile();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    if (modal) modal.hide();
    
    alert('Profile saved successfully!');
}

function displayUserProfile() {
    if (!userProfile) return;
    
    const profileSection = document.getElementById('profileSection');
    document.getElementById('displayName').textContent = userProfile.name;
    document.getElementById('displayEmail').textContent = userProfile.email;
    document.getElementById('displayCity').textContent = userProfile.city;
    document.getElementById('displayPincode').textContent = userProfile.pincode;
    
    profileSection.classList.remove('d-none');
}

function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        displayUserProfile();
        
        // Also populate the form if user opens settings again
        document.getElementById('userName').value = userProfile.name;
        document.getElementById('userEmail').value = userProfile.email;
        document.getElementById('userCity').value = userProfile.city;
        document.getElementById('userPincode').value = userProfile.pincode;
    }
}
