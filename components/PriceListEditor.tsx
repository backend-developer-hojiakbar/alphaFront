import React, { useState, useMemo, useRef } from 'react';
import { PriceList, PriceTier, Product, Material } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import CustomSelect from './ui/CustomSelect';
import Input from './ui/Input';
import { ArrowLeft, PlusCircle, Save, Search, FileDown, FileUp, ChevronsUpDown, Square } from 'lucide-react';
import { generatePriceListKey, getAttributeToOptionsMap, parsePriceListKey } from '../services/priceListKeyHelper';
import PriceVariantAccordion from './PriceVariantAccordion';
import { LUCIDE_ICONS } from '../constants';

interface PriceListEditorProps {
    initialPriceList: PriceList;
    onSave: (priceList: PriceList) => void;
    onBack: () => void;
    products: Product[];
    materials: Material[];
}

const PriceListEditor: React.FC<PriceListEditorProps> = ({ initialPriceList, onSave, onBack, products, materials }) => {
    const [priceList, setPriceList] = useState<PriceList>(initialPriceList);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    const [isAddingVariant, setIsAddingVariant] = useState<boolean>(false);
    const [newVariantAttrs, setNewVariantAttrs] = useState<Record<string, string>>({});
    const [newVariantCustomValues, setNewVariantCustomValues] = useState<Record<string, string>>({});
    const [copySourceKey, setCopySourceKey] = useState<string | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [areAllOpen, setAreAllOpen] = useState(false);
    const importFileRef = useRef<HTMLInputElement>(null);

    const attributeToOptionsMap = useMemo(() => getAttributeToOptionsMap(materials), [materials]);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsAddingVariant(false);
        setNewVariantAttrs({});
        setSearchQuery('');
        setAreAllOpen(false);
    };

    const handleBackToProductList = () => setSelectedProduct(null);

    const handleAddVariantClick = (sourceKey: string | null = null) => {
        if (!selectedProduct) return;
        setCopySourceKey(sourceKey);
        setIsAddingVariant(true);

        const sourceAttrs = sourceKey ? parsePriceListKey(sourceKey).attributes : {};
        const initialCustomValues: Record<string, string> = {};
        const initialAttrs: Record<string, string> = {};
        
        (selectedProduct.pricingAttributes || []).forEach(attrKey => {
            const sourceValue = sourceAttrs[attrKey];
            const options = attributeToOptionsMap[attrKey as keyof typeof attributeToOptionsMap] || [];
            
            if (sourceValue && !options.some(opt => opt.id === sourceValue)) {
                initialAttrs[attrKey] = 'other';
                initialCustomValues[attrKey] = sourceValue;
            } else if (sourceValue) {
                initialAttrs[attrKey] = sourceValue;
            } else {
                const defaultOption = options.find(opt => opt.id !== 'other') || options[0];
                if (defaultOption) {
                    initialAttrs[attrKey] = defaultOption.id;
                }
            }
        });
        
        setNewVariantAttrs(initialAttrs);
        setNewVariantCustomValues(initialCustomValues);
    };

    const handleVariantAttrChange = (attrKey: string, value: string) => {
        setNewVariantAttrs(prev => ({ ...prev, [attrKey]: value }));
        if (value !== 'other') {
            setNewVariantCustomValues(prev => {
                const next = { ...prev };
                delete next[attrKey];
                return next;
            });
        }
    };

    const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name: attrKey, value } = e.target;
        setNewVariantCustomValues(prev => ({ ...prev, [attrKey]: value }));
    };

    const handleCreateVariant = () => {
        if (!selectedProduct) return;
        const finalAttrs = { ...newVariantAttrs };
        const newKey = generatePriceListKey(selectedProduct.id, finalAttrs);
        
        if (priceList.variants[newKey]) {
            alert("Bunday variant allaqachon mavjud!");
            return;
        }

        const tiersToCopy = copySourceKey ? priceList.variants[copySourceKey] || [] : [];
        const newTiers = tiersToCopy.map(t => ({
            ...t, 
            id: Date.now().toString() + Math.random(),
            additionalServices: t.additionalServices?.map(s => ({ ...s, id: Date.now().toString() + Math.random() + s.name }))
        }));
        
        setPriceList(prev => ({ ...prev, variants: { ...prev.variants, [newKey]: newTiers } }));
        setIsAddingVariant(false);
        setNewVariantAttrs({});
        setNewVariantCustomValues({});
        setCopySourceKey(null);
    };
    
    const handleDeleteVariant = (keyToDelete: string) => {
        if (window.confirm("Haqiqatan ham ushbu variantni narxlar jadvalidan o'chirmoqchimisiz?")) {
            setPriceList(prev => {
                const newVariants = { ...prev.variants };
                delete newVariants[keyToDelete];
                return { ...prev, variants: newVariants };
            });
        }
    };

    const updateTiersForKey = (key: string, updatedTiers: PriceTier[]) => {
        setPriceList(prev => ({ ...prev, variants: { ...prev.variants, [key]: updatedTiers } }));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(priceList, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `ai-print-prices-${new Date().toISOString().slice(0,10)}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Faylni o'qib bo'lmadi");
                const importedData = JSON.parse(text);
                if (importedData && typeof importedData === 'object' && importedData.variants && typeof importedData.variants === 'object') {
                    if(window.confirm("Joriy narxlar jadvali import qilingan ma'lumotlar bilan almashtiriladi. Davom etasizmi?")) {
                       setPriceList(importedData);
                    }
                } else {
                    throw new Error("Noto'g'ri formatdagi fayl.");
                }
            } catch (error) {
                console.error("Import xatoligi:", error);
                alert(`Import qilishda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xato'}`);
            } finally {
                if (importFileRef.current) importFileRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const filteredProductPriceKeys = useMemo(() => {
        if (!selectedProduct) return [];
        return Object.keys(priceList.variants).filter(key => key.startsWith(selectedProduct.id)).sort();
    }, [priceList, selectedProduct]);
    
    const renderProductSelector = () => (
         <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0">
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                        Narxlar Jadvali
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm sm:text-base">Narxlarni tahrirlash uchun mahsulot turini tanlang.</p>
                </div>
            </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => {
                const Icon = LUCIDE_ICONS[product.icon] || Square;
                return (
                <Card key={product.id} onClick={() => handleSelectProduct(product)} className="hover:-translate-y-1">
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
    
    const renderProductEditor = () => {
        if (!selectedProduct) return null;
        
        const hasPricingAttributes = selectedProduct.pricingAttributes && selectedProduct.pricingAttributes.length > 0;
        const lastUpdatedDate = priceList.lastUpdated ? new Date(priceList.lastUpdated).toLocaleString('uz-UZ') : 'Hech qachon';
        const Icon = LUCIDE_ICONS[selectedProduct.icon] || Square;
        
        return (
             <div className="animate-fade-in space-y-6">
                 <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackToProductList} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0">
                            <ArrowLeft className="h-5 w-5 text-slate-300" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800/50 rounded-full p-2 border border-slate-700">
                                <Icon className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">{selectedProduct.name} Narxlari</h2>
                                <p className="text-slate-400 mt-1 text-xs">Oxirgi yangilanish: {lastUpdatedDate}</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex-shrink-0 flex items-center gap-2 self-start sm:self-center">
                        <input type="file" ref={importFileRef} onChange={handleImport} className="hidden" accept=".json" />
                        <Button onClick={() => importFileRef.current?.click()} variant="secondary" size="small"><FileUp className="h-4 w-4 mr-2"/> Import</Button>
                        <Button onClick={handleExport} variant="secondary" size="small"><FileDown className="h-4 w-4 mr-2"/> Export</Button>
                        <Button onClick={() => onSave(priceList)} variant="primary" size="small">
                            <Save className="h-4 w-4 mr-2" />
                            Saqlash
                        </Button>
                    </div>
                </div>
                
                <Card className="p-4 space-y-4">
                    <h3 className="font-bold text-lg text-slate-200">Boshqaruv Paneli</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                             <Input label="Variantlarni qidirish" id="search-variants" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Masalan: matoviy, 300gr..."/>
                             <Search className="absolute top-[40px] right-3 h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex-shrink-0 flex items-end gap-2">
                            <Button onClick={() => setAreAllOpen(!areAllOpen)} variant="secondary" className="w-full">
                                <ChevronsUpDown className="h-4 w-4 mr-2" />
                                {areAllOpen ? "Barchasini yopish" : "Barchasini ochish"}
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    {filteredProductPriceKeys.length > 0 ? filteredProductPriceKeys.map(key => (
                        <PriceVariantAccordion
                            key={key}
                            priceListKey={key}
                            product={selectedProduct}
                            tiers={priceList.variants[key] || []}
                            isInitiallyOpen={areAllOpen}
                            onTiersChange={(updatedTiers) => updateTiersForKey(key, updatedTiers)}
                            onDeleteVariant={() => handleDeleteVariant(key)}
                            onCopyVariant={() => handleAddVariantClick(key)}
                            materials={materials}
                        />
                    )) : (
                         <Card className="text-center py-10 text-slate-500 bg-slate-800/30">
                            <p className="font-semibold">{searchQuery ? "Qidiruv natijasi bo'sh." : "Narxlar kiritilmagan."}</p>
                            <p className="text-sm mt-1">{searchQuery ? "Boshqa kalit so'z bilan urinib ko'ring." : "Boshlash uchun yangi narxlar jadvalini yarating."}</p>
                        </Card>
                    )}
                </div>

                <div className="mt-4">
                    {isAddingVariant ? (
                        <Card className="p-4 bg-slate-900/40 space-y-4 animate-fade-in border border-cyan-500/30">
                            <h4 className='text-md font-semibold text-slate-300'>{copySourceKey ? "Variantdan nusxa olish" : "Yangi variant yaratish"}</h4>
                            {(selectedProduct.pricingAttributes || []).map(attrKey => (
                                <CustomSelect
                                    key={attrKey}
                                    id={`new-variant-${attrKey}`}
                                    label={attrKey}
                                    options={attributeToOptionsMap[attrKey as keyof typeof attributeToOptionsMap] || []}
                                    selectedValue={newVariantAttrs[attrKey] || ''}
                                    onValueChange={(value) => handleVariantAttrChange(attrKey, value)}
                                    customInputValue={newVariantCustomValues[attrKey] || ''}
                                    onCustomInputChange={handleCustomValueChange}
                                    customInputName={attrKey}
                                    customInputPlaceholder="Maxsus qiymatni kiriting"
                                />
                            ))}
                            <div className="flex items-center gap-3 pt-2">
                                <Button onClick={handleCreateVariant} variant="primary">Yaratish</Button>
                                <Button onClick={() => setIsAddingVariant(false)} variant="secondary">Bekor qilish</Button>
                            </div>
                        </Card>
                    ) : (
                        hasPricingAttributes ? (
                        <Button onClick={() => handleAddVariantClick(null)} variant="secondary" className="w-full">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Yangi narx varianti qo'shish
                        </Button>
                        ) : (
                             filteredProductPriceKeys.length === 0 && (
                                <Button onClick={() => { if (!selectedProduct) return; setPriceList(prev => ({ ...prev, variants: { ...prev.variants, [selectedProduct.id]: [] } })); }} variant="secondary" className="w-full">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Narxlar jadvalini yaratish
                                </Button>
                            )
                        )
                    )}
                </div>
             </div>
        )
    }

    return (
        <div className="pb-8">
            {selectedProduct ? renderProductEditor() : renderProductSelector()}
        </div>
    );
};

export default PriceListEditor;