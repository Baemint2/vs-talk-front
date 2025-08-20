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
