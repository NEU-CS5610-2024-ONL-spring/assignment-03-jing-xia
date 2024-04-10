import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';

export default function City({city}) {
  const title = (
    <div style={{display:'flex', justifyContent:'space-between', marginRight:'20px'}}>
      <div>
        {city.name}
      </div>
      <div style={{fontSize:'20px'}}> 
        {city.temperature}
      </div>
    </div>
  );

  return (
    <Card
      title={title}
      extra={
      <Link 
        to='/detail'
        state={{"cityName":city.name}}
      >
        More
      </Link>}
      style={{marginBottom:'10px'}}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  )
}
