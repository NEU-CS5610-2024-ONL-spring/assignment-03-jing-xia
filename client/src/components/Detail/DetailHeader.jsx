import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthToken } from '../../AuthTokenContext';
import './Detail.css';
import { Button } from 'antd';

export default function DetailHeader({ _city }) {
  
  const { accessToken } = useAuthToken();
  const [subscribed, setSubscribed] = useState(false);

  const [city, setCity] = useState(null);

  useEffect(() => {
    setCity(_city);
    if(accessToken && city){
      isSubscribed();
    }
  }, [accessToken, _city]);

  // subcribe/unsubscribe click event
  const onSubscribe = () => {
    if(subscribed){
      unSubscribeCity();
    } else {
      subscribeCity();
    }
  };

  const isSubscribed = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/isSubscribed?latitude=${city.latitude}&longitude=${city.longitude}`;
    const response = await fetch(fullUrl,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(response.ok){
      const data = await response.json();
      if(data !== false){
        setSubscribed(true);
        setCity(data);
      }
      console.log(typeof(data));
    }
  };
  
  const subscribeCity = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/addCity`;
    //const { name, latitude, longitude, country, state } = req.body;
    const requestBody = city;
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
      setCity(data);
      setSubscribed(true);
      // console.log(data);
    }
  }

  const unSubscribeCity = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/removeCity?cityId=${city.id}`;
    const response = await fetch(fullUrl,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(response.ok){
      // const data = await response.json();
      setSubscribed(false);
      // console.log(data);
    }
  };

  return (
    <div className='detail-header'>
      {city && <p className='header-city'>{city.name}, {city.state}, {city.country}</p>}
      <Button onClick={onSubscribe}>
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </Button>
    </div>
  )
}
