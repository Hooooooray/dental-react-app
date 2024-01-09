import $api from "./index";

export const login = (data:any)=>{
    return $api.post('/login',data)
}

export const verifyRole = ()=>{
    return $api.post('/verifyRole')
}

export const verifyUser = () =>{
    return $api.post('/verifyUser')
}