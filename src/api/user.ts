import $api from "./index";

export const findByEmployee = (data:any) =>{
    return $api.post('/findByEmployee',data)
}

export const getSms = (data:any)=>{
    return $api.post('/sms',data)
}

export const register = (data:any)=>{
    return $api.post('/register',data)
}

export const editUser = (data:any)=>{
    return $api.post('/user/edit',data)
}

export const login = (data:any)=>{
    return $api.post('/login',data)
}

export const smsLogin = (data:any)=>{
    return $api.post('/smsLogin',data)
}

export const verifyRole = ()=>{
    return $api.post('/verifyRole')
}

export const verifyUser = () =>{
    return $api.post('/verifyUser')
}