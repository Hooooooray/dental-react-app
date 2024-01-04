import $api from "./index";

export const login = (data:any)=>{
    return $api.post('/login',data)
}

export const verify = ()=>{
    return $api.post('/verify')
}