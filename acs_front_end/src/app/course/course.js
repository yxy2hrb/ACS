"use client";
import React from "react";
import { useState } from "react";
import "./course.css";
import { Select } from "antd";
import { Button, Drawer, Menu, Space, Table, Tag } from "antd";
export default function Course() {
  const tmp = [
    {
      schedule_id: 123,
      course_id: 123,
      classroom_id: 123,
      name: "计算机网络",
      classroom: "曹东102",
      time_slot: 3,
      campus: "紫金港",
      capacity: 30,
    },
    {
      schedule_id: 133,
      course_id: 133,
      classroom_id: 133,
      name: "计算机组成",
      classroom: "曹东202",
      time_slot: 9,
      campus: "紫金港",
      capacity: 30,
    },
  ];
  const columns = [
    {
      title: "week",
      dataIndex: "week",
      key: "week",
    },
    {
      title: "time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button style={{ color: "blue" }}>this</button>
        </Space>
      ),
    },
  ];
  const datas = [
    {
      week: "星期一",
      time: "10:00-11:30",
    },
    {
      week: "星期二",
      time: "9:00-10:30",
    },
  ];

  const columns2 = [
    {
      title: "class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "capti",
      dataIndex: "capti",
      key: "capti",
    },
    {
      title: "equip",
      dataIndex: "equip",
      key: "equip",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button style={{ color: "blue" }}>this</button>
        </Space>
      ),
    },
  ];
  const datas2 = [
    {
      class: "曹西201",
      capti: "30",
      equip: "黑板,投影仪",
    },
  ];
  const [nowCourse, SetNowCourse] = useState(-1);
  const [course, SetCourse] = useState(tmp);

  //     axios.get('/api/teacher?id=12345/courses')
  //         .then(function (response) {
  //             // handle success
  //             console.log(response);

  //             // update state or do something
  //             SetCourse(response.data.courses)
  //         })
  //         .catch(function (error) {
  //             // handle error
  //             console.log(error);
  //         })
  //         .then(function () {
  //             // always executed
  //   });
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [current_time_class, setCurrentTime] = useState("time_slot");
  const time_class_click = (e) => {
    setCurrentTime(e.key);
  };
  const items = [
    {
      label: "time_slot",
      key: "time_slot",
    },
    {
      label: "classroom",
      key: "classroom",
    },
  ];
  return (
    <div className="course">
      <div className="detail">
        <div className="title">课程详细信息</div>
        <div className="detail_body">
          <div className="name">
            <div className="id">课程名称</div>
            软件工程
          </div>

          <div className="name">
            <div className="id">课程编号</div>
            123456
          </div>

          <div className="name">
            <div className="id">学年</div>
            2024春夏
          </div>

          <div className="name">
            <div className="id">时间</div>
            周五 10:00-11:30
          </div>

          {/* <div className='name' style={{"height":"60px"}}>
                        <div className='id'>
                            教材
                        </div >
                        <div style={{"font-size":"meduim","lineHeight":"18px","padding-top":"10px","textAlign":"left"}}>
                            《software engineering》
                        </div>
                    </div> */}

          <div className="name">
            <div className="id">教室/容量</div>
            曹西201/30
          </div>

          <div className="name">
            <div className="id">教室设备</div>
            投影仪 黑板
          </div>

          <div className="name">
            <div className="id">校区</div>
            紫金港
          </div>

          <div>
            <Button
              style={{
                height: "50px",
                "border-width": "2px",
                borderColor: "#a1c4fd",
                borderStyle: "solid",
                "background-color": "aliceblue",
                fontWeight: "500",
              }}
              type="text"
              onClick={showDrawer}
            >
              切换该课程时间/教室
            </Button>
            <Drawer title="修改" onClose={onClose} open={open}>
              <div>
                <Menu
                  onClick={time_class_click}
                  selectedKeys={[current_time_class]}
                  mode="horizontal"
                  items={items}
                />
              </div>
              <div>
                <Table columns={columns} dataSource={datas} />;
              </div>
              {/* <div>
                              <Table columns={columns2} dataSource={datas2} />;
                            </div> */}
            </Drawer>
          </div>
        </div>
      </div>

      <div className="schedule">
        <div className="title">教师个人课表</div>
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
                  {/* <td>10:00-11:30</td>
                                <td>14:00-15:30</td>
                                <td>16:00-17:30</td>
                                <td>19:00-20:30</td>  */}
                  <tr>
                    <th>8:00-9:30 </th>
                    <td></td>
                    <td>软件工程</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>10:00-11:30 </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>14:00-15:30 </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>16:00-17:30 </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <th>19:00-20:30 </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
