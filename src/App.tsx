// src/App.tsx
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail.tsx';
import MainLayout from '@/layouts/MainLayout';
import Login from './pages/Login';
import AdminLogin from "@/pages/admin/AdminLogin.tsx";
import Admin from './pages/admin/Admin.tsx';
import {UserProvider} from "@/store/UserContext.tsx";
import CategoryManage from "@/pages/admin/CategoryManage.tsx";
import PostManage from "@/pages/admin/PostManage.tsx";
import EditPost from "@/components/post/EditPost.tsx";
import { Toaster } from 'sonner';
import ExcelUpload from "@/components/post/ExcelUpload.tsx";

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
                path: 'category/:slug',
                element: <Home/>
            },
            {
                path: 'admin/categories',
                element: <CategoryManage/>
            },
            {
                path: 'admin/posts',
                element: <PostManage orderBy={'desc'}/>
            },
            {
                path: 'admin/excel-upload',
                element: <ExcelUpload />
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
                path: '/post/update/:id',
                element: <EditPost/>
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
        <Toaster
            position="top-center"
            richColors
            toastOptions={{
                style: {
                    top: '40vh', // 뷰포트 높이의 40% 지점
                }
            }}
        />
    </UserProvider>;
}

export default App;