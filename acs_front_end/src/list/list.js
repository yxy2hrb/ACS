import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { message, Space, Table, Tag } from "antd";

export default function RoomList() {
  const columns = [
    {
      title: "教室名称",
      dataIndex: "name",
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
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDelete(record.id)}>删除</a>
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

  const handleDelete = async (key) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/classrooms/${key}`
      );
      if (res.status === 200) {
        message.success("删除成功");
      }
      console.log(res.data);
      // After deleting, fetch the data again to update the list
      fetchData();
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
        <Table columns={columns} dataSource={classData} />
      </div>
    </div>
  );
}
