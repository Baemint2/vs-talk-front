import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import PostForm, { type PostData, type VoteData } from "@/components/post/PostForm";
import { toast } from "sonner"

export default function EditPost() {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<PostData | null>(null);
    const [removedOptionIds, setRemovedOptionIds] = useState<number[]>([]); // ✅ 삭제된 옵션 ID 추적

    useEffect(() => {
        (async () => {
            const res = await api.get(`/posts/${id}`);
            const data = res.data.data;
            const transformedVotes: VoteData[] = [
                {
                    id: Date.now(),
                    options: data.voteOptionList.map((opt: { id: string; optionText: string; color: string; votes: number; }) => ({
                        id: opt.id,
                        optionText: opt.optionText,
                        color: opt.color,
                        votes: opt.votes ?? 0,
                    })),
                },
            ];
            setInitialData({
                title: data.title,
                videoId: data.videoId,
                categoryId: data.categoryId,
                votes: transformedVotes,
                voteEndTime: data.voteEndTime,
            });
        })();
    }, [id]);

    const handleRemoveOption = (optionId: number) => {
        setRemovedOptionIds(prev => [...prev, optionId]);
    };

    const handleUpdatePost = async (data: PostData) => {

        try {
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
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.response?.data);
        }


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
