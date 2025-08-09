// Post.tsx 업데이트 제안
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, Heart } from "lucide-react";
import {timeAgo} from "@/util/Time.ts";

interface PostProps {
    id: number;
    title: string;
    author: string;
    videoId?: string;
    updatedAt: string;
    commentCount?: number;
    likeCount?: number;
    thumbnail?: string;
    categoryName: string;
}

const Post = ({ id, title, videoId, updatedAt, commentCount = 0, likeCount = 0, categoryName }: PostProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/post/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
            {/* 썸네일 (있을 경우) */}
            {videoId && (
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt="YouTube Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
            )}

            <div className="p-4">
                {/* 제목 */}
                <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                    [{categoryName}] {title}
                </h3>

                {/* 메타 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{timeAgo(updatedAt)}</span>
                    </div>
                </div>

                {/* 상호작용 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;