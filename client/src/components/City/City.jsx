import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useAuthToken } from "../../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";
import './City.css';

export default function City({city, weather, unit}) {
  const { accessToken } = useAuthToken();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  console.log(city);
  const title = (
    <div style={{display:'flex', justifyContent:'space-between', marginRight:'20px'}}>
      <div>
        {city.name}
      </div>
    </div>
  );
  console.log(weather);

  return (
    <Card
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
          <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}/>
          <span>{weather.current.weather[0].main}</span>
          <span>{weather.current.temp}{unit === "imperial" ? '℉' : '℃'}</span>
        </div>
        <div>
        </div>
      </div>
    </Card>
  )
}

{/* <Link 
onClick={() => {subScribe();}}
>
{isAuthenticated ? "Unsubscribe" : "Subscribe"}
</Link>

const subScribe = async() => {
  if(!isAuthenticated){
    loginWithRedirect();
    return;
  }
  const fullUrl = `${process.env.REACT_APP_API_URL}/user/addCity`;
  //const { name, latitude, longitude, country, state } = req.body;
  const requestBody = {name: city.name, latitude: weather.lat, longitude: weather.lon, country: weather.city.country, state: weather.city.state};
  const response = await fetch(fullUrl,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody)
  });
  if(response.ok){
    const data = await response.json();
    console.log(data);
  }
} */}
