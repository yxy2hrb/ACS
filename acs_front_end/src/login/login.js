import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from "axios";
import "./login.css";
import CryptoJS from 'crypto-js';


export default function Login({ nowstate }) {
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  document.title = '登录- 现代教学服务系统';

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA256(values.password).toString();
    //   const formData = new FormData();
    //   formData.append('number', values.number);
    //   formData.append('password', hashedPassword);
    //   console.log(formData)
    //   console.log('password(SE2024):',hashedPassword)
    //   const response = await fetch('http://127.0.0.1:5000/api/user/login/', {
    //     method: 'POST',
    //     // body: formData,
    //   });
      axios
        .post("http://127.0.0.1:5000/api/user/login/", {number:values.number, password: hashedPassword})
        .then((response) => {
          const data = response;
          console.log('data:', data);
          if (data.status === 200) {
              localStorage.setItem('token', data.data.token);
              localStorage.setItem('id', data.data.id);
              localStorage.setItem('number', data.data.number);
              localStorage.setItem('name', data.data.name);
              localStorage.setItem('major', data.data.major);
              localStorage.setItem('auth', data.data.auth);
              localStorage.setItem('phone', data.data.phone);
              localStorage.setItem('password', values.password);
              localStorage.setItem('avatar', data.data.avatar);
              console.log("valuse.password",values.password);
              console.log("backend hash password",data.data.password);
              // route to profilepage
              if(data.data.auth == 1){
                  navigate('/teacher/course/'+data.data.id)
              }else{
                  navigate('/admin')
              }
          } else {
              message.error('登录失败 ' + data.msg);
              console.error('Login failed: ' + data.msg);
          }
        }).catch((error) => {
            message.error('发生错误', error);
            console.error('发生错误', error);
        });
    } catch (error) {
        message.error('发生错误', error);
        console.error('发生错误', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };
    return (
        <div className="login-page">
          <div className='login-title'>
            欢迎登陆自动排课系统
          </div>
          <div className="login-container">
            <Form
              name="login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
            >
              <Form.Item
                name="number"
                rules={[{ required: true, message: 'Please input your Number!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="学工号" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} size="large">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
}
