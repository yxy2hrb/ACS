import copy

local_db_schedule_res = []
local_db_courses = []
local_db_campus = []
local_db_teacher = []
local_db_classrooms = []
local_db_time_slots = []

def get_local_db():
    return local_db_schedule_res, local_db_courses, local_db_campus, local_db_teacher, local_db_classrooms, local_db_time_slots

def update_local_db(schedule_res, courses, campus, teacher, classrooms, time_slots):
    global local_db_schedule_res, local_db_courses, local_db_campus, local_db_teacher, local_db_classrooms, local_db_time_slots
    local_db_schedule_res = copy.deepcopy(schedule_res)
    local_db_courses = copy.deepcopy(courses)
    local_db_campus = copy.deepcopy(campus)
    local_db_teacher = copy.deepcopy(teacher)
    local_db_classrooms = copy.deepcopy(classrooms)
    local_db_time_slots = copy.deepcopy(time_slots)