import {useNavigate} from "react-router-dom";
import {User, BottleWine, Utensils, Vote, Trophy, Tag} from 'lucide-react';
import {type JSX } from "react";
import {useCategories} from "@/hooks/useCategories.tsx";



interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const categoryIcons: Record<string, JSX.Element> = {
    '스포츠': <Trophy size={20}/>,
    '연예인': <User size={20}/>,
    '정치': <Vote size={20}/>,
    '음식': <Utensils size={20}/>,
    '주류': <BottleWine size={20}/>,
};

const Sidebar = ({isOpen, onClose}: SidebarProps) => {
    const {categories} = useCategories();
    const navigate = useNavigate();

    // isLoggedIn 상태 변경 감지
    const handleCategoryClick = (slug: string) => {
        navigate(`/category/${slug}`);
        onClose();
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
                                {categories.map(category => (
                                    <li key={category.id}
                                        onClick={() => handleCategoryClick(category.slug)}
                                        className="cursor-pointer hover:bg-gray-100 p-2"
                                    >
                                         <span
                                             className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                                             {categoryIcons[category.name] || <Tag size={20} />}
                                             {category.name}
                                         </span>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;