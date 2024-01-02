import $api from "./index";

export const getPermission = () => {
    return $api.get('/permission')
}
