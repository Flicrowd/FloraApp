import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { startChat, sendMessageToChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Spinner from '../components/Spinner';

const ChatPage: React.FC = () => {
    const { t, language } = useLocalization();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startChat(language, []);
        setMessages([{ role: 'model', parts: [{ text: t('chat.intro') }] }]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await sendMessageToChat(input);
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };
    
    return (
        <div className="container mx-auto max-w-3xl">
             <h1 className="text-3xl font-bold mb-4 text-center text-green-800">{t('chat.title')}</h1>
            <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-lg">
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start mb-4">
                            <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder={t('chat.placeholder')}
                            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="px-6 py-2 text-white bg-green-600 rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                            {t('chat.send')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;