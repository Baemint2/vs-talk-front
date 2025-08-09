import {useNavigate} from "react-router-dom";
import {CirclePlus, House, AlignJustify} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import {useUser} from "@/components/UserContext.tsx";
import UserMenu from "@/components/UserMenu.tsx";

interface FooterProps {
    onMenuClick: () => void;
}

const Footer = ({ onMenuClick }: FooterProps) => {
    const { isAuthenticated, loading } = useAuth();
    const { user } = useUser();

    const navigate = useNavigate();

    const addPost = () => {
        navigate('/post/add');
    }

    if (loading) return <div>Loading...</div>;

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
                { user?.role === 'ADMIN' ? <span onClick={addPost}>
                    <CirclePlus size={30}/>
                </span> : null }
                {isAuthenticated ? (
                    user?.role !== 'ADMIN' ? <UserMenu /> : null
                ) : (
                    <span onClick={() => navigate("/login")}>로그인</span>
                )}

            </div>
        </footer>
    );
};

export default Footer;