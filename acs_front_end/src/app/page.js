import Image from "next/image";
import React from 'react';
import { DatePicker } from 'antd';
import Nav from "./Nav/nav.js"
import Course from "./Course/course.js";
export default function Home() {
  return (
    <div>
      <div >
        <Nav/>
      </div>
      <div>
        <Course></Course>
      </div>
    </div>
    
   

   
  );
}

