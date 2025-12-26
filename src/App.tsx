import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import GalleryGrid from './components/GalleryGrid';
import Modal from './components/Modal';
import { apps, type Category, type AppItem } from './data/apps';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const filteredApps = useMemo(() => {
    if (selectedCategory === 'All') return apps;
    return apps.filter(app => app.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container main-content">
        <section className="hero-section">
          <h1 className="hero-title">Gemini와 함께하는<br />AI의 미래</h1>
          <p className="hero-subtitle">
            디지털조이AI의 최신 AI 기술로 만들어진 다양한 앱을 경험해보세요.
          </p>
        </section>

        <section className="gallery-section">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <GalleryGrid
            apps={filteredApps}
            onAppClick={setSelectedApp}
          />
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 AI Gallery Showcase. Powered by 디지털조이AI Gemini.</p>
        </div>
      </footer>

      <Modal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}

export default App;
