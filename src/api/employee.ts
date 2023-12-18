import $api from "./index";

interface EmployeeType {
    employeeID:Number,
    name:String,
}

export const addEmployee = (data:EmployeeType)=>{
    return $api.post('/employee/add',data)
}

export const getMaxEmployeeID = ()=>{
    return $api.get('/employee/maxID')
}