// src/components/OrderSuccessView.tsx

import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { CheckCircle2, Home, User } from 'lucide-react';

interface OrderSuccessViewProps {
  onGoHome: () => void;
  onGoToProfile: () => void;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ onGoHome, onGoToProfile }) => {
  return (
    <div className="animate-fade-in text-center py-20 flex flex-col items-center">
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
            <CheckCircle2 className="relative h-24 w-24 text-green-400" style={{ filter: 'drop-shadow(0 0 15px currentColor)'}} />
        </div>
        <h2 className="text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.4)'}}>
            Rahmat! Buyurtmangiz qabul qilindi.
        </h2>
        <p className="text-slate-400 mt-3 max-w-md">
            Tez orada menejerimiz siz bilan bog'lanadi va buyurtma tafsilotlariga aniqlik kiritadi.
        </p>
        <p className="text-xs text-slate-500 mt-4 max-w-md">
            Buyurtma holatini shaxsiy kabinetingiz orqali kuzatib borishingiz mumkin.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
             <Button onClick={onGoHome} variant="secondary">
              <Home className="h-4 w-4 mr-2" />
              Bosh sahifaga qaytish
            </Button>
            <Button onClick={onGoToProfile} variant="primary">
              <User className="h-4 w-4 mr-2" />
              Buyurtmalarimni ko'rish
            </Button>
        </div>
      </div>
  );
};

export default OrderSuccessView;