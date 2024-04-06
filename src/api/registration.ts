import $api from "./index";

interface RegistrationType {
    id: Number,
    patientId: Number,
    employeeId: Number,
    visitingType: string,
}

export const getMaxRegistrationID = () => {
    return $api.get('/registration/maxID')
}

export const addRegistration = (data: RegistrationType) => {
    return $api.post('/registration/add', data)
}

export const getRegistrations = (page?: number, pageSize?: number, startTime?: any, endTime?: any, visitingType?: string, status?: string, patientQuery?: string, doctorQuery?: string) => {
    return $api.get('/registrations', {
        params: {
            page,
            pageSize,
            startTime,
            endTime,
            visitingType,
            status,
            patientQuery,
            doctorQuery
        }
    })
}

export const editRegistration = (data:any)=>{
    return $api.post('/registration/edit',data)
}