// pages/CategoryManage.tsx
import { useCategories } from "@/hooks/useCategories.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";

import CategoryRow from "@/components/category/CategoryRow.tsx";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogHeader, AlertDialogCancel, AlertDialogAction, AlertDialogFooter
} from "@/components/ui/alert-dialog.tsx";

export default function CategoryManage() {
    const { categories, categoryTree, addCategory, deleteCategory, loading } = useCategories();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentId, setParentId] = useState<number | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [validationAlertOpen, setValidationAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

                            <Button type="button" onClick={handleAddCategory} className="border-2 border-solid border-gray-300">
                                추가
                            </Button>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

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
