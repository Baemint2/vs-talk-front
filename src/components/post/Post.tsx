// Post.tsx (리팩터링)
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, MessageCircle, BarChart3, Play } from "lucide-react";
import { timeAgo } from "@/util/Time.ts";
import clsx from "clsx";
import MiniVoteChart from "@/components/vote/MiniVoteChart.tsx";
import type { VoteCount } from "@/pages/PostDetail";
import type {VoteOption} from "@/props/VoteOptionProps.tsx";

interface PostProps {
    id: number;
    title: string;
    author: string;
    videoId?: string | null;
    createdAt: string;
    commentCount?: number;
    voteCount?: number;
    thumbnail?: string | null; // 있으면 우선 사용, 없으면 videoId로 유튜브 썸네일
    categoryName: string;
    voteEndTime?: string | null;
    voteEnabled: boolean;
    closed?: boolean; // 선택: 서버에서 내려주면 [종료] 판단에 사용
    // ✅ 투표 데이터 추가
    voteOptionList?: VoteOption[];
    voteCounts?: VoteCount[];
    showMiniChart?: boolean; // 미니 차트 표시 여부
}

const Post = ({
                  id,
                  title,
                  videoId,
                  createdAt,
                  commentCount = 0,
                  voteCount = 0,
                  thumbnail,
                  categoryName,
                  voteEndTime,
                  voteEnabled,
                  closed,
                  voteOptionList = [],
                  voteCounts = [],
                  showMiniChart = true
              }: PostProps) => {
    const navigate = useNavigate();
    const hasVideo = Boolean(videoId);
    const imgSrc =
        thumbnail ??
        (hasVideo ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

    const isClosed = closed ?? !voteEnabled;
    const endDate =
        voteEnabled && voteEndTime
            ? `(~${voteEndTime.substring(5, 10).replace("-", "/")})`
            : "";

    const handleClick = () => navigate(`/post/${id}`);

    // ✅ 투표 데이터가 있는지 확인
    const hasVoteData = voteOptionList?.length > 0 && voteCounts?.length > 0;

    return (
        <article
            onClick={handleClick}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        >
            <div className={clsx("relative w-full overflow-hidden bg-zinc-100", "aspect-[16/9]")}>
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Play className="h-8 w-8 opacity-30" />
                    </div>
                )}
            </div>

            {/* 본문 */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                {/* 상단 라인: 카테고리/상태/마감 */}
                <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700">
            {categoryName}
          </span>
                    {isClosed && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
              종료된 투표
            </span>
                    )}
                    {voteEnabled && voteEndTime && (
                        <span className="ml-auto text-zinc-500">{endDate}</span>
                    )}
                </div>

                {/* 제목: 2줄 고정 */}
                <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 transition-colors group-hover:text-blue-600">
                    {title}
                </h3>

                {/* ✅ 미니 차트 영역 */}
                {showMiniChart && hasVoteData && (
                    <div className="bg-gray-50 rounded-lg p-2 border">
                        <MiniVoteChart
                            options={voteOptionList}
                            counts={voteCounts}
                        />
                    </div>
                )}

                {/* 시간 */}
                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{timeAgo(createdAt)}</span>
                </div>

                {/* 메타: 하단 고정 */}
                <div className="mt-auto flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{voteCount}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Post;
