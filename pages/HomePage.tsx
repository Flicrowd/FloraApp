
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Page } from '../types';

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
    setAuthModalOpen: (isOpen: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    const { t } = useLocalization();

    const handleChatClick = () => {
        setCurrentPage('chat');
    };

    return (
        <div className="container mx-auto flex items-center justify-center" style={{ minHeight: 'calc(100vh - 12rem)' }}>
            <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 tracking-tight">{t('home.title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{t('home.subtitle')}</p>
                <div className="mt-12">
                    <button
                        onClick={handleChatClick}
                        className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-3 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {t('chat.title')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;