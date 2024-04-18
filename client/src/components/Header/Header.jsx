import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Input, Select, Dropdown, Popover, List } from "antd"
import { UserOutlined } from "@ant-design/icons";
import { UnitContext } from '../../UnitContext';
import './Header.css';
import { useAuthToken } from '../../AuthTokenContext';

const { Search } = Input;

export default function Header() {
  const { logout } = useAuth0();
  const [ unit, updateUnit ] = React.useContext(UnitContext);
  const [ loading, setLoading ] = useState(false);
  const [ open, setOpen ] = useState(false);
  const { accessToken } = useAuthToken();
  const [ content, setContent ] = useState();
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

  const onChange = async(e) => {
    if(e.target.value === ''){
      return;
    }
    setOpen(true);
    await search(e.target.value);
  }

  const handleBlur = () => {
    setOpen(false);
  }

  const search = async (value) => {
    setLoading(true);
    const fullUrl = `${process.env.REACT_APP_API_URL}/search?city=${value}`;
    //!!! url cannot contain space, need to modify it
    console.log(fullUrl);
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      setLoading(false);
      const data = await response.json();
      console.log(data);
      renderSearchList(data);
    }
  }

  const renderSearchList = (data) => {
    setOpen(true);
    const list = (
      <List
      dataSource={data}
      renderItem={(item) => {
        console.log(item);
        return (<List.Item>
          <Link 
            to='/detail'
            state={item}
          >
            {item.name}, {item.country}
          </Link>
        </List.Item>);
      }}
    />
    )
    setContent(list);
  }

  return (
    <div className='container'>
      <h1 className='header-top'>Weather Forecast</h1>
      <div className='header-bottom'>
        <Popover 
          open={open} 
          placement="bottom" 
          content={content} 
          arrow={false}
        >
          <Search
            className='header-bottom-left'
            placeholder="Search by city name"
            loading={loading}
            onChange={onChange}
            onFocus={onChange}
            onBlur={handleBlur}
          />
        </Popover>
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
