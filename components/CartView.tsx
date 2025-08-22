// src/components/CartView.tsx

import React from 'react';
import { CartItem } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { ArrowLeft, Trash2, ShoppingCart, CreditCard, Square } from 'lucide-react';
import { URGENCY_OPTIONS, LUCIDE_ICONS } from '../constants';

interface CartViewProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  onGoToCheckout: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
};

const CartView: React.FC<CartViewProps> = ({ items, onRemoveItem, onContinueShopping, onGoToCheckout }) => {
  const totalCost = items.reduce((sum, item) => sum + item.result.totalCost, 0);

  if (items.length === 0) {
    return (
      <div className="animate-fade-in text-center py-20">
        <div className="flex justify-center items-center mb-6">
            <div className="relative bg-slate-800/50 rounded-full p-5 border border-slate-700">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl"></div>
                <ShoppingCart className="relative h-16 w-16 text-slate-500" />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-200">Savatchangiz bo'sh</h2>
        <p className="text-slate-400 mt-2 mb-6">Hisob-kitob qilingan mahsulotlar shu yerda paydo bo'ladi.</p>
        <Button onClick={onContinueShopping} variant="primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Xaridni boshlash
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onContinueShopping} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
        </button>
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                Savatcha
            </h2>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">{items.length} ta mahsulot umumiy narxi {formatCurrency(totalCost)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map(item => {
          const Icon = LUCIDE_ICONS[item.product.icon] || Square;
          return (
          <Card key={item.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-grow">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <Icon className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-slate-100 truncate">{item.product.name}</p>
                <p className="text-xs text-slate-400 truncate">{item.request.quantity} dona &bull; {item.request.width}x{item.request.height}mm</p>
                 {item.request.urgency && item.request.urgency !== 'standard' && (
                    <p className="text-xs text-cyan-400/80 truncate">{URGENCY_OPTIONS.find(o => o.id === item.request.urgency)?.name}</p>
                 )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 flex items-center gap-4">
                <p className="font-semibold text-slate-200">{formatCurrency(item.result.totalCost)}</p>
                <button onClick={() => onRemoveItem(item.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors" aria-label="O'chirish">
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
          </Card>
        )})}
      </div>

        <Card className="mt-8">
             <div className="p-5">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-slate-300">Jami:</p>
                    <p className="text-2xl font-bold text-cyan-300" style={{ textShadow: '0 0 10px rgba(56, 189, 248, 0.4)'}}>{formatCurrency(totalCost)}</p>
                </div>
             </div>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button onClick={onContinueShopping} variant="secondary" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Xaridni davom ettirish
            </Button>
            <Button onClick={onGoToCheckout} variant="primary" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Rasmiylashtirishga o'tish
            </Button>
        </div>
    </div>
  );
};

export default CartView;