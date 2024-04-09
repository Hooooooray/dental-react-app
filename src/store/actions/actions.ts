// 创建 action 创建器，返回适当的 action 对象
export const updatePermissions = (newPermissions: number[]) => ({
    type: 'UPDATE_PERMISSIONS',
    payload: newPermissions,
});
export const openPatientDrawer = () => {
    return {
        type: 'OPEN_PATIENT_DRAWER'
    };
};

export const closePatientDrawer = () => {
    return {
        type: 'CLOSE_PATIENT_DRAWER'
    };
};

export const setPatientEditOn = () => {
    return {
        type: 'SET_PATIENT_EDIT_ON'
    }
}

export const setPatientEditClose = () => {
    return {
        type: 'SET_PATIENT_EDIT_CLOSE'
    }
}


export const setPatientObj = (obj: any) => {
    return {
        type: 'SET_PATIENT_OBJ',
        payload: obj
    }
}

export const renderPatient = () => {
    return {
        type: 'RENDER_PATIENT'
    }
}

export const renderAppointment = () => {
    return {
        type: 'RENDER_APPOINTMENT'
    }
}