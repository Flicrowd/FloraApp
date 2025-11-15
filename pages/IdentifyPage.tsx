
import React, { useState, useCallback } from 'react';
import { identifyPlant } from '../services/geminiService';
import { useLocalization } from '../context/LocalizationContext';
import Spinner from '../components/Spinner';
import { Plant } from '../types';
import PlantCard from '../components/PlantCard';
import { addUserPlant } from '../services/plantService';

const IdentifyPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Plant | null>(null);
    const [plantAdded, setPlantAdded] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setResult(null);
            setError(null);
            setPlantAdded(false);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIdentify = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        setPlantAdded(false);
        try {
            const responseText = await identifyPlant(selectedFile, language);
            const identifiedPlant = JSON.parse(responseText);
            setResult({ ...identifiedPlant, id: new Date().toISOString(), imageUrl: preview! });
        } catch (err) {
            setError(t('identify.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCollection = () => {
        if (result) {
            addUserPlant(result);
            setPlantAdded(true);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-800">{t('identify.title')}</h1>
            <p className="text-gray-600 mb-6">{t('identify.uploadPrompt')}</p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <input type="file" id="plant-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="plant-upload" className="cursor-pointer inline-block px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
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
                    <button onClick={handleIdentify} disabled={isLoading} className="w-full px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors">
                        {isLoading ? t('identify.identifying') : t('identify.title')}
                    </button>
                )}
            </div>

            {isLoading && <div className="mt-8"><Spinner /></div>}
            {error && <p className="mt-8 text-red-500">{error}</p>}

            {result && (
                <div className="mt-8 text-left">
                    <h2 className="text-2xl font-bold mb-4 text-center">{t('identify.result')}</h2>
                    <PlantCard plant={result} />
                    <button 
                        onClick={handleAddToCollection}
                        disabled={plantAdded}
                        className="w-full mt-4 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                    >
                        {plantAdded ? 'Added!' : t('identify.addCollection')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default IdentifyPage;
