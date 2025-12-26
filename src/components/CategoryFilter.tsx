import React from 'react';
import { type Category, categories } from '../data/category';
import './CategoryFilter.css';

interface CategoryFilterProps {
    selectedCategory: Category;
    onSelectCategory: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="category-filter">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {translateCategory(cat)}
                </button>
            ))}
        </div>
    );
};

const translateCategory = (cat: Category): string => {
    switch (cat) {
        case 'All': return '전체';
        case 'Productivity': return '생산성';
        case 'Creativity': return '창작';
        case 'Education': return '교육';
        case 'Game': return '게임';
        case 'Utility': return '유틸리티';
        default: return cat;
    }
};

export default CategoryFilter;
