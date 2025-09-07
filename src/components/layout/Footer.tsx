import {useNavigate} from "react-router-dom";
import {CirclePlus, House, AlignJustify} from "lucide-react";
import UserMenu from "@/components/layout/UserMenu.tsx";

interface FooterProps {
    onMenuClick: () => void;
    role: string | undefined;
    isAuthenticated: boolean;
}

const Footer = ({onMenuClick, role, isAuthenticated}: FooterProps) => {
    const navigate = useNavigate();

    const addPost = () => {
        navigate('/post/add');
    }

    return (
        <footer
            className="
            fixed bottom-0 w-full bg-gray-800 text-white
            h-[calc(70px+env(safe-area-inset-bottom))]   // 높이를 더 크게 조정
            pt-2                                         // 상단 패딩 증가
            pb-[calc(8px+env(safe-area-inset-bottom))]   // 하단 여유 공간 추가
            supports-[padding:max(0px)]:pb-[max(8px,env(safe-area-inset-bottom))]
          "
        >
            <div className="flex items-center justify-between text-lg h-[56px] px-4">
                <span onClick={onMenuClick} className="cursor-pointer p-2">
                    <AlignJustify/>
                </span>
                <span className="cursor-pointer p-2">
                    <House size={30}
                           onClick={() => navigate('/')}
                    />
                </span>
                {role === 'ADMIN' ? <span onClick={addPost} className="cursor-pointer p-2">
                    <CirclePlus size={30}/>
                </span> : null}
                {isAuthenticated ? (
                    role !== 'ADMIN' ? <UserMenu/> : null
                ) : (
                    <span onClick={() => navigate("/login")} className="cursor-pointer p-2">로그인</span>
                )}
            </div>
        </footer>
    );
};

export default Footer;