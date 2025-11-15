
import { Plant, UserPlant } from '../types';

const PLANT_DATABASE: Plant[] = [
    {
        id: '1',
        commonName: 'Snake Plant',
        scientificName: 'Dracaena trifasciata',
        description: 'Known for its sharp, architectural leaves and air-purifying qualities. It\'s incredibly resilient and perfect for beginners.',
        careInfo: {
            watering: 'Allow soil to dry out completely between waterings. Water every 2-8 weeks.',
            light: 'Thrives in indirect light but can tolerate low light and some direct sun.',
            soil: 'Use a well-draining potting mix, like one for cacti or succulents.'
        },
        imageUrl: 'https://picsum.photos/seed/snakeplant/400/400'
    },
    {
        id: '2',
        commonName: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        description: 'Famous for its unique, split leaves. It\'s a fast-growing, climbing plant that adds a tropical feel to any room.',
        careInfo: {
            watering: 'Water when the top 1-2 inches of soil are dry. Typically every 1-2 weeks.',
            light: 'Bright, indirect light is best. Avoid direct sunlight which can scorch leaves.',
            soil: 'A well-draining, peat-based potting mix.'
        },
        imageUrl: 'https://picsum.photos/seed/monstera/400/400'
    },
    {
        id: '3',
        commonName: 'Pothos',
        scientificName: 'Epipremnum aureum',
        description: 'A trailing vine that is extremely easy to care for and can tolerate a wide range of conditions. Great for hanging baskets.',
        careInfo: {
            watering: 'Water when the top inch of soil is dry. Tolerant of occasional underwatering.',
            light: 'Prefers bright, indirect light but does well in low light too.',
            soil: 'Standard, well-draining potting soil.'
        },
        imageUrl: 'https://picsum.photos/seed/pothos/400/400'
    },
    {
        id: '4',
        commonName: 'ZZ Plant',
        scientificName: 'Zamioculcas zamiifolia',
        description: 'A drought-tolerant plant with glossy, dark green leaves. It is known for being virtually indestructible.',
        careInfo: {
            watering: 'Water sparingly. Allow the soil to dry out completely. Every 3-4 weeks.',
            light: 'Low to bright indirect light. Avoid direct sun.',
            soil: 'Well-draining soil is essential to prevent root rot.'
        },
        imageUrl: 'https://picsum.photos/seed/zzplant/400/400'
    }
];

export const getPlantDatabase = (): Plant[] => {
    return PLANT_DATABASE;
};

export const getUserPlants = (): UserPlant[] => {
    const plantsJson = localStorage.getItem('userPlants');
    return plantsJson ? JSON.parse(plantsJson) : [];
};

export const addUserPlant = (plant: Plant): void => {
    const userPlants = getUserPlants();
    const newUserPlant: UserPlant = {
        ...plant,
        id: plant.id || new Date().toISOString(),
        addedDate: new Date().toISOString(),
        lastWatered: new Date().toISOString(),
    };
    const updatedPlants = [...userPlants, newUserPlant];
    localStorage.setItem('userPlants', JSON.stringify(updatedPlants));
};


export const removeUserPlant = (plantId: string): void => {
    let userPlants = getUserPlants();
    userPlants = userPlants.filter(p => p.id !== plantId);
    localStorage.setItem('userPlants', JSON.stringify(userPlants));
};

export const waterPlant = (plantId: string): void => {
    let userPlants = getUserPlants();
    const plantIndex = userPlants.findIndex(p => p.id === plantId);
    if (plantIndex > -1) {
        userPlants[plantIndex].lastWatered = new Date().toISOString();
        localStorage.setItem('userPlants', JSON.stringify(userPlants));
    }
};
