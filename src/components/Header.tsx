import logo from '@/assets/logo2.png'

const Header = () => {
    return (
        <header className="bg-gray-800 text-white h-20">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <img src={logo} alt="logo" className="w-16 h-16 mt-2 ml-2 rounded-xl"/>
                <span className="mt-2 mr-2">로그인 영역</span>
            </div>
        </header>
    );
};

export default Header;
