import $api from "./index";

interface AppointmentType {

}

export const addAppointment = (data:AppointmentType)=>{
    return $api.post('/appointment/add',data)
}