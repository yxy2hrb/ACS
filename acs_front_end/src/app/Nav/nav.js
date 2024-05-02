"use client";
import { Menu } from "antd";
import React from "react";
import { useState } from "react";
import "./nav.css";

export default function Nav({ nowstate }) {
  const l = [];

  l.push(
    <li>
      <a href="/course">
        <div className="now">教师课表</div>
      </a>
    </li>
  );

  l.push(
    <li>
      <a href="/classroom">
        <div>增加教室</div>
      </a>
    </li>
  );
  l.push(
    <li>
      <a href="./classroom/list">
        <div>教室信息</div>
      </a>
    </li>
  );
  l.push(
    <li>
      <a href="/">首页</a>
    </li>
  );
  return (
    <div className="wi">
      <div className="frame">
        <ul>{l}</ul>
      </div>
    </div>
  );
}
