import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import {Outlet, useLocation} from 'react-router-dom';
import UserSidebar from "../components/UserSidebar.tsx";
import {useState} from "react";
import ScrollToTop from '@/components/ScrollToTop.ts';
import AdminSidebar from "@/components/AdminSidebar.tsx";
import {useUser} from "@/components/UserContext.tsx";

const MainLayout = () => {
    const { isAuthenticated, user } = useUser(); //

    const location = useLocation();
    const isLoginPage = location.pathname.startsWith("/login");

    const [openSidebar, setOpenSidebar] = useState<"admin" | "user" | null>(null);
    const toggleAdminSidebar = () => {
        setOpenSidebar((prev) => (prev === "admin" ? null : "admin"));
    };

    const toggleUserSidebar = () => {
        setOpenSidebar((prev) => (prev === "user" ? null : "user"));
    };

    const closeAdminSidebar = () => setOpenSidebar((prev) => (prev === "admin" ? null : prev));
    const closeUserSidebar = () => setOpenSidebar((prev) => (prev === "user" ? null : prev));

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Header onMenuClick={toggleAdminSidebar} role={user?.role}/>
            <main className={`${isLoginPage ? 'login' : 'full'} flex-1 pb-30`}>
                <ScrollToTop/>
                <Outlet/>   {/* 라우팅되는 페이지가 여기에 들어감 */}
            </main>
            <Footer onMenuClick={toggleUserSidebar} role={user?.role} isAuthenticated={isAuthenticated}/>

            <AdminSidebar isOpen={openSidebar === "admin"} onClose={closeAdminSidebar} />
            <UserSidebar isOpen={openSidebar === "user"} onClose={closeUserSidebar} />

        </div>
    );
};

export default MainLayout;
