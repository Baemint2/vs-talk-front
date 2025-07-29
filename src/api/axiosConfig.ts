import axios from 'axios';

const getBaseURL = () => {
    // Vite 환경변수 사용
    const envURL = import.meta.env.VITE_API_BASE_URL;

    if (envURL) {
        return envURL;
    }

    if (import.meta.env.DEV) {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return `http://${hostname}:8080`;
        }
    }

    return 'http://localhost:8080';
};


const api = axios.create({
    baseURL: getBaseURL(), // 백엔드 서버 주소
    withCredentials: true, // 쿠키를 자동으로 포함
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
    },
});

// 요청 인터셉터 - 모든 요청에 쿠키가 자동으로 포함됨
api.interceptors.request.use(
    (config) => {
        console.log('요청 보내는 중:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('인증 실패 - 로그인 페이지로 이동');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;