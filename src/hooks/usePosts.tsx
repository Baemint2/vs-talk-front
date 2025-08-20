// usePosts.ts
import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/api/axiosConfig";
import type { PostProps } from "@/props/PostProps";
import type { SearchParams } from "@/props/SearchParams";

type SliceResponse<T> = {
    content: T[];
    size?: number;
};

export const usePosts = (params: SearchParams, slug?: string, pageSize = 20) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState(true);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // 가드용 ref
    const ioRef = useRef<IntersectionObserver | null>(null);
    const observingRef = useRef(false);
    const inFlightRef = useRef(false);
    const userInteractedRef = useRef(false);
    const afterFirstPageLoadedRef = useRef(false);

    const contentExceedsViewport = () =>
        document.documentElement.scrollHeight > window.innerHeight;

    const sentinelBelowFold = (el: HTMLElement) =>
        el.getBoundingClientRect().top >= window.innerHeight;

    // 사용자 스크롤/입력 감지
    useEffect(() => {
        const onUser = () => {
            userInteractedRef.current = true;
        };
        window.addEventListener("wheel", onUser, { passive: true });
        window.addEventListener("touchmove", onUser, { passive: true });
        window.addEventListener("keydown", onUser);
        return () => {
            window.removeEventListener("wheel", onUser);
            window.removeEventListener("touchmove", onUser);
            window.removeEventListener("keydown", onUser);
        };
    }, []);

    // params/slug 변경 시 초기화
    useEffect(() => {
        setPosts([]);
        setPage(0);
        setHasNext(true);
        inFlightRef.current = false;
        afterFirstPageLoadedRef.current = false;
    }, [JSON.stringify(params), slug]);

    const fetchPage = useCallback(
        async (pageToLoad: number) => {
            if (inFlightRef.current || !hasNext) return;

            inFlightRef.current = true;
            setLoading(true);
            try {
                let apiUrl = "posts";
                if (slug) apiUrl = `posts/category/${slug}`;
                if (params.title) apiUrl = "posts/search";

                const { data: res } = await api.get<SliceResponse<PostProps>>(apiUrl, {
                    params: { ...params, page: pageToLoad, size: pageSize },
                });
                console.log(res.content);
                const pageItems = res.content ?? [];
                // (선택) 투표수 병합
                let merged = pageItems;
                if (pageItems.length > 0) {
                    try {
                        const { data: counts } = await api.get(`/votes/count`);
                        const countMap: Record<number, number> = Array.isArray(counts)
                            ? counts.reduce(
                                (acc: Record<number, number>, cur: { postId: number; count: number }) => {
                                    acc[cur.postId] = cur.count;
                                    return acc;
                                },
                                {}
                            )
                            : counts && counts.postId
                                ? { [counts.postId]: counts.count }
                                : {};
                        merged = pageItems.map((p) => ({ ...p, voteCount: countMap[p.id] ?? 0 }));
                    } catch {
                        merged = pageItems.map((p) => ({ ...p, voteCount: 0 }));
                    }
                }

                setPosts((prev) => [...prev, ...merged]);

                // hasNext 계산
                const noMore = (res.content?.length ?? 0) < pageSize ;
                setHasNext(!noMore);

                if (pageToLoad === 0) afterFirstPageLoadedRef.current = true;
            } catch (err) {
                console.error(err);
                setError("게시글을 불러오는데 실패했습니다.");
                setHasNext(false);
            } finally {
                setLoading(false);
                inFlightRef.current = false;
            }
        },
        [params, slug, pageSize, hasNext]
    );

    // page 변경되면 해당 페이지 로드
    useEffect(() => {
        if (!hasNext) return;
        fetchPage(page);
    }, [page, fetchPage, hasNext]);

    // IntersectionObserver 콜백
    const onIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const e = entries[0];
            if (!e?.isIntersecting) return;
            if (inFlightRef.current) return;
            if (!afterFirstPageLoadedRef.current) return;
            if (!userInteractedRef.current) return;
            if (!contentExceedsViewport()) return;
            if (!hasNext) return;

            // 트리거 시 즉시 관찰 해제 → 중복 방지
            if (ioRef.current && loadMoreRef.current) {
                ioRef.current.unobserve(loadMoreRef.current);
                observingRef.current = false;
            }

            setPage((p) => p + 1);
        },
        [hasNext]
    );

    // 옵저버 생성/부착
    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el || !hasNext) return;

        if (!ioRef.current) {
            ioRef.current = new IntersectionObserver(onIntersect, {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            });
        }

        // 초기부터 화면 안에 있으면 스크롤 후 부착
        if (!sentinelBelowFold(el)) {
            const onFirstScroll = () => {
                if (sentinelBelowFold(el)) {
                    if (ioRef.current && !observingRef.current) {
                        ioRef.current.observe(el);
                        observingRef.current = true;
                    }
                    window.removeEventListener("scroll", onFirstScroll);
                }
            };
            window.addEventListener("scroll", onFirstScroll, { passive: true });
            return () => window.removeEventListener("scroll", onFirstScroll);
        }

        if (ioRef.current && !observingRef.current) {
            ioRef.current.observe(el);
            observingRef.current = true;
        }

        return () => {
            if (ioRef.current && el) {
                ioRef.current.unobserve(el);
                observingRef.current = false;
            }
        };
    }, [hasNext, onIntersect]);

    // 로딩이 끝나면 다시 observe
    useEffect(() => {
        if (loading) return;
        if (!hasNext) return;
        const el = loadMoreRef.current;
        if (!(el && ioRef.current)) return;
        if (!observingRef.current) {
            ioRef.current.observe(el);
            observingRef.current = true;
        }
    }, [loading, hasNext]);

    return {
        posts,
        loading,
        error,
        hasNext,
        loadMoreRef,
        refetchFirstPage: () => {
            setPosts([]);
            setPage(0);
            setHasNext(true);
            inFlightRef.current = false;
            afterFirstPageLoadedRef.current = false;
        },
    };
};
