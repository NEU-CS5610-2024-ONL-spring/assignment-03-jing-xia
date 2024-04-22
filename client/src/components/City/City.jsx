import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import './City.css';

export default function City({city, weather, unit}) {
  const title = (
    <div style={{display:'flex', justifyContent:'space-between', marginRight:'20px'}}>
      <div>
        {city.name}
      </div>
    </div>
  );

  return (
    <Card
      data-testid='city-card'
      title={title}
      extra={
        <div>
          <Link 
            to='/detail'
            state={city}
            style={{marginRight:'10px'}}
          >
            More
          </Link>
        </div>
      }
      style={{marginBottom:'10px', overflow:'hidden'}}
    >
      <div style={{fontSize:'20px'}}> 
        <div className='city-weather-header'>
          <img src={`https://openweathermap.org/img/wn/${weather?.current?.weather[0].icon}@2x.png`} alt="weather icon"/>
          <span>{Math.round(weather?.current?.weather[0].main)}</span>
          <span>{weather?.current?.temp}{unit === "imperial" ? '℉' : '℃'}</span>
        </div>
        <div>
        </div>
      </div>
    </Card>
  )
}
