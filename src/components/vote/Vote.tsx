import {useEffect, useRef, useState} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {X, Plus} from 'lucide-react';
import type {VoteOption} from "@/props/VoteOptionProps.tsx";
import api from "@/api/axiosConfig.ts";

interface VoteProps {
    options: VoteOption[];
    isEditing?: boolean;
    postId?: number;
    onVote?: (optionId: number | string) => void;
}


interface VoteCount {
    voteOptionId: number;
    count: number;
}

const Vote = ({options: initialOptions, postId, onVote, isEditing = false}: VoteProps) => {
    const [voteOptions, setVoteOptions] = useState<VoteOption[]>(initialOptions);
    const [voteCount, setVoteCount] = useState<VoteCount[]>([]);
    const [newOptionText, setNewOptionText] = useState('');
    const [isVoted, setIsVoted] = useState(false);
    const didFetch = useRef(false)

    useEffect(() => {
        console.log('initialOptions', initialOptions)
    }, [initialOptions]);


    // 옵션 업데이트
    const updateOptions = (newOptions: VoteOption[]) => {
        setVoteOptions(newOptions);
    };

    const fetchVoteCount = async () => {
        try {
            const response = await api.get(`/api/vote/count/${postId || ''}`);
            console.log(response.data);
            setVoteCount(response.data);

        } catch (error) {
            console.error('투표 카운트 가져오기 실패:', error);
        }
    }
    const fetchIsVoted = async () => {
        if (didFetch.current) return
        didFetch.current = true
        try {
            const response = await api.get(`/api/vote/${postId || ''}/status`);
            console.log(response.data);
            setIsVoted(response.data);
        } catch (error) {
            console.error("투표 여부 확인 실패:", error)
        }
    }

    // 투표 수 조회
    useEffect(() => {
        fetchVoteCount();
        fetchIsVoted();
    }, [postId]);


    // 투표 옵션 추가
    const addOption = () => {
        if (newOptionText.trim()) {
            const newOption: VoteOption = {
                id: Date.now() + 1, // 임시 ID (음수나 큰 숫자로 구분)
                optionText: newOptionText,
                color: '#FBBF24',
                votes: 0,
            };
            const updatedOptions = [...voteOptions, newOption];
            updateOptions(updatedOptions);
            setNewOptionText('');
        }
    };

    // // 투표 옵션 삭제
    // const removeOption = (optionId: string) => {
    //     if (voteOptions.length > 2) { // 최소 2개 옵션 유지
    //         const updatedOptions = voteOptions.filter(option => option.id !== optionId);
    //         updateOptions(updatedOptions);
    //     }
    // };
    //
    // // 투표 옵션 텍스트 수정
    // const updateOptionText = (optionId: string, newText: string) => {
    //     setVoteOptions(voteOptions.map(option =>
    //         option.id === optionId ? { ...option, text: newText } : option
    //     ));
    // };

    // 투표 처리 함수
    const handleVote = async (optionId: number | string) => {
        try {
            // 부모 컴포넌트의 onVote 콜백 호출 (투표 API 호출)
            await onVote?.(optionId);

            // 투표 성공 후 투표 수 다시 조회
            await fetchVoteCount();

        } catch (error) {
            console.error('투표 처리 실패:', error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-50 rounded-2xl w-10/12 mt-10 p-4 relative">

            {/* 투표 제목 */}
            <div className="flex text-left justify-end mb-5 mt-5">
                <span className="mr-5 text-sm text-gray-600">
                    {voteCount.reduce((count, option) => count + option.count, 0)}명 투표
                </span>
            </div>

            {/* 투표 옵션들 */}
            <div className="flex flex-col items-center text-left">
                {voteOptions.map((option, index) => (
                    <VoteOption
                        key={option.id}
                        option={option}
                        index={index}
                        isEditing={isEditing}
                        // onUpdate={updateOptionText}
                        // onRemove={removeOption}
                        isVoted={isVoted}
                        onVote={handleVote}
                        voteCount={voteCount}
                        canRemove={voteOptions.length > 2}
                    />
                ))}

                {/* 새 옵션 추가 */}
                {isEditing && (
                    <div className="flex items-center gap-2 mt-3 w-full max-w-md">
                        <Input
                            placeholder="새 옵션을 입력하세요"
                            value={newOptionText}
                            onChange={(e) => setNewOptionText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addOption();
                                }
                            }}
                        />
                        <Button
                            onClick={addOption}
                            size="sm"
                            disabled={!newOptionText.trim()}
                        >
                            <Plus size={16}/>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// 개별 투표 옵션 컴포넌트
interface VoteOptionProps {
    option: VoteOption;
    index: number;
    isEditing?: boolean;
    // onUpdate: (optionId: number, newText: string) => void;
    // onRemove: (optionId: number) => void;
    onVote?: (optionId: number | string) => void;
    voteCount?: VoteCount[];
    isVoted?: boolean;
    canRemove: boolean;
}

const VoteOption = ({option, index, isEditing, isVoted, voteCount, onVote, canRemove}: VoteOptionProps) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [editText, setEditText] = useState(option.optionText);

    const handleSave = () => {
        setIsEditingText(false);
    };

    function handleVote(optionId: number | string) {
        onVote?.(optionId);
    }

    const myVoteCount = voteCount?.find(vote => vote.voteOptionId === option.id)?.count || 0;
    const totalVotes = voteCount?.reduce((sum, vote) => sum + vote.count, 0) || 0;
    const votePercentage = totalVotes > 0 ? (myVoteCount / totalVotes) * 100 : 0;

    return (
        <div className="flex items-center bg-amber-50 rounded-2xl w-full max-w-md mb-3 p-2 relative group">
            {isEditing && isEditingText ? (
                <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSave();
                        } else if (e.key === 'Escape') {
                            setEditText(option.optionText);
                            setIsEditingText(false);
                        }
                    }}
                    className="flex-1"
                    autoFocus
                />
            ) : (
                isVoted ? (
                    <div className="flex-1 w-full relative">
                        <div
                            className="bg-gray-200 rounded-2xl h-10 relative overflow-hidden transition-all duration-300"
                            style={{width: `${votePercentage}%`}}
                        >
                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-xs font-medium">
                                  ({votePercentage.toFixed(1)}%)
                             </span>
                        </div>
                        <div
                            className="absolute top-0 left-0 w-full h-10 flex items-center justify-between px-3 text-sm font-medium text-gray-800 cursor-pointer hover:bg-amber-100/20 rounded-2xl"
                            onClick={() => handleVote(option.id)}
                        >
                            <span>{option.optionText}</span>
                        </div>
                    </div>
                ) : (
                    <span
                        className="flex-1 cursor-pointer hover:bg-amber-100 p-1 rounded"
                        onClick={() => handleVote(option.id)}
                    >
                        {index + 1}. {option.optionText}
                    </span>
                )
            )}
            {isEditing && canRemove && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:opacity-100 transition-opacity w-6 h-6 p-0 ml-2"
                >
                    <X size={12}/>
                </Button>
            )}
        </div>
    );
};

export default Vote;