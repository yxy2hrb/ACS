"use client";
import React from "react";
import { useState ,useRef,useEffect} from "react";
import Highlighter from 'react-highlight-words';
import "./schedule.css";
import { Select } from "antd";
import { Button, Drawer, Menu, Space, Table, Tag ,Input,Form,InputNumber,Collapse,message} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import axios from "axios";
const { Option } = Select;

export default function Schedule() {
    const timefilter=[]
    const weekday=[
        {
            text: '周一',
            value: '周一',
            label: '周一',
          },
          {
              text: '周二',
              value: '周二',
              label: '周二',
            },
            {
              text: '周三',
              value: '周三',
              label: '周三',
            },
            {
              text: '周四',
              value: '周四',
              label: '周四',
            },
            {
              text: '周五',
              value: '周五',
              label: '周五',
            }
    ]
    const oneday=[
        {
            text: '8:00-9:30',
            value: '8:00-9:30',
            label: '8:00-9:30',
          },
          {
            text: '10:00-11:30',
            value: '10:00-11:30',
            label: '10:00-11:30',
          },
          {
              text: '14:00-15:30',
              value: '14:00-15:30',
              label: '14:00-15:30',
            },
            {
              text: '16:00-17:30',
              value: '16:00-17:30',
              label: '16:00-17:30',
            },
            {
              text: '19:00-20:30',
              value: '19:00-20:30',
              label: '19:00-20:30',
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
      const [selecttime1,Settime1]=useState(0)
      const [selecttime2,Settime2]=useState(0)

      const showDrawer = (id) => {

        Setchangeid(id);
        //console.log(changeid);
        setOpen(true);
        setOpen2(false);
      };


      const [classnumfilter,Setclassnumfilter]=useState(0)
      const [classequfilter,Setclassequfilter]=useState([])
      
      const showDrawer2 = (id) => {
        Setchangeid(id);
       // console.log(changeid);
        
        setOpen2(true);
        setOpen(false);
      };
      const onClose = () => {
        setOpen(false);
        setOpen2(false)
      };

     
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
          title: "操作",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <a onClick={()=>change_class(record.classroom_id)}>确认</a>
            </Space>
          ),
        },
      ];
    

      const columns_class_time = [
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
          title: "操作",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <a onClick={()=>change_time(record.classroom_id)}>确认</a>
            </Space>
          ),
        },
      ];
      

   
    
      
      const data = [
      
      ];
     
       
        const [Newst,SetNew]=useState(0)
        const [schedule_data,Setschedule_data]=useState(0)
        const [class_data_state,Setclassdata]=useState([])
        //获取所有排课信息
        useEffect(()=>{
          SetNew(0)
          //Setschedule_data(data)
          axios.get('http://localhost:5000/api/schedule').then(  response => {
            console.log(response.data)
            Setschedule_data(response.data.schedules)
        }).catch(err => {
          console.log(err);
        });
        },[Newst])


        const onChange_num = (value) => {
            //console.log('changed', value);
            Setclassnumfilter(value)
          };
          const handleequChange = (value) => {
            //console.log(`selected ${value}`);
            Setclassequfilter(value)
          };

        //获取可用教室
        useEffect(()=>{
        
          if(changeid!=-1){
            
            const data={
              Schedule_id:changeid,
              min_capacity:classnumfilter,
              min_equip:classequfilter
            }
            // const data_class = [
            //   {
            //     class: "曹西201",
            //     capti: 30,
            //     equip: ["黑板","投影仪"],
            //     campus:"紫金港",
            //     classroom_id:2
            //   },
            // ];
            axios.post('http://localhost:5000/api/teacher/change/class',data).then(  response => {
              //console.log(response.data.classes)
              const data_class2=[]
              const campusid2str=[
                "紫金港",
                "玉泉",
                "西溪",
                "华家池",
                "之江",
                "舟山",
                "海宁"
              ]
              for(let i=0;i<response.data.classes.length;i++)
              {
                data_class2.push({
                    class:response.data.classes[i]["classroom_name"],
                    classroom_id:response.data.classes[i]["class_id"],
                    campus:campusid2str[response.data.classes[i]["campus_id"]],
                    capti:response.data.classes[i]["capacity"],
                    equip:response.data.classes[i]["equipment"]
                })
              }
              console.log(data_class2)
              Setclassdata(data_class2)
          }).catch(err => {
            console.log(err);
          });
          }

        },[changeid,classnumfilter,classequfilter])

      
        //确认修改教室
      const change_class=(class_id)=>{

        console.log(class_id)
        const data={
          schedule_id:changeid,
          classroom_id:class_id
        }

        axios.post('http://localhost:5000/api/change/schedule/classroom',data).then(  response => {
          console.log(response.data)

         if(response.data.success==1){
            onClose()
            SetNew(1)
            Setchangeid(-1)
            alert("success")
         }else{
          alert("failed")
         }
      }).catch(err => {
         alert("failed")
        console.log(err);
      
      });
      }
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
                    <Select onChange={handleequChange} mode="multiple">  
                      <Option value="投影仪">投影仪</Option>  
                      <Option value="白板">白板</Option>  
                      <Option value="电脑">电脑</Option>  
                      <Option value="fpga开发板">fpga开发板</Option>  
                      <Option value="实验台">实验台</Option>  
                    </Select >  
                  </Form.Item>


               
                 
              </Form>,
            },
            {
              key: '2',
              label: '可用教室列表',
              children: <Table columns={columns_class} dataSource={class_data_state} />,
            },
          ];
          
          const options1=[  {
            value: 1,
            label: '周一',
          },
          {
              value: 2,
              label: '周二',
            },
            {
              value: 3,
              label: '周三',
            },
            {
              value: 4,
              label: '周四',
            },
            {
              value: 5,
              label: '周五',
            }]
            const options2=[
              {
                  value: 1,
                  label: '8:00-9:30',
                },
                {

                  value: 2,
                  label: '10:00-11:30',
                },
                {

                    value: 3,
                    label: '14:00-15:30',
                  },
                  {

                    value: 4,
                    label: '16:00-17:30',
                  },
                  {

                    value: 5,
                    label: '19:00-20:30',
                  }
          ]
          const change_time1=(value)=>{
            Settime1(value)
          }
          const change_time2=(value)=>{
            Settime2(value)
          }

          const [class_data_time,Setclasstime]=useState([])

          //获取可用教室(时间)
          useEffect(()=>{
            if(selecttime1!=0&&selecttime2!=0){
              const data={
                schedule_id:changeid,
                time_slot:selecttime1*10+selecttime2
              }
              console.log(data)
              axios.post('http://localhost:5000//api/teacher/change/time',data).then(  response => {
                console.log(response.data)
                const data_class2=[]
                const campusid2str=[
                  "紫金港",
                  "玉泉",
                  "西溪",
                  "华家池",
                  "之江",
                  "舟山",
                  "海宁"
                ]
                for(let i=0;i<response.data.classes.length;i++)
                {
                  data_class2.push({
                      class:response.data.classes[i]["classroom_name"],
                      classroom_id:response.data.classes[i]["class_id"],
                      campus:campusid2str[response.data.classes[i]["campus_id"]],
                      capti:response.data.classes[i]["capacity"],
                      equip:response.data.classes[i]["equipment"]
                  })
                }
                console.log(data_class2)
                Setclasstime(data_class2)
             
            }).catch(err => {
              console.log(err);
            
            });
            }

          },[selecttime1,selecttime2])
          //确认修改时间
          const change_time=(class_id)=>{


            const data={
              schedule_id:changeid,
              classroom_id:class_id,
              time_slot:selecttime1*10+selecttime2
            }
            console.log(data)
            axios.post('http://localhost:5000/api/change/schedule/time',data).then(  response => {
              console.log(response.data)
    
             if(response.data.success==1){
                onClose()
                SetNew(1)
                Setchangeid(-1)
                alert("success")
             }else{
              alert(response.data.message)
             }
          }).catch(err => {
             alert("failed")
            console.log(err);
          
          });
          }


          const items_time=[
            {
              key: '1',
              label: '选择时间',

              children: 
              <div>
                <Select
              onChange={change_time1}
              style={{
                width: 200,
              }}
              options={options1}
            />
                <Select
              onChange={change_time2}
              style={{
                width: 200,
              }}
              options={options2}
            />
                </div>
            
            ,
            },
            {
              key: '2',
              label: '可用教室列表',
              children: <Table columns={columns_class_time} dataSource={class_data_time} />,
            }
            
            ,
          ]
    return(
        <div className="schedule_list">
            <Table style={{height:"100%",width:"100%"}}columns={columns} dataSource={schedule_data} />;
            <Drawer width={"600px"} title="修改时间" onClose={onClose} open={open}>

            <Collapse accordion items={items_time} defaultActiveKey={'1'}  />


            </Drawer>
            <Drawer width={"600px"} title="修改教室" onClose={onClose} open={open2}>

            <Collapse accordion items={items} defaultActiveKey={'1'}  />
                
               
        
           
          
            
        </Drawer>
        </div>
    )
    
}