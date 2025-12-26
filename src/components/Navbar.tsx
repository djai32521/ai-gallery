import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <div className="navbar-logo">
                    <span className="logo-icon">✨</span>
                    <span className="logo-text">디지털조이AI AI Studio Showcase</span>
                </div>
                <div className="navbar-links">
                    {/* Add links here if needed, for now just a placeholder or external link */}
                    <a href="#" className="nav-link active">Gallery</a>
                    <a href="#" className="nav-link">About</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
