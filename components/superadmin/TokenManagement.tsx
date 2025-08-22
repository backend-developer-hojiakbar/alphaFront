
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ArrowLeft, Check, Copy, KeyRound } from 'lucide-react';

interface TokenManagementProps {
    onBack: () => void;
    onLogAction: (action: string) => void;
}

const TokenManagement: React.FC<TokenManagementProps> = ({ onBack, onLogAction }) => {
    const [step, setStep] = useState<'set_token' | 'token_success'>('set_token');
    const [newToken, setNewToken] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSetNewToken = (e: React.FormEvent) => {
        e.preventDefault();
        const tokenToSet = newToken.trim();
        if (tokenToSet.length < 8) {
            setError("Token kamida 8 ta belgidan iborat bo'lishi kerak.");
            return;
        }
        try {
            const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
            const tokenData = { token: tokenToSet, expiry };
            localStorage.setItem('ai-print-demo-token', JSON.stringify(tokenData));
            setGeneratedToken(tokenToSet);
            setError('');
            setStep('token_success');
            onLogAction(`Demo token has been changed to "${tokenToSet}".`);
        } catch (err) {
            setError("Tokentni saqlashda xatolik yuz berdi.");
        }
    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(generatedToken).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const renderContent = () => {
        switch (step) {
            case 'set_token':
                return (
                    <form onSubmit={handleSetNewToken} className="space-y-4">
                        <Input
                            label="Yangi Token"
                            id="new-token"
                            type="text"
                            value={newToken}
                            onChange={(e) => setNewToken(e.target.value)}
                            error={error}
                            required
                        />
                        <Button type="submit" variant="primary" className="w-full">Yangi tokenni saqlash</Button>
                    </form>
                );
            case 'token_success':
                return (
                     <div className="space-y-4">
                        <div className="text-center">
                            <Check className="h-12 w-12 text-green-400 mx-auto mb-2"/>
                            <h2 className="text-xl font-bold text-slate-100">Token Muvaffaqiyatli Yangilandi</h2>
                            <p className="text-sm text-slate-400">Dastur endi ushbu yangi token bilan ishlaydi.</p>
                        </div>
                        <div className="relative">
                             <Input
                                label="Yangi tokeningiz"
                                id="generated-token"
                                type="text"
                                value={generatedToken}
                                readOnly
                                className="bg-slate-900/50 pr-12"
                            />
                            <button 
                                type="button" 
                                onClick={handleCopyToken}
                                className="absolute top-[38px] right-3 p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {copied ? <Check className="h-5 w-5 text-green-400"/> : <Copy className="h-5 w-5"/>}
                            </button>
                        </div>
                        <Button onClick={() => setStep('set_token')} variant="secondary" className="w-full">Yana yangi token yaratish</Button>
                    </div>
                );
        }
    }


    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>
                <div>
                     <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
                        <KeyRound className="h-8 w-8 text-cyan-400"/>
                        Demo Token Boshqaruvi
                    </h1>
                    <p className="text-slate-400 mt-1">Dasturga kirish uchun demo tokenni o'zgartiring. Yangi token 30 kun amal qiladi.</p>
                </div>
            </div>

            <Card className="p-5">
               {renderContent()}
            </Card>
        </div>
    );
};

export default TokenManagement;
