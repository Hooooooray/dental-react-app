import $api from "./index";

interface RegistrationType {
    id: Number,
    patientId:Number,
    employeeId:Number,
    visitingType:string,
}

export const getMaxRegistrationID = () => {
    return $api.get('/registration/maxID')
}

export const addRegistration = (data: RegistrationType) => {
    return $api.post('/registration/add', data)
}