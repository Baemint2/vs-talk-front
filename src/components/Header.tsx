import logo from '@/assets/logo2.png'
import {useNavigate} from "react-router-dom";
import {AlignJustify} from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({onMenuClick}: HeaderProps) => {

    const navigate = useNavigate();

    return (
        <header className="text-white h-20 border-b-2 border-b-gray-300" style={{backgroundColor: '#F9FAFB'}}>
            <div className="flex justify-between items-center">
                <img src={logo}
                     alt="logo"
                     className="w-16 h-16 mt-2 rounded-xl"
                     onClick={() => navigate('/')}/>
                <span onClick={onMenuClick}>
                    <AlignJustify size={30} className={"text-black mr-5"}/>
                </span>
            </div>
        </header>
    );
};

export default Header;
