import React, { useEffect, useState } from 'react';
import { useAuthToken } from "../../AuthTokenContext";
import './CityList.css';
import City from '../City/City';
import { UnitContext } from '../../UnitContext';
import { useAuth0 } from '@auth0/auth0-react';

export default function CityList() {
  const defaultCityList = [
    {
      "name": "New York County",
      "latitude": 40.7127281,
      "longitude": -74.0060152,
      "country": "US",
      "state": "New York"
    },
    {
      "name": "Emeryville",
      "latitude": 37.8314089,
      "longitude": -122.2865266,
      "country": "US",
      "state": "California"
    },
    {
      "name": "Oakland",
      "latitude": 37.8044557,
      "longitude": -122.271356,
      "country": "US",
      "state": "California"
    },
    {
      "name": "Chicago",
      "latitude": 41.8755616,
      "longitude": -87.6244212,
      "country": "US",
      "state": "Illinois"
    },
  ]
  const [ cityList, setCityList ] = useState(null);
  const [ weatherList, setWeatherList ] = useState(null);
  const { accessToken } = useAuthToken();
  const { isAuthenticated } = useAuth0();
  const [ unit, updateUnit ] = React.useContext(UnitContext);

  const getWeatherList = async() => {
    if(!cityList){
      return;
    }
    const cityNameList = cityList.map((cur) => {
      return cur.name;
    })
    const encodedCityName = encodeURIComponent(cityNameList);
    const encodedUnit = encodeURIComponent(unit);
    const fullUrl = `${process.env.REACT_APP_API_URL}/weather/list?cities=${encodedCityName}&unit=${encodedUnit}`;
    const response = await fetch(fullUrl,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const data = await response.json();
      if(cityList === defaultCityList && weatherList){
        return;
      }
      if(data.find((cur) => cur.cod === 429)){
        console.log("API limit reached. Please try again later.")
      }
      setWeatherList(data);
    } else {
      console.log(response.statusText);
    }
  }

  const getSubscribedCityList = async() => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/cityList`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      let cityList = await response.json();
      if(cityList.length === 0){
        cityList = defaultCityList;
      }
      setCityList(cityList);
    } else {
      console.log(response.statusText);
    }
  }

  useEffect(()=>{
    if(isAuthenticated && accessToken){
      getSubscribedCityList();
    }
    else{
      setCityList(defaultCityList);
    }
  },[accessToken]);

  useEffect(()=>{
    getWeatherList();
  },[unit, cityList]);

  return (
    <div className='city-list-container' data-testid="home-cityList">
      {
        cityList && weatherList &&
        cityList.map((cur, index)=>{
          return (
            <City 
              key={index} 
              city={cur} 
              weather={weatherList[index]} 
              unit={unit}
            />
          )
        })
      }
    </div>
  )
}
