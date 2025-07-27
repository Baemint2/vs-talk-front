import {Link} from "react-router-dom";
import {User, Settings, LogOut} from 'lucide-react';
import {useEffect, useState} from "react";
import {useUser} from "@/components/UserContext.tsx";
import {useAuth} from "@/hooks/useAuth.tsx";
import api from "@/api/axiosConfig.ts";

interface IUserInfo {
    profile?: string;
    username: string;
    email: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({isOpen, onClose}: SidebarProps) => {
    const [, setUserInfo] = useState<IUserInfo | null>(null);
    const {setUser} = useUser();
    const {isAuthenticated, logout} = useAuth();

    // isLoggedIn 상태 변경 감지
    useEffect(() => {
        console.log("로그인 상태 변경됨:", isAuthenticated);
        if (isAuthenticated) {
            getUserInfo();
        }
    }, [isAuthenticated]);

    const getUserInfo = async () => {
        try {
            const response = await api.get("/api/v1/userInfo");

            setUser(response.data);
            setUserInfo(response.data);
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    return (
        <>
            {/* 오버레이 - 배경 클릭시 사이드바 닫기 */}
            {isOpen && (
                <div
                    className="fixed inset-0"
                    onClick={onClose}
                />
            )}

            <aside>
                <div className="sidebar">
                    <div
                        className={`fixed top-0 right-0 h-full ${isOpen ? 'w-64' : 'w-0'} bg-white shadow-lg overflow-hidden transition-all duration-300 z-50`}
                        id="sidebar">

                        {/* 메뉴 리스트 */}
                        <nav className="p-4">
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/myPage"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                                        onClick={onClose}
                                    >
                                        <User size={20}/>
                                        <span>마이 페이지</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                                        onClick={onClose}
                                    >
                                        <Settings size={20}/>
                                        <span>설정</span>
                                    </Link>
                                </li>
                                {isAuthenticated ? (
                                    <li>
                                    <span id="logout"
                                          className="block px-4 py-2 hover:bg-gray-700"
                                          onClick={() => logout()}>
                                        <div className="flex flex-row">
                                            <LogOut/>
                                            <span className="ml-5"> 로그아웃 </span>
                                        </div>
                                    </span>
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/Login" id="login"
                                                  className="block px-4 py-2 hover:bg-gray-700">로그인</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>

                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;