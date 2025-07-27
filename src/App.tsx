// src/App.tsx
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail.tsx';
import MainLayout from '@/layouts/MainLayout';
import Login from './pages/Login';
import AdminLogin from "@/pages/AdminLogin.tsx";
import Admin from './pages/Admin';
import {UserProvider} from "@/components/UserContext.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'post/:id',
                element: <PostDetail/>
            },
            {
                path: '/post/add',
                element: <Admin/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'login/admin',
                element: <AdminLogin/>
            }
            // 다른 라우트들...
        ]
    }
]);

function App() {
    return <UserProvider>
            <RouterProvider router={router}/>
          </UserProvider>;
}

export default App;