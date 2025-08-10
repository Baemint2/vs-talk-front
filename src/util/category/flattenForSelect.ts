import type {CategoryTree} from "@/hooks/useCategories.tsx";

export function flattenForSelect(nodes: CategoryTree[], depth = 0) {
    const out: { id: number; label: string }[] = [];
    for (const n of nodes) {
        out.push({ id: n.id, label: `${"— ".repeat(depth)}${n.name}` });
        if (n.children?.length) out.push(...flattenForSelect(n.children, depth + 1));
    }
    return out;
}
