// src/components/comment/Comment.tsx
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

const Comment = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      {/* 댓글 헤더 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">댓글 3개</h3>
        
        {/* 댓글 작성 폼 */}
        <div className="flex gap-3 mb-6">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">나</span>
            </div>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                댓글 작성
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {/* 첫 번째 댓글 */}
        <div className="mb-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">김</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">김철수</span>
                  <span className="text-xs text-gray-500">2시간 전</span>
                </div>
                <p className="text-sm text-gray-800">정말 좋은 포스트네요! 많은 도움이 되었습니다. 감사합니다.</p>
              </div>
              
              {/* 댓글 액션 버튼들 */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp size={14} />
                  <span>15</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-600">
                  <ThumbsDown size={14} />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  <MessageCircle size={14} />
                  <span>답글</span>
                </button>
              </div>

              {/* 대댓글 */}
              <div className="ml-8 border-l-2 border-gray-200 pl-4 mt-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center">
                      <span className="text-xs">이</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-xs">이영희</span>
                        <span className="text-xs text-gray-500">1시간 전</span>
                      </div>
                      <p className="text-xs text-gray-800">저도 같은 생각이에요!</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp size={12} />
                        <span>3</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <ThumbsDown size={12} />
                        <span>0</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 두 번째 댓글 */}
        <div className="mb-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">박</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">박민수</span>
                  <span className="text-xs text-gray-500">3시간 전</span>
                </div>
                <p className="text-sm text-gray-800">이런 내용을 더 많이 볼 수 있었으면 좋겠어요. 다음 포스트도 기대됩니다!</p>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp size={14} />
                  <span>8</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-600">
                  <ThumbsDown size={14} />
                  <span>1</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  <MessageCircle size={14} />
                  <span>답글</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 세 번째 댓글 */}
        <div className="mb-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">정</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">정수지</span>
                  <span className="text-xs text-gray-500">4시간 전</span>
                </div>
                <p className="text-sm text-gray-800">질문이 있는데, 이 부분에 대해 더 자세히 설명해주실 수 있나요? 🤔</p>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp size={14} />
                  <span>5</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-600">
                  <ThumbsDown size={14} />
                  <span>0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-600">
                  <MessageCircle size={14} />
                  <span>답글</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;