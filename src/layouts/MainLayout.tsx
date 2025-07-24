import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from "../components/Sidebar.tsx";
import {useState} from "react";

const MainLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname.startsWith("/login");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column'}}>
            <Header onMenuClick={toggleSidebar}  />
            <main className={`${isLoginPage ? 'login' : 'full'} flex-1 pb-30`}>
            <Outlet /> {/* 라우팅되는 페이지가 여기에 들어감 */}
            </main>
            <Footer/>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </div>
    );
};

export default MainLayout;
