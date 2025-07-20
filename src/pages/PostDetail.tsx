// PostDetail.tsx
import {useState} from "react";
import YouTube, {type YouTubeProps} from "react-youtube";
import Vote from "@/components/vote/Vote.tsx";
import Comment from "@/pages/Comment.tsx";
import Post from "@/components/post/Post.tsx";

const PostDetail = () => {
    const [videoId] = useState<string>('');

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
                <Vote/>
                <Comment/>
            </div>
            <div className={"border-t"}>
                <Post id={1}/>
            </div>
        </div>
    </>
};

export default PostDetail;
