import React, { useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
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
import {Calendar} from "@/components/ui/calendar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger} from "../ui/select";

export interface VoteData {
    id: number;
    options: VoteOption[];
}

export interface PostData {
    title: string;
    videoId: string;
    categoryId: number | null;
    votes: VoteData[];
    removedOptionIds?: number[];   // ✅ 삭제된 옵션 ID 목록
    voteEndTime: string | undefined;
}

interface PostFormProps {
    mode: "create" | "edit";
    initialData?: PostData;
    onSubmit: (data: {
        title: string;
        videoId: string;
        categoryId: number | null;
        votes: VoteData[];
        removedOptionIds: number[];
        voteEndTime: string | undefined
    }) => void;
    onRemoveOption?: (optionId: number) => void; // ✅ EditPost에서 삭제 이벤트 전달
}

export default function PostForm({ mode, initialData, onSubmit, onRemoveOption }: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [videoId, setVideoId] = useState(initialData?.videoId || "");
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const [votes, setVotes] = useState<VoteData[]>(initialData?.votes || []);
    const [removedOptionIds, setRemovedOptionIds] = useState<number[]>([]); // ✅ 삭제된 ID 추적
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        initialData?.categoryId || null
    );
    const week = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7);
    const [selectedDate, setDate] = React.useState<Date | undefined>(week)
    const [selectedHour, setSelectedHour] = useState<number>(week.getHours());
    const [selectedMinute, setSelectedMinute] = useState<number>(0);

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
        setVotes((prev) => [...prev, {
            id: Date.now(),
            options: [
                { id: Date.now() + 1, optionText: '옵션 1', votes: 0 },
                { id: Date.now() + 2, optionText: '옵션 2', votes: 0 }
            ]
        }]);
    };

    const addVoteOption = (voteIndex: number, newOption: VoteOption) => {
        setVotes(prevVotes =>
            prevVotes.map((vote, idx) =>
                idx === voteIndex ? { ...vote, options: [...vote.options, newOption] } : vote
            )
        );
    };

    const updateVoteOption = (voteIndex: number, optionId: number, newText: string) => {
        setVotes(prevVotes =>
            prevVotes.map((vote, idx) =>
                idx === voteIndex
                    ? { ...vote, options: vote.options.map(opt => opt.id === optionId ? { ...opt, optionText: newText } : opt) }
                    : vote
            )
        );
    };

    /** ✅ 옵션 삭제 핸들러 (Vote 컴포넌트에서 호출됨) */
    const handleRemoveVoteOption = (voteIndex: number, optionId: number) => {
        setVotes(prevVotes =>
            prevVotes.map((vote, idx) =>
                idx === voteIndex ? { ...vote, options: vote.options.filter(opt => opt.id !== optionId) } : vote
            )
        );

        // ✅ 기존 옵션이면 삭제 ID에 추가
        if (optionId < 1000000000000) {
            setRemovedOptionIds(prev => [...prev, optionId]);
            onRemoveOption?.(optionId); // ✅ EditPost에 전달
        }
    };

    const toKSTDatetimeString = (date: Date): string => {
        const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        return kst.toISOString().replace('T', ' ').substring(0, 19); // 'YYYY-MM-DD HH:mm:ss'
    }

    const handleVoteEndDate = () => {
        const combinedDate = getCombinedDateTime();
        if (combinedDate) {
            return toKSTDatetimeString(combinedDate);
        } else {
            return undefined
        }
    }

    /** ✅ 최종 제출 시 삭제 ID 포함 */
    const handleSubmit = () => {

        onSubmit({
            title,
            videoId,
            categoryId: selectedCategoryId,
            votes,
            removedOptionIds, // ✅ 삭제된 ID를 함께 전달
            voteEndTime: handleVoteEndDate()
        });
    };

    const getCombinedDateTime = (): Date | undefined => {
        if (!selectedDate) return undefined;
        const combined = new Date(selectedDate);
        combined.setHours(selectedHour);
        combined.setMinutes(selectedMinute);
        combined.setSeconds(0);
        return combined;
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
                <CardHeader><CardTitle>투표 옵션</CardTitle></CardHeader>
                <CardContent>
                    {votes.length === 0 ? (
                        <Button variant="outline" onClick={createVote}>+ 투표 추가하기</Button>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            {votes.map((vote, index) => (
                                <Vote
                                    key={vote.id}
                                    options={vote.options}
                                    isEditing={true}
                                    voteIndex={index}
                                    onAddOption={addVoteOption}
                                    onUpdateOption={updateVoteOption}
                                    onRemoveOption={handleRemoveVoteOption}
                                    onVote={() => {}}
                                />
                            ))}
                            투표 종료 시간 설정하기
                            <div className="flex flex-col items-center gap-4 p-4 rounded-lg border shadow-sm w-full max-w-md">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="time-picker" className="text-sm font-medium text-gray-700 w-24">
                                        시간 선택
                                    </label>
                                    <div className="flex gap-2">
                                        {/* 시 선택 */}
                                        <Select onValueChange={(val) => setSelectedHour(parseInt(val))} defaultValue={selectedHour.toString()}>
                                            <SelectTrigger className="w-[80px]">{selectedHour}시</SelectTrigger>
                                            <SelectContent className="bg-black text-white">
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>{i}시</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* 분 선택 */}
                                        <Select onValueChange={(val) => setSelectedMinute(parseInt(val))} defaultValue={selectedMinute.toString()}>
                                            <SelectTrigger className="w-[80px]">{selectedMinute}분</SelectTrigger>
                                            <SelectContent className="bg-black text-white">
                                                {Array.from({ length: 5 }, (_, i) => {
                                                    const minute = (i + 1) * 10; // 10, 20, ..., 50
                                                    return (
                                                        <SelectItem key={minute} value={minute.toString()}>
                                                            {minute}분
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setDate}
                                        className="rounded-lg border shadow-sm"
                                    />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    선택된 날짜와 시간:{" "}
                                    {getCombinedDateTime()?.toLocaleString("ko-KR") || "없음"}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 카테고리 */}
            <Card className="w-full">
                <CardHeader><CardTitle>카테고리 선택</CardTitle></CardHeader>
                <CardContent>
                    <CategoryList
                        value={selectedCategoryId ?? undefined}
                        onChange={(id?: number) => setSelectedCategoryId(id ?? null)}
                    />
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
