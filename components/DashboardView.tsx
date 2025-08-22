// src/components/DashboardView.tsx

import React from 'react';
import { User } from '../types';
import Card from './ui/Card';
import { Users, Database, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  user: User;
  users: User[];
  onNavigate: (view: 'price-list-editor' | 'home') => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, users, onNavigate }) => {
    const totalUsers = users.length;

    const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
        <Card className="p-5">
            <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color}/20`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-2xl font-bold text-slate-100">{value}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                    Boshqaruv paneli
                </h2>
                <p className="text-slate-400 mt-1 text-sm sm:text-base">Xush kelibsiz, {user.name}. Bu yerda biznesingiz holatini kuzatishingiz mumkin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Users} title="Foydalanuvchilar" value={totalUsers.toString()} color="text-purple-400 bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card onClick={() => onNavigate('price-list-editor')} className="p-5 flex items-center justify-between hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg p-3 bg-purple-500/20">
                            <Database className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-200">Narxlar Jadvali</h3>
                            <p className="text-sm text-slate-400">Mahsulot narxlarini tahrirlash va sozlash.</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-500" />
                </Card>
            </div>

        </div>
    );
};

export default DashboardView;