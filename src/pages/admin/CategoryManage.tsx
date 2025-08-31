// pages/CategoryManage.tsx
import {type CategoryTree, useCategories} from "@/hooks/useCategories.tsx";
import {
    type Key,
    type ReactElement,
    type ReactNode,
    type ReactPortal,
    useMemo,
    useState
} from "react";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";

import CategoryRow from "@/components/category/CategoryRow.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {flattenForSelect, flattenForSelectExcluding} from "@/util/category/flattenForSelect.ts";

export default function CategoryManage() {
    const {categories, categoryTree, addCategory, updateCategory, deleteCategory, loading} = useCategories();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentId, setParentId] = useState<number | null>(null);

    // ✅ 수정 관련 state
    const [editOpen, setEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryTree | null>(null);
    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editParentId, setEditParentId] = useState<number | null>(null);


    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [validationAlertOpen, setValidationAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ 선택 옵션들 - flattenForSelect 활용
    const editParentOptions = useMemo(() => {
        return editingCategory
            ? flattenForSelectExcluding(categoryTree, editingCategory.id)
            : flattenForSelect(categoryTree);
    }, [categoryTree, editingCategory]);

    const handleAddCategory = async () => {
        if (!name.trim() || !slug.trim()) {
            setValidationAlertOpen(true);
            return;
        }
        try {
            await addCategory(name.trim(), slug.trim().toLowerCase(), parentId);
            setOpen(false);
            setName("");
            setSlug("");
            setParentId(null);
            location.reload();
        } catch (e) {
            console.error(e);
            setErrorMessage("카테고리 추가 실패");
            setErrorAlertOpen(true);
        }
    };

    // ✅ 수정 함수들
    const handleEditCategory = (category: CategoryTree) => {
        setEditingCategory(category);
        setEditName(category.name);
        setEditSlug(category.slug);
        setEditParentId(category.parentId);
        setEditOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editName.trim() || !editSlug.trim()) {
            setValidationAlertOpen(true);
            return;
        }

        // 자기 자신을 부모로 설정하려는 경우 방지
        if (editParentId === editingCategory.id) {
            setErrorMessage("자기 자신을 부모 카테고리로 설정할 수 없습니다.");
            setErrorAlertOpen(true);
            return;
        }

        try {
            await updateCategory(editingCategory.id, {
                name: editName.trim(),
                slug: editSlug.trim().toLowerCase(),
                parentId: editParentId
            });

            setEditOpen(false);
            setEditingCategory(null);
            setEditName("");
            setEditSlug("");
            setEditParentId(null);
            location.reload();
        } catch (e) {
            console.error(e);
            setErrorMessage("카테고리 수정 실패");
            setErrorAlertOpen(true);
        }
    };

    const handleCancelEdit = () => {
        setEditOpen(false);
        setEditingCategory(null);
        setEditName("");
        setEditSlug("");
        setEditParentId(null);
    };

    const handleDeleteCategory = (id: number) => {
        setCategoryToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (categoryToDelete === null) return;

        try {
            await deleteCategory(categoryToDelete);
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setErrorMessage(err?.response?.data || "카테고리 삭제 실패");
            setErrorAlertOpen(true);
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">카테고리 관리</h3>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" className="border-2 border-solid border-gray-300 text-2xl">
                            새 카테고리 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="dialog-desc">
                        <DialogHeader>
                            <DialogTitle>카테고리</DialogTitle>
                            <DialogDescription>추가할 카테고리명과 영문명(슬러그)를 입력하세요</DialogDescription>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name="categoryName"
                                type="text"
                                placeholder="한글명을 입력해주세요"
                            />
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                name="categorySlug"
                                type="text"
                                placeholder="영문명(슬러그)을 입력해주세요 (예: sports)"
                            />

                            <Button type="button" onClick={handleAddCategory}
                                    className="border-2 border-solid border-gray-300">
                                추가
                            </Button>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ✅ 수정 다이얼로그 */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>카테고리 수정</DialogTitle>
                        <DialogDescription>
                            {editingCategory?.name} 카테고리를 수정합니다
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">카테고리명</label>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="한글명을 입력해주세요"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">영문명 (슬러그)</label>
                            <Input
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                placeholder="영문명(슬러그)을 입력해주세요"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">부모 카테고리</label>
                            <Select
                                value={editParentId ? String(editParentId) : ""}
                                onValueChange={(value) => setEditParentId(value === "" ? null : Number(value))}
                            >
                                {/* ✅ SelectTrigger 추가 */}
                                <SelectTrigger>
                                    <SelectValue placeholder="부모 카테고리 선택 (선택사항)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {editParentOptions.map((option: { id: Key | null | undefined; label: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                        <SelectItem key={option.id} value={String(option.id)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                                자기 자신과 하위 카테고리는 부모로 선택할 수 없습니다
                            </p>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button variant="outline" onClick={handleCancelEdit} className="flex-1">취소</Button>
                            <Button onClick={handleUpdateCategory} className="flex-1">수정</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">카테고리명</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">영문명</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500" colSpan={2}>편집</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                                불러오는 중…
                            </td>
                        </tr>
                    ) : categories.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                                카테고리가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        categoryTree.map((root) => (
                            <CategoryRow key={root.id}
                                         node={root}
                                         depth={0}
                                         onAdd={(id) => {
                                             setParentId(id)
                                             setOpen(true)
                                         }}
                                         onEdit={handleEditCategory}
                                         onDelete={handleDeleteCategory} />
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* 입력 검증 알림 다이얼로그 */}
            <AlertDialog open={validationAlertOpen} onOpenChange={setValidationAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>입력 오류</AlertDialogTitle>
                        <AlertDialogDescription>
                            한글명/영문명(슬러그)를 입력해주세요.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            정말로 이 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteCategory}
                        >
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={errorAlertOpen} onOpenChange={setErrorAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>오류</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
