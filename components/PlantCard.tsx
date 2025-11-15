
import React from 'react';
import { Plant } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface PlantCardProps {
    plant: Plant;
    children?: React.ReactNode;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, children }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <img src={plant.imageUrl} alt={plant.commonName} className="w-full h-48 object-cover"/>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-green-800">{plant.commonName}</h3>
                <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                <p className="text-gray-700 text-sm flex-grow">{plant.description}</p>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-2">{t('common.careInfo')}</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                        <li><strong>{t('common.watering')}:</strong> {plant.careInfo.watering}</li>
                        <li><strong>{t('common.light')}:</strong> {plant.careInfo.light}</li>
                        <li><strong>{t('common.soil')}:</strong> {plant.careInfo.soil}</li>
                    </ul>
                </div>
                {children && <div className="mt-4">{children}</div>}
            </div>
        </div>
    );
};

export default PlantCard;
