import {SortButton} from "@/components/SortButton.tsx";

export type SortType = "desc" | "vote" | "endingSoon";
const SORT_OPTIONS: {key: SortType; label: string}[] = [
    { key: "desc",       label: "최신순" },
    { key: "vote",       label: "투표수순" },
    { key: "endingSoon", label: "마감임박" },
];

export function SortControls({
                                 value,
                                 onChange,
                             }: { value: SortType; onChange: (v: SortType) => void }) {
    return (
        <div className="flex gap-2" role="radiogroup" aria-label="정렬">
            {SORT_OPTIONS.map(opt => (
                <SortButton
                    key={opt.key}
                    active={value === opt.key}
                    onClick={() => onChange(opt.key)}
                >
                    {opt.label}
                </SortButton>
            ))}
        </div>
    );
}
