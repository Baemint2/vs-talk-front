import { useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import CategoryList from "@/api/category/CategoryList";
import Vote from "@/components/vote/Vote";
import type { VoteOption } from "@/props/VoteOptionProps";

export interface VoteData {
    id: number;
    options: VoteOption[];
}

export interface PostData {
    title: string;
    videoId: string;
    categoryId: number | null;
    votes: VoteData[];
}

interface PostFormProps {
    mode: "create" | "edit";
    initialData?: PostData;
    onSubmit: (data: PostData) => void;
}

export default function PostForm({ mode, initialData, onSubmit }: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [videoId, setVideoId] = useState(initialData?.videoId || "");
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const [votes, setVotes] = useState<VoteData[]>(initialData?.votes || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        initialData?.categoryId || null
    );

    const opts: YouTubeProps["opts"] = { width: "400", height: "300" };

    const extractYouTubeId = (url: string) => {
        const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleVideoSubmit = () => {
        const id = extractYouTubeId(inputValue);
        if (id) setVideoId(id);
        setOpen(false);
    };

    const removeVideoId = () => setVideoId("");

    const createVote = () => {
        setVotes((prev) => [...prev, { id: Date.now(), options: [
                { id: 1, optionText: '옵션 1', votes: 0 },
                { id: 2, optionText: '옵션 2', votes: 0 }
            ]}]);
    };

    const addVoteOption = (voteIndex: number, newOption: VoteOption) => {
        setVotes(prevVotes =>
            prevVotes.map((vote, idx) =>
                idx === voteIndex ? { ...vote, options: [...vote.options, newOption] } : vote
            )
        );
    };

    const updateVoteOption = (voteIndex: number, optionId: number, newText: string) => {
        setVotes((prevVotes) =>
            prevVotes.map((vote, idx) =>
                idx === voteIndex
                    ? { ...vote, options: vote.options.map((opt) => (opt.id === optionId ? { ...opt, optionText: newText } : opt)) }
                    : vote
            )
        );
    };

    const handleSubmit = () => {
        onSubmit({ title, videoId, categoryId: selectedCategoryId, votes });
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-10 w-full max-w-3xl mx-auto">
            {/* 제목 */}
            <Card className="w-full">
                <CardHeader><CardTitle>게시글 제목</CardTitle></CardHeader>
                <CardContent>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />
                </CardContent>
            </Card>

            {/* 영상 */}
            <Card className="w-full">
                <CardHeader><CardTitle>영상</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center gap-3">
                    {videoId ? (
                        <>
                            <YouTube videoId={videoId} opts={opts} />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setOpen(true)}>수정</Button>
                                <Button variant="destructive" onClick={removeVideoId}>삭제</Button>
                            </div>
                        </>
                    ) : (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild><Button variant="outline">+ 영상 추가하기</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>유튜브 URL 입력</DialogTitle>
                                    <DialogDescription>동영상 URL을 입력하면 자동으로 ID가 추출됩니다.</DialogDescription>
                                    <Input onChange={(e) => setInputValue(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                                    <Button className="mt-2" onClick={handleVideoSubmit}>확인</Button>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardContent>
            </Card>

            {/* 투표 옵션 */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>투표 옵션</CardTitle>
                </CardHeader>
                <CardContent>
                    {votes.length === 0 ? (
                        <Button variant="outline" onClick={createVote}>+ 투표 추가하기</Button>
                    ) : (
                        votes.map((vote, index) => (
                            <Vote
                                key={vote.id}
                                options={vote.options}
                                isEditing={true}
                                voteIndex={index}
                                onAddOption={addVoteOption}
                                onUpdateOption={updateVoteOption}
                                onVote={() => {}}
                            />
                        ))
                    )}
                </CardContent>
            </Card>

            {/* 카테고리 */}
            <Card className="w-full">
                <CardHeader><CardTitle>카테고리 선택</CardTitle></CardHeader>
                <CardContent>
                    <CategoryList value={selectedCategoryId || undefined} onChange={setSelectedCategoryId} />
                </CardContent>
            </Card>

            {/* 제출 버튼 */}
            <div className="w-full flex justify-end">
                <Button className="w-40 h-12 bg-black text-white" onClick={handleSubmit}>
                    {mode === "create" ? "게시글 등록하기" : "게시글 수정하기"}
                </Button>
            </div>
        </div>
    );
}