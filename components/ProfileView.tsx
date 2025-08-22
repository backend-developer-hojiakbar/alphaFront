// src/components/ProfileView.tsx

import React from 'react';
import { User, Subscription, TariffPlan } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { User as UserIcon, LogOut, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  subscription?: Subscription;
  tariffPlans: TariffPlan[];
  onLogout: () => void;
  onBack: () => void;
  onPlanChange: (planId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProfileView: React.FC<ProfileViewProps> = ({ user, subscription, tariffPlans, onLogout, onBack, onPlanChange }) => {
    const currentPlan = subscription?.plan;
    const isSubscriptionActive = subscription?.status === 'active' && new Date(subscription.expiresAt) > new Date();
  
    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                Shaxsiy kabinet
                </h2>
            </div>

            <Card className="p-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative bg-slate-800/50 rounded-full p-3 border border-slate-600">
                            <UserIcon className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
                            <p className="text-sm text-slate-400">{user.phone}</p>
                        </div>
                    </div>
                    <Button onClick={onLogout} variant="secondary">
                        <LogOut className="h-4 w-4 mr-2" />
                        Chiqish
                    </Button>
                </div>
            </Card>

            <Card className="p-5">
                <h3 className="font-bold text-lg text-slate-200 mb-4">Mening Obunam</h3>
                {isSubscriptionActive && currentPlan ? (
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="text-xl font-bold text-cyan-400">{currentPlan.name}</p>
                                <p className="text-sm text-slate-300">Holat: <span className="text-green-400 font-semibold">Faol</span></p>
                             </div>
                             <div className="text-right">
                                <p className="text-sm text-slate-400">Amal qilish muddati:</p>
                                <p className="font-semibold text-slate-200">{new Date(subscription.expiresAt).toLocaleDateString('uz-UZ')}</p>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-slate-300 font-semibold">Sizda faol obuna mavjud emas.</p>
                        <p className="text-sm text-slate-400 mt-1">Dasturdan foydalanish uchun tarif rejalaridan birini tanlang.</p>
                    </div>
                )}
            </Card>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100">Mavjud Tarif Rejalari</h3>
                {tariffPlans.map(plan => {
                    const isCurrent = plan.id === currentPlan?.id;
                    return (
                        <Card key={plan.id} className={`p-5 border-2 ${isCurrent ? 'border-cyan-500' : 'border-transparent'}`}>
                             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-bold text-slate-100">{plan.name}</h4>
                                        {isCurrent && <span className="px-2 py-0.5 text-xs font-bold bg-cyan-400/20 text-cyan-300 rounded-full">Joriy reja</span>}
                                    </div>
                                    <p className="text-2xl font-bold text-cyan-300 mb-3">{formatCurrency(plan.price)} <span className="text-base font-normal text-slate-400">/ {plan.period === 'monthly' ? 'oyiga' : 'yiliga'}</span></p>
                                    <ul className="space-y-2">
                                        {plan.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                                                <Check className="h-4 w-4 text-green-400" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-full sm:w-auto flex-shrink-0">
                                <Button 
                                    onClick={() => onPlanChange(plan.id)} 
                                    variant={isCurrent ? "secondary" : "primary"}
                                    disabled={isCurrent}
                                    className="w-full"
                                >
                                    {isCurrent ? <><ShieldCheck className="h-4 w-4 mr-2"/> Tanlangan</> : <>O'tish</>}
                                </Button>
                                </div>
                             </div>
                        </Card>
                    );
                })}
            </div>

        </div>
    );
};

export default ProfileView;