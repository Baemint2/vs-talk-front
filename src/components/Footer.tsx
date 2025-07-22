import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {CircleUser, CirclePlus} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const Footer = () => {
    const { isAuthenticated, loading } = useAuth();

    const navigate = useNavigate();

    const addPost = () => {
        navigate('/post/add');
    }
    if (loading) return <div>Loading...</div>;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 h-20 z-50">
            <div className="flex items-center justify-between text-lg">

                <span>1</span>
                <span>2</span>
                <span onClick={addPost}> <CirclePlus size={40}/></span>
                {!isAuthenticated ?
                    (<span
                        className="m-4 flex items-center"
                        onClick={() => navigate('/login')}
                    >로그인</span>) :
                    (<span>
                    <CircleUser size={40}/>
                    </span>)
                }
            </div>
        </footer>
    );
};

export default Footer;