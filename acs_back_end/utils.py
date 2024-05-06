names = [
    "计算机科学导论",
    "微积分",
    "英语写作",
    "数据结构与算法",
    "物理学基础",
    "人文学科概论",
    "离散数学",
    "大学化学",
    "艺术史",
    "数据库管理",
    "宏观经济学",
    "微观经济学",
    "心理学入门",
    "操作系统原理",
    "社会学概论",
    "计算机网络",
    "线性代数",
    "法律基础",
    "生物学基础",
    "历史文献",
    "企业管理原理",
    "人体解剖学",
    "工程伦理学",
    "金融学基础",
    "数字图像处理",
    "环境科学导论",
    "逻辑与推理",
    "艺术设计",
    "心理统计学",
    "物联网技术",
    "教育心理学",
    "算法设计与分析",
    "新闻学基础",
    "软件工程概论",
    "人工智能导论",
    "社会心理学",
    "计算机图形学",
    "宗教文化",
    "生态学基础",
    "营销原理",
    "音乐欣赏",
    "数据挖掘",
    "健康心理学",
    "经济学原理",
    "网络安全",
    "环境伦理学",
    "数据可视化",
    "传播学概论",
    "电子商务",
    "神经科学",
    "戏剧表演",
    "市场调查",
    "艺术哲学",
    "医学伦理学",
    "会计学原理",
    "网络社交分析",
    "教育技术",
    "游戏设计",
    "风险管理",
    "人际沟通",
    "物理学实验",
    "大数据技术",
    "人类学概论",
    "营销策略",
    "心理咨询",
    "跨文化沟通",
    "工业工程",
    "语言学导论",
    "机器学习",
    "体育营养学",
    "环境政策",
    "创意写作",
    "音乐技术",
    "电影史",
    "数据库应用",
    "生态学实践",
    "组织行为学",
    "信息管理",
    "医学影像学",
    "宇宙学导论",
    "数学建模",
    "数字营销",
    "城市规划",
    "企业战略",
    "编程语言",
    "人体生理学",
    "社交心理学",
    "物理化学",
    "动画制作",
    "政治学概论",
    "电子游戏设计",
    "人工智能伦理学",
    "公共关系",
    "医学统计学",
    "生物信息学",
    "媒体文化",
    "网络营销",
    "环境研究",
    "信息安全",
    "艺术心理学",
]

first_names = ["张", "王", "李", "赵", "刘", "陈", "杨", "黄", "周", "吴",
               "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗"]

last_names = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军",
              "洋", "勇", "艳", "杰", "娟", "涛", "明", "超", "秀兰", "霞"]
import random
# def prepare_info():
#     number = 100
#     cids = []
#     names = names
#     teachers = []
#     campus = []
#     for i in range(0,100):
#         cids.append(i)
#         teachers.append(random.randint(0, 39)%40)
#         if random.randint(0, 10)>5:
#             campus.append("紫金港")
#         else:
#             campus.append("玉泉")
#     return cids,names,teachers,campus


# def prepare_name():
#     firstname = first_names
#     lastname = last_names
#     names = []
#     tid = []
#     for i in range(40):
#         tid.append(i)
#         name = random.choice(firstname) + random.choice(lastname)
#         names.append(name)
#     return tid,names

# def prepare_classroom():
#     number = 20
#     ss = "教学楼"
#     rid = []
#     rname = []
#     campus = []
#     capacity = []
#     for i in range(0,number):
#         rid.append(i)
#         rname.append(ss+str(i%5)+" "+str(i%7+1) + "0" + str(i%9+1))
#         campus.append(random.randint(0, 10) % 2)
#         a = random.randint(50,100)
#         a = a - a%10
#         capacity.append(a)
#     return rid,rname,campus,capacity


# 排课
# schedule_ids,class_ids,times,classrooms,teachers = schedule_course(course_num,classroom_num,courses)
# data = []
# mycollection = mydb["schedule_res"]
# for i in range(0, course_num):
#     item = {}
#     item["schedule_id"] = schedule_ids[i]
#     item["class_id"] = class_ids[i]
#     item["time"] = times[i]
#     item["classroom"] = classrooms[i]
#     item["teacher"] = teachers[i]
#     data.append(item)
# mycollection.insert_many(data)

# 课程
# cids,names,teachers,campus = prepare_info()
# data = []
# for i in range(0,len(cids)):
#     item = {}
#     item["class_id"] = cids[i]
#     item["class_name"] = names[i]
#     item["teacher_id"] = teachers[i]
#     item["campus_id"] = campus[i]
#     data.append(item)
# print(data)
# mycollection.insert_many(data)

# 教师
# tid,tname = prepare_name()
# data = []
# for i in range(0,40):
#     item = {}
#     item["teacher_id"] = tid[i]
#     item["teacher_name"] = tname[i]
#     data.append(item)
# mycollection.insert_many(data)

# 教室
# def prepare_classroom():
#     number = 20
#     ss = "教学楼"
#     items = ["投影仪","空调","激光笔","录像设备"]
#     rid = []
#     rname = []
#     campus = []
#     capacity = []
#     equipment = []
#     for i in range(0,number):
#         rid.append(i)
#         rname.append(ss+str(i%5+1)+" "+str(i%7+1) + "0" + str(i%9+1))
#         campus.append(random.randint(0, 10) % 2)
#         a = random.randint(50,100)
#         a = a - a%10
#         capacity.append(a)
#         eq = ["黑板"]
#         eq.append(items[i%4])
#         equipment.append(eq)
#     return rid,rname,campus,capacity,equipment