import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import api from "@/api/axiosConfig.ts"; // axios 인스턴스 (withCredentials=true 등 설정된 것)

export interface IUser {
    id: number;
    username: string;
    email: string;
    nickname: string;
    role: string;
    profile?: string;
    providerKey?: string;
}

interface UserContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    refresh: () => Promise<void>;   // 상태/유저정보 재조회
    logout: () => Promise<void>;    // 로그아웃 + 상태 초기화
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const didFetch = useRef(false);

    const fetchAuthOnce = async () => {
        try {

            const check = await api.get("/v1/loginCheck", {
                validateStatus: (s) => s < 500,
            });

            const authed =
                check.status === 200
                    ? Boolean(check.data?.data)
                    : false;

            if (!authed) {
                setUser(null);
                return;
            }

            const info = await api.get("/v1/userInfo");
            setUser(info.data?.data ?? null);
        } catch {
            setUser(null);
        }
    };

    const refresh = async () => {
        setLoading(true);
        try {
            await fetchAuthOnce();
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/v1/logout", null, { validateStatus: (s) => s < 500 });
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        (async () => {
            await refresh();
        })();
    }, []);

    const value: UserContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        refresh,
        logout,
        setUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}