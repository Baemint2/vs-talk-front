import type {CategoryTree} from "@/hooks/useCategories.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Edit} from "lucide-react";

interface CategoryRowProps {
    node: CategoryTree;
    depth: number;
    onAdd: (id: number) => void;
    onEdit: (node: CategoryTree) => void;
    onDelete: (id: number) => void;
}

const CategoryRow = ({ node, depth, onAdd, onEdit, onDelete, }: CategoryRowProps) => {
        const [open, setOpen] = useState(true);
        const hasChildren = node.children?.length > 0;

        return (
            <>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-500">{node.id}</td>
                    <td className="px-3 py-3">
                        <div className="flex items-center" style={{ paddingLeft: depth * 16 }}>
                            {hasChildren ? (
                                <button
                                    type="button"
                                    className="mr-2 text-gray-500"
                                    onClick={() => setOpen(!open)}
                                    aria-label={open ? "collapse" : "expand"}
                                >
                                    {open ? "▼" : "▶"}
                                </button>
                            ) : (
                                <span className="w-4 mr-2" />
                            )}
                            <span className="font-medium">{node.name}</span>
                        </div>
                    </td>
                    <td className="px-3 py-3 text-sm">{node.slug}</td>
                    <td className="px-3 py-3 text-black">
                        <Button onClick={() => onAdd(node.id)}>
                            추가
                        </Button>
                    </td>
                    <td className="px-3 py-3 text-black">
                        <Button
                            onClick={() => onEdit(node)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            수정
                        </Button>
                    </td>
                    <td className="px-3 py-3 text-black">
                        <Button onClick={() => onDelete(node.id)}>
                            삭제
                        </Button>
                    </td>
                </tr>

                {open &&
                    node.children?.map((child) => (
                        <CategoryRow key={child.id}
                                     node={child}
                                     depth={depth + 1}
                                     onAdd={onAdd}
                                     onEdit={onEdit}
                                     onDelete={onDelete} />
                    ))}
            </>
        );
}

export default CategoryRow;