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
    const [videoId] = useState<string>('');
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetailData | null>(null);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!id) {
                setError('게시글 ID가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/post/get/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('게시글 상세 정보 가져오기 실패:', error);
                setError('게시글을 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]); // id가 변경될 때마다 다시 실행

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                const response = await api.get(`/api/post/get`);
                console.log(response.data);
                setPosts(response.data);
                // 상태 업데이트 등 필요한 작업 수행
            } catch (error) {
                console.error('게시글 목록 가져오기 실패:', error);
            }
        };
        fetchPostList();
    }, [])


    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        event.target.pauseVideo();
    }
    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
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


    return <>
        <div className="pb-20 mt-10">
            <div className={"flex flex-col items-center gap-4"}>
                <div>제목</div>
                {videoId === '' ? (<div></div>) :
                    (<YouTube
                        videoId={videoId}
                        opts={opts}
                        onReady={onPlayerReady}
                        className="flex justify-center"/>)
                }
                <Vote voteId="1" title="123" options={post.voteOptionList || []} isEditing={false} onDelete={() => {}} onUpdate={() => {}}/>
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
