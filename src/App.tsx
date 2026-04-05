import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'auth' | 'dashboard' | 'portfolio'>('auth');
  const [portfolioUserId, setPortfolioUserId] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const portfolioMatch = path.match(/^\/portfolio\/([a-f0-9-]+)$/i);

    if (portfolioMatch) {
      setCurrentView('portfolio');
      setPortfolioUserId(portfolioMatch[1]);
    } else if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
  }, [user, window.location.pathname]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const portfolioMatch = path.match(/^\/portfolio\/([a-f0-9-]+)$/i);

      if (portfolioMatch) {
        setCurrentView('portfolio');
        setPortfolioUserId(portfolioMatch[1]);
      } else if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('auth');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (currentView === 'portfolio' && portfolioUserId) {
    return <Portfolio userId={portfolioUserId} />;
  }

  if (!user) {
    return <Auth />;
  }

  return <Dashboard />;
}

export default App;
