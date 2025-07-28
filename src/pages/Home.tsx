import logo from '../assets/logo2.png'
import Post from "@/components/post/Post.tsx";
import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import api from "@/api/axiosConfig.ts";
import type {PostProps} from "@/props/PostProps.tsx";
import {useLocation, useParams} from "react-router-dom";
import {useCategories} from "@/hooks/useCategories.tsx";

// Home.tsx
const Home = () => {
    const location = useLocation();
    const params = useParams();
    const { categories } = useCategories();
    const [posts, setPosts] = useState<PostProps[]>([]);

    const isCategoryPage = location.pathname.startsWith('/category/');
    const slug = params.slug;
    const currentCategory = categories.find(cat => cat.slug === slug);

    console.log(slug);

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                let apiUrl = '/api/post/get';

                // 카테고리 페이지라면 카테고리별 API 호출
                if (isCategoryPage && slug) {
                    apiUrl = `/api/post/get/category/${slug}`;
                }

                const response = await api.get(apiUrl);
                console.log(response.data);
                setPosts(response.data);
                // 상태 업데이트 등 필요한 작업 수행
            } catch (error) {
                console.error('게시글 목록 가져오기 실패:', error);
            }
        };
        fetchPostList();
    }, [isCategoryPage, slug])

    return <>
        <div className="flex flex-col items-center gap-4">
            {!isCategoryPage && <div className={"flex flex-col items-center gap-4 mt-10"}>
                <img src={logo} alt="logo" className="w-16 h-16 mt-2 ml-2 rounded-xl"/>
            </div>}
            {isCategoryPage && currentCategory && (
                <h2 className="text-2xl font-bold">{currentCategory.name}</h2>
            )}
            <div className="flex items-center justify-center w-8/12 mt-5 bg-amber-100 rounded-2xl">
                <input
                    className="flex-1 h-8 px-4 py-2 bg-transparent outline-none rounded-2xl"
                    placeholder="Search"
                />
                <button
                    className="pr-3 hover:bg-amber-200 p-2 rounded-r-2xl transition-colors"
                    type="button"
                >
                    <Search size={16} className="text-gray-600"/>
                </button>
            </div>
        </div>
        {posts.map(post => (
                <Post id={post.id}
                      key={post.id}
                      title={post.title}
                      author={post.author}
                      updatedAt={post.updatedAt}
                />))}
    </>
};

export default Home;