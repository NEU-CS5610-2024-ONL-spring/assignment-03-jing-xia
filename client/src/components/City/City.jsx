import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useAuthToken } from "../../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

export default function City({city, weather, unit}) {
  const { accessToken } = useAuthToken();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const title = (
    <div style={{display:'flex', justifyContent:'space-between', marginRight:'20px'}}>
      <div>
        {city.name}
      </div>
    </div>
  );

  return (
    <Card
      title={title}
      extra={
        <div>
          <Link 
            to='/detail'
            state={{"cityName":city.name}}
            style={{marginRight:'10px'}}
          >
            More
          </Link>
        </div>
      }
      style={{marginBottom:'10px'}}
    >
      <div style={{fontSize:'20px'}}> 
        <div>
          {weather.current.weather[0].main}
        </div>
        <div>
          {weather.current.temp}{unit === "imperial" ? '℉' : '℃'}
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
