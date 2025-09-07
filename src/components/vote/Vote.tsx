import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Plus } from 'lucide-react';
import type { VoteOption } from "@/props/VoteOptionProps.tsx";
import api from "@/api/axiosConfig.ts";
import {useUser} from "@/store/UserContext.tsx";
import LoginPromptDialog from "@/components/common/LoginPromptDialog.tsx";
import VoteOptionItem from "@/components/vote/VoteOptionItem.tsx";
import Quiz from "@/components/quiz/Quiz.tsx";

interface VoteProps {
    options: VoteOption[];
    isEditing?: boolean;
    postId?: number;
    categoryId?: number;
    counts?: VoteCount[];
    onVote?: (optionId: number | string) => void;
    onAddOption: (voteIndex: number, newOption: VoteOption) => void;
    onUpdateOption?: (voteIndex: number, optionId: number, newText: string) => void;
    onRemoveOption?: (voteIndex: number, optionId: number) => void;  // ✅ 부모 삭제 콜백 추가
    voteIndex?: number;
    voteEnabled?: boolean;
    voteEndTime?: string;
}

interface VoteCount {
    voteOptionId: number;
    count: number;
}

const Vote = ({ options: initialOptions, postId, categoryId, onVote, isEditing = false, onAddOption, onUpdateOption, onRemoveOption, voteIndex, voteEnabled, voteEndTime }: VoteProps) => {
    const { user } = useUser();
    const [voteOptions, setVoteOptions] = useState<VoteOption[]>(initialOptions);
    const [voteCount, setVoteCount] = useState<VoteCount[]>([]);
    const [newOptionText, setNewOptionText] = useState('');
    const [isVoted, setIsVoted] = useState(false);
    const didFetch = useRef(false);
    const [validationAlertOpen, setValidationAlertOpen] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    // ✅ 부모에서 내려온 옵션이 변할 때만 반영
    useEffect(() => {
        if (JSON.stringify(initialOptions) !== JSON.stringify(voteOptions)) {
            setVoteOptions(initialOptions);
        }
    }, [initialOptions]);

    const fetchVoteCount = async () => {
        try {
            const response = await api.get(`votes/count/${postId || ''}`);
            const data = response.data;
            setVoteCount(Array.isArray(data) ? data : (data ? [data] : []));
        } catch (error) {
            console.error('투표 카운트 가져오기 실패:', error);
        }
    };

    const fetchIsVoted = async (force = false) => {
        if (didFetch.current && !force) return;
        didFetch.current = true;
        try {
            const response = await api.get(`votes/${postId || ''}/status`);
            setIsVoted(response.data);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (error.response?.status === 401) setIsVoted(true);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchVoteCount();
            fetchIsVoted();
        }
    }, [postId]);

    const updateOptions = (newOptions: VoteOption[]) => {
        setVoteOptions(newOptions);
    };

    const updateOptionText = (optionId: number, newText: string) => {
        setVoteOptions(prev => prev.map(opt => opt.id === optionId ? { ...opt, optionText: newText } : opt));
        onUpdateOption?.(voteIndex ?? 0, optionId, newText);
    };

    const addOption = () => {
        if (!newOptionText.trim()) return;
        const newOption: VoteOption = {
            id: Math.floor(Date.now() + Math.random()),
            optionText: newOptionText,
            color: '#FBBF24',
            votes: 0,
        };
        const updated = [...voteOptions, newOption];
        updateOptions(updated);
        onAddOption?.(voteIndex ?? 0, newOption);
        setNewOptionText('');
    };

    // ✅ 옵션 삭제 → 로컬 상태 + 부모에 전달
    const removeOption = (optionId: number) => {
        if (voteOptions.length <= 2) return;
        const updated = voteOptions.filter(opt => opt.id !== optionId);
        updateOptions(updated);
        onRemoveOption?.(voteIndex ?? 0, optionId);
    };

    const handleVote = async (optionId: number | string) => {
        if (!user) {
            setValidationAlertOpen(true);

            return;
        }

        try {
            await onVote?.(optionId);
            await fetchVoteCount();
            await fetchIsVoted(true);

            // 투표 성공 후 퀴즈 표시
            setTimeout(() => {
                setShowQuiz(true);
            }, 1000); // 투표 결과가 업데이트된 후 1초 지연시간

        } catch (error) {
            console.error('투표 처리 실패:', error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-50 rounded-2xl w-10/12 mt-10 p-4 relative">
            {!isEditing && (
                <div className="flex justify-between mb-5 mt-5 text-sm text-gray-600">
                    {voteEnabled ? (<div>투표 종료 시간 : {voteEndTime}</div>) : <div>투표종료</div>}
                    {voteCount.reduce((c, o) => c + o.count, 0)}명 투표
                </div>
            )}

            <div className="flex flex-col items-center text-left">
                {voteOptions.map(option => (
                    <VoteOptionItem
                        key={option.id}
                        option={option}
                        isEditing={isEditing}
                        onUpdate={updateOptionText}
                        onRemove={removeOption}
                        isVoted={isVoted}
                        onVote={handleVote}
                        voteCount={voteCount}
                        voteEnabled={voteEnabled}
                        canRemove={voteOptions.length > 2}
                    />
                ))}

                {isEditing && (
                    <div className="flex items-center gap-2 mt-3 w-full max-w-md">
                        <Input placeholder="새 옵션을 입력하세요" value={newOptionText}
                               onChange={(e) => setNewOptionText(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && addOption()} />
                        <Button onClick={addOption} size="sm" disabled={!newOptionText.trim()}>
                            <Plus size={16}/>
                        </Button>
                    </div>
                )}
            </div>

            {/* 퀴즈 섹션 */}
            {showQuiz && !isEditing && (
                <Quiz open={showQuiz} onOpenChange={setShowQuiz} categoryId={categoryId} />
            )}

            {/* 입력 검증 알림 다이얼로그 */}
            <LoginPromptDialog
                open={validationAlertOpen}
                onOpenChange={setValidationAlertOpen}
                title="🗳️ 투표 참여"
                description={"투표 참여는 로그인이 필요한 서비스입니다. \n 로그인 후 다양한 투표에 참여해보세요!"}
            />
        </div>
    );
};

export default Vote;
