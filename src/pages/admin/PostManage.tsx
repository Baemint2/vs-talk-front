import {Button} from "@/components/ui/button.tsx";
import {usePosts} from "@/hooks/usePosts.tsx";
import type {SearchParams} from "@/props/SearchParams.ts";
import api from "@/api/axiosConfig.ts";
import {useNavigate} from "react-router-dom";

const PostManage = (params: SearchParams) => {
    const {posts, refetchFirstPage} = usePosts(params);
    const navigate = useNavigate();

    const handleDeletePost = async (id: number) => {
        // confirm 창 추가하기
        await api.delete(`posts/${id}`)
        await refetchFirstPage();
    };

    const handleUpdatePost = (id: number) => {
        navigate('/post/update/' + id);
    };

    const handleAddPost = () => {
        navigate('/post/add');
    }

    return <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">게시글 관리</h3>
            <Button onClick={() => handleAddPost()}
                    className="border-2 border-solid border-gray-300 text-2xl"
            >
                새 게시글 추가
            </Button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        게시글명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작성자
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                        편집
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.id}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
                                {post.title}
                            </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-xs font-medium text-gray-900">
                                {post.author}
                            </div>
                        </td>
                        <td className="px-3 py-3 text-black">
                            <Button onClick={() => handleUpdatePost(post.id)}>
                                수정
                            </Button>
                        </td>
                        <td className="px-3 py-3 text-black">
                            <Button onClick={() => handleDeletePost(post.id)}>
                                삭제
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
}

export default PostManage;