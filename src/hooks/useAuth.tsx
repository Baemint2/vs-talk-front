// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

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

    return { isAuthenticated, loading, checkAuthStatus, logout };
};