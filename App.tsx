
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DatabasePage from './pages/DatabasePage';
import MyPlantsPage from './pages/MyPlantsPage';
import IdentifyPage from './pages/IdentifyPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import TipsPage from './pages/TipsPage';
import ChatPage from './pages/ChatPage';
import { Page } from './types';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const { user } = useAuth();
    const { t } = useLocalization();

    const protectedPages: Page[] = useMemo(() => ['database', 'my-plants', 'identify', 'diagnostics', 'tips'], []);

    useEffect(() => {
        const redirectPage = sessionStorage.getItem('redirectAfterLogin');
        if (user && redirectPage) {
            setCurrentPage(redirectPage as Page);
            sessionStorage.removeItem('redirectAfterLogin');
        }
    }, [user]);

    useEffect(() => {
        if (!user && protectedPages.includes(currentPage)) {
            sessionStorage.setItem('redirectAfterLogin', currentPage);
            setAuthModalOpen(true);
        }
    }, [currentPage, user, setAuthModalOpen, protectedPages]);

    const renderPage = () => {
        if (!user && protectedPages.includes(currentPage)) {
             return <HomePage setCurrentPage={setCurrentPage} setAuthModalOpen={setAuthModalOpen} />;
        }
        switch (currentPage) {
            case 'home':
                return <HomePage setCurrentPage={setCurrentPage} setAuthModalOpen={setAuthModalOpen} />;
            case 'database':
                return <DatabasePage />;
            case 'my-plants':
                return <MyPlantsPage />;
            case 'identify':
                return <IdentifyPage />;
            case 'diagnostics':
                return <DiagnosticsPage />;
            case 'tips':
                return <TipsPage />;
            case 'chat':
                return <ChatPage />;
            default:
                return <HomePage setCurrentPage={setCurrentPage} setAuthModalOpen={setAuthModalOpen} />;
        }
    };

    return (
        <div className="min-h-screen bg-green-50/50 font-sans text-gray-800">
            <Header
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isAuthModalOpen={isAuthModalOpen}
                setAuthModalOpen={setAuthModalOpen}
            />
            <main className="p-4 sm:p-6 md:p-8">
                {renderPage()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LocalizationProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </LocalizationProvider>
    );
};

export default App;
