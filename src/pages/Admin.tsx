import {type FormEvent, useState} from "react";
import YouTube, {type YouTubeProps } from 'react-youtube';
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx"


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
        height: '390',
        width: '640',
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

    return <>
        <div className={"flex flex-col items-center gap-4 mt-10"} style={{height: '100vh'}}>
            {showInput ?
                (<form onSubmit={addVideoId}>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}
                                className="border-2 border-solid border-gray-300 text-2xl"
                                style= {{height: '390px', width: '640px'}}>
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
                                placeholder={"Video Id를 입력해주세요."}/>
                        </DialogHeader>
                        <Button onClick={() => handleVideoSubmit()} className="border-2 border-solid border-gray-300">
                            입력
                        </Button>
                    </DialogContent>
                </Dialog>
            </form>) : null
            }
            { videoId === '' ? null :
                (<div>
                    <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    className="flex justify-center"/>
                    <Button>수정</Button>
                    <Button>삭제</Button>
                </div>
                )
            }

            <Button
                type="submit"
                variant="outline"
                className="bg-black text-white"
            >
                투표 추가하기
            </Button>

        </div>
    </>
};

export default Admin;
