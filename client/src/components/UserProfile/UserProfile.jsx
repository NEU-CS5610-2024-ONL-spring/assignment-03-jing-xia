import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Card, Button, Avatar, List } from 'antd';
import { HomeOutlined, AntDesignOutlined } from '@ant-design/icons';
import { useAuthToken } from "../../AuthTokenContext";
import './UserProfile.css'

export default function UserProfile() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const [ user, setUser ] = useState({name:"Loading", email: "Loading", allowLocate: 0});
  const [ cityList, setCityList ] = useState(["Loading"]);

  const settings = [
    "Access to my location",
  ];

  const authDebugger = [{title:"Token", content:accessToken.toString()}];
  const collapseItems = [
    {
      key: '1',
      label: 'Subscribed City List',
      children: (
        <List
          dataSource={cityList}
          renderItem={
            (item) => {
              return (
              <List.Item 
                actions={[<a key="list-remove" onClick={() => {removeCity(item)}}>Remove</a>]}
              >
                {item.name}
              </List.Item>)
            }
          }
        />
      ),
    },
    {
      key: '2',
      label: 'Settings',
      children: (
        <List
          dataSource={settings}
          renderItem={
            (item) => {
              return (
              <List.Item 
                actions={[<a key="list-disable" onClick={()=>{allowLocate()}}>{user.allowLocate ? "Disable" : "Enable"}</a>]}
              >
                {item}
              </List.Item>)
            }
          }
        />
      ),
    },
    {
      key: '3',
      label: 'Auth Debugger',
      children: (
        <List
          dataSource={authDebugger}
          itemLayout="vertical"
          renderItem={
            (item) => {
              return (
                <List.Item>
                  <List.Item.Meta title={<p className='debugger-title'>{item.title}</p>}/>
                  <p className='debugger-content'>
                    {item.content}
                  </p>
                </List.Item>
              )
            }
          }>

        </List>
      )
    },
  ];

  const getUserInfo = async() => {
    if(!accessToken){
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const user = await response.json();
      setUser(user);
    }
  }

  const getSubscribedCityList = async() => {
    if(!accessToken){
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/cityList`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const cityList = await response.json();
      console.log(cityList);
      setCityList(cityList);
    }
  }

  const removeCity = async(city) => {
    if(!accessToken){
      return;
    }
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/removeCity?cityId=${city.id}`;
    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      getSubscribedCityList();
    }
  }

  const allowLocate = async() => {
    if(!accessToken){
      return;
    }
    let allow = !user.allowLocate;
    const fullUrl = `${process.env.REACT_APP_API_URL}/user/locate?allow=${allow}`;
    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    if(response.ok){
      const data = await response.json();
      setUser(data);
    }
  }

  useEffect(()=>{
    getUserInfo();
    getSubscribedCityList();
  },[accessToken]);

  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <Button 
          type="primary" 
          size="large" 
          shape="circle" 
          icon={<HomeOutlined />}
          onClick={() => {navigate('/home')} }
        >
        </Button>
        <h1>UserProfile</h1>
      </div>
      <Card className='profile-content'>
        <div className='profile-content-header'>
          <Avatar
            size={{
              xs: 40,
              sm: 40,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            icon={<AntDesignOutlined />}
            src="https://dthezntil550i.cloudfront.net/p4/latest/p42102052243097410008650553/1280_960/12bc8bc0-2186-48fb-b432-6c011a559ec0.png"
          />
          <h1>
            {user.name}
          </h1>
          <p>
            {user.email}
          </p>
        </div>
        <Collapse items={collapseItems} defaultActiveKey={['1']} />
      </Card>
    </div>
  )
}
