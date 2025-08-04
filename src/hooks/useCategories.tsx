import { useState, useEffect } from 'react';
import api from "@/api/axiosConfig.ts";

interface Category {
    id: number;
    name: string;
    slug: string;
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get<Category[]>('category/all');
                setCategories(response.data);
            } catch (err) {
                setError('카테고리를 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 카테고리 추가 함수
    const addCategory = async (name: string, slug: string) => {
        try {
            const newCategory = {
                name,
                slug: slug.toLowerCase(),
            };

            const response = await api.post<Category>('category/add', newCategory);

            // 상태에 새 카테고리 추가
            setCategories(prev => [...prev, response.data]);

            return response.data;
        } catch (err) {
            setError('카테고리 추가에 실패했습니다.');
            console.error(err);
            throw err;
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await api.delete(`category/delete/${id}`);

            window.location.reload();
        } catch (error) {
            setError('카테고리 삭제 실패');
            console.error(error);
            throw error;
        }
    }


    return { categories, loading, error, addCategory, deleteCategory };
}