import logo from '@/assets/logo2.png'
import {useNavigate} from "react-router-dom";
import { Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {

    const navigate = useNavigate();

    return (
        <header className="text-white h-20" style={{backgroundColor: '#F9FAFB'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <img src={logo}
                     alt="logo"
                     className="w-16 h-16 mt-2 ml-2 rounded-xl"
                     onClick={() => navigate('/')}/>
                <button
                    onClick={onMenuClick}
                    className="px-2 py-1 rounded"
                >
                    <Menu size={24} className="text-black" />
                </button>

            </div>
        </header>
    );
};

export default Header;
