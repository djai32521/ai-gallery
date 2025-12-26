import React from 'react';
import { type AppItem } from '../data/apps';
import AppCard from './AppCard';
import './GalleryGrid.css';

interface GalleryGridProps {
    apps: AppItem[];
    onAppClick: (app: AppItem) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ apps, onAppClick }) => {
    if (apps.length === 0) {
        return (
            <div className="no-results">
                <p>해당 카테고리에 앱이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="gallery-grid">
            {apps.map((app) => (
                <AppCard key={app.id} app={app} onClick={() => onAppClick(app)} />
            ))}
        </div>
    );
};

export default GalleryGrid;
