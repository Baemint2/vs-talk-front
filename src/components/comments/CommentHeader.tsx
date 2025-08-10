import {timeAgo} from "@/util/Time.ts";

interface CommentHeaderProps {
    level: number;
    nickname: string;
    isAuthenticated: boolean;
    updatedAt: string;
    isEditing: boolean;
}

export const CommentHeader = ({level, nickname, isAuthenticated, updatedAt, isEditing}: CommentHeaderProps) => {
    return <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className={`${
                level === 0 ? 'w-8 h-8' : 'w-6 h-6'
            } bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className={`${
                                level === 0 ? 'text-sm' : 'text-xs'
                            } font-medium text-white`}>
                                {nickname.charAt(0).toUpperCase()}
                            </span>
            </div>

            {/* 사용자명과 레벨 표시 */}
            <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                                level === 0 ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                                {nickname}
                            </span>
                {level > 0 && isAuthenticated && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                    답글
                                </span>
                )}
                {isEditing && (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                                    수정 중
                    </span>
                )}
            </div>
        </div>

        <span className="text-xs text-gray-500">
                        {timeAgo(updatedAt)}
        </span>
    </div>
}