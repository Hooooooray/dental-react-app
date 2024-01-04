import $api from "./index";

interface RoleType {
    roleName: String,
}

export const addRole = (data: RoleType) => {
    return $api.post('/role/add', data)
}
export const getRoles = (page: number, pageSize: number) => {
    return $api.get('/roles', {params: {page, pageSize}})
}

export const getRole = (id: number) => {
    return $api.get('/role', {params: {id}})
}

export const deleteRole = (id: number) => {
    return $api.post('/role/delete', {id})
}

export const modifyPermission = (id: number, permissions: string) => {
    return $api.post('/role/modifyPermission',{id,permissions})
}

