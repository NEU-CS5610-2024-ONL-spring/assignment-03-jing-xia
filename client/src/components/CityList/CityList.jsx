import React, { useEffect, useState } from 'react';
import { useAuthToken } from "../../AuthTokenContext";
import './CityList.css';
import City from '../City/City';

export default function CityList() {
  const defaultCityList = [
    {name:'New York'},
    {name:'Emeryville'},
    {name:'Oakland'},
    {name:'Chicago'},
  ]
  const [ cityList, setCityList ] = useState(defaultCityList);
  const [ unit, setUnit ] = useState("imperial");
  const [ weatherList, setWeatherList ] = useState(null);
  const { accessToken } = useAuthToken();

  const getWeatherList = async() => {
    if(cityList.length === 0){
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
      console.log(data);
      setWeatherList(data);
    }
  }

  const getSubscribedCityList = async() => {
    if(!accessToken){
      console.log("Using default city list");
      setCityList(defaultCityList);
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/cityList`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const cityList = await response.json();
      console.log("Subscribed city list:", cityList);
      setCityList(cityList);
    }
  }

  useEffect(()=>{
    getSubscribedCityList();
  },[accessToken]);

  useEffect(()=>{
    getWeatherList();
  },[cityList])

  return (
    <div className='city-list-container'>
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
