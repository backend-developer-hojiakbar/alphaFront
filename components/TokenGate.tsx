
import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { Bot, KeyRound, Lock } from 'lucide-react';
import SuperadminLogin from './SuperadminLogin';

interface TokenGateProps {
    onSuccess: () => void;
    onSuperadminLogin: () => void;
}

const DEFAULT_TOKEN = '2025print';

const getValidTokenData = (): { token: string; expiry: number } => {
    try {
        const dataStr = localStorage.getItem('ai-print-demo-token');
        if (!dataStr) return { token: DEFAULT_TOKEN, expiry: Infinity };
        const data = JSON.parse(dataStr);
        if (new Date().getTime() > data.expiry) {
            localStorage.removeItem('ai-print-demo-token');
            alert("Sizning oylik tokeningiz muddati tugadi. Iltimos, yangi token oling yoki standart tokendan foydalaning.");
            return { token: DEFAULT_TOKEN, expiry: Infinity };
        }
        return data;
    } catch (e) {
        return { token: DEFAULT_TOKEN, expiry: Infinity };
    }
};

const TokenGate: React.FC<TokenGateProps> = ({ onSuccess, onSuperadminLogin }) => {
    const [tokenInput, setTokenInput] = useState('');
    const [error, setError] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    
    // Auto-login if a valid user token is already stored
    React.useEffect(() => {
        const userToken = localStorage.getItem('ai-print-user-token');
        if (userToken) {
            const validTokenData = getValidTokenData();
            if (userToken === validTokenData.token) {
                onSuccess();
            } else {
                localStorage.removeItem('ai-print-user-token');
            }
        }
    }, [onSuccess]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validTokenData = getValidTokenData();
        
        if (tokenInput.trim() === validTokenData.token) {
            try {
                // Store the user's successful token entry so they don't have to re-enter it next time.
                localStorage.setItem('ai-print-user-token', tokenInput.trim());
                onSuccess();
            } catch (err) {
                 setError('Tokentni saqlashda xatolik. Iltimos, brauzer sozlamalarini tekshiring.');
            }
        } else {
            setError("Token noto'g'ri kiritildi. Iltimos, qaytadan tekshirib kiriting.");
        }
    };
    
    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-200 flex flex-col items-center justify-center p-4">
             <Card className="w-full max-w-md animate-fade-in-up">
                <div className="p-8 space-y-6">
                    <div className="text-center">
                        <Bot className="h-14 w-14 text-cyan-400 mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}/>
                        <h1 className="text-2xl font-bold text-slate-100">AI-Print Hisob-kitobi</h1>
                        <p className="text-slate-400 mt-2">Dasturdan foydalanish uchun amal qiluvchi tokenni kiriting.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Demo Token"
                            id="token-input"
                            type="text"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            error={error}
                            placeholder="Tokenni shu yerga kiriting"
                            required
                        />
                        <Button type="submit" variant="primary" className="w-full">
                            <Lock className="h-4 w-4 mr-2"/>
                            Kirish
                        </Button>
                    </form>
                    <div className="text-center pt-4 border-t border-slate-700/50">
                        <Button onClick={() => setShowAdminLogin(true)} variant="secondary" size="small">
                            <KeyRound className="h-4 w-4 mr-2"/>
                            Superadmin Paneli
                        </Button>
                    </div>
                </div>
            </Card>
            <footer className="absolute bottom-4 text-center text-slate-500 text-xs">
                <p>Ushbu demo versiya. Barcha huquqlar himoyalangan. © CDCGroup & CraDev 2025</p>
            </footer>

            {showAdminLogin && <SuperadminLogin onLoginSuccess={onSuperadminLogin} onClose={() => setShowAdminLogin(false)}/>}
        </div>
    );
};

export default TokenGate;
