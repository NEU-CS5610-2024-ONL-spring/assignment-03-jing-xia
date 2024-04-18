import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Input, Select, Dropdown, Popover, List } from "antd"
import { UserOutlined } from "@ant-design/icons";
import { UnitContext } from '../../UnitContext';
import './Header.css';
import { useAuthToken } from '../../AuthTokenContext';

const { Option } = Select;

export default function Header() {
  const { logout } = useAuth0();
  const [ unit, updateUnit ] = React.useContext(UnitContext);
  const { accessToken } = useAuthToken();
  const [ data, setData ] = useState();
  const [ options, setOptions ] = useState(null);
  const navigate = useNavigate();
  //item list for the dropdown of user button
  const items = [
    {
      key: '1',
      label: (
        <a href="/profile">
          Profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={() => {logout({ logoutParams: { returnTo: window.location.origin } })}}>
          Log Out
        </span>
      ),
    },
  ]

  const search = async (newValue) => {
    const encodedCityName = encodeURIComponent(newValue);
    const fullUrl = `${process.env.REACT_APP_API_URL}/search?city=${encodedCityName}`;
    //!!! url cannot contain space, need to modify it
    console.log(fullUrl);
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const data = await response.json();
      console.log(data);
      setData(data);
    }
  }

  const debouncedSearch = useCallback(debounce(search, 1000),[])

  const handleSearch = (newValue) => {
    if(newValue === ''){
      return;
    }
    debouncedSearch(newValue);
  }
  useEffect(()=>{
    const new_options = data?.map((cur, index)=>{
      const cur_option = (
        <Option key={index}>
          <Link 
            to={'/detail'} 
            state={cur}
          >
            {cur.name}, {cur.country}
          </Link>
        </Option>
      )
      return cur_option;
    });
    setOptions(new_options);
  },[data])
  

  return (
    <div className='container'>
      <h1 className='header-top'>Weather Forecast</h1>
      <div className='header-bottom'>
        <Select
          showSearch
          suffixIcon={null}
          placeholder="Search by city name"
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={null}
        >
          {options}
        </Select>
        <div className='header-bottom-right'>
          <Select 
            defaultValue = {unit}
            onChange = { (value) => { updateUnit(value) }}
            options = {[
              {
                value:'metric',
                label:'℃'
              },
              {
                value:'imperial',
                label:'℉'
              }
            ]}
          />
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            arrow
          >
            <button 
              onClick={() => {
                navigate("/profile");
              }}
              className='userBtn'
            >
            <UserOutlined />
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
    
  )
}

const debounce = (func, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(()=>{
      func.apply(this, args);
    }, delay);
  }
};
