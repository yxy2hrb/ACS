import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";

export default function RoomList() {
  const columns = [
    {
      title: "教室名称",
      dataIndex: "classroom_name",
      key: "classroomName",
    },
    {
      title: "校区",
      dataIndex: "campus_id",
      key: "campus",
    },
    {
      title: "容量",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "设备",
      key: "equipment",
      dataIndex: "equipment",
      // render: (_, { equipment }) => (
      //   <>
      //     {equipment.map((tag) => {
      //       let color = tag.length > 5 ? "geekblue" : "green";
      //       if (tag === "loser") {
      //         color = "volcano";
      //       }
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       );
      //     })}
      //   </>
      // ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>删除 {record.name}</a>
          <a>修改</a>
        </Space>
      ),
    },
  ];
  const [classData, setClassData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classrooms");
      setClassData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginLeft: "15vw" }}>
        <Table columns={columns} dataSource={classData.data} />
      </div>
    </div>
  );
}
