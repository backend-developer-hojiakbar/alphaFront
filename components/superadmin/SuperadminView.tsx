import React, { useState } from 'react';
import { User, Subscription, PriceList, TariffPlan, PromoCode, AuditLogEntry, Product, Template, Material } from '../../types';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Bot, Package, Tag, HeartPulse } from 'lucide-react';
import SuperadminDashboard from './SuperadminDashboard';
import UserManagement from './UserManagement';
import SubscriptionManagement from './SubscriptionManagement';
import FinancialManagement from './FinancialManagement';
import SystemManagement from './SystemManagement';
import ContentManagement from './ContentManagement';
import PriceListEditor from '../PriceListEditor';

interface SuperadminViewProps {
    users: User[];
    subscriptions: Subscription[];
    priceList: PriceList;
    tariffPlans: TariffPlan[];
    promoCodes: PromoCode[];
    auditLog: AuditLogEntry[];
    products: Product[];
    materials: Material[];
    templates: Template[];

    onUpdateUser: (user: User) => void;
    onAddSubscription: (subscriptionData: Omit<Subscription, 'id'>) => void;
    onUpdateSubscription: (subscription: Subscription) => void;
    onDeleteSubscription: (subscriptionId: number) => void;
    
    onPriceListUpdate: (priceList: PriceList) => void;

    onUpdateTariffPlans: (plans: TariffPlan[]) => void;
    onUpdatePromoCodes: (codes: PromoCode[]) => void;
    onUpdateProducts: (products: Product[]) => void;
    onUpdateMaterials: (materials: Material[]) => void;
    onUpdateTemplates: (templates: Template[]) => void;

    onLogAction: (action: string) => void;
    onLogout: () => void;
}

type SuperadminPage = 'dashboard' | 'users' | 'subscriptions' | 'content' | 'finance' | 'system' | 'price-list';

const SuperadminView: React.FC<SuperadminViewProps> = (props) => {
    const [activePage, setActivePage] = useState<SuperadminPage>('dashboard');

    const NavItem: React.FC<{ page: SuperadminPage; icon: React.ElementType; label: string; }> = ({ page, icon: Icon, label }) => (
        <button
            onClick={() => setActivePage(page)}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === page 
                ? 'bg-cyan-500/10 text-cyan-300' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
        >
            <Icon className="h-5 w-5 mr-3" />
            <span>{label}</span>
        </button>
    );

     const NavGroup: React.FC<{ title: string }> = ({ title }) => (
        <p className="px-3 mt-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
    );

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard': return <SuperadminDashboard users={props.users} subscriptions={props.subscriptions} promoCodes={props.promoCodes} products={props.products} />;
            case 'users': return <UserManagement users={props.users} onUpdateUser={props.onUpdateUser} onLogAction={props.onLogAction} />;
            case 'subscriptions': return <SubscriptionManagement subscriptions={props.subscriptions} users={props.users} tariffPlans={props.tariffPlans} onAddSubscription={props.onAddSubscription} onUpdateSubscription={props.onUpdateSubscription} onDeleteSubscription={props.onDeleteSubscription} onLogAction={props.onLogAction} />;
            case 'content': return <ContentManagement products={props.products} materials={props.materials} templates={props.templates} onUpdateProducts={props.onUpdateProducts} onUpdateMaterials={props.onUpdateMaterials} onUpdateTemplates={props.onUpdateTemplates} onLogAction={props.onLogAction} />;
            case 'finance': return <FinancialManagement tariffPlans={props.tariffPlans} promoCodes={props.promoCodes} onUpdateTariffPlans={props.onUpdateTariffPlans} onUpdatePromoCodes={props.onUpdatePromoCodes} onLogAction={props.onLogAction} />;
            case 'system': return <SystemManagement auditLog={props.auditLog} onLogAction={props.onLogAction} />;
            case 'price-list': return <PriceListEditor initialPriceList={props.priceList} onSave={props.onPriceListUpdate} onBack={() => setActivePage('dashboard')} products={props.products} materials={props.materials} />;
            default: return <div>Sahifa topilmadi</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-200">
            <aside className="w-64 bg-slate-900/80 border-r border-slate-500/20 p-4 flex-shrink-0 flex flex-col">
                <div className="flex items-center gap-2 px-2 mb-6">
                    <Bot className="h-7 w-7 text-cyan-400" />
                    <span className="font-bold text-lg text-slate-100">Superadmin</span>
                </div>
                <nav className="flex-grow space-y-1">
                    <NavItem page="dashboard" icon={LayoutDashboard} label="Boshqaruv Paneli" />
                    <NavGroup title="Boshqaruv" />
                    <NavItem page="users" icon={Users} label="Foydalanuvchilar" />
                    <NavItem page="subscriptions" icon={CreditCard} label="Obunalar" />
                    <NavGroup title="Kontent" />
                    <NavItem page="content" icon={Package} label="Kontent Boshqaruvi" />
                    <NavItem page="price-list" icon={Settings} label="Narxlar Jadvali" />
                    <NavGroup title="Moliya" />
                     <NavItem page="finance" icon={Tag} label="Moliya Boshqaruvi" />
                    <NavGroup title="Tizim" />
                    <NavItem page="system" icon={HeartPulse} label="Tizim Boshqaruvi" />
                </nav>
                <div className="space-y-1">
                    <button onClick={props.onLogout} className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            <main className="flex-grow p-6 overflow-y-auto bg-gray-900/20">
                {renderContent()}
            </main>
        </div>
    );
};

export default SuperadminView;