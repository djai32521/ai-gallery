import React from 'react';
import { type AppItem } from '../data/apps';
import './AppCard.css';

interface AppCardProps {
    app: AppItem;
    onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Video play error:', e));
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="app-card"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="card-image-wrapper">
                {app.videoUrl ? (
                    <>
                        <img
                            src={app.imageUrl}
                            alt={app.title}
                            className={`card-image ${isHovered ? 'hidden' : ''}`}
                            loading="lazy"
                        />
                        <video
                            ref={videoRef}
                            src={app.videoUrl}
                            className={`card-video ${isHovered ? 'visible' : ''}`}
                            loop
                            muted
                            playsInline
                            preload="none"
                        />
                    </>
                ) : (
                    <img src={app.imageUrl} alt={app.title} className="card-image" loading="lazy" />
                )}
            </div>
            <div className="card-content">
                <h3 className="card-title">{app.title}</h3>
                <p className="card-description">{app.description}</p>
                <div className="card-tags">
                    {app.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppCard;
