from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS, cross_origin
from genetic import schedule_interface
import copy
import threading
import time

app = Flask(__name__)
cors = CORS(app)


uri = "mongodb+srv://3210102495:Gw7GaKXlOuMWQ1bf@cluster0.pheotiv.mongodb.net/"
client = MongoClient(uri)

# 在应用启动时下载所有数据
database = client['scheduling_course']
schedule_res_collection = database['schedule_res']
courses_collection = database['courses']
campus_collection = database['campus']
teacher_collection = database['teacher']
classrooms_collection = database['classrooms']
time_slots_collection = database['time_slots']  # 新增

local_db_schedule_res = list(schedule_res_collection.find({}))
local_db_courses = list(courses_collection.find({}))
local_db_campus = list(campus_collection.find({}))
local_db_teacher = list(teacher_collection.find({}))
local_db_classrooms = list(classrooms_collection.find({}))
local_db_time_slots = list(time_slots_collection.find({}))  # 新增

# 创建一个锁
data_lock = threading.Lock()

# 启动一个新的后台线程，定期从数据库中获取更新的数据
def update_local_db():
    while True:
        with data_lock:  # 获取锁
            local_db_schedule_res[:] = list(schedule_res_collection.find({}))
            local_db_courses[:] = list(courses_collection.find({}))
            local_db_campus[:] = list(campus_collection.find({}))
            local_db_teacher[:] = list(teacher_collection.find({}))
            local_db_classrooms[:] = list(classrooms_collection.find({}))
            local_db_time_slots[:] = list(time_slots_collection.find({}))  # 新增
        print("Updated local database at", time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()))  # 打印更新时间
        time.sleep(60)  # 每60秒更新一次数据

update_thread = threading.Thread(target=update_local_db)
update_thread.start()

# 在后台下载排课表到本地
def update_local_schedule():
    global local_db_schedule_res  # 声明全局变量
    with data_lock:  # 获取锁
        local_db_schedule_res = list(schedule_res_collection.find({}))  # 从 MongoDB 更新本地数据

# 获取课室信息
@app.route('/api/classrooms', methods=['GET'])
def get_classrooms():
    try:
        classes = copy.deepcopy(local_db_classrooms)

        result = []  # 创建一个新的结果列表

        # 将设备数组转换为字符串，并删除 _id 字段
        for i in range(len(classes)):
            equipment = ', '.join(classes[i]['equipment'])
            del classes[i]['_id']  # 删除 _id 字段

            # 创建一个新的字典，并添加到结果列表中
            result.append({
                "id": classes[i]['classroom_id'],
                "name": classes[i]['classroom_name'],
                "campus_id": classes[i]['campus_id'],
                "capacity": classes[i]['capacity'],
                "equipment": equipment
            })

        return jsonify(result)  # 返回结果到前端
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify({"message": "An error occurred while trying to connect to MongoDB", "data": []}), 500
    

@app.route('/api/classrooms', methods=['POST'])
def create_classroom():
    try:
        # 从请求体中获取教室信息
        classroom_info = request.json

        # 查询 campus_id
        campus = next((item for item in local_db_campus if item["name"] == classroom_info['campus']), None)
        if campus is None:
            raise Exception('Campus not found')
        campus_id = campus['campus_id']

        # 自动生成 classroom_id
        classroom_id = len(local_db_classrooms)

        # 调整数据格式
        classroom_info = {
            'classroom_id': classroom_id,
            'classroom_name': classroom_info['classroomName'],
            'campus_id': campus_id,
            'capacity': classroom_info['capacity'],
            'equipment': classroom_info['equipment'],
        }

        # 检查是否已经存在具有相同 classroom_name 和 campus_id 的教室
        existing_classroom = next((item for item in local_db_classrooms if item["classroom_name"] == classroom_info['classroom_name'] and item["campus_id"] == campus_id), None)
        if existing_classroom is not None:
            # 如果 classroom_name 和 campus_id 都相同，拒绝插入新的教室
            return jsonify({"message": "Classroom with the same name and campus already exists. Insertion is denied.", "data": []}), 400
        else:
            # 插入新的教室
            result = classrooms_collection.insert_one(classroom_info)
            # 在后台更新本地数据库
            def update_local_db():
                with data_lock:  # 获取锁
                    # 从 MongoDB 获取新插入的教室的完整信息
                    new_classroom = classrooms_collection.find_one({'_id': result.inserted_id})
                    local_db_classrooms.append(new_classroom)
            threading.Thread(target=update_local_db).start()
            classroom_info.pop('_id', None)  # 删除 _id 字段
            return jsonify({"message": f"Successfully inserted item with _id: {str(result.inserted_id)}", "data": [classroom_info]}), 201
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify({"message": "An error occurred while trying to connect to MongoDB", "data": []}), 500
    
