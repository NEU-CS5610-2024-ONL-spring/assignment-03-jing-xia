import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthToken } from '../../AuthTokenContext';
import './Detail.css';

export default function DetailHeader({ city }) {
  
  const { accessToken } = useAuthToken();
  const [subscribed, setSubscribed] = useState(false);

  const [location, setLocation] = useState({
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

  useEffect(() => {
    isSubscribed();
    // setCity({
    //   "id": 1,
    //   "name": "Oakland",
    //   "latitude": 37.8044557,
    //   "longitude": -122.271356,
    //   "country": "US",
    //   "state": "California",
    // });
  }, [accessToken]);

  // subcribe/unsubscribe click event
  const onSubscribe = () => {
    if(subscribed){
      unSubscribeCity();
    } else {
      subscribeCity();
    }
  };

  const isSubscribed = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/isSubscribed?latitude=${location.latitude}&longitude=${location.longitude}`;
    const response = await fetch(fullUrl,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(response.ok){
      const data = await response.json();
      if(data){
        setSubscribed(true);
      }
      console.log(typeof(data));
    }
  };
  
  const subscribeCity = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/addCity`;
    //const { name, latitude, longitude, country, state } = req.body;
    const requestBody = location;
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
      setLocation(data);
      setSubscribed(true);
      console.log(data);
    }
  }

  const unSubscribeCity = async() => {
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/removeCity?cityId=${location.id}`;
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
      <p className='header-city'>{location.name}, {location.state}, {location.country}</p>
      <Link onClick={onSubscribe}>
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </Link>
    </div>
  )
}
