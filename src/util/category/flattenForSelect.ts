import type {CategoryTree} from "@/hooks/useCategories.tsx";

export function flattenForSelect(
    nodes: CategoryTree[],
    parentPath: string[] = [],
) {
    const out: { id: number; label: string }[] = [];
    for (const n of nodes) {
        const path = [...parentPath, n.name];
        out.push({ id: n.id, label: path.join(" › ") });
        if (n.children?.length) out.push(...flattenForSelect(n.children, path));
    }
    return out;
}

// ✅ 수정용: 특정 카테고리와 그 하위 카테고리를 제외한 flatten
export function flattenForSelectExcluding(
    nodes: CategoryTree[],
    excludeId?: number,
    parentPath: string[] = []
): { id: number; label: string }[] {
    const out: { id: number; label: string }[] = [];

    for (const n of nodes) {
        // 자기 자신이면 제외 (하위 카테고리도 자동으로 제외됨)
        if (excludeId && n.id === excludeId) {
            continue;
        }

        const path = [...parentPath, n.name];
        out.push({ id: n.id, label: path.join(" › ") });

        // 하위 카테고리 재귀 처리
        if (n.children?.length) {
            out.push(...flattenForSelectExcluding(n.children, excludeId, path));
        }
    }

    return out;
}
