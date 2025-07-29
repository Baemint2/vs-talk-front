import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import {Outlet, useLocation} from 'react-router-dom';
import UserSidebar from "../components/UserSidebar.tsx";
import {useState} from "react";
import ScrollToTop from '@/components/ScrollToTop.ts';
import AdminSidebar from "@/components/AdminSidebar.tsx";

const MainLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname.startsWith("/login");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    const toggleAdminSidebar = () => {
        setIsAdminSidebarOpen(!isAdminSidebarOpen);
    };

    const toggleUserSidebar = () => {
        setIsUserSidebarOpen(!isUserSidebarOpen);
    };

    const closeAdminSidebar = () => {
        setIsAdminSidebarOpen(false);
    };

    const closeUserSidebar = () => {
        setIsUserSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Header onMenuClick={toggleAdminSidebar}/>
            <main className={`${isLoginPage ? 'login' : 'full'} flex-1 pb-30`}>
                <ScrollToTop/>
                <Outlet/> {/* 라우팅되는 페이지가 여기에 들어감 */}
            </main>
            <Footer onMenuClick={toggleUserSidebar}/>

            <AdminSidebar
                isOpen={isAdminSidebarOpen}
                onClose={closeAdminSidebar}
            />

            <UserSidebar
                isOpen={isUserSidebarOpen}
                onClose={closeUserSidebar}
            />

        </div>
    );
};

export default MainLayout;
