import $api from "./index";

export const getDoctorShifts = (page?: number, pageSize?: number, position?: string) => {
    return $api.get('/doctorShifts', {params: {page, pageSize, position}})
}

interface DoctorShiftOperation {
    employeeId: number;
    shiftId: number;
    week: string; // 假设这里使用数字数组表示星期
}

export const batchAddOrEditDoctorShifts = (data: DoctorShiftOperation[]) => {
    return $api.post('/doctorShift/addOrEdit', data)
}