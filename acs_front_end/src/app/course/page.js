import Image from "next/image";
import React from "react";
import { DatePicker } from "antd";
import Nav from "../Nav/nav.js";
import Course from "./course.js";
import Topbar from "../topbar/topbar.js";
export default function Home() {
  return (
    <div>
      <div>
        <Topbar></Topbar>
      </div>
      <div>
        <Nav />
      </div>
      <div>
        <Course></Course>
      </div>
    </div>
  );
}
