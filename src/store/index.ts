import {createStore} from 'redux';
import SecureLS from "secure-ls";

export interface AppState {
    permissions: number[];
    patientOpen: boolean
}


// 定义 action 类型
type AppAction =
    | { type: 'UPDATE_PERMISSIONS'; payload: number[] }
    | { type: 'OPEN_DRAWER' }
    | { type: 'CLOSE_DRAWER' };

const ls = new SecureLS({encodingType: 'aes'});

const savedPermissions = ls.get('permissions');
console.log(savedPermissions)
const initialPermissions = savedPermissions ? savedPermissions : [0];

// 创建 reducer
const reducer = (state: AppState = {
    permissions: initialPermissions || [0],
    patientOpen: false
}, action: AppAction): AppState => {
    switch (action.type) {
        case 'UPDATE_PERMISSIONS':
            return {
                ...state,
                permissions: action.payload,
            };
        case 'OPEN_DRAWER':
            return { ...state, patientOpen: true };
        case 'CLOSE_DRAWER':
            return { ...state, patientOpen: false };
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
