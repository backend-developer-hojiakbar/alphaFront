// src/components/Loader.tsx

import React from 'react';
import { Cpu } from 'lucide-react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 my-6 animate-fade-in">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping"></div>
        <div className="relative flex items-center justify-center h-full w-full bg-slate-800 rounded-full border border-slate-700 shadow-lg">
            <Cpu className="h-10 w-10 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}/>
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-lg font-semibold text-slate-200" style={{ textShadow: '0 0 5px rgba(255,255,255,0.2)'}}>AI yadro hisoblamoqda...</p>
        <p className="text-sm text-slate-400">Vaqt-makon kontinuumini optimallashtirish...</p>
      </div>
    </div>
  );
};

export default Loader;