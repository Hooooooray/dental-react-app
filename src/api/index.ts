import axios from "axios";

const $api = axios.create({
    baseURL: '/api'
})

// 请求拦截
$api.interceptors.request.use(config => {
    // 全局携带token
    const token = window.localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default $api;