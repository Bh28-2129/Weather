# Weather Application

A modern, interactive weather application built with Node.js, Express.js, HTML, CSS, JavaScript, Bootstrap 5, and Tailwind CSS. The app automatically detects your location and displays current weather with a 7-day forecast.

## Features

✨ **Key Features:**
- 🌍 **Automatic Geolocation** - Detects your current location on app startup
- 📍 **Current Weather Display** - Shows temperature, humidity, wind speed, pressure
- 🌤️ **Weather Icons** - Dynamic icons based on weather conditions (sunny, rainy, snowy, etc.)
- 📅 **7-Day Forecast** - Extended weather forecast with daily details
- 🔍 **City Search** - Search and switch between different cities
- ⭐ **Popular Cities** - Quick access to popular cities worldwide
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 💾 **Additional Details** - UV Index, visibility, dew point, precipitation

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5, Tailwind CSS
- **Backend**: Node.js, Express.js
- **API Integration**: OpenWeatherMap API
- **Icons**: Font Awesome

## Project Structure

```
weather/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Custom CSS styles
│   └── script.js        # Frontend JavaScript
├── server.js            # Express.js backend
├── package.json         # Project dependencies
├── .env                 # Environment variables
└── README.md            # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenWeatherMap API Key (free tier available)

## Installation & Setup

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys page
4. Copy your API key

### 2. Install Dependencies

```bash
cd weather
npm install
```

### 3. Configure Environment Variables

Edit the `.env` file and add your API key:

```
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
```

Replace `your_api_key_here` with your actual API key from OpenWeatherMap.

### 4. Start the Application

```bash
# Start the server
npm start
```

The server will start on `http://localhost:5000`

### 5. Open in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

## Development Mode

For development with automatic reload:

```bash
npm install --save-dev nodemon
npm run dev
```

## API Endpoints

### Get Current Weather
- **By Coordinates**: `GET /api/weather/current?lat=51.5074&lon=-0.1278`
- **By City Name**: `GET /api/weather/city?city=London`

### Get Forecast
- **By Coordinates**: `GET /api/forecast/coords?lat=51.5074&lon=-0.1278`
- **By City Name**: `GET /api/forecast?city=London`

### Search Cities
- `GET /api/search-cities?q=lond` - Search for cities

## Features Explained

### 1. Geolocation Detection
- The app automatically requests permission to access your location
- Uses browser's Geolocation API
- Falls back to London if permission is denied

### 2. Current Weather Display
Shows:
- City name and current conditions
- Temperature (°C)
- "Feels Like" temperature
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Visibility
- UV Index
- Dew Point
- Precipitation

### 3. Dynamic Weather Icons
Icons change based on weather conditions:
- ☀️ Clear/Sunny
- ☁️ Cloudy
- 🌧️ Rainy
- ⛈️ Thunderstorm
- ❄️ Snow
- 🌫️ Misty/Foggy

### 4. 7-Day Forecast
- Daily weather conditions
- High and low temperatures
- Precipitation probability
- Weather description

### 5. City Search
- Real-time search suggestions
- Click on suggestions or press Enter to search
- Popular cities quick access in sidebar

### 6. Responsive Design
- Mobile-first approach
- Desktop: Full 2-column layout (sidebar + content)
- Tablet: Adjusted grid layout
- Mobile: Stacked vertical layout

## Customization

### Change Default City
Edit `script.js`, find `initializeApp()` function and modify:
```javascript
fetchWeatherByCity('London'); // Change 'London' to your preference
```

### Add More Popular Cities
Edit `public/index.html`, add more city buttons in the cities-list div:
```html
<button class="city-btn" data-city="YourCity">
    <i class="fas fa-city"></i> Your City
</button>
```

### Customize Colors
Edit `public/styles.css` to change the color scheme:
```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #00a8ff;
    /* ... more colors ... */
}
```

## Troubleshooting

### API Key Error
- Verify your API key is correct in `.env`
- Check that your OpenWeatherMap account is active
- Ensure free tier API is enabled

### Geolocation Not Working
- Check browser permissions for location access
- Some browsers require HTTPS for geolocation
- Try the "Current Location" button in sidebar

### CORS Errors
- Ensure the backend is running on `http://localhost:5000`
- Check that Express CORS middleware is enabled

### City Not Found
- Verify the city name spelling
- Try searching with just the city name (without state/country)
- Use the search suggestions for accurate city names

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support
- IE 11: ❌ Not supported

## Performance Tips

1. **Reduce API Calls**: Cache weather data locally
2. **Optimize Images**: Use CDN for Font Awesome
3. **Lazy Load**: Load forecast only when needed
4. **Service Worker**: Add PWA support for offline access

## Future Enhancements

- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] Sunrise/sunset times
- [ ] Moon phase information
- [ ] Weather maps and radar
- [ ] Historical weather data
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Save favorite cities
- [ ] Weather notifications

## License

This project is open source and available for educational and personal use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your API key and configuration
3. Check browser console for error messages
4. Review OpenWeatherMap API documentation

## Credits

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Bootstrap 5](https://getbootstrap.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)
- [Express.js](https://expressjs.com/)

---

**Happy Weather Checking! 🌤️**
