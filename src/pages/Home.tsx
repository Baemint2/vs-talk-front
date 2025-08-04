import logo from '../assets/logo2.png'
import Post from "@/components/post/Post.tsx";
import {useState} from "react";
import {Search, X} from "lucide-react";
import {useLocation, useParams} from "react-router-dom";
import {useCategories} from "@/hooks/useCategories.tsx";
import {usePosts} from "@/hooks/usePosts.tsx";

interface SearchParams {
    orderBy: 'desc' | 'asc';
    title?: string;
}

const Home = () => {
    const location = useLocation();
    const params = useParams();
    const { categories } = useCategories();
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchParams, setSearchParams] = useState<SearchParams>({
        orderBy: 'desc' // 기본값: 최신순
    });

    const isCategoryPage = location.pathname.startsWith('/category/');
    const slug = params.slug;
    const currentCategory = categories.find(cat => cat.slug === slug);

    const { posts } = usePosts(searchParams, slug);

    // 정렬 변경 핸들러
    const handleSortChange = (sortType: 'desc' | 'asc') => {
        setSearchParams(prev => ({
            ...prev,
            orderBy: sortType
        }));
    };

    // 검색 실행
    const handleSearch = () => {
        setSearchParams(prev => ({
            ...prev,
            title: searchInput
        }));
    };

    // 검색 초기화
    const handleClearSearch = () => {
        setSearchInput('');
        setSearchParams(prev => ({
            ...prev,
            title: undefined
        }));
    };

    // Enter 키 핸들링
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 현재 검색 중인지 확인
    const isSearching = searchParams.title && searchParams.title.trim() !== '';

    return (
        <div className="min-h-screen bg-gray-50" >
            {/* 헤더 섹션 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-6">
                        {!isCategoryPage && (
                            <div className="flex flex-col items-center gap-4">
                                <img src={logo} alt="logo" className="w-16 h-16 rounded-xl"/>
                            </div>
                        )}
                        {isCategoryPage && currentCategory && (
                            <h2 className="text-3xl font-bold text-gray-800">{currentCategory.name}</h2>
                        )}

                        {/* 검색 바 */}
                        <div className="flex items-center w-full max-w-md bg-gray-100 rounded-full border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <input
                                className="flex-1 h-12 px-6 bg-transparent outline-none rounded-full"
                                placeholder="게시글 검색..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {isSearching && (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    title="검색 초기화"
                                >
                                    <X size={16} className="text-gray-500"/>
                                </button>
                            )}
                            <button
                                onClick={handleSearch}
                                className="pr-4 hover:bg-gray-200 p-3 rounded-r-full transition-colors"
                                type="button"
                            >
                                <Search size={20} className="text-gray-600"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 게시글 목록 */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {isSearching ? `"${searchParams.title}" 검색 결과` : '최근 게시글'} ({posts.length})
                        </h3>
                        {isSearching && (
                            <button
                                onClick={handleClearSearch}
                                className="text-sm text-blue-500 hover:text-blue-700 text-left"
                            >
                                전체 게시글 보기
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                searchParams.orderBy === 'desc'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handleSortChange('desc')}
                        >
                            최신순
                        </button>
                        <button
                            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                searchParams.orderBy === 'asc'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handleSortChange('asc')}
                        >
                            과거순
                        </button>
                    </div>
                </div>

                {/* 그리드 레이아웃 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            author={post.author}
                            updatedAt={post.updatedAt}
                            commentCount={post.commentCount}
                            likeCount={post.likeCount}
                        />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-lg mb-2">
                            {isSearching ? '검색 결과가 없습니다' : '게시글이 없습니다'}
                        </div>
                        <p className="text-gray-500">
                            {isSearching
                                ? '다른 검색어를 시도해보세요'
                                : '첫 번째 게시글을 작성해보세요!'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;