export interface PostProps {
    id: number;
    title: string;
    author: string;
    updatedAt: string;
    thumbnailUrl?: string;
    commentCount?: number;
    likeCount?: number;
}