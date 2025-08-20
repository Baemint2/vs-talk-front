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
}