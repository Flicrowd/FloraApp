
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { Page } from '../types';
import AuthModal from './AuthModal';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (isOpen: boolean) => void;
}

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.598 15.25 15.25 0 01-1.54-1.128 15.501 15.501 0 01-1.325-1.464 15.918 15.918 0 01-1.077-1.827c-.312-.613-.598-1.26-.84-1.939-.241-.678-.432-1.383-.585-2.124-.152-.741-.247-1.49-.283-2.25l-.014-.287c-.01-.195-.018-.386-.023-.572a15.215 15.215 0 01.023-.572c.006-.186.014-.372.023-.558.051-.994.158-1.987.32-2.958.164-.971.39-1.916.68-2.819.292-.902.635-1.766 1.024-2.572.39-.806.828-1.554 1.31-2.24.482-.686 1.008-1.308 1.57-1.857a7.258 7.258 0 012.35-.972 8.612 8.612 0 013.821 0 7.256 7.256 0 012.35.972c.563.55.087 1.17.57 1.857.482.686.92 1.434 1.31 2.24.39.806.728 1.67 1.024 2.572.292.903.556 1.848.68 2.819.162.97.269 1.964.32 2.958.006.186.014.372.023.558a15.215 15.215 0 01.023.572l.014.287c.036.76.131 1.513.283 2.25.152.741.343 1.446.585 2.124.242.679.528 1.326.84 1.939.243.515.454 1.04.628 1.576.174.536.308 1.08.399 1.623.09.543.132 1.095.125 1.642a10.91 10.91 0 01-.25 2.25c-.25.7-.587 1.36-.994 1.96a10.99 10.99 0 01-1.325 1.615c-.443.476-.934.9-1.464 1.267-.53.368-1.09.675-1.683.91l-.043.018a7.258 7.258 0 01-2.35.972 8.612 8.612 0 01-3.821 0z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, isAuthModalOpen, setAuthModalOpen }) => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLocalization();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems: { page: Page; labelKey: string; authRequired: boolean }[] = [
        { page: 'home', labelKey: 'nav.home', authRequired: false },
        { page: 'database', labelKey: 'nav.database', authRequired: true },
        { page: 'my-plants', labelKey: 'nav.myPlants', authRequired: true },
        { page: 'identify', labelKey: 'nav.identify', authRequired: true },
        { page: 'diagnostics', labelKey: 'nav.diagnostics', authRequired: true },
        { page: 'tips', labelKey: 'nav.tips', authRequired: true },
        { page: 'chat', labelKey: 'nav.chat', authRequired: false },
    ];

    const handleNavClick = (page: Page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const handleLoginClick = () => {
        sessionStorage.removeItem('redirectAfterLogin'); // Clear any pending redirects
        setAuthModalOpen(true);
    };

    return (
        <>
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-green-600">
                                <LeafIcon className="w-8 h-8"/>
                                <span className="text-xl font-bold">Flora AI</span>
                            </button>
                        </div>
                        <nav className="hidden md:flex md:space-x-4 lg:space-x-6">
                            {navItems.map(item => (
                                (!item.authRequired || user) && (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNavClick(item.page)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.page ? 'text-green-600 bg-green-100' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                                    >
                                        {t(item.labelKey)}
                                    </button>
                                )
                            ))}
                        </nav>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'ru')}
                                className="bg-transparent border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="en">EN</option>
                                <option value="es">ES</option>
                                <option value="ru">RU</option>
                            </select>
                            <div className="hidden md:block">
                                {user ? (
                                    <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                                        {t('auth.logout')}
                                    </button>
                                ) : (
                                    <button onClick={handleLoginClick} className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                                        {t('auth.login')}
                                    </button>
                                )}
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                                    <span className="sr-only">Open main menu</span>
                                    {isMobileMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                             {navItems.map(item => (
                                (!item.authRequired || user) && (
                                    <button
                                        key={item.page}
                                        onClick={() => handleNavClick(item.page)}
                                        className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${currentPage === item.page ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        {t(item.labelKey)}
                                    </button>
                                )
                            ))}
                        </div>
                         <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="px-2 space-y-1">
                                {user ? (
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                        {t('auth.logout')}
                                    </button>
                                ) : (
                                    <button onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                        {t('auth.login')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
};

export default Header;
