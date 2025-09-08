import { useParams, useNavigate } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Vote from "@/components/vote/Vote.tsx";
import CommentSection from "@/components/comments/CommentSection.tsx";
import Post from "@/components/post/Post.tsx";
import api from "@/api/axiosConfig.ts";
import type {PostProps} from "@/props/PostProps.tsx";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";
import LazyYouTube from "@/components/common/LazyYoutube.tsx";
import VoteChart from "@/components/vote/VoteCharts.tsx";
import ShareButton from "@/components/common/ShareButton";
import {useUser} from "@/store/UserContext.tsx";
import { Button } from "@/components/ui/button";
import {Clock} from "lucide-react";
import {toast} from "sonner";

interface PostDetailData {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    videoId?: string;
    categoryId?: number;
    voteOptionList: VoteOption[];
    voteEnabled: boolean;
    voteEndTime: string;
}

export interface VoteCount { voteOptionId: number; count: number; }

const PostDetail = () => {

    const { user } = useUser();
    const isAdmin = user?.role === 'ADMIN'; // 관리자 권한 체크

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
            setCounts(Array.isArray(data) ? data : (data ? [data] : []));
        } finally {
            setCountLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchVoteCount(); }, [fetchVoteCount]);

    const handleExtendVote = async () => {
        try {
            await api.put(`/posts/${id}/extend-vote`);

            toast.success('투표가 7일 연장되었습니다!');

            // 데이터 다시 불러오기
            const postResponse = await api.get(`posts/${id}`);
            setPost(postResponse.data.data);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('투표 연장에 실패했습니다.');
        }
    };

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
                setPost(postResponse.data.data);

                const postsResponse = await api.get(`posts`);
                const filteredPosts = postsResponse.data.content.filter((postItem: { id: number; }) => postItem.id !== Number(id));
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

    const isVoteExpired = post && post.voteEndTime &&
        new Date(post.voteEndTime) < new Date();

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

                        {/* 투표 상태 & 관리자 액션 */}
                        <div className="w-full mb-4 flex justify-between items-center">
                            {/* ✅ 관리자만 볼 수 있는 연장 버튼 */}
                            {isAdmin && isVoteExpired && (
                                <Button
                                    onClick={handleExtendVote}
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    투표 연장
                                </Button>
                            )}
                        </div>

                        {/* 투표 옵션 */}
                        <Vote
                            options={post.voteOptionList || []}
                            postId={post.id}
                            categoryId={post.categoryId}
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
                    <div className="fixed bottom-20 right-4 z-10">
                        <ShareButton
                            url={`${window.location.origin}/post/${post.id}`}
                            title={post.title}
                            variant="floating" // 둥근 버튼 스타일
                        />
                    </div>
                </div>

                <CommentSection postId={post.id}/>
            </div>

            {/* 관련 게시글 */}
            <div className="bg-white border-t">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">다른 게시글</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <Post
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                author={post.author}
                                createdAt={post.createdAt}
                                voteEndTime={post.voteEndTime}
                                commentCount={post.commentCount}
                                categoryName={post.categoryName}
                                voteEnabled={post.voteEnabled}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;