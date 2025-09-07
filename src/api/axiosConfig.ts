import axios from 'axios';

const getBaseURL = () => {
    if (window.location.hostname === "localhost") {
        return "/api"; // PC 개발환경 → Proxy 사용
    }
    return import.meta.env.VITE_API_BASE_URL;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (config.url?.startsWith("/")) {
        config.url = config.url.substring(1); // 슬래시 제거 후 baseURL과 결합
    }
    return config;
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 400) {
            return Promise.resolve(err.response);
        }
        return Promise.reject(err);
    }
);

export default api;