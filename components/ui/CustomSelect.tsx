import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import Input from './Input';

interface Option {
  id: string;
  name: string;
}

interface CustomSelectProps {
  label: string;
  id: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  customInputValue?: string;
  onCustomInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customInputName: string;
  customInputPlaceholder: string;
  customInputError?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  id,
  options,
  selectedValue,
  onValueChange,
  customInputValue,
  onCustomInputChange,
  customInputName,
  customInputPlaceholder,
  customInputError,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionId: string) => {
    onValueChange(optionId);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.id === selectedValue);
  const displayValue = selectedOption ? selectedOption.name : 'Tanlang...';

  return (
    <div className="space-y-2">
      <div className="relative" ref={selectRef}>
        <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
            {label}
        </label>
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-slate-600/80 bg-slate-800/50 py-2.5 px-4 text-slate-100 shadow-inner-sm transition-colors focus:border-cyan-400 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-400 focus:outline-none sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-30 mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 shadow-lg animate-fade-in-sm">
            <ul
              tabIndex={-1}
              role="listbox"
              className="max-h-60 overflow-auto rounded-md p-1 focus:outline-none"
            >
              {options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="group flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-cyan-500/10"
                  role="option"
                  aria-selected={selectedValue === option.id}
                >
                  <span className="truncate">{option.name}</span>
                  {selectedValue === option.id && (
                    <Check className="h-5 w-5 text-cyan-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedValue === 'other' && (
        <div className="mt-2 animate-fade-in">
          <Input
            id={customInputName}
            name={customInputName}
            label=""
            value={customInputValue}
            onChange={onCustomInputChange}
            placeholder={customInputPlaceholder}
            error={customInputError}
            required
          />
        </div>
      )}
    </div>
  );
};

export default CustomSelect;