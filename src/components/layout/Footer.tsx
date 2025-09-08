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

    const goHome = () => {
        if (location.pathname === '/') {
            // 현재 홈 페이지에 있다면 새로고침
            window.scrollTo(0, 0);
        } else {
            // 다른 페이지에 있다면 홈으로 이동
            navigate('/');
        }
    }

    return (
        <footer
            className="
            fixed bottom-0 w-full bg-gray-800 text-white
            h-[calc(70px+env(safe-area-inset-bottom))]
            pt-2
            pb-[calc(8px+env(safe-area-inset-bottom))]
            supports-[padding:max(0px)]:pb-[max(8px,env(safe-area-inset-bottom))]
          "
        >
            <div className="flex items-center justify-between text-lg h-[56px] px-4">
                <span onClick={onMenuClick} className="cursor-pointer p-2">
                    <AlignJustify/>
                </span>
                <span className="cursor-pointer p-2" onClick={goHome}>
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