// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {useUser} from "@/components/UserContext.tsx";
import api from "@/api/axiosConfig.ts";

interface IUserInfo {
    profile?: string;
    username: string;
    email: string;
}

export const useAuth = () => {
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const {setUser} = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userReady, setUserReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        console.log("로그인 상태 변경됨:", isAuthenticated);
        if (isAuthenticated) {
            getUserInfo();
        }
    }, [isAuthenticated]);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch("/api/v1/loginCheck");
            const data = await response.json();
            setIsAuthenticated(Boolean(data));
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/api/v1/userInfo");

            setUser(response.data);
            setUserInfo(response.data);
            setUserReady(true); // 사용자 정보 로드 완료
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
            setUserReady(false);
        }
    };

    const logout = async () => {
        console.log("로그아웃 호출");
        const response = await fetch("/api/v1/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.text();
        console.log(data);
        if (data === "로그아웃 성공") {
            setIsAuthenticated(false);
            navigate("/");
        }
    }

    return { isAuthenticated, loading, userReady, checkAuthStatus, logout, userInfo };
};