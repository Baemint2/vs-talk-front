import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {/* 썸네일 */}
            <div className="relative w-full overflow-hidden bg-zinc-100 aspect-[16/9]">
                <Skeleton className="w-full h-full" />
            </div>

            {/* 본문 */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                {/* 상단 라인: 카테고리/상태/마감 */}
                <div className="flex items-center gap-2 text-sm">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="ml-auto h-4 w-24" />
                </div>

                {/* 제목 (2줄) */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-2/3" />
                </div>

                {/* 시간 */}
                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* 하단 메타: 댓글, 투표 수 */}
                <div className="mt-auto flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostSkeleton;
