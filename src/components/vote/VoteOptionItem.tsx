import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Edit, X} from "lucide-react";
import {toast} from "sonner";
import type {VoteCount} from "@/pages/PostDetail.tsx";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";

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
                                 toast.info("종료된 투표입니다.")
                             }}}>
                        <span>{option.optionText}</span>
                        {!isEditing && <span className="text-xs font-medium">({votePercentage.toFixed(1)}%)</span>}
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

export default VoteOptionItem;