"use client";
import React from "react";
import { useState ,useRef,useEffect} from "react";
import Highlighter from 'react-highlight-words';
import "./schedule.css";
import { Select } from "antd";
import { Button, Drawer, Menu, Space, Table, Tag ,Input,Form,InputNumber,Collapse} from "antd";
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
export default function Schedule() {
    const timefilter=[]
    const weekday=[
        {
            text: '周一',
            value: '周一',
          },
          {
              text: '周二',
              value: '周二',
            },
            {
              text: '周三',
              value: '周三',
            },
            {
              text: '周四',
              value: '周四',
            },
            {
              text: '周五',
              value: '周五',
            }
    ]
    const oneday=[
        {
            text: '8:00-9:30',
            value: '8:00-9:30',
          },
          {
            text: '10:00-11:30',
            value: '10:00-11:30',
          },
          {
              text: '14:00-15:30',
              value: '14:00-15:30',
            },
            {
              text: '16:00-17:30',
              value: '16:00-17:30',
            },
            {
              text: '19:00-20:30',
              value: '19:00-20:30',
            }
    ]
    for(let i=0;i<5;i++)
    {
       let onechild=[]
       for(let j=0;j<5;j++)
       {
        onechild.push({
            text:oneday[j].text,
            value:weekday[i].text+oneday[j].text
        })
       }

       timefilter.push({
        text:weekday[i].text,
        value:weekday[i].value,
        children:onechild
       })
        
    }

    const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
   
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`搜索 ${ dataIndex=="teacher"?"教师":
          dataIndex=="course"?"课程名称":
              dataIndex=="classroom"?"教室":"none"}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 50,
            }}
          >
            
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 50,
            }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            筛选
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
   // console.log(timefilter)
    const columns = [
        {
          title: 'ID',
          dataIndex: 'Schedule_id',
          key: 'Schedule_id',
          width:"10%",
          render:(text)=>(<h4>{text}</h4>),
          sorter: {
            compare: (a, b) => a.Schedule_id - b.Schedule_id,
            multiple: 1,
          },
        },
        {
          title: '教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width:"10%",
          ...getColumnSearchProps('teacher'),
        },
        {
          title: '时间',
          dataIndex: 'time_slot',
          key: 'time_slot',
          width:"15%",
            
          filters: timefilter,
     
          onFilter: (value, record) => record.time_slot.indexOf(value) === 0,
        },
        {
          title: '课程',
          key: 'course',
          dataIndex: 'course',
          width:"15%",
          ...getColumnSearchProps('course'),
        },
        {
            title: '教室',
            key: 'classroom',
            dataIndex: 'classroom',
            ...getColumnSearchProps('classroom'),
            width:"10%",
        },
        {
            title: '校区',
            key: 'campus',
            dataIndex: 'campus',
            width:"10%",
        },
        {
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <a onClick={()=>showDrawer(record.Schedule_id)}>修改时间</a>
              <a onClick={()=>showDrawer2(record.Schedule_id)}>修改教室</a>
            </Space>
          ),
        },
      ];


      const [open, setOpen] = useState(false);
      const [open2, setOpen2] = useState(false);

      const [changeid,Setchangeid]=useState(-1);

      const showDrawer = (id) => {

        Setchangeid(id);
        //console.log(changeid);
        setOpen(true);
        setOpen2(false);
      };


      const [classnumfilter,Setclassnumfilter]=useState(0)
      const showDrawer2 = (id) => {
        Setchangeid(id);
       // console.log(changeid);

        setOpen2(true);
        setOpen(false);
      };
    

      const columns_time=[
        {
            title:"星期",
            dataIndex: "weekday",
            key: "weekday",
           
        },
        {
            title:"时间",
            dataIndex: "daytime",
            key: "daytime",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <a >确认</a>
              </Space>
            ),
          },

      ]
      const data_time=[
        {
            weekday:"周一",
            daytime:"10:00-11:30"
        },
        {
            weekday:"周二",
            daytime:"10:00-11:30"
        },
        {
            weekday:"周三",
            daytime:"10:00-11:30"
        },
        {
            weekday:"周四",
            daytime:"10:00-11:30"
        },

      ]
      const columns_class = [
        {
          title: "名称",
          dataIndex: "class",
          key: "class",
          ...getColumnSearchProps('class'),
        },
        {
          title: "容量",
          dataIndex: "capti",
          key: "capti",
          sorter: (a, b) => a.capti - b.capti,
        },
        {
          title: "设备",
          dataIndex: "equip",
          key: "equip",
          render: (_, { equip }) => (
            <>
              {equip .map((tag) => {
                let color = 'geekblue'
              
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
            title:"校区",
            dataIndex: "campus",
            key: "campus",
            filters: [
                {
                  text: '紫金港',
                  value: '紫金港',
                },
                {
                  text: '玉泉',
                  value: '玉泉',
                },],
                onFilter: (value, record) => record.campus.indexOf(value) === 0,
        },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <a >确认</a>
            </Space>
          ),
        },
      ];
      const data_class = [
        {
          class: "曹西201",
          capti: 30,
          equip: ["黑板","投影仪"],
          campus:"紫金港"
        },
      ];


      const onClose = () => {
        setOpen(false);
        setOpen2(false)
      };
    
      
      const data = [
      
      ];
      
      for(let i=0;i<10;i++)
        {data.push( {
            Schedule_id:i,
            teacher:"王章野",
            time_slot:"周五10:00-11:30",
            course: 'software engineering',
            classroom:"曹西201",
            campus:"紫金港"
          })
           
        }
        for(let i=0;i<10;i++)
        {data.push( {
            Schedule_id:i+10,
            teacher:"王章野",
            time_slot:"周四10:00-11:30",
            course: 'software engineering',
            classroom:"曹西201",
            campus:"紫金港"
          })
           
        }
        for(let i=0;i<10;i++)
        {data.push( {
            Schedule_id:i+20,
            teacher:"王章野",
            time_slot:"周四8:00-9:30",
            course: 'software engineering',
            classroom:"曹西201",
            campus:"紫金港"
          })
           
        }
        for(let i=0;i<10;i++)
        {data.push( {
            Schedule_id:i+30,
            teacher:"王章野",
            time_slot:"周四14:00-15:30",
            course: 'software engineering',
            classroom:"曹西201",
            campus:"紫金港"
          })
           
        }

        const [schedule_data,Setschedule_data]=useState(0)

        useEffect(()=>{
            Setschedule_data(data)
        },[])


        const onChange_num = (value) => {
            console.log('changed', value);
            Setclassnumfilter(value)
          };


          const items = [
            {
              key: '1',
              label: '筛选教室',
              children:  <Form>
              <Form.Item  
                    label="教室最少容量"  
                    name="mincapti"  
                    rules={[{ required: false, message: '最小容量' }]}  
                  >  
                  <InputNumber min={0} defaultValue={0} onChange={onChange_num} />
                  </Form.Item>
  
              
                 <Form.Item  
                    label="教室设备"  
                    name="minequip"  
                    rules={[{ required: false, message: '请选择教室设备' }]}  
                  >  
                    <Select mode="multiple">  
                      <Option value="投影仪">投影仪</Option>  
                      <Option value="白板">白板</Option>  
                      <Option value="电脑">电脑</Option>  
                      <Option value="fpga开发板">fpga开发板</Option>  
                      <Option value="实验台">实验台</Option>  
                    </Select>  
                  </Form.Item>    
                  <Form.Item className="align-right">  
                  <Button type="primary" htmlType="submit" className='confirm'>  
                    确认  
                  </Button>  
               
                </Form.Item>  
              </Form>,
            },
            {
              key: '2',
              label: '可用教室列表',
              children: <Table columns={columns_class} dataSource={data_class} />,
            },
          ];
    
    return(
        <div className="schedule_list">
            <Table style={{height:"100%",width:"100%"}}columns={columns} dataSource={schedule_data} />;
            <Drawer title="修改时间" onClose={onClose} open={open}>
              <Table columns={columns_time} dataSource={data_time} />;
            </Drawer>
            <Drawer width={"600px"} title="修改教室" onClose={onClose} open={open2}>

            <Collapse accordion items={items} defaultActiveKey={'1'}  />
                
               
        
           
          
            
        </Drawer>
        </div>
    )
    
}