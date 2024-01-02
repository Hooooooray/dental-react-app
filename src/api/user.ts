import $api from "./index";

export const login = (data:any)=>{
    return $api.post('/login',data)
}