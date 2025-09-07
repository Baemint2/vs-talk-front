
const QuizSkeleton = () => {
    return (
        <div className="py-4 animate-pulse">
            {/* 퀴즈 제목 스켈레톤 */}
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-6"></div>

            {/* 옵션들 스켈레톤 */}
            <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                    >
                        {/* 라디오 버튼 스켈레톤 */}
                        <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0"></div>

                        {/* 옵션 텍스트 스켈레톤 */}
                        <div className={`h-4 bg-gray-200 rounded ${
                            index === 0 ? 'w-2/3' :
                                index === 1 ? 'w-1/2' :
                                    index === 2 ? 'w-3/4' : 'w-1/3'
                        }`}></div>
                    </div>
                ))}
            </div>

            {/* 제출 버튼 스켈레톤 */}
            <div className="mt-6">
                <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
            </div>
        </div>
    );
};

export default QuizSkeleton;