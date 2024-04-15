import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Hourly.css';
import { useAuthToken } from '../../AuthTokenContext';
import { Button } from 'antd';
import { getRainIcon, iconUrlConvert, windDirConvert } from '../../models/WeatherConverter';

export default function Hourly() {
  
  const { accessToken } = useAuthToken();

  // const city = useLocation().state.city;
  const [city, setCity] = useState({
    // "id": 1,
    // "name": "Oakland",
    // "latitude": 37.8044557,
    // "longitude": -122.271356,
    // "country": "US",
    // "state": "California",
    "id": 3,
    "name": "New York County",
    "latitude": 40.7127281,
    "longitude": -74.0060152,
    "country": "US",
    "state": "New York"
  });
  
  // record request time
  const [requestTime, setRequestTime] = useState();
  const [hourlyWeather, setHourlyWeather] = useState(null);
  
  
  useEffect(() => {
    setRequestTime(new Date());
    getHourlyWeather();
  }, []);

  const getHourlyWeather = async() => {
    // !!! need unit param
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/weather/detail/hourly?latitude=${city.latitude}&longitude=${city.longitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
    if(response.ok){
      const data = await response.json();
      console.log(data);
      setHourlyWeather(data);
    }
  };

  const renderHourList = (weathers) => {
    const timezone = weathers.timezone;
    return (
      <div className='weather-list'>
        {weathers.hourly.map((weather, index) => {
          const dt = new Date((new Date(weather.dt * 1000)).toLocaleString('en-US', {"timeZone": timezone}));
          let renderDay = false;
          if(index === 0 || dt.getHours() === 0){
            renderDay = true;
          }
          // const iconUrl = iconUrlConvert(weather.weather[0].icon);
          const iconUrl = `${process.env.REACT_APP_API_ICON_URL}${weather.weather[0].icon}@2x.png`;
          // console.log(iconUrl);
          const direction = windDirConvert(weather.wind_deg);
          return (
            <div>
              {renderDay && <div className='hourly-day'>{dt.toLocaleDateString('en-US', {"timeZone": timezone})}</div>}
              <div className='weather-item' key={index}>
                <div className='hourly-item-time'>{dt.getHours()}:00</div>
                <div className='hourly-item-weather-info'>
                  <div className='hourly-item-temp'>{weather.temp}°</div>
                  <div className='hourly-item-description'>
                    <img src={iconUrl} alt={weather.weather[0].description}/>
                    {weather.weather[0].description}</div>
                  <div className='hourly-item-precipitation'>
                    <img src={getRainIcon()} alt={`Precipitation icon`}/>
                    {weather.pop === 0 ? "0%" : "100%"}</div>
                  <div className='hourly-item-wind'>{direction} - {Math.round(weather.wind_speed)} mph</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  };

  return (
    <div>
      <div className='hourly-header'>
        <h2 className='header-title'>Hourly Weather</h2>
        <p className='header-time'>As of {requestTime?.toLocaleTimeString('en-US', {"timeZone": hourlyWeather.timezone})}</p>
      </div>
      <div>
        {hourlyWeather && renderHourList(hourlyWeather)}
      </div>
    </div>
  )
}
