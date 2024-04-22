import React, { useState } from 'react';
import { Menu, Card } from 'antd';
import { Link, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Hourly from '../Hourly/Hourly';
import './Detail.css';
import DetailHeader from './DetailHeader';
import Daily from '../Daily/Daily';

export default function Detail() {
  // cityName is passed by using state object in the <Link> component
  // to get the data, use location.state
  const location = useLocation();
  const items = [
    {
      label: (
        <Link 
          to='/home'
        >
          Home
        </Link>
      ),
      key: 'home',
    },
    {
      label: (
        <Link 
          to='/detail/hourly'
          state={location.state}
        >
          Hourly
        </Link>
      ),
      key: 'hourly',
    },
    {
      label: (
        <Link 
          to='/detail/daily'
          state={location.state}
        >
          Eight Day
        </Link>
      ),
      key: 'daily',
    },
  ];

  const [current, setCurrent] = useState('hourly');
  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className='detail-container'>
      <Menu 
        className="detail-menu" 
        onClick={onClick} 
        selectedKeys={[current]} 
        mode="horizontal" 
        items={items}
      />
      <Card className='detail-content'>
        <DetailHeader city={location.state}/>
        <Routes>
          <Route path='/hourly' element={<Hourly />}/>
          <Route path='/daily' element={<Daily />}/>
          <Route path='*' element={<Navigate to='/detail/hourly' state={location.state}/>}/>
        </Routes>
      </Card>
    </div>
  )
}
