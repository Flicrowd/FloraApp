
import React, { useState } from 'react';
import { diagnosePlant } from '../services/geminiService';
import { useLocalization } from '../context/LocalizationContext';
import Spinner from '../components/Spinner';

interface DiagnosisResult {
    problem: string;
    possibleCauses: string[];
    suggestedSolution: string;
}

const DiagnosticsPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setResult(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDiagnose = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const responseText = await diagnosePlant(selectedFile, language);
            setResult(JSON.parse(responseText));
        } catch (err) {
            setError(t('diagnostics.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-800">{t('diagnostics.title')}</h1>
            <p className="text-gray-600 mb-6">{t('diagnostics.uploadPrompt')}</p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <input type="file" id="diagnostics-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="diagnostics-upload" className="cursor-pointer inline-block px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        {t('identify.selectFile')}
                    </label>
                    {selectedFile && <p className="mt-2 text-sm text-gray-500">{selectedFile.name}</p>}
                </div>

                {preview && (
                    <div className="mb-6">
                        <img src={preview} alt="Plant preview" className="max-w-xs mx-auto rounded-lg shadow-sm" />
                    </div>
                )}

                {selectedFile && (
                    <button onClick={handleDiagnose} disabled={isLoading} className="w-full px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors">
                        {isLoading ? t('diagnostics.diagnosing') : t('diagnostics.title')}
                    </button>
                )}
            </div>

            {isLoading && <div className="mt-8"><Spinner /></div>}
            {error && <p className="mt-8 text-red-500">{error}</p>}

            {result && (
                <div className="mt-8 text-left bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center text-green-800">{t('diagnostics.result')}</h2>
                    {result.problem.toLowerCase().includes("healthy") || result.problem.toLowerCase().includes("sana") || result.problem.toLowerCase().includes("здоровым") ? (
                        <p className="text-center text-lg text-green-700 font-semibold">{t('diagnostics.healthy')}</p>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-red-700">{t('diagnostics.problem')}</h3>
                                <p className="text-gray-700">{result.problem}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-yellow-700">{t('diagnostics.causes')}</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    {result.possibleCauses.map((cause, index) => <li key={index}>{cause}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-green-700">{t('diagnostics.solution')}</h3>
                                <p className="text-gray-700">{result.suggestedSolution}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DiagnosticsPage;
