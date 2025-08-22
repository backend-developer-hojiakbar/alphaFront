// src/components/CheckoutView.tsx

import React, { useState, useEffect } from 'react';
import { Order, CartItem, User, PromoCode } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { ArrowLeft, Send, CheckCircle, CreditCard, Truck, Landmark, Store, Tag, PlusCircle, Trash2 } from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  onPlaceOrder: (orderDetails: Omit<Order, 'id' | 'user' | 'items' | 'status' | 'createdAt'>) => void;
  onBackToCart: () => void;
  user: User | null;
  promoCodes: PromoCode[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
};

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onPlaceOrder, onBackToCart, user, promoCodes }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] =useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [errors, setErrors] = useState<{name?: string, phone?: string, address?: string}>({});
  
  const [additionalServices, setAdditionalServices] = useState<{ id: string; name: string; cost: string; }[]>([]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  
  useEffect(() => {
    if (user) {
        setName(user.name);
        setPhone(user.phone);
    }
  }, [user]);

  const subtotal = items.reduce((sum, item) => sum + item.result.totalCost, 0);
  const servicesCost = additionalServices.reduce((sum, service) => sum + (Number(service.cost) || 0), 0);
  
  const totalCost = subtotal - discount + servicesCost;
  
  const handleAddService = () => {
    setAdditionalServices(prev => [...prev, { id: `service-${Date.now()}`, name: '', cost: '' }]);
  };
  
  const handleUpdateService = (id: string, field: 'name' | 'cost', value: string) => {
    setAdditionalServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  
  const handleRemoveService = (id: string) => {
    setAdditionalServices(prev => prev.filter(s => s.id !== id));
  };

  const handleApplyPromo = () => {
    const foundCode = promoCodes.find(pc => pc.id.toUpperCase() === promoCode.toUpperCase() && pc.isActive);

    if (foundCode) {
        if (foundCode.type === 'percentage') {
            setDiscount(subtotal * (foundCode.value / 100));
        } else {
            setDiscount(foundCode.value);
        }
        setPromoMessage({ text: "Promo-kod muvaffaqiyatli qo'llanildi!", type: 'success'});
    } else {
        setDiscount(0);
        setPromoMessage({ text: "Noto'g'ri yoki yaroqsiz promo-kod.", type: 'error' });
    }
  };

  const validate = () => {
    const newErrors: {name?: string, phone?: string, address?: string} = {};
    if (!name.trim()) newErrors.name = "Ism-sharifingizni kiriting.";
    if (!phone.trim()) newErrors.phone = "Telefon raqamingizni kiriting.";
    if (deliveryMethod === 'delivery' && !address.trim()) {
        newErrors.address = "Yetkazib berish uchun manzilingizni kiriting.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder({
        subtotal: subtotal,
        promoCode: discount > 0 ? promoCode : undefined,
        discount: discount,
        additionalServices: additionalServices
            .map(s => ({ ...s, cost: Number(s.cost) || 0 }))
            .filter(s => s.name.trim() && s.cost > 0),
        totalCost: totalCost,
        customer: { name, phone },
        delivery: { method: deliveryMethod, address: deliveryMethod === 'delivery' ? address : undefined },
        paymentMethod,
      });
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBackToCart} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
        </button>
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                Buyurtmani rasmiylashtirish
            </h2>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Ma'lumotlaringizni to'ldiring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Aloqa ma'lumotlari</h3>
            <div className="space-y-4">
                <Input 
                    label="Ism-sharifingiz"
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
                    placeholder="+998 (XX) XXX-XX-XX"
                    error={errors.phone}
                    required
                />
            </div>
        </Card>

        <Card className="p-5">
             <h3 className="font-bold text-lg text-slate-200 mb-4">Yetkazib berish usuli</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${deliveryMethod === 'pickup' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-600/80 bg-slate-800/50'}`}>
                    <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="hidden" />
                    <Store className={`h-6 w-6 ${deliveryMethod === 'pickup' ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-medium">O'zim olib ketaman</span>
                    <CheckCircle className={`h-5 w-5 ml-auto transition-opacity ${deliveryMethod === 'pickup' ? 'opacity-100 text-cyan-400' : 'opacity-0'}`} />
                </label>
                 <label className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${deliveryMethod === 'delivery' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-600/80 bg-slate-800/50'}`}>
                    <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="hidden" />
                    <Truck className={`h-6 w-6 ${deliveryMethod === 'delivery' ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-medium">Yetkazib berish</span>
                     <CheckCircle className={`h-5 w-5 ml-auto transition-opacity ${deliveryMethod === 'delivery' ? 'opacity-100 text-cyan-400' : 'opacity-0'}`} />
                </label>
             </div>
             {deliveryMethod === 'delivery' && (
                 <div className="mt-4 animate-fade-in">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-400 mb-2">
                        Manzilingiz
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Masalan: Toshkent sh., Yunusobod tumani, 19-kvartal, 25-uy, 7-xonadon"
                        className={`w-full rounded-lg border bg-slate-800/50 p-3 text-slate-100 shadow-inner-sm transition-colors focus:bg-slate-800 focus:ring-1 focus:outline-none sm:text-sm ${errors.address ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : 'border-slate-600/80 focus:border-cyan-400 focus:ring-cyan-400'}`}
                    ></textarea>
                    {errors.address && <p className="mt-1.5 text-xs text-red-400">{errors.address}</p>}
                    <p className="text-xs text-slate-500 mt-2">Yetkazib berish narxi menejer tomonidan alohida hisoblanadi.</p>
                 </div>
             )}
        </Card>
        
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Qo'shimcha xizmatlar</h3>
             <div className="space-y-3">
                {additionalServices.map((service, index) => (
                    <div key={service.id} className="flex flex-col sm:flex-row items-end gap-2 p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex-grow w-full sm:w-auto">
                           <Input
                             label={`Xizmat #${index + 1} nomi`}
                             id={`service-name-${service.id}`}
                             value={service.name}
                             onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)}
                             placeholder="Masalan: Muqovalash"
                           />
                        </div>
                        <div className="w-full sm:w-40 flex-shrink-0">
                           <Input
                             label="Narxi"
                             id={`service-cost-${service.id}`}
                             type="number"
                             value={service.cost}
                             onChange={(e) => handleUpdateService(service.id, 'cost', e.target.value)}
                             placeholder="50000"
                           />
                        </div>
                        <Button
                            type="button"
                            onClick={() => handleRemoveService(service.id)}
                            variant="secondary"
                            className="h-[46px] p-2 bg-red-900/20 border-red-500/20 text-red-400 hover:bg-red-900/60"
                        >
                            <Trash2 className="h-5 w-5"/>
                        </Button>
                    </div>
                ))}
                 <Button type="button" onClick={handleAddService} variant="secondary" className="w-full border-dashed">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Xizmat qo'shish
                </Button>
            </div>
        </Card>

        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Promo-kod</h3>
            <div className="flex items-start gap-2">
                <div className="flex-grow">
                     <Input 
                        label=""
                        id="promoCode"
                        name="promoCode"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo-kodni kiriting"
                    />
                </div>
                <Button type="button" onClick={handleApplyPromo} variant="secondary" className="h-[46px] mt-2">
                    Qo'llash
                </Button>
            </div>
            {promoMessage.text && (
                 <p className={`mt-2 text-xs ${promoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {promoMessage.text}
                 </p>
            )}
        </Card>

        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">To'lov usuli</h3>
            <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-not-allowed border-slate-700 bg-slate-800/30 opacity-60">
                    <input type="radio" name="paymentMethod" value="payme" checked={paymentMethod === 'payme'} className="hidden" disabled />
                    <CreditCard className="h-6 w-6 text-slate-500" />
                    <div className="flex-grow">
                        <span className="font-medium text-slate-400">Payme / Click</span>
                        <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">Tez kunda</span>
                    </div>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${paymentMethod === 'cash' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-600/80 bg-slate-800/50'}`}>
                    <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <Landmark className={`h-6 w-6 ${paymentMethod === 'cash' ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-medium">Naqd pul yoki o'tkazma</span>
                     <CheckCircle className={`h-5 w-5 ml-auto transition-opacity ${paymentMethod === 'cash' ? 'opacity-100 text-cyan-400' : 'opacity-0'}`} />
                </label>
            </div>
        </Card>

        <Card className="mt-8 bg-slate-900/50 p-5 space-y-3">
            <div className="flex justify-between items-center text-slate-300">
                <p>Mahsulotlar jami:</p>
                <p>{formatCurrency(subtotal)}</p>
            </div>
             {discount > 0 && (
                <div className="flex justify-between items-center text-green-400 animate-fade-in">
                    <p>Chegirma ({promoCode}):</p>
                    <p>-{formatCurrency(discount)}</p>
                </div>
            )}
            {servicesCost > 0 && (
                <div className="flex justify-between items-center text-cyan-300 animate-fade-in">
                    <p>Qo'shimcha xizmatlar:</p>
                    <p>+{formatCurrency(servicesCost)}</p>
                </div>
            )}
            <div className="border-t border-slate-700 my-2"></div>
            <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-slate-200">Yakuniy narx:</p>
                <p className="text-2xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(56, 189, 248, 0.4)'}}>{formatCurrency(totalCost)}</p>
            </div>
        </Card>

        <div className="mt-6">
            <Button type="submit" variant="primary" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Buyurtmani tasdiqlash
            </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutView;