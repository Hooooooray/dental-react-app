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

export const getPatient = (page: number, pageSize: number, id?: string, name?: string, phone?: string) => {
    return $api.get('/patients', {params: {page, pageSize, id, name, phone}})
}

export const deletePatient = (id: number) => {
    return $api.post('patient/delete', {id})
}
