import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Card, Button, Avatar, List } from 'antd';
import { HomeOutlined, AntDesignOutlined } from '@ant-design/icons';
import './UserProfile.css'

export default function UserProfile() {
  const navigate = useNavigate();
  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;
  const subscribedCityList = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
  ];
  const settings = [
    "Access to my location",
  ];
  const collapseItems = [
    {
      key: '1',
      label: 'Subscribed City List',
      children: (
        <List
          dataSource={subscribedCityList}
          renderItem={
            (item) => {
              return (
              <List.Item 
                actions={[<a key="list-remove">Remove</a>]}
              >
                {item}
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
                actions={[<a key="list-disable">Disable</a>]}
              >
                {item}
              </List.Item>)
            }
          }
        />
      ),
    },
  ];
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
            Cathenax
          </h1>
          <p>
            siyuan20011205@163.com
          </p>
        </div>
        <Collapse items={collapseItems} defaultActiveKey={['1']} />
      </Card>
    </div>
  )
}
