export interface PostProps {
    id: number;
    title: string;
    author: string;
    videoId?: string;
    updatedAt: string;
    thumbnailUrl?: string;
    commentCount?: number;
    likeCount?: number;
    categoryName: string;
}