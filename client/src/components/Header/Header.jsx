import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Input, Select, Dropdown, Button } from "antd"
import { UserOutlined } from "@ant-design/icons";
import { UnitContext } from '../../UnitContext';
import './Header.css';

const { Search } = Input;

export default function Header() {
  const { logout } = useAuth0();
  const [ unit, updateUnit ] = React.useContext(UnitContext);
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

  return (
    <div className='container'>
      <h1 className='header-top'>Weather Forecast</h1>
      <div className='header-bottom'>
        <Search
          className='header-bottom-left'
          placeholder="Search by city name"
          // onSearch={onSearch}
        />
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
