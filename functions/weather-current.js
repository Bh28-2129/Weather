const axios = require('axios');

const API_KEY = (process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE').trim().replace(/^['"]|['"]$/g, '');
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

exports.handler = async (event) => {
  try {
    const { lat, lon } = event.queryStringParameters || {};
    
    if (!lat || !lon) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Latitude and longitude required' })
      };
    }

    const url = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
