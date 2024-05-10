"use client";
import { Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./nav.css";

export default function Nav({ nowstate }) {
  return (
    <div className="wi">
      <div className="frame">
        <Menu
          defaultSelectedKeys={[nowstate]}
          mode="inline"
          style={{ background: "#white", height: "100%" }}
        >
          <Menu.Item key="/admin">
            <Link to="/admin">首页</Link>
          </Menu.Item>
          <Menu.Item key="/admin/schedule">
            <Link to="/admin/schedule">排课信息</Link>
          </Menu.Item>
          <Menu.Item key="/admin/classroom">
            <Link to="/admin/classroom">增加教室</Link>
          </Menu.Item>
          <Menu.Item key="/admin/classroom/list">
            <Link to="/admin/classroom/list">教室信息</Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}
