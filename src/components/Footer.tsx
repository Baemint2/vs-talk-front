import {useNavigate} from "react-router-dom";
import {CircleUser, CirclePlus, House, AlignJustify} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

interface FooterProps {
    onMenuClick: () => void;
}

const Footer = ({ onMenuClick }: FooterProps) => {
    const { isAuthenticated, loading } = useAuth();

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
                <span onClick={addPost}>
                    <CirclePlus size={30}/>
                </span>
                {!isAuthenticated ?
                    (<span
                        className="m-4 flex items-center"
                        onClick={() => navigate('/login')}
                    >로그인</span>) :
                    (<span>
                    <CircleUser size={30}/>
                    </span>)
                }
            </div>
        </footer>
    );
};

export default Footer;