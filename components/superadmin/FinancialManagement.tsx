import React, { useState, useRef, useEffect } from 'react';
import { TariffPlan, PromoCode } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Tag, Percent, PlusCircle, Trash2, Edit, X, Check } from 'lucide-react';

// Tariff Plan Management Component
const TariffPlanManagement: React.FC<{
    tariffPlans: TariffPlan[];
    onUpdateTariffPlans: (plans: TariffPlan[]) => void;
    onLogAction: (action: string) => void;
}> = ({ tariffPlans, onUpdateTariffPlans, onLogAction }) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<TariffPlan | null>(null);

    const openModal = (plan: TariffPlan | null = null) => {
        setCurrentPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPlan(null);
    };

    const handleSave = (planData: TariffPlan) => {
        let updatedPlans;
        if (currentPlan) {
            updatedPlans = tariffPlans.map(p => p.id === planData.id ? planData : p);
            onLogAction(`Tariff plan "${planData.name}" updated.`);
        } else {
            updatedPlans = [...tariffPlans, { ...planData, id: `plan-${Date.now()}` }];
            onLogAction(`New tariff plan "${planData.name}" created.`);
        }
        onUpdateTariffPlans(updatedPlans);
        closeModal();
    };

    const handleDelete = (planId: string) => {
        if (window.confirm("Haqiqatan ham bu tarif rejasini o'chirmoqchimisiz?")) {
            const planName = tariffPlans.find(p => p.id === planId)?.name;
            onUpdateTariffPlans(tariffPlans.filter(p => p.id !== planId));
            onLogAction(`Tariff plan "${planName}" deleted.`);
        }
    };

    return (
        <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-200">Tarif Rejalari</h3>
                <Button onClick={() => openModal(null)} size="small" variant="secondary"><PlusCircle className="h-4 w-4 mr-2"/>Yangi qo'shish</Button>
            </div>
            <div className="space-y-3">
                {tariffPlans.map(plan => (
                    <div key={plan.id} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-100">{plan.name}</p>
                            <p className="text-sm text-cyan-400">{plan.price.toLocaleString()} UZS / {plan.period === 'monthly' ? 'oy' : 'yil'}</p>
                            <p className="text-xs text-slate-400 mt-1">{plan.features.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => openModal(plan)} size="small" variant="secondary"><Edit className="h-4 w-4"/></Button>
                            <Button onClick={() => handleDelete(plan.id)} size="small" variant="secondary" className="hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <TariffPlanModal plan={currentPlan} onSave={handleSave} onClose={closeModal} />}
        </Card>
    );
};


// Promo Code Management Component
const PromoCodeManagement: React.FC<{
    promoCodes: PromoCode[];
    onUpdatePromoCodes: (codes: PromoCode[]) => void;
    onLogAction: (action: string) => void;
}> = ({ promoCodes, onUpdatePromoCodes, onLogAction }) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCode, setCurrentCode] = useState<PromoCode | null>(null);

    const openModal = (code: PromoCode | null = null) => {
        setCurrentCode(code);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCode(null);
    };
    
    const handleSave = (codeData: PromoCode) => {
        let updatedCodes;
        const isEditing = promoCodes.some(c => c.id === codeData.id);
        if (isEditing) {
            updatedCodes = promoCodes.map(c => c.id === codeData.id ? codeData : c);
            onLogAction(`Promo code "${codeData.id}" updated.`);
        } else {
            updatedCodes = [...promoCodes, codeData];
            onLogAction(`New promo code "${codeData.id}" created.`);
        }
        onUpdatePromoCodes(updatedCodes);
        closeModal();
    };

    const handleDelete = (codeId: string) => {
        if (window.confirm("Haqiqatan ham bu promo-kodni o'chirmoqchimisiz?")) {
            onUpdatePromoCodes(promoCodes.filter(c => c.id !== codeId));
            onLogAction(`Promo code "${codeId}" deleted.`);
        }
    };


    return (
        <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-200">Promo-kodlar</h3>
                <Button onClick={() => openModal(null)} size="small" variant="secondary"><PlusCircle className="h-4 w-4 mr-2"/>Yangi qo'shish</Button>
            </div>
             <div className="space-y-3">
                {promoCodes.map(code => (
                    <div key={code.id} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-100">{code.id}</p>
                            <p className="text-sm text-cyan-400">
                                {code.type === 'percentage' ? `${code.value}%` : `${code.value.toLocaleString()} UZS`} chegirma
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Status: {code.isActive ? 'Faol' : 'Nofaol'} | Ishlatilgan: {code.uses}
                            </p>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => openModal(code)} size="small" variant="secondary"><Edit className="h-4 w-4"/></Button>
                            <Button onClick={() => handleDelete(code.id)} size="small" variant="secondary" className="hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
             {isModalOpen && <PromoCodeModal code={currentCode} onSave={handleSave} onClose={closeModal} allCodes={promoCodes} />}
        </Card>
    );
};

// Main Financial Management Component
const FinancialManagement: React.FC<{
    tariffPlans: TariffPlan[];
    promoCodes: PromoCode[];
    onUpdateTariffPlans: (plans: TariffPlan[]) => void;
    onUpdatePromoCodes: (codes: PromoCode[]) => void;
    onLogAction: (action: string) => void;
}> = (props) => {
    const [activeTab, setActiveTab] = useState<'tariffs' | 'promocodes'>('tariffs');

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Moliya Boshqaruvi</h1>
                <p className="text-slate-400 mt-1">Tarif rejalarini va chegirmalarni boshqarish.</p>
            </div>

             <div className="bg-slate-800/50 rounded-lg p-1 flex gap-1">
                <button onClick={() => setActiveTab('tariffs')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'tariffs' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <Tag className="inline h-4 w-4 mr-2"/>Tariflar
                </button>
                <button onClick={() => setActiveTab('promocodes')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'promocodes' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <Percent className="inline h-4 w-4 mr-2"/>Promo-kodlar
                </button>
            </div>

            {activeTab === 'tariffs' && <TariffPlanManagement {...props} />}
            {activeTab === 'promocodes' && <PromoCodeManagement {...props} />}
        </div>
    );
};

// Modal for TariffPlan
const TariffPlanModal: React.FC<{ plan: TariffPlan | null; onSave: (data: TariffPlan) => void; onClose: () => void; }> = ({ plan, onSave, onClose }) => {
    const [data, setData] = useState<TariffPlan>(plan || { id: '', name: '', price: 0, period: 'monthly', features: [] });
    const [featuresStr, setFeaturesStr] = useState(plan?.features.join(', ') || '');
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

    const handleSaveClick = () => {
        onSave({ ...data, features: featuresStr.split(',').map(f => f.trim()).filter(Boolean) });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"><X/></button>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{plan ? "Tarifni tahrirlash" : "Yangi tarif qo'shish"}</h2>
                    <Input label="Nomi" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                    <Input label="Narxi (UZS)" type="number" value={data.price} onChange={e => setData({...data, price: Number(e.target.value)})} />
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Davr</label>
                        <select value={data.period} onChange={e => setData({...data, period: e.target.value as 'monthly' | 'yearly'})} className="w-full appearance-none rounded-lg border border-slate-600/80 bg-slate-800/50 py-2.5 px-4 text-slate-100">
                            <option value="monthly">Oylik</option>
                            <option value="yearly">Yillik</option>
                        </select>
                    </div>
                    <Input label="Imkoniyatlar (vergul bilan ajrating)" value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={onClose} variant="secondary">Bekor qilish</Button>
                        <Button onClick={handleSaveClick} variant="primary">Saqlash</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

// Modal for PromoCode
const PromoCodeModal: React.FC<{ code: PromoCode | null; onSave: (data: PromoCode) => void; onClose: () => void; allCodes: PromoCode[] }> = ({ code, onSave, onClose, allCodes }) => {
    const [data, setData] = useState<PromoCode>(code || { id: '', type: 'percentage', value: 0, uses: 0, isActive: true });
    const [error, setError] = useState('');
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

    const handleSaveClick = () => {
        if (!data.id) {
            setError("Promo-kod ID'si bo'sh bo'lishi mumkin emas.");
            return;
        }
        if (!code && allCodes.some(c => c.id.toLowerCase() === data.id.toLowerCase())) {
            setError("Bunday promo-kod allaqachon mavjud.");
            return;
        }
        onSave(data);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-lg relative">
                 <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"><X/></button>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{code ? "Promo-kodni tahrirlash" : "Yangi promo-kod qo'shish"}</h2>
                    <Input label="Promo-kod (ID)" value={data.id} onChange={e => setData({...data, id: e.target.value.toUpperCase()})} disabled={!!code} error={error} />
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Turi</label>
                        <select value={data.type} onChange={e => setData({...data, type: e.target.value as 'percentage' | 'fixed'})} className="w-full appearance-none rounded-lg border border-slate-600/80 bg-slate-800/50 py-2.5 px-4 text-slate-100">
                            <option value="percentage">Foizli</option>
                            <option value="fixed">Qat'iy summa</option>
                        </select>
                    </div>
                    <Input label="Qiymati" type="number" value={data.value} onChange={e => setData({...data, value: Number(e.target.value)})} />
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={data.isActive} onChange={e => setData({...data, isActive: e.target.checked})} className="h-5 w-5 rounded-md bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-slate-300">Faol</span>
                    </label>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={onClose} variant="secondary">Bekor qilish</Button>
                        <Button onClick={handleSaveClick} variant="primary">Saqlash</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default FinancialManagement;