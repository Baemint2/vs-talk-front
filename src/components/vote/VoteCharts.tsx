import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';
import { useMemo } from 'react';

interface VoteChartProps {
    options: { id: number; optionText: string }[];
    counts: { voteOptionId: number; count: number }[];
    loading?: boolean;
}

export default function VoteChart({ options, counts }: VoteChartProps) {
    console.log(options, counts);
    const data = useMemo(() => {
        const map = new Map(counts.map(c => [c.voteOptionId, c.count]));
        const rows = options.map(o => ({
            id: o.id,
            name: o.optionText,
            count: map.get(o.id) ?? 0,
        }));
        const total = rows.reduce((s, r) => s + r.count, 0);
        return {
            total,
            rows: rows.map(r => ({ ...r, pct: total ? Math.round((r.count / total) * 1000) / 10 : 0 }))
        };
    }, [options, counts]);

    if (data.rows.length === 0) return null;

    // 원하는 색상 배열 (옵션 수만큼 순환)
    const COLORS = ['#60a5fa', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#fb7185'];

    return (
        <div className="w-full p-3 rounded-xl border bg-white mb-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">현재 투표 현황</span>
                <span className="text-sm text-gray-400">{data.total}명 투표</span>
            </div>
            {data.total === 0 ? (
                <div className="text-sm text-gray-400 py-6 text-center">아직 투표가 없습니다.</div>
            ) : (
                <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.rows}
                            layout="vertical"
                            margin={{ top: 4, right: 30, bottom: 4, left: 8 }} // ← right 여백 30px 이상
                        >
                            <XAxis type="number" hide domain={[0, 'dataMax']} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={80}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(v) => (v.length > 6 ? v.slice(0, 6) + '…' : v)}
                            />
                            <Tooltip
                                formatter={(value: never, _name, props) => {
                                    const pct = props?.payload?.pct ?? 0;
                                    return [`${value}표 (${pct}%)`, ''];
                                }}
                                labelFormatter={(label) => label}
                            />
                            <Bar dataKey="count" radius={[6, 6, 6, 6]} isAnimationActive>
                                <LabelList
                                    dataKey="pct"
                                    position="right"
                                    className="text-[10px] fill-gray-700"
                                />
                                {data.rows.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
