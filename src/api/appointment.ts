import $api from "./index";

interface AppointmentType {

}

export const addAppointment = (data: AppointmentType) => {
    return $api.post('/appointment/add', data)
}

export const getAppointments = (startTime?: any, endTime?: any, service?: any, status?: any, patientId?: any, employeeId?: any, page?: any, pageSize?: any) => {
    return $api.get('/appointments', {
        params: {
            startTime,
            endTime,
            service,
            status,
            patientId,
            employeeId,
            page,
            pageSize
        }
    })
}

