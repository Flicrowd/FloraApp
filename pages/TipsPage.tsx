
import React, { useState, useEffect } from 'react';
import { getCareTips } from '../services/geminiService';
import { useLocalization } from '../context/LocalizationContext';
import Spinner from '../components/Spinner';

interface Tip {
    title: string;
    content: string;
}

const TipsPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [tips, setTips] = useState<Tip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTips = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const responseText = await getCareTips(language);
                const tipsData = JSON.parse(responseText);
                setTips(tipsData.tips);
            } catch (err) {
                setError(t('tips.error'));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-green-800">{t('tips.title')}</h1>

            {isLoading && (
                <div className="text-center py-10">
                    <Spinner />
                    <p className="mt-2">{t('tips.loading')}</p>
                </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!isLoading && !error && (
                <div className="space-y-6">
                    {tips.map((tip, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                            <h2 className="text-xl font-semibold text-green-700 mb-2">{tip.title}</h2>
                            <p className="text-gray-600">{tip.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TipsPage;
