import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/UserContext.tsx";
import api from "@/api/axiosConfig.ts";

interface IUserInfo {
    profile?: string;
    username: string;
    email: string;
}

export const useAuth = () => {
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const { setUser } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userReady, setUserReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            getUserInfo();
        } else {
            setUser(null);
            setUserInfo(null);
            setUserReady(false);
        }
    }, [isAuthenticated]);

    const checkAuthStatus = async () => {
        try {
            await api.get("/v1/loginCheck");
            setIsAuthenticated(true);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsAuthenticated(false);
            } else {
                console.error("Auth check failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/v1/userInfo");

            if (response.status === 200) {
                setUser(response.data);
                setUserInfo(response.data);
                setUserReady(true);
            } else {
                setUserReady(false);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
            }
            console.error("유저 정보 조회 실패:", error);
            setUserReady(false);
        }
    };

    const logout = async () => {
        console.log("로그아웃 호출");
        try {
            await api.post("/v1/logout");
        } catch (e) {
            console.error("로그아웃 API 실패", e);
        } finally {
            setUser(null);
            setUserInfo(null);
            setIsAuthenticated(false);
            setUserReady(false);

            // ✅ 홈으로 이동
            navigate("/", { replace: true });
        }
    };

    return {
        isAuthenticated,
        loading,
        userReady,
        checkAuthStatus,
        logout,
        userInfo,
    };
};
