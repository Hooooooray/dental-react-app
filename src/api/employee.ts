import $api from "./index";

interface EmployeeType {
    employeeID: Number,
    name: String,
}

export const addEmployee = (data: EmployeeType) => {
    return $api.post('/employee/add', data)
}

export const editEmployee = (data: EmployeeType) => {
    return $api.post('/employee/edit', data)
}

export const deleteEmployee = (employeeID: number) => {
    return $api.post('employee/delete', {employeeID})
}

export const getMaxEmployeeID = () => {
    return $api.get('/employee/maxID')
}

export const getEmployee = (employeeID: number) => {
    return $api.get('/employee', {params: {employeeID}});
}

export const getEmployees = () => {
    return $api.get('/employees')
}