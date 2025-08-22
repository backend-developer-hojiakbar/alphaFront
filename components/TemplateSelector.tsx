// src/components/TemplateSelector.tsx

import React from 'react';
import { Template } from '../types';
import Card from './ui/Card';
import { ArrowLeft } from 'lucide-react';

interface TemplateSelectorProps {
    templates: Template[];
    onSelect: (template: Template) => void;
    onBack: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect, onBack }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
        </button>
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                Tayyor shablonni tanlang
            </h2>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Hisob-kitobni boshlash uchun shablon ustiga bosing.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} onClick={() => onSelect(template)} className="hover:-translate-y-1 p-1 overflow-hidden flex flex-col">
            <div className={`w-full h-24 rounded-lg m-1.5 flex items-center justify-center ${template.previewColor}`}>
                <p className="font-bold text-slate-900/50 text-xl tracking-wider">{template.name}</p>
            </div>
            <div className="p-4 pt-3">
              <h3 className="font-semibold text-slate-100">{template.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;