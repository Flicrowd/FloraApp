
import React, { useState, useCallback, useEffect } from 'react';
import { getUserPlants, removeUserPlant, waterPlant } from '../services/plantService';
import { UserPlant } from '../types';
import PlantCard from '../components/PlantCard';
import { useLocalization } from '../context/LocalizationContext';

const MyPlantsPage: React.FC = () => {
    const { t } = useLocalization();
    const [myPlants, setMyPlants] = useState<UserPlant[]>([]);

    const fetchPlants = useCallback(() => {
        setMyPlants(getUserPlants());
    }, []);

    useEffect(() => {
        fetchPlants();
    }, [fetchPlants]);

    const handleRemovePlant = (plantId: string) => {
        removeUserPlant(plantId);
        fetchPlants();
    };

    const handleWaterPlant = (plantId: string) => {
        waterPlant(plantId);
        fetchPlants();
    };

    return (
        <div className="container mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-green-800">{t('myPlants.title')}</h1>
            </div>

            {myPlants.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">{t('myPlants.noPlants')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myPlants.map(plant => (
                        <PlantCard key={plant.id} plant={plant}>
                           <div className="flex justify-between items-center space-x-2">
                                <button
                                    onClick={() => handleWaterPlant(plant.id)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    {t('myPlants.water')}
                                </button>
                                <button
                                    onClick={() => handleRemovePlant(plant.id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    {t('myPlants.remove')}
                                </button>
                            </div>
                        </PlantCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPlantsPage;
