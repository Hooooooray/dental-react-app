import $api from "./index";

export const getMaxRegistrationID = () => {
    return $api.get('/registration/maxID')
}