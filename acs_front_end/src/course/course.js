"use client";
import React from "react";
import { useRef, useState, useEffect } from "react";
import "./course.css";
import { Select } from "antd";
import { useReactToPrint } from "react-to-print";
import { Button, Drawer, Menu, Space, Table, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import {Input} from "antd";
import { useNavigate } from 'react-router-dom';
export default function Course() {
  const contentToPrint = useRef(null);
  const tmp=[]
  const [nowCourse, SetNowCourse] = useState(-1);
  const [course, SetCourse] = useState(tmp);
  const [course_html_state, Setcoursehtml] = useState("null");
  const [nowcourse_html_state, Setnowcoursehtml] = useState(0);

  const params = useParams();
  var id = params.course_id;

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const time_num2str = [
    "8:00-9:30",
    "10:00-11:30",
    "14:00-15:30",
    "16:00-17:30",
    "19:00-20:30",
  ];
  const week_num2str = ["周一", "周二", "周三", "周四", "周五"];
  const [SSSteachername,SetSSS]=useState("null")
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/teacher/courses/" + id)
      .then((response) => {
        console.log(response.data);
        SetCourse(response.data.courses);
        const course_html = [];
        for (let i = 0; i < 5; i++) {
          let onecontent = [];
          onecontent.push(<th>{time_num2str[i]}</th>);
          for (let j = 0; j < 5; j++) {
            let f = 0;
            for (let l = 0; l < response.data.courses.length; l++) {
              if (response.data.courses[l].time_slot == (j + 1) * 10 + i + 1) {
                onecontent.push(
                  <td
                    onClick={() => {
                      SetNowCourse(l);
                    }}
                  >
                    <div>{response.data.courses[l].name}</div>
                    <div>{response.data.courses[l].classroom}</div>
                  </td>
                );
                f = 1;
                break;
              }
            }
            if (f == 0) {
              onecontent.push(<td></td>);
            }
          }
          course_html.push(<tr>{onecontent}</tr>);
        }
        console.log(course_html);
        Setcoursehtml(course_html);
      })
      .catch((err) => {
        console.log(err);
      });

    
  }, [id]);
///api/teacher/name/
useEffect(() => {
  axios
    .get("http://127.0.0.1:5000/api/teacher/name/" + id)
    .then((response) => {
      console.log(response.data);
      SetSSS(response.data.name);
    })
    .catch((err) => {
      console.log(err);
    });

  
}, [id]);
  const navigate = useNavigate();
  const [TeacherSearchid,setSearchid]=useState(-1)
  const [teachername,setteachername]=useState("null")
  var myteachername="null"
  useEffect(() => {
    const nowcourse_html = [];

    if (nowCourse != -1) {
      nowcourse_html.push(
        <div className="names">
          <div className="ids">课程名称</div>
          {course[nowCourse].name}
        </div>
      );
      nowcourse_html.push(
        <div className="names">
          <div className="ids">课程编号</div>
          {course[nowCourse].course_id}
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">学年</div>
          2024春夏
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">时间</div>
          {week_num2str[parseInt(course[nowCourse].time_slot / 10) - 1] +
            time_num2str[(course[nowCourse].time_slot % 10) - 1]}
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">教室/容量</div>
          {course[nowCourse].classroom + "/" + course[nowCourse].capacity}
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">校区</div>
          {course[nowCourse].campus}
        </div>
      );
    } else {
      nowcourse_html.push(
        <div className="names">
          <div className="ids">课程名称</div>
        </div>
      );
      nowcourse_html.push(
        <div className="names">
          <div className="ids">课程编号</div>
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">学年</div>
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">时间</div>
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">教室/容量</div>
        </div>
      );

      nowcourse_html.push(
        <div className="names">
          <div className="ids">校区</div>
        </div>
      );
     
      nowcourse_html.push(
        <div>
           <Input onChange={(e)=>{
           // setteachername(e.target.value)
            myteachername=e.target.value
            console.log(e.target.value)
            }}placeholder="教师名称" />
           <Button onClick={
            ()=>{
              const data={
                name:myteachername
            }
          //  console.log(data)
              axios
              .post("http://127.0.0.1:5000/api/test/searchid",data)
              .then((response) => {
                console.log(response.data);
                if(response.data.success){
                  setSearchid(response.data.id)
                  if(response.data.id==-1){
                    alert("没有此教师")
                  }else{
                    alert("查询成功")
                   navigate("/teacher/course/"+response.data.id);
                  }
                }else{
                  console.log("error")
                }
              
              })
              .catch((err) => {
                console.log(err);
              });
            }
           }style={{height:30,color:"black"}}type="primary">搜索</Button>
        
        </div>
       
      )
    }
    Setnowcoursehtml(nowcourse_html);
  }, [nowCourse,TeacherSearchid]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="course" id="print-content">
      <div className="detail">
        <div className="title">课程详细信息</div>
        <div className="detail_body">{nowcourse_html_state}</div>
      </div>

      <div className="schedule" ref={contentToPrint}>
        <div className="title">{SSSteachername}课表</div>
        <div className="body">
          <div className="title2">
            <div>
              <h5>学年 </h5>
            </div>
            <div>
              <Select
                defaultValue="2023-2024"
                onChange={handleChange}
                style={{ width: 200, marginLeft: 10, marginRight: 80, top: -3 }}
                options={[
                  { value: "2023-2024", label: "2023-2024" },
                  { value: "2022-2023", label: "2022-2023" },
                  { value: "2021-2022", label: "2021-2022" },
                  { value: "disabled", disabled: true },
                ]}
              />
            </div>

            <div>
              <h5>学期 </h5>
            </div>
            <div>
              <Select
                defaultValue="2023-2024"
                onChange={handleChange}
                style={{ width: 200, marginLeft: 10, top: -3 }}
                options={[
                  { value: "春", label: "春" },
                  { value: "夏", label: "夏" },
                  { value: "秋", label: "秋" },
                  { value: "冬", label: "冬" },
                ]}
              />
            </div>
            <div>
              <Button
                style={{ marginLeft: 100, top: -4 }}
                type="default"
                onClick={handlePrint}
              >
                打印
              </Button>
            </div>
          </div>
          <div className="courses">
            <div className="show">
              <table className="table_course">
                <tbody>
                  <tr>
                    <th>时间</th>
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                  </tr>

                  {course_html_state}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