@app.route('/api/classrooms/<int:id>', methods=['DELETE'])
def delete_classroom(id):
    try:
        # 查询并删除教室
        result = classrooms_collection.delete_one({'classroom_id': id})

        if result.deleted_count == 0:
            # 如果没有删除任何教室，返回 404 状态码
            return jsonify({"message": f"No classroom found with id: {id}", "data": []}), 404
        else:
            # 如果成功删除教室，更新本地数据库
            with data_lock:  # 获取锁
                local_db_classrooms[:] = [d for d in local_db_classrooms if d.get('classroom_id') != id]
            # 在后台调用遗传算法重新排课
            threading.Thread(target=schedule_interface).start()
            
            # 在后台下载排课表到本地
            update_thread = threading.Thread(target=update_local_schedule)  # 创建新线程
            update_thread.start()  # 开始新线程
            
            return jsonify({"message": f"Successfully deleted classroom with id: {id}", "data": []}), 200
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify({"message": "An error occurred while trying to connect to MongoDB", "data": []}), 500


@app.route('/api/classrooms/<int:id>', methods=['PUT'])
def update_classroom(id):
    try:
        # 获取请求中的参数
        classroom_name = request.json.get('classroomName')
        campus_name = request.json.get('campus')
        equipment = request.json.get('equipment')

        # 从本地数据中用campus字段查询相应campus_id
        campus = next((item for item in local_db_campus if item["name"] == campus_name), None)
        if campus is None:
            return jsonify({"message": f"No campus found with name: {campus_name}", "data": []}), 404
        campus_id = campus['campus_id']

        # 构建更新的数据
        update_data = {}
        if classroom_name is not None:
            update_data['classroom_name'] = classroom_name
        if campus_id is not None:
            update_data['campus_id'] = campus_id
        if equipment is not None:
            update_data['equipment'] = equipment

        # 更新本地数据
        classroom = next((item for item in local_db_classrooms if item["classroom_id"] == id), None)
        if classroom is None:
            # 如果没有找到匹配的教室，返回 404 状态码
            return jsonify({"message": f"No classroom found with id: {id}", "data": []}), 404
        else:
            # 检查新的数据是否与现有的数据相同
            if classroom['classroom_name'] == classroom_name and classroom['campus_id'] == campus_id and classroom['equipment'] == equipment:
                return jsonify({"message": "The classroom information is already up to date", "data": []}), 400

            # 更新教室信息
            classrooms_collection.update_one({'classroom_id': id}, {'$set': update_data})
            # 在后台调用遗传算法重新排课
            threading.Thread(target=schedule_interface).start()
            
            # 更新本地数据
            def update_local_db():
                with data_lock:  # 获取锁
                    # 从 MongoDB 获取新插入的教室的完整信息
                    updated_classroom = classrooms_collection.find_one({'classroom_id': id})
                    index = next((index for (index, d) in enumerate(local_db_classrooms) if d["classroom_id"] == id), None)
                    local_db_classrooms[index] = updated_classroom
            threading.Thread(target=update_local_db).start()
            
            # 在后台下载排课表到本地
            update_thread = threading.Thread(target=update_local_schedule)  # 创建新线程
            update_thread.start()  # 开始新线程
            
            # 如果成功更新教室信息，返回 200 状态码
            return jsonify({"message": f"Successfully updated classroom with id: {id}", "data": []}), 200
    except Exception as e:
        print('An error occurred while trying to update classroom', e)
        return jsonify({"message": "An error occurred while trying to update classroom", "data": []}), 500

@app.route('/api/teacher/courses/<int:teacher_id>', methods=['GET'])
def get_courses(teacher_id):
    try:
        courses = [item for item in local_db_schedule_res if item['teacher'] == teacher_id]
        result = {"courses": []}

        for i in range(len(courses)):
            course = next((item for item in local_db_courses if item['class_id'] == courses[i]['class_id']), None)
            classroom = next((item for item in local_db_classrooms if item['classroom_id'] == courses[i]['classroom']), None)
            campus = next((item for item in local_db_campus if item['name'] == course['campus_id']), None) if course else None
            teacher = next((item for item in local_db_teacher if item['teacher_id'] == courses[i]['teacher']), None)
            time_slot = next((item for item in local_db_time_slots if item['time'] == courses[i]['time']), None)

            if None in [teacher, course, classroom, campus, time_slot]:
                continue

            result["courses"].append({
                "schedule_id": courses[i]['schedule_id'],
                "course_id": courses[i]['class_id'],
                "classroom_id": courses[i]['classroom'],
                "name": course['class_name'],
                "classroom": classroom['classroom_name'],
                "campus": campus['name'],
                "capacity": classroom['capacity'],
                "time_slot": time_slot['time_slot'],
            })

        return jsonify(result)  # 返回结果到前端

    except Exception as e:
        print('An error occurred while trying to get courses', e)
        return jsonify({"message": "An error occurred while trying to get courses", "data": []}), 500
    
