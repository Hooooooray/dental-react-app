import $api from "./index";

export const getTotal = ()=>{
    return $api.get('/total')
}