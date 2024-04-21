"use client";
import React from 'react';
import { useState } from "react";
import "./classroom.css"
import { Form, Input, Radio, Checkbox, Button, Select }  from 'antd';
const { Option } = Select;
export default function Classroom()
{

  const [formData, setFormData] = useState({  
    classroomName: '',  
    campus: '',  
    capacity: '',  
    equipment: []  
  })

  const handleFormChange = (changedValues, allValues) => {  
    setFormData(allValues);  
  };

  const onFinish = (values) => {  
    console.log('Received values:', values);  
  };  
  
  const onFinishFailed = (errorInfo) => {  
    console.log('Failed:', errorInfo);  
  }; 
  
  const handleCancel = () => {  
    console.log("cancel")
  };  


    return(
        <div className='mask'>
            <div className='add_wrapper'>
              <div className='title'>
                添加教室信息
              </div>
              <div className='inputForm'>
                <Form  
                  name="inputForm"  
                  initialValues={formData}  // 使用初始值来填充表单  
                  onFinish={onFinish}  
                  onFinishFailed={onFinishFailed}  
                  onValuesChange={handleFormChange}  // 监听表单值的变化  
                  className="input-form"  
                >  
                <Form.Item  
                  label="教室名"  
                  name="classroomName"  
                  rules={[{ required: true, message: '请输入教室名' }]}  
                >  
                  <Input />  
                </Form.Item>  
            
                <Form.Item  
                  label="校区"  
                  name="campus"  
                  rules={[{ required: true, message: '请选择校区' }]}  
                >  
                  <Select>  
                    <Option value="紫金港">紫金港</Option>  
                    <Option value="玉泉">玉泉</Option>  
                    <Option value="西溪">西溪</Option>  
                    <Option value="华家池">华家池</Option>  
                    <Option value="之江">之江</Option> 
                  </Select>  
                </Form.Item> 
            
                <Form.Item  
                  label="教室容量"  
                  name="capacity"  
                  rules={[{ required: true, message: '请输入教室容量' }]}  
                >  
                  <Input type="number" />  
                </Form.Item>  
            
                <Form.Item  
                  label="教室设备"  
                  name="equipment"  
                  rules={[{ required: true, message: '请选择教室设备' }]}  
                >  
                  <Select mode="multiple">  
                    <Option value="投影仪">投影仪</Option>  
                    <Option value="白板">白板</Option>  
                    <Option value="电脑">电脑</Option>  
                    <Option value="fpga开发板">fpga开发板</Option>  
                    <Option value="实验台">实验台</Option>  
                  </Select>  
                </Form.Item>    
            
                <Form.Item className="align-right">  
                  <Button type="primary" htmlType="submit" className='confirm'>  
                    确认  
                  </Button>  
                  <Button type="default" htmlType="button" className="cancel-button" onClick={handleCancel}>  
                    取消  
                  </Button>  
                </Form.Item>  
              </Form>  
              </div>
            </div>
        </div>
    )
}

