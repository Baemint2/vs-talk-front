import {X, Users, BarChart3, Settings, Shield, MessageSquare, Tag, LogOut} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {useUser} from "@/store/UserContext.tsx";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar = ({isOpen, onClose}: AdminSidebarProps) => {
    const navigate = useNavigate();
    const { logout } = useUser();

    const menuItems = [
        {
            icon: <BarChart3 size={20}/>,
            label: '대시보드',
            path: '/admin/dashboard'
        },
        {
            icon: <Users size={20}/>,
            label: '사용자 관리',
            path: '/admin/users'
        },
        {
            icon: <MessageSquare size={20}/>,
            label: '게시글 관리',
            path: '/admin/posts'
        },
        {
            icon: <Tag size={20}/>,
            label: '카테고리 관리',
            path: '/admin/categories'
        },
        {
            icon: <Shield size={20}/>,
            label: '신고 관리',
            path: '/admin/reports'
        },
        {
            icon: <Settings size={20}/>,
            label: '엑셀 업로드',
            path: '/admin/excel-upload'
        },
    ];

    const handleItemClick = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* 배경 오버레이 */}
            {isOpen && (
                <div
                    className="fixed inset-0"
                    onClick={onClose}
                />
            )}

            {/* 사이드바 */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center gap-2">
                        <Shield className="text-red-600" size={24}/>
                        <h2 className="text-lg font-bold text-red-700">관리자 메뉴</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* 메뉴 항목들 */}
                <div className="p-4">
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item.path)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group"
                            >
                                <span className="text-gray-600 group-hover:text-red-600">
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group"
                                onClick={() => {
                                    onClose();
                                    logout();
                                }}
                        >
                            <span className="text-gray-600 group-hover:text-red-600">
                                    <LogOut />
                                </span>
                            <span className="font-medium">로그아웃</span>
                        </button>
                    </nav>
                </div>

                {/* 하단 정보 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        관리자 전용 메뉴입니다
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;