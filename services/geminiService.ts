
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (file: File) => {
    return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file"));
            }
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = (error) => reject(error);
    });
};


export const identifyPlant = async (imageFile: File, language: 'en' | 'es' | 'ru'): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const langMap = {
            en: 'English',
            es: 'Spanish',
            ru: 'Russian'
        };
        const prompt = `Identify this plant. Provide a response in ${langMap[language]} as a JSON object with the following keys: "commonName", "scientificName", "description", and "careInfo" (which should be an object with "watering", "light", and "soil" keys). Be concise and practical.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        commonName: { type: Type.STRING },
                        scientificName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        careInfo: {
                            type: Type.OBJECT,
                            properties: {
                                watering: { type: Type.STRING },
                                light: { type: Type.STRING },
                                soil: { type: Type.STRING },
                            },
                        },
                    },
                },
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error identifying plant:", error);
        throw new Error("Failed to identify plant.");
    }
};

export const diagnosePlant = async (imageFile: File, language: 'en' | 'es' | 'ru'): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const langMap = {
            en: 'English',
            es: 'Spanish',
            ru: 'Russian'
        };
        const prompt = `Diagnose the health issue of this plant from the image. Provide a response in ${langMap[language]} as a JSON object with keys: "problem", "possibleCauses" (an array of strings), and "suggestedSolution". If the plant looks healthy, state that.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        problem: { type: Type.STRING },
                        possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestedSolution: { type: Type.STRING },
                    },
                },
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error diagnosing plant:", error);
        throw new Error("Failed to diagnose plant.");
    }
};

export const getCareTips = async (language: 'en' | 'es' | 'ru'): Promise<string> => {
    const langMap = {
        en: 'English',
        es: 'Spanish',
        ru: 'Russian'
    };
    const prompt = `Generate 5 diverse and useful plant care tips for beginners. Provide the response in ${langMap[language]} as a JSON object with a single key "tips", which is an array of objects. Each object should have a "title" and a "content" string.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tips: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                content: { type: Type.STRING },
                            },
                        },
                    },
                },
            },
        },
    });

    return response.text;
};

let chatInstance: Chat | null = null;

export const startChat = (language: 'en' | 'es' | 'ru', history: ChatMessage[] = []) => {
    const langMap = {
        en: 'English',
        es: 'Spanish',
        ru: 'Russian'
    };

    chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            systemInstruction: `You are Flora, a friendly and expert AI plant care assistant. You provide clear, concise, and helpful advice about house plants. Always respond in ${langMap[language]}.`,
        }
    });
};

export const sendMessageToChat = async (message: string): Promise<string> => {
    if (!chatInstance) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};
