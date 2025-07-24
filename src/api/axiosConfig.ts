// api/axiosConfig.ts (새 파일 생성)
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버 주소
    withCredentials: true, // 쿠키를 자동으로 포함
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