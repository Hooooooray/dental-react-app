import $api from "./index";

interface AppointmentType {

}

export const addAppointment = (data: AppointmentType) => {
    return $api.post('/appointment/add', data)
}

export const getAppointments = (startTime?: any, endTime?: any) => {
    return $api.get('/appointments', {params: {startTime, endTime}})
}

