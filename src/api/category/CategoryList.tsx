import axios from 'axios';
import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Category[]>('/api/category/all');
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

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div>
            <select className="your-existing-classes">
                <option value="">카테고리 선택</option>
                {loading && <option disabled>로딩 중...</option>}
                {error && <option disabled>에러 발생</option>}
                {categories.map(category => (
                    <option key={category.id}
                            value={category.id}
                            >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryList;