import { useParams, useNavigate } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Vote from "@/components/vote/Vote.tsx";
import Comment from "@/pages/Comment.tsx";
import Post from "@/components/post/Post.tsx";
import api from "@/api/axiosConfig.ts";
import type {PostProps} from "@/props/PostProps.tsx";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";
import LazyYouTube from "@/components/LazyYoutube.tsx";
import VoteChart from "@/components/vote/VoteCharts.tsx";

interface PostDetailData {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    videoId?: string;
    voteOptionList: VoteOption[];
    voteEnabled: boolean;
    voteEndTime: string;
}

export interface VoteCount { voteOptionId: number; count: number; }

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetailData | null>(null);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [counts, setCounts] = useState<VoteCount[]>([]);
    const [countLoading, setCountLoading] = useState(false);

    const fetchVoteCount = useCallback(async () => {
        setCountLoading(true);
        try {
            const { data } = await api.get(`votes/count/${id}`);
            console.log(data);
            setCounts(Array.isArray(data) ? data : (data ? [data] : []));
        } finally {
            setCountLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchVoteCount(); }, [fetchVoteCount]);

    const handleVote = async (optionId: number | string) => {
        if (!post) return;
        try {
            await api.post(`votes`, {
                optionId,
                postId: post.id,
            });
            await fetchVoteCount(); // ← 투표 성공 후 카운트만 갱신
        } catch (e) {
            console.error('투표 실패:', e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('게시글 ID가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                const postResponse = await api.get(`posts/${id}`);
                setPost(postResponse.data);

                const postsResponse = await api.get(`posts`);
                const filteredPosts = postsResponse.data.filter((postItem: { id: number; }) => postItem.id !== Number(id));
                setPosts(filteredPosts);

            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
                setError('데이터를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p>{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-2 py-6">
                <div className="bg-white rounded-lg shadow-sm border mb-8">
                    <div className="p-3 flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>

                        {post.videoId && post.videoId !== '' && (
                            <div className="mb-6">
                                <LazyYouTube videoId={post.videoId} width="300px" height="300px" />
                            </div>
                        )}

                        <VoteChart
                            options={post.voteOptionList}
                            counts={counts}
                            loading={countLoading}
                        />

                        {/* 투표 옵션 */}
                        <Vote
                            options={post.voteOptionList || []}
                            postId={post.id}
                            counts={counts}                 // ← 같은 데이터 공유
                            isEditing={false}
                            onVote={handleVote}
                            voteEnabled={post.voteEnabled}
                            voteEndTime={post.voteEndTime}
                            onUpdateOption={() => {}}
                            onRemoveOption={() => {}}
                            onAddOption={() => {}}
                        />
                    </div>
                </div>

                <Comment postId={post.id}/>
            </div>

            {/* 관련 게시글 */}
            <div className="bg-white border-t">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">다른 게시글</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.slice(0, 6).map(post => (
                            <Post
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                author={post.author}
                                updatedAt={post.updatedAt}
                                commentCount={post.commentCount}
                                categoryName={post.categoryName}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;