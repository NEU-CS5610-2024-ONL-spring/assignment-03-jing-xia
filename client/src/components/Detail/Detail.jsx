import React, { useState } from 'react';
import { Menu, Card } from 'antd';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import Hourly from '../Hourly/Hourly';
import SevenDays from '../SevenDays/SevenDays';
import Monthly from '../Monthly/Monthly';
import './Detail.css';

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
          to='/detail/seven-days'
          state={location.state}
        >
          Seven Days
        </Link>
      ),
      key: 'seven-days',
    },
    {
      label: (
        <Link 
          to='/detail/monthly'
          state={location.state}
        >
          Monthly
        </Link>
      ),
      key: 'monthly',
    },
  ];

  const [current, setCurrent] = useState('hourly');
  const onClick = (e) => {
    console.log('click ', e);
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
        <Routes>
          <Route path='/hourly' element={<Hourly />}/>
          <Route path='/seven-days' element={<SevenDays />}/>
          <Route path='/monthly' element={<Monthly />}/>
          <Route path='*' element={<Hourly />}/>
        </Routes>
      </Card>
    </div>
  )
}
