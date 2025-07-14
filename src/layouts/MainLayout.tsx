import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column'}}>
            <Header />
            <main>
                <Outlet /> {/* 라우팅되는 페이지가 여기에 들어감 */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
