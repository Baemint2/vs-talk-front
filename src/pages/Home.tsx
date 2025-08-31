import logo from '../assets/logo2.png';
import Post from "@/components/post/Post.tsx";
import {useEffect, useMemo, useState} from "react";
import { Search, X } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { type CategoryTree, useCategories } from "@/hooks/useCategories.tsx";
import { usePosts } from "@/hooks/usePosts.tsx";
import { SortControls, type SortType } from "@/components/common/SortControls.tsx";
import PostSkeleton from "@/components/post/PostSkeleton.tsx";

function findBySlug(nodes: CategoryTree[], slug?: string): CategoryTree | undefined {
    if (!slug) return undefined;
    for (const n of nodes) {
        if (n.slug === slug) return n;
        const hit = findBySlug(n.children ?? [], slug);
        if (hit) return hit;
    }
    return undefined;
}

// 한 파일 내에서 재사용하는 간단 탭 버튼
function TabButton({
                       active,
                       onClick,
                       children,
                       tone = "blue",
                   }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    tone?: "blue" | "indigo";
}) {
    const activeClass =
        tone === "blue"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-indigo-600 text-white border-indigo-600";
    const inactiveClass = "bg-white text-gray-700 border-gray-300";
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full border text-sm ${active ? activeClass : inactiveClass}`}
        >
            {children}
        </button>
    );
}

const Home = () => {
    const location = useLocation();
    const params = useParams();
    const { categoryTree } = useCategories();

    const [searchInput, setSearchInput] = useState<string>('');
    const [searchParams, setSearchParams] = useState<{ orderBy: SortType; title?: string }>({
        orderBy: "desc",
    });

    const isCategoryPage = location.pathname.startsWith('/category/');
    const slug = params.slug as string | undefined;

    const currentCategory = useMemo(
        () => findBySlug(categoryTree, slug),
        [categoryTree, slug]
    );

    // 탭 상태
    const [childSlug, setChildSlug] = useState<string>("");
    const [grandSlug, setGrandSlug] = useState<string>("");

    // 부모 카테고리 변경 시 하위 선택 초기화
    useEffect(() => {
        setChildSlug("");
        setGrandSlug("");
    }, [slug]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const childCategories = currentCategory?.children ?? [];
    const selectedChild = useMemo(
        () => (childSlug ? childCategories.find(c => c.slug === childSlug) : undefined),
        [childCategories, childSlug]
    );
    const grandChildCategories = selectedChild?.children ?? [];

    // 어떤 슬러그로 글을 조회할지 결정 (손자 > 자식 > 부모)
    const effectiveSlug = (grandSlug || childSlug || slug) as string | undefined;

    const { posts, hasNext, loadMoreRef, loading } = usePosts(searchParams, effectiveSlug, 20);

    console.log(posts);
    // 검색
    const handleSearch = () => {
        setSearchParams(prev => ({ ...prev, title: searchInput }));
    };
    const handleClearSearch = () => {
        setSearchInput('');
        setSearchParams(prev => ({ ...prev, title: undefined }));
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };
    const isSearching = !!(searchParams.title && searchParams.title.trim() !== '');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-6">
                        {!isCategoryPage && (
                            <div className="flex flex-col items-center gap-4">
                                <img src={logo} alt="logo" className="w-16 h-16 rounded-xl" />
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
                                onKeyDown={handleKeyPress}
                            />
                            {isSearching && (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    title="검색 초기화"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            )}
                            <button
                                onClick={handleSearch}
                                className="pr-4 hover:bg-gray-200 p-3 rounded-r-full transition-colors"
                                type="button"
                            >
                                <Search size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {isCategoryPage && currentCategory && (
                            <div className="w-full max-w-6xl flex flex-col gap-2">
                                {childCategories.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-2 whitespace-nowrap">
                                            <TabButton
                                                active={!childSlug}
                                                onClick={() => {
                                                    setChildSlug("");
                                                    setGrandSlug("");
                                                }}
                                                tone="blue"
                                            >
                                                전체
                                            </TabButton>

                                            {childCategories.map((c) => (
                                                <TabButton
                                                    key={c.id}
                                                    active={childSlug === c.slug}
                                                    onClick={() => {
                                                        setChildSlug(c.slug);
                                                        setGrandSlug("");
                                                    }}
                                                    tone="blue"
                                                >
                                                    {c.name}
                                                </TabButton>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedChild && grandChildCategories.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-2 whitespace-nowrap">
                                            <TabButton
                                                active={!grandSlug}
                                                onClick={() => setGrandSlug("")}
                                                tone="indigo"
                                            >
                                                {selectedChild.name} 전체
                                            </TabButton>

                                            {grandChildCategories.map((gc) => (
                                                <TabButton
                                                    key={gc.id}
                                                    active={grandSlug === gc.slug}
                                                    onClick={() => setGrandSlug(gc.slug)}
                                                    tone="indigo"
                                                >
                                                    {gc.name}
                                                </TabButton>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-700">
                            {isSearching ? `"${searchParams.title}" 검색 결과` : '게시글 목록'}
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
                    <SortControls
                        value={searchParams.orderBy}
                        onChange={(v) => setSearchParams(prev => ({ ...prev, orderBy: v }))}
                    />
                </div>

                {/* 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // ✅ 스켈레톤 UI 표시 (12개)
                        Array.from({ length: 12 }).map((_, index) => (
                            <PostSkeleton key={index} />
                        ))
                    ) : (
                        // ✅ 실제 게시글 데이터 표시
                        posts.map(post => (
                            <Post
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                author={post.author}
                                categoryName={post.categoryName}
                                videoId={post.videoId}
                                createdAt={post.createdAt}
                                commentCount={post.commentCount}
                                voteCount={post.voteCount}
                                voteEndTime={post.voteEndTime}
                                voteEnabled={post.voteEnabled}
                                voteOptionList={post.voteOptionList}
                                voteCounts={post.voteCounts}
                                showMiniChart={true} // 홈에서는 미니 차트 표시
                            />
                        ))
                    )}
                    {!loading && hasNext && <div ref={loadMoreRef} style={{ height: 1 }} />}
                </div>
            </div>
        </div>
    );
};

export default Home;
