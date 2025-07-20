
import { Link, useNavigate } from "react-router-dom";
import { X, User, Settings, LogOut, Home } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();

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
                                        <User size={20} />
                                        <span>마이 페이지</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                                        onClick={onClose}
                                    >
                                        <Settings size={20} />
                                        <span>설정</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;