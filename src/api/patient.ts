import $api from "./index";

interface PatientType{
    id:Number
    patientType:string
    name:string
    consultationProject:string
    acceptancePerson:string
}

export const addPatient = (data:PatientType)=>{
    return $api.post('/patient/add',data)
}

export const getMaxPatientID = ()=>{
    return $api.get('/patient/maxID')
}