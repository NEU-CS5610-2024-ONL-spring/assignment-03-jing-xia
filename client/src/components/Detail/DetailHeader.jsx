import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthToken } from '../../AuthTokenContext';
import './Detail.css';
import { Button } from 'antd';

export default function DetailHeader({ city }) {
  
  const { accessToken } = useAuthToken();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if(accessToken && city){
      isSubscribed();
    }
  }, [accessToken, city]);

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
        city.id = data.id;
      } else {
        setSubscribed(false);
      }
    }
  };

    // subcribe/unsubscribe click event
    const onSubscribe = () => {
      if(subscribed){
        unSubscribeCity();
      } else {
        subscribeCity();
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
      city.id = data.id;
      setSubscribed(true);
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
    <div className='detail-header' data-testid="detail-header">
      <p className='header-city'>{city?.name}, {city?.state}, {city?.country}</p>
      <Button onClick={onSubscribe} data-testid="detail-header-button">
        {subscribed === true ? "Unsubscribe" : "Subscribe"}
      </Button>
    </div>
  )
}
