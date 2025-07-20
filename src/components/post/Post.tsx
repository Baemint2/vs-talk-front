import {useNavigate} from "react-router-dom";

// Props 인터페이스 정의
interface PostProps {
    id: number;
    // 다른 필요한 props들 추가
    title?: string;
    author?: string;
    timestamp?: string;
}

const Post = ({ id, title, author, timestamp }: PostProps) => {
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
                <span className="font-medium mb-5">제목</span>
                <div className="flex justify-between space-x-2">
                    <span className="text-sm">작성자</span>
                    <span className="text-sm">시간</span>
                </div>
            </div>
        </div>
    </div>
}

export default Post