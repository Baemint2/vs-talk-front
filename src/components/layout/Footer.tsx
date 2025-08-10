import {useNavigate} from "react-router-dom";
import {CirclePlus, House, AlignJustify} from "lucide-react";
import UserMenu from "@/components/layout/UserMenu.tsx";

interface FooterProps {
    onMenuClick: () => void;
    role: string | undefined;
    isAuthenticated: boolean;
}

const Footer = ({ onMenuClick, role, isAuthenticated}: FooterProps) => {
    const navigate = useNavigate();

    const addPost = () => {
        navigate('/post/add');
    }

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 h-13 z-50">
            <div className="flex items-center justify-between text-lg h-full">
                <span onClick={onMenuClick}>
                    <AlignJustify />
                </span>
                <span>
                    <House size={30}
                           onClick={() => navigate('/')}
                    />
                </span>
                { role === 'ADMIN' ? <span onClick={addPost}>
                    <CirclePlus size={30}/>
                </span> : null }
                {isAuthenticated ? (
                    role !== 'ADMIN' ? <UserMenu /> : null
                ) : (
                    <span onClick={() => navigate("/login")}>로그인</span>
                )}
            </div>
        </footer>
    );
};

export default Footer;