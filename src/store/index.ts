import {createStore} from 'redux';

interface AppState {
    permissions: number[];
}

// 定义 action 类型
interface UpdatePermissionsAction {
    type: 'UPDATE_PERMISSIONS';
    payload: number[]; // 载荷，用于传递新的 permissions 数组
}

// 创建 reducer
const reducer = (state: AppState = {permissions: [0]}, action: UpdatePermissionsAction): AppState => {
    switch (action.type) {
        case 'UPDATE_PERMISSIONS':
            return {
                ...state,
                permissions: action.payload,
            };
        // 处理其他 action 类型或默认情况
        default:
            return state;
    }
};

// 创建 store
const store = createStore(reducer);

// 订阅 state 的变化
store.subscribe(() => {
    // console.log(store.getState());
});

export default store;
