import logo from '../assets/logo2.png'
import Post from "@/components/post/Post.tsx";
import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import api from "@/api/axiosConfig.ts";
import type {PostProps} from "@/props/PostProps.tsx";

// Home.tsx
const Home = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                const response = await api.get(`/api/post/get`);
                console.log(response.data);
                setPosts(response.data);
                // 상태 업데이트 등 필요한 작업 수행
            } catch (error) {
                console.error('게시글 목록 가져오기 실패:', error);
            }
        };
        fetchPostList();
    }, [])

    return <>
        <div className="flex flex-col items-center gap-4">
            <div className={"flex flex-col items-center gap-4 mt-10"}>
                <img src={logo} alt="logo" className="w-16 h-16 mt-2 ml-2 rounded-xl"/>
            </div>
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