import React, { useRef } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Input, Select } from "antd"
import { UserOutlined } from "@ant-design/icons";
import './Header.css';

const { Search } = Input;

export default function Header() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h1>Weather Forecast</h1>
      <div className='container'>
        <Search
          className='header-left'
          placeholder="Search by city name"
          // onSearch={onSearch}
        />
        <div className='header-right'>
          <Select 
            defaultValue = '℃'
            options = {[
              {
                value:'℃',
                label:'℃'
              },
              {
                value:'℉',
                label:'℉'
              }
            ]}
          />
          <button 
            onClick={() => loginWithRedirect()}
            className='userBtn'
          >
            <UserOutlined />
          </button>
        </div>
      </div>
    </div>
    
  )
}
