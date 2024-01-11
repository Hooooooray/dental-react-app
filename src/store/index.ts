import {createStore} from 'redux';
import SecureLS from "secure-ls";

export interface AppState {
    permissions: number[];
    patientOpen: boolean;
    isPatientEdit: boolean;
    patientObj: object;
    renderPatient: number;
}


// 定义 action 类型
type AppAction =
    | { type: 'UPDATE_PERMISSIONS'; payload: number[] }
    | { type: 'OPEN_PATIENT_DRAWER' }
    | { type: 'CLOSE_PATIENT_DRAWER' }
    | { type: 'SET_PATIENT_EDIT_ON' }
    | { type: 'SET_PATIENT_EDIT_CLOSE' }
    | { type: 'SET_PATIENT_OBJ'; payload: object }
    | { type: 'RENDER_PATIENT' }

const ls = new SecureLS({encodingType: 'aes'});

const savedPermissions = ls.get('permissions');
const initialPermissions = savedPermissions ? savedPermissions : [0];

// 创建 reducer
const reducer = (state: AppState = {
    permissions: initialPermissions || [0],
    patientOpen: false,
    isPatientEdit: false,
    patientObj: {},
    renderPatient: 1,
}, action: AppAction): AppState => {
    switch (action.type) {
        case 'UPDATE_PERMISSIONS':
            return {...state, permissions: action.payload,};
        case 'OPEN_PATIENT_DRAWER':
            return {...state, patientOpen: true};
        case 'CLOSE_PATIENT_DRAWER':
            return {...state, patientOpen: false};
        case 'SET_PATIENT_EDIT_ON':
            return {...state, isPatientEdit: true};
        case 'SET_PATIENT_EDIT_CLOSE':
            return {...state, isPatientEdit: false}
        case 'SET_PATIENT_OBJ':
            return {...state, patientObj: action.payload}
        case 'RENDER_PATIENT':
            return {...state, renderPatient: state.renderPatient+1}
        // 处理其他 action 类型或默认情况
        default:
            return state;
    }
};

// 创建 store
const store = createStore(reducer);

// 订阅 state 的变化
store.subscribe(() => {
    const state = store.getState();
    ls.set('permissions', state.permissions);
});


export default store;
