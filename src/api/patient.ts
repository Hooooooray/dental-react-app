import $api from "./index";

interface PatientType {
    id: Number
    patientType: string
    name: string
    consultationProject: string
    acceptancePerson: string
}

export const addPatient = (data: PatientType) => {
    return $api.post('/patient/add', data)
}

export const getMaxPatientID = () => {
    return $api.get('/patient/maxID')
}

export const getPatient = (id: number) => {
    return $api.get('/patient', {params: {id}});
}

export const getPatients = (page: number, pageSize: number, id?: string, name?: string,
                            phone?: string, idCardNo?: string, isTodayOnly?: boolean,
                            sortColumn?: string, sortOrder?: string | undefined) => {
    return $api.get('/patients', {
        params: {
            page,
            pageSize,
            id,
            name,
            phone,
            idCardNo,
            isTodayOnly,
            sortColumn,
            sortOrder
        }
    })
}

export const searchPatients = (keyword:string) =>{
    return $api.get('/searchPatients',{params:{keyword}})
}

export const editPatient = (data: PatientType) => {
    return $api.post('/patient/edit', data)
}

export const deletePatient = (id: number) => {
    return $api.post('patient/delete', {id})
}
