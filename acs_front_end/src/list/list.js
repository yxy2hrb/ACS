

import React from "react";
import { Space, Table, Tag } from "antd";

export default  function RoomList() {
  const columns = [
    {
      title: "教室名称",
      dataIndex: "classroomName",
      key: "classroomName",
    },
    {
      title: "校区",
      dataIndex: "campus",
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
      render: (_, { equipment }) => (
        <>
          {equipment.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
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
  const data = [
    {
      key: "1",
      classroomName: "教室A",
      campus: "校区1",
      capacity: 30,
      equipment: ["投影仪", "白板"],
    },
    {
      key: "2",
      classroomName: "教室B",
      campus: "校区2",
      capacity: 25,
      equipment: ["投影仪"],
    },
    {
      key: "3",
      classroomName: "教室C",
      campus: "校区1",
      capacity: 40,
      equipment: ["投影仪", "电脑"],
    },
  ];
  return (
    <div>
      <div style={{ marginLeft: "15vw"}}>
        <Table columns={columns} dataSource={data} />
      </div>

    </div>
  );
}
