
import React from 'react';
import { User, Subscription, PromoCode, Product } from '../../types';
import Card from '../ui/Card';
import { DollarSign, Package, Users, CreditCard, Percent } from 'lucide-react';

interface SuperadminDashboardProps {
    users: User[];
    subscriptions: Subscription[];
    promoCodes: PromoCode[];
    products: Product[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);

const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({ users, subscriptions, promoCodes, products }) => {
    
    const totalUsers = users.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const totalProducts = products.length;
    const activePromoCodes = promoCodes.filter(pc => pc.isActive).length;


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
                <h1 className="text-3xl font-bold text-slate-100">Boshqaruv Paneli</h1>
                <p className="text-slate-400 mt-1">Platformaning umumiy statistikasi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={Users} title="Foydalanuvchilar" value={totalUsers.toString()} color="text-purple-400 bg-purple-500" />
                <StatCard icon={CreditCard} title="Aktiv Obunalar" value={activeSubscriptions.toString()} color="text-yellow-400 bg-yellow-500" />
                <StatCard icon={Package} title="Mahsulot Turlari" value={totalProducts.toString()} color="text-blue-400 bg-blue-500" />
                <StatCard icon={Percent} title="Aktiv Promo-kodlar" value={activePromoCodes.toString()} color="text-rose-400 bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="p-5 lg:col-span-2">
                    <h3 className="font-bold text-lg text-slate-200 mb-4">So'nggi Foydalanuvchilar</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {users.length > 0 ? users.slice(-10).reverse().map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-slate-200">{user.name}</p>
                                    <p className="text-sm text-slate-400">{user.phone}</p>
                                </div>
                                 <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                                </span>
                            </div>
                        )) : <p className="text-slate-500 text-center py-4">Hozircha foydalanuvchilar mavjud emas.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SuperadminDashboard;
