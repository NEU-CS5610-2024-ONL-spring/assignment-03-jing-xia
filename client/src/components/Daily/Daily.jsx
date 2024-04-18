import React, { useEffect, useState } from 'react';
import { useAuthToken } from '../../AuthTokenContext';
import { getRainIcon, iconUrlConvert, windDirConvert } from '../../models/WeatherConverter';
import './Daily.css';
import { useLocation } from 'react-router-dom';
import { UnitContext } from '../../UnitContext';

export default function Daily() {

  const { accessToken } = useAuthToken();
  const [ unit, updateUnit ] = React.useContext(UnitContext);

  const location = useLocation();
  const [city, setCity] = useState(location.state);

  // record request time
  const [requestTime, setRequestTime] = useState(new Date());
  const [dailyWeather, setDailyWeather] = useState(null);
  
  useEffect(() => {
    getDailyWeather();
  }, [accessToken, unit]);

  const getDailyWeather = async() => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/weather/detail/daily?latitude=${city.latitude}&longitude=${city.longitude}&unit=${unit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
    if(response.ok){
      const data = await response.json();
      setDailyWeather(data);
      console.log(data);
    }
  };

  const renderDailyList = (weathers) => {
    const timezone = weathers.timezone;
    return (
      <div className='weather-list'>
        {weathers.daily.map((weather, index) => {
          // const dt = new Date((new Date(weather.dt * 1000)).toLocaleString('en-US', {"timeZone": timezone}));
          const dt = new Date(weather.dt * 1000);
          const options = {
            day: 'numeric',
            weekday: 'short',
            timezone: timezone,
          };
          const day = dt.toLocaleDateString('en-US', options);
          // const iconUrl = iconUrlConvert(weather.weather[0].icon);
          const iconUrl = `${process.env.REACT_APP_API_ICON_URL}${weather.weather[0].icon}@2x.png`;
          const direction = windDirConvert(weather.wind_deg);
          return (
            <div className='weather-item' key={index}>
              <div className='weather-date'>{day}</div>
              <div className="weather-item-info">
                <div className='weather-item-info-1'>
                  <div className='weather-item-temp'>H: {Math.round(weather.temp.max)}° L: {Math.round(weather.temp.min)}°</div>
                  <div className='weather-item-description'>
                    <img src={iconUrl} alt={weather.weather[0].description}/>
                    {weather.weather[0].description}
                  </div>
                </div>
                <div className='weather-item-info-2'>
                  <div className='weather-item-precipitation'>
                  <img src={getRainIcon()} alt={`Precipitation icon`}/>
                      {weather.pop === 0 ? "0%" : "100%"}</div>
                  <div className='weather-item-wind'>
                    {direction} - {Math.round(weather.wind_speed)} {unit === "imperial" ? "mph" : "m/s"}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="daily-header">
        <h2 className='header-title'>Daily Weather</h2>
        <p className='header-time'>As of {requestTime?.toLocaleTimeString('en-US', 
                                            { 
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              timezone: dailyWeather?.timezone,
                                              timeZoneName: 'short',
                                            }
                                          )}
        </p>
      </div>
      <div>
        {dailyWeather && renderDailyList(dailyWeather)}
      </div>
    </div>
  )
}