@app.route('/api/teacher/change/time', methods=['POST'])
def change_teacher_time():
    data = request.get_json()
    schedule_id = data.get('schedule_id')
    target_time_slot = data.get('time_slot')

    # 从 time_slots 集合中查找对应的 time
    target_time = next((item['time'] for item in local_db_time_slots if item['time_slot'] == target_time_slot), None)

    if target_time is None:
        return jsonify({"success": False, "message": "Invalid time_slot."}), 400

    try:
        # 获取目标时间对应的所有课程
        target_courses = [item for item in local_db_schedule_res if item['time'] == target_time]

        # 获取这些课程的教室id
        target_classrooms = [course['classroom'] for course in target_courses]

        # 获取所有的教室
        all_classrooms = local_db_classrooms

        # 筛选出在目标时间没有被占用的教室
        available_classrooms = [classroom['classroom_id'] for classroom in all_classrooms if classroom['classroom_id'] not in target_classrooms]

        # 检查 available_classrooms 是否为空
        if len(available_classrooms) == 0:
            return jsonify({"success": False,"message":"No available classrooms."}), 200

        return jsonify({"success": True, "classrooms": available_classrooms}), 200
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify({"message": "An error occurred while trying to connect to MongoDB"}), 500

    
@app.route('/api/teacher/change/class', methods=['POST'])
def change_teacher_class():
    data = request.get_json()
    schedule_id = data.get('schedule_id')
    min_capacity = data.get('min_capacity')
    min_equip = data.get('min_equip')

    try:
        # 查找满足条件的教室
        available_classes = [c for c in local_db_classrooms if c['capacity'] >= min_capacity and all(equip in c['equipment'] for equip in min_equip)]

        # 获取当前课程的时间
        current_schedule = next((item for item in local_db_schedule_res if item['schedule_id'] == schedule_id), None)
        current_time = current_schedule.get('time') if current_schedule else None

        # 检查教室是否在该时间段被其他课程占用
        for c in available_classes[:]:
            classroom_id = c.get('classroom_id')
            if classroom_id is not None:
                classroom_schedule = next((item for item in local_db_schedule_res if item['classroom'] == classroom_id and item['time'] == current_time), None)
                if classroom_schedule is not None:
                    available_classes.remove(c)  # 如果教室在这个时间段被占用，那么从可用教室列表中移除这个教室

        available_classes_new = []
        for c in available_classes:
            new_c = c.copy()  # 创建一个新的字典
            new_c.pop('_id', None)  # 删除 _id 字段
         #   new_c.pop('classroom_name', None)  # 删除 classroom_name 字段
            new_c['class_id'] = new_c.pop('classroom_id', None)  # 将 'classroom_id' 改为 'class_id'
            available_classes_new.append(new_c)

        if len(available_classes_new) == 0:
            return jsonify({"success": False})  # 没有合适的教室
        else:
            return jsonify({"success": True, "classes": available_classes_new})  # 显示可切换的教室
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify({"message": "An error occurred while trying to connect to MongoDB"}), 500
    
        

@app.route('/api/change/schedule/time', methods=['POST'])
def change_schedule_time():
    data = request.json
    schedule_id = data['schedule_id']
    time_slot_id = data['time_slot']
    classroom_id = data['classroom_id']

    # 从 time_slots 集合中查找对应的时间字符串
    time_slot = next((item['time'] for item in local_db_time_slots if item['time_slot'] == time_slot_id), None)
    if time_slot is None:
        return jsonify(success=False, message="Time slot not found")  # Time slot not found

    try:
        # Check if the classroom is occupied at this time slot
        class_schedule = next((item for item in local_db_schedule_res if item['classroom'] == classroom_id and item['time'] == time_slot), None)
        if class_schedule is not None:
            return jsonify(success=False,message = "Classroom time conflict")  # Classroom time conflict

        # Update the schedule
        schedule = next((item for item in local_db_schedule_res if item['schedule_id'] == schedule_id), None)
        if schedule is not None:
            schedule['time'] = time_slot
            schedule['classroom'] = classroom_id
            schedule_res_collection.update_one({'schedule_id': schedule_id}, {'$set': {'time': time_slot, 'classroom': classroom_id}})  # Update MongoDB
            schedule.pop('_id', None)  # 删除 _id 字段
            return jsonify(success=True)  # Return the modified schedule item
        else:
            return jsonify(success=False, message="Schedule not found")  # Schedule not found
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify(message='An error occurred while trying to connect to MongoDB'), 500
    

