import {useCategories} from "@/hooks/useCategories.tsx";
import {useMemo} from "react";
import {flattenForSelect} from "@/util/category/flattenForSelect.ts";
import {Select, SelectItem, SelectValue} from "@/components/ui/select.tsx";
import {SelectContent, SelectTrigger} from "@radix-ui/react-select";

interface CategoryProps {
    value?: number;
    onChange: (id: number | undefined) => void;
}

const CategoryList = ({ value, onChange }: CategoryProps) => {
    const { categoryTree, loading, error } = useCategories();
    const options = useMemo(() => flattenForSelect(categoryTree), [categoryTree]);

    if (loading) return <div>로딩 중...</div>;
    if (error)   return <div>에러: {String(error)}</div>;

    return (
        <Select
            value={value === undefined ? "" : String(value)}
            onValueChange={(v) => onChange(v === "" ? undefined : Number(v))}
        >
            <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white z-50" position="popper">
                {options.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CategoryList;