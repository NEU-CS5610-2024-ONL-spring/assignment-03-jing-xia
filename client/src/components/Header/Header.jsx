import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Select } from "antd"
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import './Header.css';

export default function Header() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className='container'>
      <div className='header-left'>
        <div className='search'>
          <SearchOutlined style={{color:'black'}}/>
        </div>
        {/* test login */}
      </div>
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
  )
}
