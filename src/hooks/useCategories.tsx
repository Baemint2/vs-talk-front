import { useState, useEffect } from 'react';
import api from "@/api/axiosConfig.ts";

interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
}

export interface CategoryTree {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    children: CategoryTree[];
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get('categories');
                const response1 = await api.get('categories/tree');
                setCategories(response.data.data);
                setCategoryTree(response1.data.data);
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
    const addCategory = async (name: string, slug: string, parentId: number | null) => {
        try {
            const newCategory = {
                name,
                slug: slug.toLowerCase(),
                parentId: parentId === null ? null : parentId,
            };

            const response = await api.post('categories', newCategory);

            // 상태에 새 카테고리 추가
            setCategories(prev => [...prev, response.data.data]);

            return response.data;
        } catch (err) {
            setError('카테고리 추가에 실패했습니다.');
            console.error(err);
            throw err;
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await api.delete(`categories/${id}`);

            window.location.reload();
        } catch (error) {
            setError('카테고리 삭제 실패');
            console.error(error);
            throw error;
        }
    }


    return { categories: categories, categoryTree, loading, error, addCategory, deleteCategory };
}