import { Skeleton } from "@/components/ui/skeleton.tsx";

const PostSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* 썸네일 영역 */}
            <div className="aspect-video bg-gray-100">
                <Skeleton className="w-full h-full" />
            </div>

            {/* 컨텐츠 영역 */}
            <div className="p-4 space-y-3">
                {/* 제목 */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </div>

                {/* 작성자 & 카테고리 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-16" />
                        <span className="text-gray-400">•</span>
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* 날짜 & 상호작용 */}
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-6" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-6" />
                        </div>
                    </div>
                </div>

                {/* 투표 종료 시간 */}
                <div className="pt-2">
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </div>
    );
};

export default PostSkeleton;