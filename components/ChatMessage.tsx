// src/components/ChatMessage.tsx

import React from 'react';
import { ChatMessage as ChatMessageType, Product, Material } from '../types';
import { Bot, User } from 'lucide-react';
import Card from './ui/Card';
import ResultDisplay from './ResultDisplay';

interface ChatMessageProps {
    message: ChatMessageType;
    products: Product[];
    materials: Material[];
    onSuggestedActionClick: (actionText: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, products, materials, onSuggestedActionClick }) => {
    const isUser = message.role === 'user';
    const product = message.result ? products.find(p => p.name === message.result?.requestData.productType) : null;

    if (message.isLoading) {
        return (
             <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse-fast"></span>
                    <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse-fast [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse-fast [animation-delay:0.4s]"></span>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-cyan-400" />
                </div>
            )}
            
            <div className={`max-w-md w-full ${isUser ? 'order-1' : ''}`}>
                 <div className={`rounded-2xl px-4 py-3 shadow-sm ${isUser ? 'bg-cyan-600/80 text-white rounded-br-none' : 'bg-slate-800/70 text-slate-200 rounded-bl-none'}`}>
                     {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                </div>
                {message.result && product && (
                    <Card className="mt-2 border-cyan-500/30">
                        <ResultDisplay 
                            result={message.result} 
                            request={message.result.requestData} 
                            product={product} 
                            materials={materials}
                        />
                    </Card>
                )}
                 {message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestedActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => onSuggestedActionClick(action)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-700/60 text-cyan-300 hover:bg-slate-700/90 transition-colors shadow-sm"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center shadow-md order-2">
                    <User className="h-5 w-5 text-slate-300" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;