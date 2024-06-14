"use client";
import { Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./nav.css";

export default function TNav({ nowstate }) {
  return (
    <div className="wi">
      <div className="frame">
        <Menu
          defaultSelectedKeys={[nowstate]}
          mode="inline"
          style={{ background: "#white", height: "100%" }}
        >
          <Menu.Item key="/teacher">
            <Link to="/teacher">首页</Link>
          </Menu.Item>
          <Menu.Item key="/teacher/course">
            <Link to="/teacher/course/7">教师课表</Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}
