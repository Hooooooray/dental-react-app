// 创建 action 创建器，返回适当的 action 对象
export const updatePermissions = (newPermissions: number[]) => ({
    type: 'UPDATE_PERMISSIONS',
    payload: newPermissions,
});
export const openDrawer = () => {
    return {
        type: 'OPEN_DRAWER'
    };
};

export const closeDrawer = () => {
    return {
        type: 'CLOSE_DRAWER'
    };
};