// src/components/LoginView.tsx

import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { ArrowLeft, LogIn, KeyRound } from 'lucide-react';
import SuperadminLogin from './SuperadminLogin';

interface LoginViewProps {
  onLogin: (phone: string, password: string) => void;
  onGoToRegister: () => void;
  onBack: () => void;
  onSuperadminLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onGoToRegister, onBack, onSuperadminLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    onLogin(phone, password);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                Tizimga kirish
            </h2>
            <p className="text-slate-400 mt-2 text-base">Shaxsiy kabinetga kirish uchun ma'lumotlarni kiriting.</p>
        </div>
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Telefon raqamingiz"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    required
                />
                <Input
                    label="Parol"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <Button type="submit" variant="primary" className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Kirish
                </Button>
            </form>
            <div className="mt-6 text-center text-sm">
                <p className="text-slate-400">
                    Hisobingiz yo'qmi?{' '}
                    <button onClick={onGoToRegister} className="font-medium text-cyan-400 hover:text-cyan-300">
                        Ro'yxatdan o'tish
                    </button>
                </p>
            </div>
             <div className="text-center pt-4 mt-4 border-t border-slate-700/50">
                <button onClick={() => setShowAdminLogin(true)} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center mx-auto gap-2">
                    <KeyRound className="h-4 w-4"/>
                    Superadmin kirishi
                </button>
            </div>
        </Card>
        {showAdminLogin && <SuperadminLogin onClose={() => setShowAdminLogin(false)} onLoginSuccess={onSuperadminLogin} />}
    </div>
  );
};

export default LoginView;