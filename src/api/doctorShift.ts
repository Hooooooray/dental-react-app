import $api from "./index";

export const getDoctorShifts = () => {
    return $api.get('/doctorShifts')
}

interface DoctorShiftOperation {
    employeeId: number;
    shiftId: number;
    week: string; // 假设这里使用数字数组表示星期
}

export const batchAddOrEditDoctorShifts = (data: DoctorShiftOperation[]) => {
    return $api.post('/doctorShift/addOrEdit', data)
}