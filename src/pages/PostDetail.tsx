// PostDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import YouTube, {type YouTubeProps} from "react-youtube";
import Vote from "@/components/vote/Vote.tsx";
import Comment from "@/pages/Comment.tsx";
import Post from "@/components/post/Post.tsx";
import api from "@/api/axiosConfig.ts";
import type {PostProps} from "@/props/PostProps.tsx";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";

interface PostDetailData {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    videoId?: string;
    voteOptionList: VoteOption[];
    // 기타 필요한 필드들
}

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetailData | null>(null);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('게시글 ID가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                // 1. 게시글 상세 정보 가져오기
                const postResponse = await api.get(`/api/post/get/${id}`);
                console.log(postResponse.data);
                setPost(postResponse.data);

                // 2. 게시글 목록 가져오기 및 현재 게시글 제외
                const postsResponse = await api.get(`/api/post/get`);
                const filteredPosts = postsResponse.data.filter((postItem: { id: number; }) => postItem.id !== Number(id));
                console.log(filteredPosts);
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

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        event.target.pauseVideo();
    }
    const opts: YouTubeProps['opts'] = {
        width: '100%',
        height: '250',
        // playerVars: {
        //     autoplay: 1,
        // },
    };

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

    const handleVote = async (optionId: number | string) => {
        if (!post) return;

        try {
            // 서버에 투표 요청
            await api.post(`/api/vote/add`, {
                optionId: optionId,
                postId: post.id,
                userId: id,
            });


        } catch (error) {
            console.error('투표 실패:', error);
            // 에러 처리 (토스트 메시지 등)
        }
    };

    return <>
        <div className="pb-20 mt-10">
            <div className={"flex flex-col items-center gap-4"}>
                <div>{post.title}</div>
                {post.videoId === '' ? (<div></div>) :
                    (
                        <YouTube
                        videoId={post.videoId}
                        opts={opts}
                        onReady={onPlayerReady}
                        className="flex justify-center"/>)
                }
                <Vote options={post.voteOptionList || []}
                      postId={post.id}
                      isEditing={false}
                      onVote={handleVote}
                />
                <Comment/>
            </div>
            <div className={"border-t"}>
                {posts.map(post => (
                    <Post id={post.id}
                          key={post.id}
                          title={post.title}
                          author={post.author}
                          updatedAt={post.updatedAt}
                    />))}
            </div>
        </div>
    </>
};

export default PostDetail;
