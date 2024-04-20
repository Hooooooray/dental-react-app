import $api from "./index";

interface CategoryType{
    id?:number,
    name?:string,
    parentId?:number
}

export const getCategories = () => {
    return $api.get('/categories', )
}

export const addCategory = (data:CategoryType)=>{
    return $api.post('/category/add',data)
}

export const deleteCategory = (data:CategoryType)=>{
    return $api.post('/category/delete',data)
}