import {useState} from 'react';
import api from "@/api/axiosConfig.ts";

interface CommentType {
    id: number;
    content: string;
    postId: number;
    username: string;
    parentId: number | null;
    updatedAt: string;
    replies?: CommentType[];
    deleted: boolean;
}

interface UserInfo {
    profile?: string;
    username: string;
    email: string;
}

interface CommentItemProps {
    comment: CommentType;
    postId: number;
    level: number;
    userInfo: UserInfo | null;
    onCommentsChange: () => void; // 댓글 변경 후 새로고침 콜백 (하나로 통합)
}

const CommentItem = ({comment, postId, level, userInfo, onCommentsChange}: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    // 최대 답글 깊이 제한 (0: 원댓글, 1: 답글, 2: 대댓글)
    const MAX_REPLY_DEPTH = 2;
    const canReply = level < MAX_REPLY_DEPTH;

    const isDeleted = comment.deleted;
    const addReply = async () => {
        if (replyText.trim() === '') return;

        try {
            await api.post(`/api/comment/add`, {
                content: replyText,
                postId: postId,
                parentId: comment.id,
            });

            setReplyText('');
            setShowReplyForm(false);
            onCommentsChange(); // 부모에게 새로고침 요청
        } catch (error) {
            console.error('답글 추가 실패:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/comment/${comment.id}`);
            onCommentsChange(); // 부모에게 새로고침 요청
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };

    const handleEditSubmit = async () => {
        if (editText.trim() === '') return;
        if (editText.trim() === comment.content) {
            setShowEditForm(false);
            return;
        }

        try {
            await api.put(`/api/comment/${comment.id}`, {
                content: editText.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setShowEditForm(false);
            onCommentsChange(); // 부모에게 새로고침 요청
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleEditCancel = () => {
        setEditText(comment.content); // 원래 내용으로 복원
        setShowEditForm(false);
    };

    // 들여쓰기 계산
    const marginLeft = level * 24; // 24px씩 들여쓰기

    return (
        <div className="mb-4" style={{marginLeft: `${marginLeft}px`}}>
            {/* 대댓글인 경우 연결선 표시 */}
            {level > 0 && (
                <div className="relative">
                    <div
                        className="absolute -left-6 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"
                        style={{left: `-${24}px`}}
                    />
                </div>
            )}

            {/* 댓글 내용 */}
            <div className={`rounded-lg p-4 ${
                level === 0
                    ? 'bg-white border border-gray-200 shadow-sm'
                    : 'bg-gray-50 border-l-4 border-blue-200'
            } ${showEditForm ? 'ring-2 ring-orange-200' : ''}`}>
                {/* 댓글 헤더 */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* 프로필 이미지 */}
                        <div className={`${
                            level === 0 ? 'w-8 h-8' : 'w-6 h-6'
                        } bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className={`${
                                level === 0 ? 'text-sm' : 'text-xs'
                            } font-medium text-white`}>
                                {comment.username.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* 사용자명과 레벨 표시 */}
                        <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                                level === 0 ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                                {comment.username}
                            </span>
                            {level > 0 && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                    답글
                                </span>
                            )}
                            {showEditForm && (
                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                                    수정 중
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="text-xs text-gray-500">
                        {new Date(comment.updatedAt).toLocaleString()}
                    </span>
                </div>

                {/* 댓글 내용 또는 수정 폼 */}
                <div className={`${level > 0 ? 'ml-9' : 'ml-11'}`}>
                    {showEditForm ? (
                        /* 수정 폼 */
                        <div className="mb-3">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-3 border border-orange-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50"
                                rows={3}
                                autoFocus
                                placeholder="댓글을 수정해주세요..."
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={handleEditCancel}
                                    className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    disabled={!editText.trim() || editText.trim() === comment.content}
                                    className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    수정 완료
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* 일반 댓글 내용 */
                        <p className={`mb-3 ${
                            level === 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                            {comment.content}
                        </p>
                    )}

                    {/* 액션 버튼들 - 수정 중이 아닐 때만 표시 */}
                    {!showEditForm && (
                        <div className="flex gap-3">
                            {userInfo?.username === comment.username && !isDeleted && (
                                <>
                                    <button
                                        onClick={() => setShowEditForm(true)}
                                        className="text-xs text-orange-500 hover:text-orange-700 font-medium transition-colors"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                                    >
                                        삭제
                                    </button>
                                </>
                            )}

                            {canReply && !isDeleted && (
                                <button
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                >
                                    {showReplyForm ? '취소' : '답글'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 답글 입력 폼 */}
            {showReplyForm && canReply && !showEditForm && (
                <div className="mt-3 ml-11 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-3 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">나</span>
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`@${comment.username}님에게 답글...`}
                                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowReplyForm(false);
                                setReplyText('');
                            }}
                            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={addReply}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            답글 등록
                        </button>
                    </div>
                </div>
            )}

            {/* 자식 댓글들을 재귀적으로 렌더링 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            level={level + 1}
                            userInfo={userInfo}
                            onCommentsChange={onCommentsChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;