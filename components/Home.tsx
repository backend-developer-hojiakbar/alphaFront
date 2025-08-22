// src/components/Home.tsx

import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import { SlidersHorizontal, Paperclip, Send, X } from 'lucide-react';
import { ChatMessage as ChatMessageType, Product, Material } from '../types';
import ChatMessage from './ChatMessage';

interface HomeProps {
    onSelectProducts: () => void;
    messages: ChatMessageType[];
    onSendMessage: (message: string, file?: { data: string; mimeType: string; name: string; }) => void;
    isAiThinking: boolean;
    products: Product[];
    materials: Material[];
}

const Home: React.FC<HomeProps> = ({ onSelectProducts, messages, onSendMessage, isAiThinking, products, materials }) => {
    const [input, setInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("Fayl hajmi 5MB dan oshmasligi kerak.");
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFilePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !file) return;

        if (file && filePreview) {
            const base64Data = filePreview.split(',')[1];
            onSendMessage(input, { data: base64Data, mimeType: file.type, name: file.name });
        } else {
            onSendMessage(input);
        }

        setInput('');
        handleRemoveFile();
    };
    
    const handleSuggestedActionClick = (actionText: string) => {
        setInput(actionText); 
    };

    return (
        <div className="animate-fade-in flex flex-col h-full" style={{minHeight: 'calc(100vh - 250px)'}}>
            <Card className="flex-grow flex flex-col p-0 overflow-hidden">
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map(msg => (
                        <ChatMessage 
                            key={msg.id} 
                            message={msg} 
                            products={products} 
                            materials={materials} 
                            onSuggestedActionClick={handleSuggestedActionClick}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                     {filePreview && (
                        <div className="mb-2 p-2 bg-slate-900/50 rounded-lg relative flex items-center gap-2">
                           <img src={filePreview} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
                            <p className="text-xs text-slate-300 truncate flex-grow">{file?.name}</p>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAiThinking}
                            className="p-3 rounded-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors disabled:opacity-50"
                        >
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <input
                            ref={fileInputRef}
                            id="chat-file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                        />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isAiThinking ? "AI o'ylanmoqda..." : "Xabaringizni yozing..."}
                            className="w-full rounded-full border border-slate-600/80 bg-slate-900/80 py-3 px-5 text-slate-100 shadow-inner-sm transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none sm:text-sm disabled:opacity-50"
                            disabled={isAiThinking}
                        />
                        <button
                            type="submit"
                            disabled={isAiThinking || (!input.trim() && !file)}
                            className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 transition-colors disabled:opacity-50 disabled:bg-slate-700"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </Card>

            <div className="my-8 text-center">
                 <p className="text-slate-400 text-sm">Suhbatdan tashqari, an'anaviy usuldan ham foydalanishingiz mumkin:</p>
            </div>
            
            <div className="flex justify-center">
                <Card onClick={onSelectProducts} className="p-6 text-center hover:-translate-y-1 flex flex-col justify-center w-full max-w-xs cursor-pointer">
                     <div className="flex justify-center items-center mb-3">
                        <div className="relative bg-slate-800/50 rounded-full p-3 border border-slate-600">
                           <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-lg"></div>
                           <SlidersHorizontal className="relative h-7 w-7 text-sky-400" style={{ filter: 'drop-shadow(0 0 5px currentColor)' }}/>
                        </div>
                    </div>
                    <h3 className="text-md font-bold text-slate-100">An'anaviy Kalkulyator</h3>
                    <p className="text-xs text-slate-400 mt-1">Barcha parametrlarni o'zingiz kiritib hisoblang.</p>
                </Card>
            </div>
        </div>
    );
};

export default Home;