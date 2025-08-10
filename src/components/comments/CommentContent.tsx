
interface CommentContentProps {
    level: number;
    content: string;
    editText: string;
    setEditText: (text: string) => void;
    showEditForm: boolean;
    onEditSubmit: () => void;
    onEditCancel: () => void;
}

export const CommentContent = ({showEditForm, editText, setEditText, onEditCancel, onEditSubmit, content, level}:CommentContentProps) => {
    return showEditForm ? (
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
                            onClick={onEditCancel}
                            className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={onEditSubmit}
                            disabled={!editText.trim() || editText.trim() === content}
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
                    {content}
                </p>
            )
}