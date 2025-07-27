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
import Vote from "@/components/vote/Vote.tsx";
import api from "@/api/axiosConfig.ts";
import {useUser} from "@/components/UserContext.tsx";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";

interface VoteData {
    id: number;
    title: string;
    createdAt: Date;
    options: VoteOption[];
}

// Admin.tsx
const Admin = () => {
    const { user } = useUser();
    const [showInput, setShowInput] = useState(true);
    const [videoId, setVideoId] = useState<string>('');
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [title, setTitle] = useState('');
    const [votes, setVotes] = useState<VoteData[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

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

    // 투표 추가
    const createVote = () => {
        const newVote: VoteData = {
            id: Date.now().toString() as unknown as number,
            title: '123',
            createdAt: new Date(),
            options: [
                { id: 1, optionText: '옵션 1', votes: 0 },
                { id: 2, optionText: '옵션 2', votes: 0 }
            ],
        };
        setVotes([...votes, newVote]);
        console.log('새 투표 생성:', newVote.id);
    }

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    const addPost = async () => {
        console.log('게시글을 등록합니다.')
        const postCreate = {
            title: title,
            categoryId : selectedCategoryId,
            videoId : videoId,
            isSecret: false,
            isDeleted: false,
            voteEnabled: true,
            voteOptions: votes.flatMap(vote => vote.options.map(option => ({
                optionText: option.optionText,
                color: '#FBBF24'
            }))),
            username: user?.username
        }

        const response = await api.post('/api/post/create', postCreate);

        console.log(response)
    }

    return <>
        <div className={"flex flex-col items-center gap-4 mt-10"}>
            <Input onChange={(e) => setTitle(e.target.value)}/>
            {showInput ?
                (<form onSubmit={addVideoId}>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setOpen(true)}
                                    className="border-2 border-solid border-gray-300 text-2xl"
                                    style={{height: '390px', width: '430px'}}>
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

            {votes.length === 0 ? (
                <Button
                    variant="outline"
                    className="bg-black text-white"
                    onClick={() => createVote()}
                >
                    투표 추가하기
                </Button>
            ) : (<div className="w-full max-w-4xl">
                    {votes.map((vote) => (
                        <Vote
                            key={vote.id}
                            options={vote.options}
                            isEditing={true}
                            onVote={() => {}}
                        />
                    ))}
                </div>
            )}

            <div>
                <CategoryList
                    value={selectedCategoryId || undefined}
                    onChange={handleCategoryChange}
                />
            </div>
            <div className={"border border-solid border-gray-300 bg-gray-300 mt-5"}>
                <Button onClick={() => addPost()}> 게시글 등록하기 </Button>
            </div>
        </div>
    </>
};

export default Admin;
