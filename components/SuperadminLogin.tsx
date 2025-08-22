// src/components/SuperadminLogin.tsx

import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { X, ShieldCheck, LoaderCircle } from 'lucide-react';
import * as api from '../services/apiService'; // API servisni import qilamiz

interface SuperadminLoginProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const SuperadminLogin: React.FC<SuperadminLoginProps> = ({ onClose, onLoginSuccess }) => {
    const [phone, setPhone] = useState(''); // Superadminning telefon raqami uchun
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Superadmin sifatida login qilish uchun backendga so'rov yuboramiz
            const data = await api.login({ phone, password });

            // Backenddan kelgan foydalanuvchi superadmin ekanligini tekshiramiz (bu ixtiyoriy lekin xavfsizlik uchun yaxshi)
            // Django'da superuser'ning `is_staff` maydoni true bo'ladi.
            // Bu tekshiruvni UserSerializer'ga 'is_staff'ni qo'shib amalga oshirish mumkin.
            // Hozircha bu tekshiruvsiz davom etamiz.

            // Superadminning tokenini `localStorage`ga saqlaymiz.
            localStorage.setItem('accessToken', data.access);
            onLoginSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login yoki parol xato.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-md relative border border-cyan-500/30">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                </button>
                 <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                    <div className="text-center">
                        <ShieldCheck className="h-12 w-12 text-cyan-400 mx-auto mb-2"/>
                        <h2 className="text-xl font-bold text-slate-100">Superadmin Kirishi</h2>
                        <p className="text-sm text-slate-400">Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting.</p>
                    </div>
                    <Input
                        label="Telefon raqam"
                        id="admin-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998..."
                        required
                    />
                    <Input
                        label="Parol"
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                        required
                    />
                    <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                        {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin"/> : 'Tasdiqlash'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default SuperadminLogin;