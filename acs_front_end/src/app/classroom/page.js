import Image from "next/image";
import React from 'react';
import { DatePicker } from 'antd';
import Nav from "../Nav/nav.js"
import Topbar from "../topbar/topbar.js";
import Classroom from "./classroom.js";
export default function Home() {
  return (
    <div>
      <div>
        <Topbar></Topbar>
      </div>
      <div>
        <Classroom></Classroom>
      </div>
    </div>
  );
}

