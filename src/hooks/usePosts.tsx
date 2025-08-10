import type { PostProps } from "@/props/PostProps";
import {useEffect, useState} from "react";
import api from "@/api/axiosConfig.ts";
import type {SearchParams} from "@/props/SearchParams.ts";

export const usePosts = (params: SearchParams, slug?: string) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            let apiUrl = 'posts';
            if (slug) apiUrl = `posts/category/${slug}`;
            if (params.title) apiUrl = `posts/search`;

            const response = await api.get(apiUrl, { params });
            setPosts(response.data.data);
        } catch (err) {
            setError('게시글을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [params, slug]);

    return { posts, loading, error, refetch: fetchPosts };
};