
import React, { useState } from 'react';
import { PriceList, Product, Material } from '../../types';
import PriceListEditor from '../PriceListEditor';
import TokenManagement from './TokenManagement';
import Card from '../ui/Card';
import { Database, KeyRound, ArrowRight } from 'lucide-react';

interface AdminSettingsProps {
    initialPriceList: PriceList;
    onPriceListSave: (priceList: PriceList) => void;
    onLogAction: (action: string) => void;
    products: Product[];
    materials: Material[];
}

type SettingsPage = 'main' | 'pricelist' | 'token';

const AdminSettings: React.FC<AdminSettingsProps> = ({ initialPriceList, onPriceListSave, onLogAction, products, materials }) => {
    const [page, setPage] = useState<SettingsPage>('main');

    const handlePriceListSave = (priceList: PriceList) => {
        onPriceListSave(priceList);
        onLogAction('Price list updated.');
    };

    const SettingCard: React.FC<{ icon: React.ElementType, title: string, description: string, onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
        <Card onClick={onClick} className="p-5 flex items-center justify-between hover:bg-slate-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="rounded-lg p-3 bg-slate-700/50">
                    <Icon className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-200">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500" />
        </Card>
    );

    const renderMainPage = () => (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Sozlamalar</h1>
                <p className="text-slate-400 mt-1">Tizimning asosiy sozlamalarini boshqarish.</p>
            </div>
            <div className="space-y-4">
                 <SettingCard 
                    icon={Database} 
                    title="Narxlar Jadvali" 
                    description="Mahsulotlar uchun narxlarni tahrirlash va yangilash."
                    onClick={() => setPage('pricelist')}
                />
                <SettingCard 
                    icon={KeyRound} 
                    title="Demo Token Boshqaruvi"
                    description="Dasturga kirish uchun demo tokenni yaratish va yangilash."
                    onClick={() => setPage('token')}
                />
            </div>
        </div>
    );
    
    switch(page) {
        case 'pricelist':
            return <PriceListEditor initialPriceList={initialPriceList} onSave={handlePriceListSave} onBack={() => setPage('main')} products={products} materials={materials} />;
        case 'token':
            return <TokenManagement onBack={() => setPage('main')} onLogAction={onLogAction} />;
        case 'main':
        default:
            return renderMainPage();
    }
};

export default AdminSettings;
