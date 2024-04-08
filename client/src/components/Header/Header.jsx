import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { UserOutlined } from "@ant-design/icons";
import './Header.css';

export default function Header() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className='container'>
      <div className='search header-left'>
        Headerasdadsadasd
        {/* test login */}
      </div>
      <div className='header-right'>
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
