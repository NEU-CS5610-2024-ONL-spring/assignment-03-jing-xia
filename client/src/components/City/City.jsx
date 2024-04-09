import React from 'react';
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
      extra={<a href="#">More</a>}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  )
}
