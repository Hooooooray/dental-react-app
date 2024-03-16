import $api from "./index";
import data from "china-area-data/v5/data";

export const getShifts = () => {
    return $api.get('/shifts')
}

interface shiftType {
    id?: number
    name: string,
    startTime: string,
    endTime: string
}

interface deleteShiftType {
    id: number
}

export const addShift = (data: shiftType) => {
    return $api.post('/shift/add', data)
}

export const deleteShift = (data: deleteShiftType) => {
    return $api.post('/shift/delete', data)
}

export const editShift = (data: shiftType) => {
    return $api.post('shift/edit', data)
}