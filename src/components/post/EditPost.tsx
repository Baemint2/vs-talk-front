import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import PostForm, { type PostData, type VoteData } from "@/components/post/PostForm";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<PostData | null>(null);
    const [removedOptionIds, setRemovedOptionIds] = useState<number[]>([]); // ✅ 삭제된 옵션 ID 추적

    useEffect(() => {
        (async () => {
            const res = await api.get(`/posts/${id}`);
            const transformedVotes: VoteData[] = [
                {
                    id: Date.now(),
                    options: res.data.voteOptionList.map((opt: any) => ({
                        id: opt.id,
                        optionText: opt.optionText,
                        color: opt.color,
                        votes: opt.votes ?? 0,
                    })),
                },
            ];
            setInitialData({
                title: res.data.title,
                videoId: res.data.videoId,
                categoryId: res.data.categoryId,
                votes: transformedVotes,
                voteEndTime: res.data.voteEndTime,
            });
        })();
    }, [id]);

    /** ✅ 옵션 삭제 이벤트 핸들러 (PostForm에서 호출) */
    const handleRemoveOption = (optionId: number) => {
        setRemovedOptionIds(prev => [...prev, optionId]);
    };

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
            removedOptionIds, // ✅ 서버에 삭제할 ID 목록 전달
        });

        // ✅ 서버에 삭제 요청 따로 호출하고 싶으면:
        for (const optionId of removedOptionIds) {
            await api.delete(`/votes/option/${optionId}`);
        }

        navigate(`/post/${id}`);
    };

    if (!initialData) return <div>로딩 중...</div>;

    return (
        <PostForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleUpdatePost}
            onRemoveOption={handleRemoveOption} // ✅ PostForm에서 삭제된 옵션을 부모에게 전달
        />
    );
}
