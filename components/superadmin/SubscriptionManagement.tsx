// src/components/superadmin/SubscriptionManagement.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Subscription, User, TariffPlan } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CustomSelect from '../ui/CustomSelect';
import Input from '../ui/Input';
import { CreditCard, PlusCircle, Trash2, Edit, X } from 'lucide-react';

interface SubscriptionManagementProps {
    subscriptions: Subscription[];
    users: User[];
    tariffPlans: TariffPlan[];
    onAddSubscription: (subscriptionData: Omit<Subscription, 'id' | 'user' | 'plan'> & { userId: string; planId: string }) => void;
    onUpdateSubscription: (subscription: Subscription) => void;
    onDeleteSubscription: (subscriptionId: number) => void;
    onLogAction: (action: string) => void;
}

const SubscriptionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    users: User[];
    tariffPlans: TariffPlan[];
    subscription: Subscription | null;
}> = ({ isOpen, onClose, onSave, users, tariffPlans, subscription }) => {
    
    const [formData, setFormData] = useState({
        userId: subscription?.user?.phone || '',
        planId: subscription?.plan?.id || '',
        status: subscription?.status || 'active',
        expiresAt: subscription ? new Date(subscription.expiresAt).toISOString().split('T')[0] : '',
    });
    
    const [errors, setErrors] = useState<{userId?: string, planId?: string, expiresAt?: string}>({});
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    
    const handleSave = () => {
        const newErrors: typeof errors = {};
        if (!formData.userId) newErrors.userId = "Foydalanuvchi tanlanishi shart.";
        if (!formData.planId) newErrors.planId = "Tarif rejasi tanlanishi shart.";
        if (!formData.expiresAt) newErrors.expiresAt = "Amal qilish muddati kiritilishi shart.";
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const saveData = {
            ...formData,
            expiresAt: new Date(formData.expiresAt).toISOString(),
        };

        if (subscription) {
            onSave({ ...subscription, ...saveData });
        } else {
            onSave(saveData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-lg relative border border-cyan-500/30">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                </button>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{subscription ? "Obunani Tahrirlash" : "Yangi Obuna Qo'shish"}</h2>
                    <div className="space-y-4">
                        <CustomSelect
                            id="user-select"
                            label="Foydalanuvchi"
                            options={users.map(u => ({ id: u.phone, name: `${u.name} (${u.phone})` }))}
                            selectedValue={formData.userId}
                            onValueChange={value => setFormData(p => ({...p, userId: value}))}
                            customInputName="" onCustomInputChange={()=>{}} customInputPlaceholder=""
                            disabled={!!subscription}
                        />
                         {errors.userId && <p className="text-xs text-red-400 -mt-2">{errors.userId}</p>}

                        <CustomSelect
                            id="plan-select"
                            label="Tarif Rejasi"
                            options={tariffPlans.map(p => ({ id: p.id, name: p.name }))}
                            selectedValue={formData.planId}
                            onValueChange={value => setFormData(p => ({...p, planId: value}))}
                            customInputName="" onCustomInputChange={()=>{}} customInputPlaceholder=""
                        />
                         {errors.planId && <p className="text-xs text-red-400 -mt-2">{errors.planId}</p>}

                        <Input
                            label="Amal qilish muddati"
                            id="expires-at"
                            type="date"
                            value={formData.expiresAt}
                            onChange={e => setFormData(p => ({...p, expiresAt: e.target.value}))}
                            error={errors.expiresAt}
                        />

                        <CustomSelect
                            id="status-select"
                            label="Holati"
                            options={[
                                { id: 'active', name: 'Faol'}, 
                                { id: 'cancelled', name: 'Bekor qilingan' }, 
                                { id: 'expired', name: 'Muddati o\'tgan' }
                            ]}
                            selectedValue={formData.status}
                            onValueChange={value => setFormData(p => ({...p, status: value as Subscription['status']}))}
                            customInputName="" onCustomInputChange={()=>{}} customInputPlaceholder=""
                        />
                        <div className="flex justify-end gap-3 pt-4">
                            <Button onClick={onClose} variant="secondary">Bekor qilish</Button>
                            <Button onClick={handleSave} variant="primary">Saqlash</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ subscriptions, users, tariffPlans, onAddSubscription, onUpdateSubscription, onDeleteSubscription, onLogAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

    const openAddModal = () => {
        setCurrentSubscription(null);
        setIsModalOpen(true);
    };

    const openEditModal = (subscription: Subscription) => {
        setCurrentSubscription(subscription);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSubscription(null);
    };

    const handleSave = (data: any) => {
        const user = users.find(u => u.phone === data.userId);
        if (currentSubscription) {
            onUpdateSubscription(data);
            onLogAction(`Subscription for user "${user?.name}" updated.`);
        } else {
            onAddSubscription(data);
            onLogAction(`New subscription created for user "${user?.name}".`);
        }
        closeModal();
    };

    const handleDelete = (subscriptionId: number) => {
        if (window.confirm("Haqiqatan ham bu obunani o'chirmoqchimisiz?")) {
            const sub = subscriptions.find(s => s.id === subscriptionId);
            const user = users.find(u => u.phone === sub?.user?.phone);
            onDeleteSubscription(subscriptionId);
            onLogAction(`Subscription for user "${user?.name}" deleted.`);
        }
    };

    return (
        <>
        <SubscriptionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSave}
            subscription={currentSubscription}
            users={users}
            tariffPlans={tariffPlans}
        />
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Obunalarni Boshqarish</h1>
                    <p className="text-slate-400 mt-1">{subscriptions.length} ta obuna mavjud.</p>
                </div>
                <Button onClick={openAddModal} variant="primary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Yangi obuna qo'shish
                </Button>
            </div>
            
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-800/70">
                            <tr>
                                <th scope="col" className="px-6 py-3">Foydalanuvchi</th>
                                <th scope="col" className="px-6 py-3">Tarif Rejasi</th>
                                <th scope="col" className="px-6 py-3">Holati</th>
                                <th scope="col" className="px-6 py-3">Amal qilish muddati</th>
                                <th scope="col" className="px-6 py-3 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length > 0 ? subscriptions.map(sub => {
                                const user = sub.user;
                                const plan = sub.plan;
                                const isExpired = new Date(sub.expiresAt) < new Date();
                                
                                return (
                                <tr key={sub.id} className="border-b border-slate-700/50 hover:bg-slate-800/40">
                                    <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{user?.name || 'Noma\'lum'}</td>
                                    <td className="px-6 py-4">{plan?.name || 'Noma\'lum'}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${sub.status === 'active' ? (isExpired ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300') : 'bg-slate-600/50 text-slate-400'}`}>
                                            {sub.status === 'active' && isExpired ? 'Muddati o\'tgan' : sub.status === 'active' ? 'Faol' : sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(sub.expiresAt).toLocaleDateString('uz-UZ')}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button onClick={() => openEditModal(sub)} variant="secondary" size="small" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                         <Button onClick={() => handleDelete(sub.id)} variant="secondary" size="small" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </td>
                                </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-slate-500">
                                            <CreditCard className="mx-auto h-10 w-10 mb-2"/>
                                            Hozircha obunalar mavjud emas.
                                        </td>
                                    </tr>
                                )
                             }
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
        </>
    );
};

export default SubscriptionManagement;