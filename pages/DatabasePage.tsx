
import React, { useState, useMemo } from 'react';
import { getPlantDatabase } from '../services/plantService';
import PlantCard from '../components/PlantCard';
import { useLocalization } from '../context/LocalizationContext';
import { Plant } from '../types';

const DatabasePage: React.FC = () => {
    const { t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');
    const plantDatabase = useMemo(() => getPlantDatabase(), []);

    const filteredPlants = useMemo(() => {
        return plantDatabase.filter(plant =>
            plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, plantDatabase]);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-800">{t('database.title')}</h1>
            <div className="mb-8 max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder={t('database.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlants.map(plant => (
                    <PlantCard key={plant.id} plant={plant} />
                ))}
            </div>
        </div>
    );
};

export default DatabasePage;
