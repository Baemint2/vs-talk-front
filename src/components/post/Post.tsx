import {useNavigate} from "react-router-dom";

import type {PostProps} from "@/props/PostProps.tsx";


const Post = ({ id, title, author, updatedAt }: PostProps) => {
    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/post/${id}`);
    };

    return <div className="flex flex-col items-center gap-4"
                onClick={handlePostClick}>
        <div className="flex flex-row items-center w-10/12 h-25 mt-5 ml-4 pr-4 bg-amber-100 rounded-2xl">
            <div className="mr-4">
                <span className="flex flex-row items-center justify-center w-20">썸네일</span>
            </div>
            <div className="flex flex-col flex-1 justify-between">
                <span className="font-medium mb-5">{title}</span>
                <div className="flex justify-between space-x-2">
                    <span className="text-sm">{author}</span>
                    <span className="text-sm">{updatedAt}</span>
                </div>
            </div>
        </div>
    </div>
}

export default Post