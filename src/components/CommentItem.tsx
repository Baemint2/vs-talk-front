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
    onCommentAdd: (newComment: CommentType) => void;
    onCommentDelete: (commentId: number) => void;
}

const CommentItem = ({comment, postId, level, userInfo, onCommentAdd, onCommentDelete}: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    // 최대 답글 깊이 제한 (0: 원댓글, 1: 답글, 2: 대댓글)
    const MAX_REPLY_DEPTH = 2;
    const canReply = level < MAX_REPLY_DEPTH;

    const addReply = async () => {
        if (replyText.trim() === '') return;

        try {
            const response = await api.post(`/api/comment/add`, {
                content: replyText,
                postId: postId,
                parentId: comment.id,
            });

            onCommentAdd(response.data);
            setReplyText('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('답글 추가 실패:', error);
        }
    };

    const handleDelete = () => {
        onCommentDelete(comment.id);
    };

    // 들여쓰기 계산 (최대 레벨로 제한)
    const indentLevel = Math.min(level, MAX_REPLY_DEPTH);
    const marginLeft = indentLevel * 32; // 32px씩 들여쓰기

    return (
        <div className="mb-4" style={{marginLeft: `${marginLeft}px`}}>
            {/* 댓글 내용 */}
            <div className={'rounded-lg p-3 bg-gray-50'}>
                <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">User {comment.username}</span>
                    <span className="text-xs text-gray-500">
            {new Date(comment.updatedAt).toLocaleString()}
          </span>
                </div>
                <div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex gap-2">
                        {userInfo?.username === comment.username && (
                            <button
                                onClick={handleDelete}
                                className="text-xs text-red-500 hover:text-red-700"
                            >
                                삭제
                            </button>
                        )}
                        {/* 답글 버튼은 최대 깊이에서 숨김 */}
                        {canReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-blue-500 hover:text-blue-700"
                            >
                                {showReplyForm ? '취소' : '답글'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 답글 입력 폼 */}
            {showReplyForm && canReply && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex gap-2 mb-2">
                        <div
                            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium">나</span>
                        </div>
                        <div className="flex-1">
              <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`@${comment.username}님에게 답글...`}
                  className="w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
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
                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            취소
                        </button>
                        <button
                            onClick={addReply}
                            disabled={!replyText.trim()}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
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
                            onCommentAdd={onCommentAdd}
                            onCommentDelete={onCommentDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;