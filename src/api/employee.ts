import $api from "./index";

interface EmployeeType {
    employeeID:Number,
    name:String,
}

export const addEmployee = (data:any)=>{
    return $api.post('/employee/add',data)
}