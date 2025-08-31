import type { VoteCount } from "@/pages/PostDetail";

import type {VoteOption} from "@/props/VoteOptionProps.tsx";

export interface PostProps {
    id: number;
    title: string;
    author: string;
    videoId?: string;
    createdAt: string;
    thumbnailUrl?: string;
    commentCount?: number;
    likeCount?: number;
    categoryName: string;
    voteEndTime: string;
    voteEnabled: boolean;
    voteCount?: number;
    // ✅ 투표 데이터 추가
    voteOptionList?: VoteOption[];
    voteCounts?: VoteCount[];
}