const axios = require('axios');

const API_KEY = (process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE').trim().replace(/^['"]|['"]$/g, '');

exports.handler = async (event) => {
  try {
    const { q } = event.queryStringParameters || {};
    const query = q?.trim() || '';
    
    if (!query || query.length < 2) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify([])
      };
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(cities)
    };
  } catch (error) {
    console.error('Error searching cities:', error.message);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify([])
    };
  }
};
