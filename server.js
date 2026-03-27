const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenWeatherMap API Key - Replace with your own from openweathermap.org
const API_KEY = (process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE').trim().replace(/^['"]|['"]$/g, '');
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Validate API Key on startup
if (API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn('⚠️ WARNING: OpenWeatherMap API key not set. Please set OPENWEATHER_API_KEY in .env file');
} else {
  console.log('✅ OpenWeatherMap API key loaded successfully');
}

// Route to get current weather by coordinates (for geolocation)
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const url = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log('Fetching weather from:', url.replace(API_KEY, '***'));
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data: ' + error.message });
    }
  }
});

// Route to get current weather by city name
app.get('/api/weather/city', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City name required' });
    }

    const url = `${WEATHER_API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    console.log('Fetching weather for city:', city);
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather by city:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data for this city: ' + error.message });
    }
  }
});

// Route to get 5-day forecast (OpenWeatherMap free tier)
app.get('/api/forecast', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City name required' });
    }

    const url = `${WEATHER_API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to fetch forecast data: ' + error.message });
    }
  }
});

// Route to get forecast by coordinates
app.get('/api/forecast/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const url = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast by coordinates:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to fetch forecast data: ' + error.message });
    }
  }
});

// Route to search cities (for autocomplete)
app.get('/api/search-cities', async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Use OpenWeatherMap Geocoding API to search for cities
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`;
    
    const response = await axios.get(url);
    
    // Extract unique city names from the response
    const cities = response.data.map(location => {
      const cityName = location.name;
      const stateName = location.state ? `, ${location.state}` : '';
      const countryName = location.country ? `, ${location.country}` : '';
      return {
        name: `${cityName}${stateName}${countryName}`,
        city: cityName,
        state: location.state || '',
        country: location.country || '',
        lat: location.lat,
        lon: location.lon
      };
    });

    res.json(cities);
  } catch (error) {
    console.error('Error searching cities:', error.message);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Weather API Server running on http://localhost:${PORT}`);
  console.log('Make sure to set your OpenWeatherMap API key in .env file');
});
