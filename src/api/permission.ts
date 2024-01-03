import $api from "./index";

export const getPermissions = () => {
    return $api.get('/permissions')
}
