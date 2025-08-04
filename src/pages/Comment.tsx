import { useEffect, useState } from "react";
import api from "@/api/axiosConfig.ts";
import { useAuth } from "@/hooks/useAuth";
import CommentItem from "@/components/CommentItem.tsx";
import {check} from "korcen";

interface CommentProps {
  postId: number;
}

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

const Comment = ({ postId }: CommentProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`comment/all/${postId}`);
      const commentsData = response.data;
      console.log(commentsData);
      // 중첩 구조로 변환
      const nestedComments = buildNestedComments(commentsData);
      setComments(nestedComments);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
    }
  };

  // 플랫 구조를 중첩 구조로 변환
  const buildNestedComments = (flatComments: CommentType[]): CommentType[] => {
    const commentMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    // 모든 댓글을 맵에 저장하고 replies 배열 초기화
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 설정
    commentMap.forEach(comment => {
      if (comment.parentId === null) {
        rootComments.push(comment);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(comment);
        }
      }
    });

    return rootComments;
  };

  // 총 댓글 개수 계산 (대댓글 포함)
  const getTotalCommentCount = (comments: CommentType[]): number => {
    let total = 0;

    const countRecursive = (commentList: CommentType[]) => {
      commentList.forEach(comment => {
        total += 1; // 현재 댓글 카운트
        if (comment.replies && comment.replies.length > 0) {
          countRecursive(comment.replies); // 재귀적으로 답글들 카운트
        }
      });
    };

    countRecursive(comments);
    return total;
  };

  // 새 댓글 추가
  const addComment = async () => {
    if (inputValue.trim() === '') return;

    if (check(inputValue)) return;
    try {
      await api.post(`comment/add`, {
        content: inputValue,
        postId: postId,
        parentId: null,
      });

      setInputValue('');
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  // 댓글 추가 핸들러 (자식 컴포넌트에서 호출)
  // 댓글 변경 후 새로고침 핸들러 (추가/수정/삭제 후 공통으로 사용)
  const handleCommentsRefresh = () => {
    fetchComments();
  };

  const totalCommentCount = getTotalCommentCount(comments);

  return (
      <div className="w-full max-w-4xl mx-auto px-4 mt-8">
        <h3 className="text-lg font-semibold mb-4">댓글 {totalCommentCount}개</h3>

        {/* 새 댓글 작성 폼 */}
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={3}
          />
            <div className="flex justify-end mt-2">
              <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  onClick={addComment}
                  disabled={!inputValue.trim()}
              >
                댓글 작성
              </button>
            </div>
            {comments.length > 0 ? <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={fetchComments}
            >
              댓글 목록 재조회
            </button> : null}
          </div>
        </div>

        {/* 댓글 목록 (재귀적 렌더링) */}
        <div className="space-y-4">
          {comments.map(comment => (
              <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  level={0}
                  userInfo={userInfo}
                  onCommentsChange={handleCommentsRefresh}
                  isDeleted={comment.deleted}
              />
          ))}
        </div>
      </div>
  );
};

export default Comment;