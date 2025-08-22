// src/components/RegisterView.tsx

import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { ArrowLeft, UserPlus } from 'lucide-react';

interface RegisterViewProps {
  onRegister: (name: string, phone: string, password: string) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onGoToLogin, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string, phone?: string, password?: string }>({});

  const validate = () => {
    const newErrors: { name?: string, phone?: string, password?: string } = {};
    if (!name.trim()) newErrors.name = "Ismingizni kiriting.";
    if (!phone.trim()) newErrors.phone = "Telefon raqamingizni kiriting.";
    if (password.length < 8) newErrors.password = "Parol kamida 8 belgidan iborat bo'lishi kerak.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister(name, phone, password);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0">
                <ArrowLeft className="h-5 w-5 text-slate-300" />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Ro'yxatdan o'tish</h2>
                <p className="text-slate-400 mt-1 text-sm">Yangi hisob yarating.</p>
            </div>
        </div>
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Ismingiz"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    required
                />
                <Input
                    label="Telefon raqamingiz"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    error={errors.phone}
                    required
                />
                <Input
                    label="Parol"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    required
                />
                <Button type="submit" variant="primary" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ro'yxatdan o'tish
                </Button>
            </form>
            <div className="mt-6 text-center text-sm">
                <p className="text-slate-400">
                    Hisobingiz bormi?{' '}
                    <button onClick={onGoToLogin} className="font-medium text-cyan-400 hover:text-cyan-300">
                        Kirish
                    </button>
                </p>
            </div>
        </Card>
    </div>
  );
};

export default RegisterView;