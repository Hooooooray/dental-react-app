import $api from "./index";
import {retry} from "@reduxjs/toolkit/query";

export const addItem = (data: any) => {
    return $api.post('/item/add', data)
}

export const getItems = (categoryId?: number) => {
    return $api.get('/items', {params: {categoryId}})
}

export const deleteItem = (id: number) => {
    return $api.post('/item/delete', {id})
}

export const editItem = (data: any) => {
    return $api.post('/item/edit', data)
}