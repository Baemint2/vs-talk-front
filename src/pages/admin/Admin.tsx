import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig.ts";
import PostForm, {type PostData } from "@/components/post/PostForm.tsx";

export default function Admin() {
    const navigate = useNavigate();

    const handleCreatePost = async (data: PostData) => {
        try {
            const response = await api.post("/posts", {
                ...data,
                isSecret: false,
                isDeleted: false,
                voteEnabled: true,
                voteOptions: data.votes.flatMap(vote => vote.options.map(option => ({
                    optionText: option.optionText,
                    color: "#FBBF24",
                }))),
            });

            // 2xx일 때만 여기 실행
            navigate(`/post/${response.data.data}`);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (error.response?.status === 401) {
                alert("로그인이 필요합니다.");
                // 필요시 로그인 페이지로 리다이렉트
                // navigate("/login");
            } else {
                console.error("게시글 등록 실패", error);
            }
        }

    };

    return <PostForm mode="create" onSubmit={handleCreatePost} />;
}
