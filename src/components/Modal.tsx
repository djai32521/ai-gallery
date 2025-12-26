import React, { useEffect } from 'react';
import { type AppItem } from '../data/apps';
import './Modal.css';

interface ModalProps {
    app: AppItem | null;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ app, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        if (app) document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [app, onClose]);

    if (!app) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-image-wrapper">
                    {app.videoUrl ? (
                        <video
                            src={app.videoUrl}
                            className="modal-video"
                            controls
                            autoPlay
                            loop
                        />
                    ) : (
                        <img src={app.imageUrl} alt={app.title} className="modal-image" />
                    )}
                </div>
                <div className="modal-body">
                    <div className="modal-header">
                        <h2 className="modal-title">{app.title}</h2>
                        <div className="modal-tags">
                            {app.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <p className="modal-description">{app.description}</p>
                    <div className="modal-actions">
                        <button className="btn-primary">
                            사용해보기 (데모)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