@app.route('/api/change/schedule/classroom', methods=['POST'])
def change_schedule_classroom():
    data = request.get_json()
    schedule_id = data['schedule_id']
    classroom_id = data['classroom_id']

    # 从 classrooms 集合中查找对应的教室
    classroom = next((item for item in local_db_classrooms if item['classroom_id'] == classroom_id), None)
    if classroom is None:
        return jsonify(success=False, message="Classroom not found")  # Classroom not found

    try:
        # Check if the classroom is occupied at this time slot
        class_schedule = next((item for item in local_db_schedule_res if item['classroom'] == classroom['classroom_id'] and item['schedule_id'] == schedule_id), None)
        if class_schedule is not None:
            return jsonify(success=False,message="Classroom time conflict")  # Classroom time conflict

        # Update the schedule
        schedule = next((item for item in local_db_schedule_res if item['schedule_id'] == schedule_id), None)
        if schedule is not None:
            schedule['classroom'] = classroom['classroom_id']
            schedule_res_collection.update_one({'schedule_id': schedule_id}, {'$set': {'classroom': classroom['classroom_id']}})  # Update MongoDB
            schedule.pop('_id', None)  # 删除 _id 字段
            return jsonify(success=True)  # Return the modified schedule item
        else:
            return jsonify(success=False, message="Schedule not found")  # Schedule not found
    except Exception as e:
        print('An error occurred while trying to connect to MongoDB', e)
        return jsonify(message='An error occurred while trying to connect to MongoDB'), 500
    

@app.route('/api/reschedule', methods=['POST'])
def reschedule_classes():
    schedule_interface()
    local_db_schedule_res = list(schedule_res_collection.find({}))  # 从 MongoDB 更新本地数据
    schedule_res = local_db_schedule_res.copy()  # 使用本地数据

    result = {"schedules": []}

    for document in schedule_res:
        course = next((item for item in local_db_courses if item['class_id'] == document['class_id']), None)
        classroom = next((item for item in local_db_classrooms if item['classroom_id'] == document['classroom']), None)
        campus = next((item for item in local_db_campus if item['name'] == course['campus_id']), None) if course else None
        teacher = next((item for item in local_db_teacher if item['teacher_id'] == document['teacher']), None)
        time_slot = next((item for item in local_db_time_slots if item['time'] == document['time']), None)

        if None in [teacher, course, classroom, campus, time_slot]:
            continue

        result["schedules"].append({
            "Schedule_id": document['schedule_id'],
            "teacher": teacher['teacher_name'],
            "time_slot": time_slot['time'],
            "course": course['class_name'],
            "classroom": classroom['classroom_name'],
            "campus": campus['name'],
        })

    return jsonify(result)

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    local_db_schedule_res = list(schedule_res_collection.find({}))  # 从 MongoDB 更新本地数据
    schedule_res = local_db_schedule_res.copy()  # 使用本地数据

    result = {"schedules": []}

    for document in schedule_res:
        course = next((item for item in local_db_courses if item['class_id'] == document['class_id']), None)
        classroom = next((item for item in local_db_classrooms if item['classroom_id'] == document['classroom']), None)
        campus = next((item for item in local_db_campus if item['name'] == course['campus_id']), None) if course else None
        teacher = next((item for item in local_db_teacher if item['teacher_id'] == document['teacher']), None)
        time_slot = next((item for item in local_db_time_slots if item['time'] == document['time']), None)

        if None in [teacher, course, classroom, campus, time_slot]:
            continue

        result["schedules"].append({
            "Schedule_id": document['schedule_id'],
            "teacher": teacher['teacher_name'],
            "time_slot": time_slot['time'],
            "course": course['class_name'],
            "classroom": classroom['classroom_name'],
            "campus": campus['name'],
        })

    return jsonify(result)

@app.route('/')
def index():
    return 'Index Page'

if __name__ == '__main__':
    app.run(debug=True)

