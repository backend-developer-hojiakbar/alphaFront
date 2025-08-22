// src/components/Footer.tsx

import React from 'react';
import { Bot, Crown, Shield, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
      <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-500/20 rounded-2xl p-5 text-slate-400">
        <div className="flex justify-center items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-cyan-400" />
            <p className="font-semibold text-slate-300">AI-Print Calculator</p>
        </div>
        <p className="mb-4 text-sm text-slate-300 max-w-lg mx-auto" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
            Bu shunchaki dastur emas. Bu — intellekt va texnologiyaning strategik birlashmasi.
        </p>
        <div className="border-t border-slate-700/50 my-4"></div>
        <div className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-cyan-400/90" />
                <span className="text-slate-300">Yaratuvchi: <a href="https://cdcgroup.uz" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 tracking-wide hover:underline">CDCGroup</a></span>
            </div>
            <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-rose-400/90" />
                <span className="text-slate-300">Qo'llab-quvvatlash: <a href="https://cdcgroup.uz" target="_blank" rel="noopener noreferrer" className="font-semibold text-rose-400 tracking-wide hover:underline">CraDev</a></span>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400/90" />
                <a href="tel:+998947430912" className="text-slate-300 hover:text-green-400 transition-colors">Bog'lanish: <strong className="font-semibold text-green-400 tracking-wide">+998 94 743 09 12</strong></a>
            </div>
        </div>
         <p className="mt-5 opacity-70 text-xs">
           © 2025 Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};

export default Footer;