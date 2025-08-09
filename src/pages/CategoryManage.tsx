import {useCategories} from "@/hooks/useCategories.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";

const CategoryManage = () => {
    const {categories, addCategory, deleteCategory } = useCategories();
    const [open, setOpen] = useState(false)
    const [inputKorValue, setInputKorValue] = useState('');
    const [inputEngValue, setInputEngValue] = useState('');

    const handleAddCategory = async () => {
        try {
            await addCategory(inputKorValue, inputEngValue);
        } catch (err) {
            console.error('카테고리 추가 실패:', err);
        } finally {
            setOpen(false);
            setInputKorValue('');
            setInputEngValue('');
        }
    };


    const handleDeleteCategory = async (id: number) => {
        if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
            try {
                await deleteCategory(id)

            } catch (err: any) {
                if (err.response?.status === 400) {
                    alert(err.response.data);
                }
                console.error('카테고리 삭제 실패:', err);
            }
        }
    };

    return <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">카테고리 관리</h3>
             <form>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setOpen(true)}
                                    className="border-2 border-solid border-gray-300 text-2xl"
                            >
                                새 카테고리 추가
                            </Button>
                        </DialogTrigger>
                        <DialogContent aria-describedby="dialog-desc">
                            <DialogHeader>
                                <DialogTitle>카테고리</DialogTitle>
                                <DialogDescription>
                                    추가할 카테고리명과 영문명을 입력해주세요
                                </DialogDescription>
                                <Input
                                    name="videoId"
                                    onChange={(e) => setInputKorValue(e.target.value)}
                                    type="text"
                                    placeholder="한글명을 입력해주세요"/>
                                <Input
                                    name="videoId"
                                    onChange={(e) => setInputEngValue(e.target.value)}
                                    type="text"
                                    placeholder="영문명을 입력해주세요"/>
                            </DialogHeader>
                            <Button onClick={handleAddCategory}
                                    className="border-2 border-solid border-gray-300">
                                추가
                            </Button>
                        </DialogContent>
                    </Dialog>
                </form>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        영문명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        편집
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {category.name}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {category.slug}
                            </div>
                        </td>
                        <td className="px-1 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 border border-solid border-gray-300 rounded-lg p-1">
                                <Button onClick={() => handleDeleteCategory(category.id)}>
                                    삭제
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
}

export default CategoryManage;