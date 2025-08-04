import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import PostForm, {type PostData, type VoteData } from "@/components/post/PostForm";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<PostData | null>(null);


    useEffect(() => {
        (async () => {
            const res = await api.get(`/posts/${id}`);

            const transformedVotes: VoteData[] = [
                {
                    id: Date.now(), // 단일 투표 ID (서버에 여러 투표가 있다면 map 필요)
                    options: res.data.voteOptionList.map((opt: any) => ({
                        id: opt.id,
                        optionText: opt.optionText,
                        color: opt.color,
                        votes: opt.votes ?? 0, // votes가 없으면 기본값 0
                    })),
                },
            ];

            setInitialData({
                title: res.data.title,
                videoId: res.data.videoId,
                categoryId: res.data.categoryId,
                votes: transformedVotes, // 서버 응답 구조에 맞춰 변환 필요
            });
        })();
    }, [id]);

    const handleUpdatePost = async (data: PostData) => {
        console.log("서버로 전송할 데이터:", data);

        await api.put(`/posts/${id}`, {
            ...data,
            voteOptions: data.votes.flatMap(vote =>
                vote.options.map(option => ({
                    id: option.id > 1000000000000 ? null : option.id,
                    optionText: option.optionText,
                    color: option.color ?? "#FBBF24",
                }))
            ),
        });

        navigate(`/post/${id}`);
    };


    if (!initialData) return <div>로딩 중...</div>;

    return <PostForm mode="edit" initialData={initialData} onSubmit={handleUpdatePost} />;
}
