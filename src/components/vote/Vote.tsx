import {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { X, Plus } from 'lucide-react';
import type {VoteOption} from "@/props/VoteOptionProps.tsx";

interface VoteProps {
    voteId: string;
    title: string;
    options: VoteOption[];
    isEditing?: boolean;
    onDelete: (voteId: string) => void;
    onUpdate: (voteId: string, updatedData: { title?: string; options?: VoteOption[] }) => void;
}


const Vote = ({ voteId, title: initialTitle, options: initialOptions, isEditing = false,onDelete, onUpdate }: VoteProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [voteOptions, setVoteOptions] = useState<VoteOption[]>(initialOptions);
    const [newOptionText, setNewOptionText] = useState('');

    useEffect(() => {
        console.log('initialOptions', initialOptions)
    }, [initialOptions]);

    // 제목 업데이트
    const updateTitle = (newTitle: string) => {
        setTitle(newTitle);
        onUpdate(voteId, { title: newTitle });
    };



    // 옵션 업데이트
    const updateOptions = (newOptions: VoteOption[]) => {
        setVoteOptions(newOptions);
        onUpdate(voteId, { options: newOptions });
    };


    // 투표 옵션 추가
    const addOption = () => {
        if (newOptionText.trim()) {
            const newOption: VoteOption = {
                id: Date.now().toString(),
                optionText: newOptionText,
                color: '#FBBF24',
                votes: 0,
            };
            const updatedOptions = [...voteOptions, newOption];
            updateOptions(updatedOptions);
            setNewOptionText('');
        }
    };

    // 투표 옵션 삭제
    const removeOption = (optionId: string) => {
        if (voteOptions.length > 2) { // 최소 2개 옵션 유지
            const updatedOptions = voteOptions.filter(option => option.id !== optionId);
            updateOptions(updatedOptions);
        }
    };

    // 투표 옵션 텍스트 수정
    const updateOptionText = (optionId: string, newText: string) => {
        setVoteOptions(voteOptions.map(option =>
            option.id === optionId ? { ...option, text: newText } : option
        ));
    };

    return (
        <div className="flex flex-col bg-gray-50 rounded-2xl mt-10 p-4 relative">
            {/* 투표 삭제 버튼 */}
            {isEditing && (
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 w-8 h-8 p-0"
                    onClick={() => onDelete(voteId)}
                >
                    <X size={16} />
                </Button>
            )}

            {/* 투표 제목 */}
            <div className="flex text-left justify-between mb-5 mt-5">
                <span className="mr-5 text-sm text-gray-600">
                    {voteOptions.reduce((total, option) => total + option.votes, 0)}명 참여, 단일선택
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
                        onUpdate={updateOptionText}
                        onRemove={removeOption}
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
                            <Plus size={16} />
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
    onUpdate: (optionId: string, newText: string) => void;
    onRemove: (optionId: string) => void;
    canRemove: boolean;
}

const VoteOption = ({ option, index, isEditing, onUpdate, onRemove, canRemove }: VoteOptionProps) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [editText, setEditText] = useState(option.optionText);

    const handleSave = () => {
        onUpdate(option.id, editText);
        setIsEditingText(false);
    };

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
                <span
                    className="flex-1 cursor-pointer hover:bg-amber-100 p-1 rounded"
                    onClick={() => setIsEditingText(true)}
                >
                    {index + 1}. {option.optionText}
                </span>
            )}

            {isEditing && canRemove && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:opacity-100 transition-opacity w-6 h-6 p-0 ml-2"
                    onClick={() => onRemove(option.id)}
                >
                    <X size={12}/>
                </Button>
            )}
        </div>
    );
};

export default Vote;