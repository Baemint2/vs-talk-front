import logo from '@/assets/logo2.png'
import {useNavigate} from "react-router-dom";
import { Search } from 'lucide-react';

const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="text-white h-20" style={{backgroundColor: '#F9FAFB'}}>
            <div className="flex justify-between items-center">
                <img src={logo}
                     alt="logo"
                     className="w-16 h-16 mt-2 ml-2 rounded-xl"
                     onClick={() => navigate('/')}/>
                <Search size={30} className={"text-black"}/>
            </div>
        </header>
    );
};

export default Header;
