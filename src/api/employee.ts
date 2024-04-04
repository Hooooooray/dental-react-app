import $api from "./index";

interface EmployeeType {
    id: Number,
    name: String,
}

export const addEmployee = (data: EmployeeType) => {
    return $api.post('/employee/add', data)
}

export const editEmployee = (data: EmployeeType) => {
    return $api.post('/employee/edit', data)
}

export const deleteEmployee = (id: number) => {
    return $api.post('employee/delete', {id})
}

export const getMaxEmployeeID = () => {
    return $api.get('/employee/maxID')
}

export const getEmployee = (id: number) => {
    return $api.get('/employee', {params: {id}});
}

export const getEmployees = (page?: number, pageSize?: number, position?: string, keyword?: string) => {
    return $api.get('/employees', {params: {page, pageSize, position, keyword}})
}

export const searchEmployees = (keyword: string) => {
    return $api.get('/searchEmployees', {params: {keyword}})
}