import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { IntakeForm } from './components/IntakeForm';
import { Dashboard } from './components/Dashboard';
import { AiAssistant } from './components/AiAssistant';
import { UserPreferences } from './types';
import { Building2, Menu, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // State with LocalStorage persistence
  const [user, setUser] = useState<UserPreferences | null>(() => {
    try {
      const saved = localStorage.getItem('casa_user_prefs');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persist user state whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('casa_user_prefs', JSON.stringify(user));
    } else {
      localStorage.removeItem('casa_user_prefs');
    }
  }, [user]);

  const handleFormComplete = (data: UserPreferences) => {
    setUser(data);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your profile and start over?')) {
      setUser(null);
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-nyc-orange p-1.5 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-nyc-blue">CASA <span className="text-gray-900">NYC</span></span>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              <button className="text-gray-600 hover:text-nyc-blue font-medium text-sm">Housing Connect</button>
              <button className="text-gray-600 hover:text-nyc-blue font-medium text-sm">Resources</button>
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                    <div className="w-6 h-6 bg-nyc-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{user.fullName}</span>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Start Over"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </nav>
            
            <button className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          {!user ? (
            <div className="py-12 px-4">
              <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Affordable Housing, <span className="text-nyc-blue">Simplified</span>.
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Stop searching multiple sites. CASA NYC matches you with lotteries, HPD listings, and voucher-eligible units in one place.
                </p>
              </div>
              <IntakeForm onComplete={handleFormComplete} />
            </div>
          ) : (
            <Dashboard user={user} onReset={handleReset} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500">© 2024 CASA NYC. Not affiliated with NYC Housing Connect or HPD.</p>
          </div>
        </footer>

        {/* AI Assistant - Always visible */}
        <AiAssistant />
      </div>
    </HashRouter>
  );
};

export default App;