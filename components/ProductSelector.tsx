// src/components/ProductSelector.tsx

import React from 'react';
import { Product } from '../types';
import Card from './ui/Card';
import { ArrowLeft, Square } from 'lucide-react';
import { LUCIDE_ICONS } from '../constants';

interface ProductSelectorProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onBack: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ products, onSelect, onBack }) => {
  return (
    <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
                <ArrowLeft className="h-5 w-5 text-slate-300" />
            </button>
            <div>
                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>Mahsulot turini tanlang</h2>
                 <p className="text-slate-400 mt-1 text-sm sm:text-base">Hisob-kitob uchun kibernetik modulni tanlang.</p>
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => {
            const Icon = LUCIDE_ICONS[product.icon] || Square;
            return (
            <Card key={product.id} onClick={() => onSelect(product)} className="hover:-translate-y-1">
              <div className="p-5 flex flex-col items-center text-center">
                <div className="relative mb-4">
                   <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg"></div>
                   <div className="relative bg-slate-800/50 rounded-full p-3 border border-slate-600">
                      <Icon className="h-8 w-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 5px currentColor)' }}/>
                   </div>
                </div>
                <h3 className="font-semibold text-slate-100">{product.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{product.description}</p>
              </div>
            </Card>
          )})}
        </div>
    </div>
  );
};

export default ProductSelector;