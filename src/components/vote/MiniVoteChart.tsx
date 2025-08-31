import { useMemo } from 'react';
import type { VoteOption } from "@/props/VoteOptionProps.tsx";
import type { VoteCount } from "@/pages/PostDetail.tsx";

interface MiniVoteChartProps {
    options: VoteOption[];
    counts: VoteCount[];
    className?: string;
}

const MiniVoteChart = ({ options, counts, className = "" }: MiniVoteChartProps) => {
    const chartData = useMemo(() => {
        if (!options.length || !counts.length) return [];

        const totalVotes = counts.reduce((sum, count) => sum + count.count, 0);

        return options.map(option => {
            const count = counts.find(c => c.voteOptionId === option.id)?.count || 0;
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

            return {
                id: option.id,
                text: option.optionText,
                count,
                percentage,
                color: option.color || "#3B82F6"
            };
        });
    }, [options, counts]);

    const totalVotes = chartData.reduce((sum, item) => sum + item.count, 0);

    if (chartData.length === 0) {
        return (
            <div className={`text-center text-gray-400 text-xs ${className}`}>
                투표 데이터 없음
            </div>
        );
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {/* 총 투표수 */}
            <div className="text-xs text-gray-500 mb-1">
                총 {totalVotes}표
            </div>

            {/* 미니 바 차트 */}
            <div className="space-y-1">
                {chartData.slice(0, 3).map((item) => ( // 최대 3개만 표시
                    <div key={item.id} className="flex items-center gap-1 text-xs">
                        <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-0">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.color
                                }}
                            />
                        </div>
                        <span className="text-gray-600 text-xs w-8 text-right">
                            {item.count}
                        </span>
                    </div>
                ))}

                {/* 더 많은 옵션이 있을 때 */}
                {chartData.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">
                        +{chartData.length - 3}개 더
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniVoteChart;