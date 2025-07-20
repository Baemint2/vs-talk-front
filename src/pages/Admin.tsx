import {type FormEvent, useState} from "react";
import YouTube, {type YouTubeProps} from 'react-youtube';
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx"
import CategoryList from "@/api/category/CategoryList.tsx";

// Admin.tsx
const Admin = () => {
    const [showInput, setShowInput] = useState(true);
    const [videoId, setVideoId] = useState<string>('');
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('');

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        event.target.pauseVideo();
    }
    const opts: YouTubeProps['opts'] = {
        playerVars: {
            autoplay: 1,
        },
    };

    const handleVideoSubmit = () => {
        if (inputValue.trim()) {
            setVideoId(inputValue);
            setOpen(false);
            setShowInput(false);
        }
    }

    const addVideoId = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const videoId = formData.get('videoId') as string;

        console.log('입력된 Video ID:', videoId);

        setVideoId(videoId);
    }

    const removeVideoId = () => {
        setVideoId('');
        setShowInput(true);
    }


    return <>
        <div className={"flex flex-col items-center gap-4 mt-10"}>
            {showInput ?
                (<form onSubmit={addVideoId}>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setOpen(true)}
                                    className="border-2 border-solid border-gray-300 text-2xl"
                                    style={{height: '390px', width: '640px'}}>
                                영상 추가하기
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>비디오 ID 입력하기</DialogTitle>
                                <Input
                                    name="videoId"
                                    onChange={(e) => setInputValue(e.target.value)}
                                    type="text"
                                    placeholder="video url을 입력해주세요"/>
                            </DialogHeader>
                            <Button onClick={() => handleVideoSubmit()}
                                    className="border-2 border-solid border-gray-300">
                                입력
                            </Button>
                        </DialogContent>
                    </Dialog>
                </form>) : null
            }
            {videoId === '' ? null :
                (<div className="w-full max-w-4xl video-responsive gap-4">
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            onReady={onPlayerReady}
                            className="flex justify-center"/>
                    </div>
                )
            }

            {/* 버튼 영역을 항상 렌더링하되 조건부로 표시/숨김 */}
            <div className="flex flex-row items-center justify-center h-10 mt-4">
                {videoId !== '' && (
                    <>
                        <Button>수정</Button>
                        <Button onClick={() => removeVideoId()}>삭제</Button>
                    </>
                )}
            </div>

            <Button
                type="submit"
                variant="outline"
                className="bg-black text-white"
            >
                투표 추가하기
            </Button>

            <div>
                <CategoryList />
            </div>
            <div className={"border border-solid border-gray-300 bg-gray-300 p-3 mt-5"}>
                <span>게시글 등록하기</span>
            </div>
        </div>
    </>
};

export default Admin;
