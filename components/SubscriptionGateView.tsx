// src/components/SubscriptionGateView.tsx

import React from 'react';
import { User } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { Lock, LogOut, User as UserIcon } from 'lucide-react';

interface SubscriptionGateViewProps {
    user: User;
    onLogout: () => void;
}

const SubscriptionGateView: React.FC<SubscriptionGateViewProps> = ({ user, onLogout }) => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md animate-fade-in-up p-8 text-center">
                <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <Lock className="relative h-20 w-20 text-red-400 mx-auto" style={{ filter: 'drop-shadow(0 0 15px currentColor)'}} />
                </div>
                <h1 className="text-2xl font-bold text-slate-100">Obuna talab qilinadi</h1>
                <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                    Dasturdan to'liq foydalanish uchun sizda faol obuna bo'lishi kerak. Iltimos, administrator bilan bog'laning: <a href="tel:+998947430912" className="font-semibold text-cyan-400 hover:underline">+998 94 743 09 12</a>
                </p>
                
                <div className="my-6 border-t border-slate-700/50"></div>

                <div className="text-left bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
                     <div className="relative bg-slate-800 rounded-full p-2 border border-slate-600">
                        <UserIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-200">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.phone}</p>
                    </div>
                </div>

                <Button onClick={onLogout} variant="secondary" className="w-full mt-6">
                    <LogOut className="h-4 w-4 mr-2" />
                    Chiqish
                </Button>
            </Card>
             <footer className="absolute bottom-4 text-center text-slate-500 text-xs">
                <p>Barcha huquqlar himoyalangan. © CDCGroup & CraDev 2025</p>
            </footer>
        </div>
    );
};

export default SubscriptionGateView;