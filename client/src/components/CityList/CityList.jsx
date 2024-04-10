import React, { useState } from 'react';
import './CityList.css';
import City from '../City/City';

export default function CityList() {
  const [cities, setCities] = useState([
    {name:'New York', temperature:'15', day:'sunny'},
    {name:'Emeryville', temperature:'15', day:'sunny'},
    {name:'Oakland', temperature:'15', day:'sunny'},
    {name:'Chicago', temperature:'15', day:'sunny'},
    {name:'New York', temperature:'15', day:'sunny'},
    {name:'New York', temperature:'15', day:'sunny'},
  ])
  return (
    <div className='city-list-container'>
      {
        cities.map((cur)=>{
          return <City city={cur}/>
        })
      }
    </div>
  )
}
