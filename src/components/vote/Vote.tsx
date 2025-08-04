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
    onVote?: (optionId: number | string) => void;
    onAddOption: (voteIndex: number, newOption: VoteOption) => void;
    onUpdateOption?: (voteIndex: number, optionId: number, newText: string) => void; // ✅ 추가
    voteIndex?: number;
}

interface VoteCount {
    voteOptionId: number;
    count: number;
}

const Vote = ({ options: initialOptions, postId, onVote, isEditing = false, onAddOption, onUpdateOption, voteIndex }: VoteProps) => {
    const [voteOptions, setVoteOptions] = useState<VoteOption[]>(initialOptions);
    const [voteCount, setVoteCount] = useState<VoteCount[]>([]);
    const [newOptionText, setNewOptionText] = useState('');
    const [isVoted, setIsVoted] = useState(false);
    const didFetch = useRef(false);

    useEffect(() => {
        setVoteOptions(initialOptions);
    }, [initialOptions]);

    const fetchVoteCount = async () => {
        try {
            const response = await api.get(`vote/count/${postId || ''}`);
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
            const response = await api.get(`vote/${postId || ''}/status`);
            setIsVoted(response.data);
        } catch (error) {
            console.error("투표 여부 확인 실패:", error);
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

    // ✅ 옵션 텍스트 수정
    const updateOptionText = (optionId: number, newText: string) => {
        setVoteOptions(prev => prev.map(opt =>
            opt.id === optionId ? { ...opt, optionText: newText } : opt
        ));
        onUpdateOption?.(voteIndex ?? 0, optionId, newText);
    };

    const addOption = () => {
        if (newOptionText.trim()) {
            const newOption: VoteOption = {
                id: Date.now() + Math.random(),
                optionText: newOptionText,
                color: '#FBBF24',
                votes: 0,
            };
            const updated = [...voteOptions, newOption];
            updateOptions(updated);

            // ✅ 상위에 알림
            onAddOption?.(voteIndex ?? 0, newOption);

            setNewOptionText('');
        }
    };

    const removeOption = (optionId: number) => {
        if (voteOptions.length > 2) {
            const updated = voteOptions.filter(opt => opt.id !== optionId);
            updateOptions(updated);
        }
    };

    const handleVote = async (optionId: number | string) => {
        try {
            await onVote?.(optionId);
            await fetchVoteCount();   // 투표 수 다시 가져오기
            await fetchIsVoted(true); // ✅ 강제로 상태 갱신
        } catch (error) {
            console.error('투표 처리 실패:', error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-50 rounded-2xl w-10/12 mt-10 p-4 relative">
            {!isEditing && (
                <div className="flex text-left justify-end mb-5 mt-5">
                    <span className="mr-5 text-sm text-gray-600">
                        {voteCount.reduce((c, o) => c + o.count, 0)}명 투표
                    </span>
                </div>
            )}

            <div className="flex flex-col items-center text-left">
                {voteOptions.map((option) => (
                    <VoteOption
                        key={option.id}
                        option={option}
                        isEditing={isEditing}
                        onUpdate={updateOptionText}
                        onRemove={removeOption}
                        isVoted={isVoted}
                        onVote={handleVote}
                        voteCount={voteCount}
                        canRemove={voteOptions.length > 2}
                    />
                ))}

                {isEditing && (
                    <div className="flex items-center gap-2 mt-3 w-full max-w-md">
                        <Input
                            placeholder="새 옵션을 입력하세요"
                            value={newOptionText}
                            onChange={(e) => setNewOptionText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addOption()}
                        />
                        <Button onClick={addOption} size="sm" disabled={!newOptionText.trim()}>
                            <Plus size={16}/>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface VoteOptionProps {
    option: VoteOption;
    isEditing?: boolean;
    onUpdate: (optionId: number, newText: string) => void;
    onRemove: (optionId: number) => void;
    onVote?: (optionId: number | string) => void;
    voteCount?: VoteCount[];
    isVoted?: boolean;
    canRemove: boolean;
}

const VoteOption = ({ option, isEditing, isVoted, voteCount, onUpdate, onRemove, onVote, canRemove }: VoteOptionProps) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [editText, setEditText] = useState(option.optionText);

    useEffect(() => {
        setEditText(option.optionText);
    }, [option.optionText]);

    const handleSave = () => {
        if (editText.trim() && editText !== option.optionText) {
            onUpdate(option.id, editText.trim());
        }
        setIsEditingText(false);
    };

    const handleCancel = () => {
        setEditText(option.optionText);
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
                           onKeyDown={(e) => e.key === 'Enter' ? handleSave() : e.key === 'Escape' && handleCancel()}
                           className="flex-1" autoFocus />
                    <Button size="sm" onClick={handleSave} className="px-2 py-1 h-8">저장</Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="px-2 py-1 h-8">취소</Button>
                </div>
            ) : isVoted ? (
                <div className="flex-1 w-full relative">
                    <div className="bg-gray-200 rounded-2xl h-10 relative overflow-hidden transition-all duration-300"
                         style={{ width: `${votePercentage}%` }}>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs font-medium">
                            ({votePercentage.toFixed(1)}%)
                        </span>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-10 flex items-center justify-between px-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-amber-100/20 rounded-2xl"
                         onClick={() => onVote?.(option.id)}>
                        <span>{option.optionText}</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-between">
                    <span className="flex-1 p-1 rounded cursor-pointer hover:bg-amber-100"
                          onClick={() => isEditing ? setIsEditingText(true) : onVote?.(option.id)}
                          onDoubleClick={() => isEditing && setIsEditingText(true)}
                          title={isEditing ? "클릭하여 편집" : "클릭하여 투표"}>
                        {option.optionText}
                    </span>
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingText(true)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 ml-2 hover:bg-blue-100"
                                title="편집">
                            <Edit size={12} className="text-blue-500"/>
                        </Button>
                    )}
                </div>
            )}
            {isEditing && canRemove && !isEditingText && (
                <Button variant="ghost" size="sm" onClick={() => onRemove(option.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 ml-2 hover:bg-red-100"
                        title="삭제">
                    <X size={12} className="text-red-500"/>
                </Button>
            )}
        </div>
    );
};

export default Vote;