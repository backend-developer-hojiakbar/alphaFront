// src/components/Header.tsx

import React from 'react';
import { Bot, User, LogIn, LayoutDashboard } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onLogoClick: () => void;
  currentUser: UserType | null;
  onProfileClick: () => void;
  onLoginClick: () => void;
  onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, currentUser, onProfileClick, onLoginClick, onDashboardClick }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md shadow-lg shadow-black/20 sticky top-0 z-20 border-b border-slate-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex-1 flex justify-start">
          </div>

          <div onClick={onLogoClick} className="flex-shrink-0 flex items-center justify-center gap-3 cursor-pointer">
            <Bot className="h-7 w-7 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}/>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.3)' }}>AI-Print Hisob-kitobi</h1>
          </div>

          <div className="flex-1 flex items-center justify-end gap-2">
            {currentUser ? (
              <>
                <button onClick={onDashboardClick} className="p-2 text-slate-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700/50 w-10 h-10 flex items-center justify-center" aria-label="Boshqaruv paneli">
                    <LayoutDashboard className="h-6 w-6" />
                </button>
                <button onClick={onProfileClick} className="p-2 text-slate-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700/50 w-10 h-10 flex items-center justify-center" aria-label="Shaxsiy kabinet">
                    <User className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button onClick={onLoginClick} className="p-2 text-slate-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700/50 w-10 h-10 flex items-center justify-center" aria-label="Tizimga kirish">
                <LogIn className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;