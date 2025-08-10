import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { X, Plus, Edit } from 'lucide-react';
import type { VoteOption } from "@/props/VoteOptionProps.tsx";
import api from "@/api/axiosConfig.ts";

interface VoteProps {
    options: VoteOption[];
    isEditing?: boolean;
    postId?: number;
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

const Vote = ({ options: initialOptions, postId, onVote, isEditing = false, onAddOption, onUpdateOption, onRemoveOption, voteIndex, voteEnabled, voteEndTime }: VoteProps) => {
    const [voteOptions, setVoteOptions] = useState<VoteOption[]>(initialOptions);
    const [voteCount, setVoteCount] = useState<VoteCount[]>([]);
    const [newOptionText, setNewOptionText] = useState('');
    const [isVoted, setIsVoted] = useState(false);
    const didFetch = useRef(false);

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
        try {
            await onVote?.(optionId);
            await fetchVoteCount();
            await fetchIsVoted(true);
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
        </div>
    );
};

// ✅ 옵션 단일 컴포넌트
interface VoteOptionProps {
    option: VoteOption;
    isEditing?: boolean;
    onUpdate: (optionId: number, newText: string) => void;
    onRemove: (optionId: number) => void;
    onVote?: (optionId: number | string) => void;
    voteCount?: VoteCount[];
    isVoted?: boolean;
    canRemove: boolean;
    voteEnabled?: boolean | false;
}

const VoteOptionItem = ({ option, isEditing, voteCount, onUpdate, onRemove, onVote, canRemove, voteEnabled }: VoteOptionProps) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [editText, setEditText] = useState(option.optionText);

    useEffect(() => setEditText(option.optionText), [option.optionText]);

    const handleSave = () => {
        if (editText.trim() && editText !== option.optionText) onUpdate(option.id, editText.trim());
        setIsEditingText(false);
    };

    const myVoteCount = voteCount?.find(v => v.voteOptionId === option.id)?.count || 0;
    const totalVotes = voteCount?.reduce((s, v) => s + v.count, 0) || 0;
    const votePercentage = totalVotes > 0 ? (myVoteCount / totalVotes) * 100 : 0;

    return (
        <div className="flex items-center bg-amber-50 rounded-2xl w-full max-w-md mb-3 p-2 relative group">
            {isEditing && isEditingText ? (
                <div className="flex-1 flex items-center gap-2">
                    <Input value={editText} onChange={(e) => setEditText(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' ? handleSave() : e.key === 'Escape' && setIsEditingText(false)}
                           className="flex-1" autoFocus />
                    <Button size="sm" onClick={handleSave}>저장</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingText(false)}>취소</Button>
                </div>
            ) : (
                <div className="flex-1 relative">
                    <div className="bg-gray-200 rounded-2xl h-10" style={{ width: `${votePercentage}%` }} />
                    <div className="absolute top-0 left-0 w-full h-10 flex items-center justify-between px-3 cursor-pointer hover:bg-amber-100/20"
                         onClick={() => {
                             if (isEditing) {
                                 setIsEditingText(true);
                             } else if (voteEnabled) {
                                 onVote?.(option.id)
                             } else {
                                 alert("종료된 투표입니다.")
                             }}}>
                        <span>{option.optionText}</span>
                        <span className="text-xs font-medium">({votePercentage.toFixed(1)}%)</span>
                        {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingText(true)}
                                    className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0 ml-2 hover:bg-blue-100">
                                <Edit size={12} className="text-blue-500"/>
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {isEditing && canRemove && !isEditingText && (
                <Button variant="ghost" size="sm" onClick={() => onRemove(option.id)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0 ml-2 hover:bg-red-100">
                    <X size={12} className="text-red-500"/>
                </Button>
            )}
        </div>
    );
};

export default Vote;
