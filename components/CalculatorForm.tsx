// src/components/CalculatorForm.tsx

import React, { useState, useEffect } from 'react';
import { Product, FormState, FileInfo, Urgency, Material } from '../types';
import { COLORS, LAMINATIONS, BINDING_TYPES, URGENCY_OPTIONS } from '../constants';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import CustomSelect from './ui/CustomSelect';
import { ArrowLeft, Calculator, UploadCloud, X, LoaderCircle } from 'lucide-react';

interface CalculatorFormProps {
  product: Product;
  onCalculate: (formState: FormState) => void;
  onBack: () => void;
  isLoading: boolean;
  prefilledState?: Partial<FormState>;
  materials: Material[];
}

type CustomFieldErrors = {
  customMaterial?: string;
  customColor?: string;
  customLamination?: string;
  customCoverMaterial?: string;
  customInnerMaterial?: string;
  customBindingType?: string;
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({ product, onCalculate, onBack, isLoading, prefilledState, materials }) => {
  const hasField = (field: string) => product.fields.includes(field as any);

  const getDefaultState = (): FormState => ({
    productType: product.name,
    width: hasField('dimensions') ? 90 : 0,
    height: hasField('dimensions') ? 50 : 0,
    depth: hasField('depth') ? 50 : undefined,
    material: hasField('depth') ? 'cardboard-270' : 'coated-300',
    customMaterial: '',
    quantity: 1000,
    color: '4+4',
    customColor: '',
    lamination: 'none',
    customLamination: '',
    urgency: 'standard',
    file: undefined,
    pageCount: hasField('pageCount') ? 16 : undefined,
    coverMaterial: hasField('coverMaterial') ? 'coated-300' : undefined,
    customCoverMaterial: '',
    innerMaterial: hasField('innerMaterial') ? 'coated-150' : undefined,
    customInnerMaterial: '',
    bindingType: hasField('bindingType') ? 'saddle-stitch' : undefined,
    customBindingType: '',
  });

  const [formState, setFormState] = useState<FormState>(() => getDefaultState());

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>> & CustomFieldErrors>({});

  useEffect(() => {
    const defaultState = getDefaultState();
    const initialState = prefilledState
        ? { ...defaultState, ...prefilledState, productType: product.name }
        : defaultState;
        
    setFormState(initialState);
    setFile(null);
    setFilePreview(null);
    setErrors({});
  }, [product, prefilledState]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> & CustomFieldErrors = {};
    if (hasField('dimensions')) {
      if (!formState.width || formState.width <= 0) newErrors.width = "Eni musbat son bo'lishi kerak.";
      if (!formState.height || formState.height <= 0) newErrors.height = "Bo'yi musbat son bo'lishi kerak.";
    }
    if (hasField('depth')) {
      if (formState.depth !== undefined && formState.depth <= 0) newErrors.depth = "Balandligi musbat son bo'lishi kerak.";
    }
    if (hasField('pageCount')) {
      if (!formState.pageCount || formState.pageCount <= 0) newErrors.pageCount = "Sahifalar soni musbat son bo'lishi kerak.";
    }
    if (!formState.quantity || formState.quantity <= 0) {
      newErrors.quantity = "Soni musbat son bo'lishi kerak.";
    }
    
    if (hasField('material') && formState.material === 'other' && !formState.customMaterial?.trim()) newErrors.customMaterial = "Iltimos, material nomini kiriting.";
    if (hasField('color') && formState.color === 'other' && !formState.customColor?.trim()) newErrors.customColor = "Iltimos, ranglilik turini kiriting.";
    if (hasField('lamination') && formState.lamination === 'other' && !formState.customLamination?.trim()) newErrors.customLamination = "Iltimos, laminatsiya turini kiriting.";
    if (hasField('coverMaterial') && formState.coverMaterial === 'other' && !formState.customCoverMaterial?.trim()) newErrors.customCoverMaterial = "Iltimos, muqova materialini kiriting.";
    if (hasField('innerMaterial') && formState.innerMaterial === 'other' && !formState.customInnerMaterial?.trim()) newErrors.customInnerMaterial = "Iltimos, ichki sahifa materialini kiriting.";
    if (hasField('bindingType') && formState.bindingType === 'other' && !formState.customBindingType?.trim()) newErrors.customBindingType = "Iltimos, muqova turini kiriting.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof errors];
        return newErrors;
      });
    }
    setFormState(prevState => ({
      ...prevState,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: keyof FormState, value: string) => {
    const customFieldName = `custom${name.charAt(0).toUpperCase() + name.slice(1)}` as keyof CustomFieldErrors;
    if (errors[customFieldName]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[customFieldName];
            return newErrors;
        });
    }
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi 5MB dan oshmasligi kerak.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    let submissionState: FormState = { ...formState };
    
    if (submissionState.material === 'other') submissionState.material = submissionState.customMaterial!;
    if (submissionState.color === 'other') submissionState.color = submissionState.customColor!;
    if (submissionState.lamination === 'other') submissionState.lamination = submissionState.customLamination!;
    if (submissionState.coverMaterial === 'other') submissionState.coverMaterial = submissionState.customCoverMaterial!;
    if (submissionState.innerMaterial === 'other') submissionState.innerMaterial = submissionState.customInnerMaterial!;
    if (submissionState.bindingType === 'other') submissionState.bindingType = submissionState.customBindingType!;

    const cleanedState: Partial<FormState> = { ...submissionState };
    delete cleanedState.customMaterial;
    delete cleanedState.customColor;
    delete cleanedState.customLamination;
    delete cleanedState.customCoverMaterial;
    delete cleanedState.customInnerMaterial;
    delete cleanedState.customBindingType;

    if (file && filePreview) {
      const base64Data = filePreview.split(',')[1];
      const fileInfo: FileInfo = {
        data: base64Data,
        mimeType: file.type,
        name: file.name
      };
      cleanedState.file = fileInfo;
    } else {
      delete cleanedState.file;
    }
    
    onCalculate(cleanedState as FormState);
  };

  return (
    <Card className="p-0 animate-fade-in">
      <div className="p-5 border-b border-slate-500/30 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors" aria-label="Orqaga">
          <ArrowLeft className="h-5 w-5 text-slate-300" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-100">{product.name}</h2>
          <p className="text-sm text-slate-400">Parametrlarni kiriting</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-5">
        {hasField('dimensions') && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Eni" id="width" name="width" type="number" value={formState.width} onChange={handleInputChange} min="1" unit="mm" error={errors.width} />
            <Input label="Bo'yi" id="height" name="height" type="number" value={formState.height} onChange={handleInputChange} min="1" unit="mm" error={errors.height} />
          </div>
        )}
        
        {hasField('depth') && (
          <Input label="Balandligi (chuqurligi)" id="depth" name="depth" type="number" value={formState.depth} onChange={handleInputChange} min="1" unit="mm" error={errors.depth} />
        )}

        {hasField('pageCount') && (
            <Input label="Sahifalar soni" id="pageCount" name="pageCount" type="number" value={formState.pageCount} onChange={handleInputChange} required min="2" error={errors.pageCount} />
        )}
        
        {hasField('material') && (
            <CustomSelect
                id="material"
                label="Material"
                options={materials}
                selectedValue={formState.material}
                onValueChange={(value) => handleSelectChange('material', value)}
                customInputValue={formState.customMaterial}
                onCustomInputChange={handleInputChange}
                customInputName="customMaterial"
                customInputPlaceholder="Material nomini kiriting"
                customInputError={errors.customMaterial}
            />
        )}

        {hasField('coverMaterial') && (
            <CustomSelect
                id="coverMaterial"
                label="Muqova materiali"
                options={materials}
                selectedValue={formState.coverMaterial!}
                onValueChange={(value) => handleSelectChange('coverMaterial', value)}
                customInputValue={formState.customCoverMaterial}
                onCustomInputChange={handleInputChange}
                customInputName="customCoverMaterial"
                customInputPlaceholder="Muqova materialini kiriting"
                customInputError={errors.customCoverMaterial}
            />
        )}

        {hasField('innerMaterial') && (
            <CustomSelect
                id="innerMaterial"
                label="Ichki sahifa materiali"
                options={materials}
                selectedValue={formState.innerMaterial!}
                onValueChange={(value) => handleSelectChange('innerMaterial', value)}
                customInputValue={formState.customInnerMaterial}
                onCustomInputChange={handleInputChange}
                customInputName="customInnerMaterial"
                customInputPlaceholder="Ichki sahifa materialini kiriting"
                customInputError={errors.customInnerMaterial}
            />
        )}

        <Input label="Soni (tiraj)" id="quantity" name="quantity" type="number" value={formState.quantity} onChange={handleInputChange} required min="1" error={errors.quantity} />

        {hasField('color') && (
             <CustomSelect
                id="color"
                label="Ranglilik"
                options={COLORS}
                selectedValue={formState.color}
                onValueChange={(value) => handleSelectChange('color', value)}
                customInputValue={formState.customColor}
                onCustomInputChange={handleInputChange}
                customInputName="customColor"
                customInputPlaceholder="Rang turini kiriting"
                customInputError={errors.customColor}
            />
        )}

        {hasField('lamination') && (
            <CustomSelect
                id="lamination"
                label="Laminatsiya"
                options={LAMINATIONS}
                selectedValue={formState.lamination}
                onValueChange={(value) => handleSelectChange('lamination', value)}
                customInputValue={formState.customLamination}
                onCustomInputChange={handleInputChange}
                customInputName="customLamination"
                customInputPlaceholder="Laminatsiya turini kiriting"
                customInputError={errors.customLamination}
            />
        )}

        {hasField('bindingType') && (
            <CustomSelect
                id="bindingType"
                label="Muqovalash turi"
                options={BINDING_TYPES}
                selectedValue={formState.bindingType!}
                onValueChange={(value) => handleSelectChange('bindingType', value)}
                customInputValue={formState.customBindingType}
                onCustomInputChange={handleInputChange}
                customInputName="customBindingType"
                customInputPlaceholder="Muqova turini kiriting"
                customInputError={errors.customBindingType}
            />
        )}

        {hasField('urgency') && (
            <CustomSelect
                id="urgency"
                label="Bajarilish muddati"
                options={URGENCY_OPTIONS}
                selectedValue={formState.urgency}
                onValueChange={(value) => handleSelectChange('urgency', value as Urgency)}
                customInputValue=""
                onCustomInputChange={() => {}}
                customInputName="customUrgency"
                customInputPlaceholder=""
            />
        )}
        
        {hasField('file-upload') && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Dizayn fayli (ixtiyoriy)</label>
              {filePreview ? (
                <div className="mt-2 relative group bg-slate-900/70 p-2 rounded-lg border border-slate-600">
                    <img src={filePreview} alt="Fayl prevyusi" className="max-h-40 w-auto mx-auto rounded-md shadow-sm" />
                    <p className="text-xs text-slate-400 truncate mt-2 text-center">{file?.name}</p>
                    <button type="button" onClick={handleRemoveFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" aria-label="Faylni o'chirish">
                      <X className="h-4 w-4" />
                    </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-xl hover:border-cyan-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
                    <div className="flex text-sm text-slate-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none">
                        <span>Fayl yuklash</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp, application/pdf" />
                      </label>
                      <p className="pl-1">yoki tortib olib keling</p>
                    </div>
                    <p className="text-xs text-slate-500">Rasm, PDF (maks 5MB)</p>
                  </div>
                </div>
              )}
            </div>
        )}
        
        <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <LoaderCircle className="h-5 w-5 mr-2 animate-spin" />
                  Hisoblanmoqda...
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Hisoblash
                </>
              )}
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default CalculatorForm;