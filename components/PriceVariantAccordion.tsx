import React, { useState, useEffect, useMemo } from 'react';
import { PriceTier, Product, Material, AdditionalService } from '../types';
import { getOptionDisplayName, parsePriceListKey } from '../services/priceListKeyHelper';
import { ChevronDown, PlusCircle, Trash2, Copy, Sparkles, Check } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface PriceVariantAccordionProps {
    priceListKey: string;
    product: Product;
    tiers: PriceTier[];
    isInitiallyOpen: boolean;
    onTiersChange: (updatedTiers: PriceTier[]) => void;
    onDeleteVariant: () => void;
    onCopyVariant: () => void;
    materials: Material[];
}

const PriceVariantAccordion: React.FC<PriceVariantAccordionProps> = ({ priceListKey, product, tiers, isInitiallyOpen, onTiersChange, onDeleteVariant, onCopyVariant, materials }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    const [newTier, setNewTier] = useState({ soni: '', narxi: '', summasi: '', izoh: '' });
    const [tierErrors, setTierErrors] = useState<Record<string, string>>({});
    const [adjustment, setAdjustment] = useState('');

    const [addingServiceForTier, setAddingServiceForTier] = useState<string | null>(null);
    const [newServiceName, setNewServiceName] = useState('');
    const [newServiceCost, setNewServiceCost] = useState('');
    
    const { attributes } = parsePriceListKey(priceListKey);
    const variantDescription = Object.entries(attributes)
        .map(([key, value]) => getOptionDisplayName(value, materials))
        .join(', ') || 'Asosiy narx';
        
    useEffect(() => {
        setIsOpen(isInitiallyOpen);
    }, [isInitiallyOpen]);
    
    useEffect(() => {
        validateTiers();
    }, [tiers]);

    const validateTiers = () => {
        const errors: Record<string, string> = {};
        const soniSet = new Set<number>();
        for (const tier of tiers) {
            if (soniSet.has(tier.soni)) {
                errors[tier.id] = "Bu miqdor uchun narx allaqachon mavjud.";
            } else {
                soniSet.add(tier.soni);
            }
        }
        setTierErrors(errors);
    };

    const handleTiersChangeWithSort = (updatedTiers: PriceTier[]) => {
        const sortedTiers = [...updatedTiers].sort((a,b) => a.soni - b.soni);
        onTiersChange(sortedTiers);
    };

    const handleTierChange = (tierId: string, field: keyof PriceTier, value: string) => {
        const updatedTiers = tiers.map(tier => {
            if (tier.id === tierId) {
                const servicesCost = tier.additionalServices?.reduce((sum, s) => sum + s.cost, 0) || 0;
                 if (field === 'izoh') {
                    return { ...tier, izoh: value };
                }
                
                const numericValue = Number(value);
                if (isNaN(numericValue)) return tier;

                const newTier = { ...tier, [field]: numericValue };
                if (field === 'soni' || field === 'narxi') {
                    newTier.summasi = Math.round(newTier.soni * newTier.narxi) + servicesCost;
                } else if (field === 'summasi') {
                    const baseSummasi = newTier.summasi - servicesCost;
                    newTier.narxi = newTier.soni > 0 ? parseFloat((baseSummasi / newTier.soni).toFixed(2)) : 0;
                }
                return newTier;
            }
            return tier;
        });
        handleTiersChangeWithSort(updatedTiers);
    };
    
    const handleNewTierChange = (field: keyof typeof newTier, value: string) => {
        const updatedNewTier = { ...newTier, [field]: value };
        const soni = Number(updatedNewTier.soni);
        const narxi = Number(updatedNewTier.narxi);
        const summasi = Number(updatedNewTier.summasi);

        if (field === 'soni' || field === 'narxi') {
            if (!isNaN(soni) && !isNaN(narxi)) {
                updatedNewTier.summasi = Math.round(soni * narxi).toString();
            }
        } else if (field === 'summasi') {
             if (!isNaN(soni) && soni > 0 && !isNaN(summasi)) {
                 updatedNewTier.narxi = parseFloat((summasi / soni).toFixed(2)).toString();
             }
        }
        
        setNewTier(updatedNewTier);
    };

    const addTier = () => {
        const soni = Number(newTier.soni);
        if (!soni || soni <= 0) {
            alert("Soni yoki Yuza musbat son bo'lishi kerak.");
            return;
        }
        if (tiers.some(t => t.soni === soni)) {
            alert("Bu miqdor uchun narx allaqachon mavjud. Boshqa miqdor kiriting.");
            return;
        }
        const newTierToAdd: PriceTier = { 
            id: Date.now().toString(), 
            soni: soni, 
            narxi: Number(newTier.narxi) || 0, 
            summasi: Number(newTier.summasi) || 0,
            izoh: newTier.izoh,
            additionalServices: [],
        };
        handleTiersChangeWithSort([...tiers, newTierToAdd]);
        setNewTier({ soni: '', narxi: '', summasi: '', izoh: '' });
    };

    const removeTier = (tierId: string) => {
        handleTiersChangeWithSort(tiers.filter(tier => tier.id !== tierId));
    };

    const handleBulkAdjust = () => {
        const percentage = parseFloat(adjustment);
        if (isNaN(percentage)) {
            alert("Foizni to'g'ri son ko'rinishida kiriting.");
            return;
        }

        const multiplier = 1 + percentage / 100;

        const updatedTiers = tiers.map(tier => {
            const newNarxi = parseFloat((tier.narxi * multiplier).toFixed(2));
            const servicesCost = tier.additionalServices?.reduce((sum, s) => sum + s.cost, 0) || 0;
            const newSummasi = Math.round(tier.soni * newNarxi) + servicesCost;
            return { ...tier, narxi: newNarxi, summasi: newSummasi };
        });

        handleTiersChangeWithSort(updatedTiers);
        setAdjustment('');
    };
    
    const handleAddService = (tierId: string) => {
        const cost = Number(newServiceCost);
        if (!newServiceName.trim() || isNaN(cost)) return;
        
        const targetTier = tiers.find(t => t.id === tierId);
        if (!targetTier) return;
        
        const newService: AdditionalService = {
            id: Date.now().toString(),
            name: newServiceName.trim(),
            cost: cost
        };
        
        const updatedServices = [...(targetTier.additionalServices || []), newService];
        const servicesCost = updatedServices.reduce((sum, s) => sum + s.cost, 0);

        const updatedTiers = tiers.map(t => t.id === tierId ? {
            ...t,
            additionalServices: updatedServices,
            summasi: Math.round(t.soni * t.narxi) + servicesCost
        } : t);

        onTiersChange(updatedTiers);
        setAddingServiceForTier(null);
        setNewServiceName('');
        setNewServiceCost('');
    };

    const handleRemoveService = (tierId: string, serviceId: string) => {
        const targetTier = tiers.find(t => t.id === tierId);
        if (!targetTier) return;
        
        const updatedServices = targetTier.additionalServices?.filter(s => s.id !== serviceId);
        const servicesCost = updatedServices?.reduce((sum, s) => sum + s.cost, 0) || 0;

        const updatedTiers = tiers.map(t => t.id === tierId ? {
            ...t,
            additionalServices: updatedServices,
            summasi: Math.round(t.soni * t.narxi) + servicesCost
        } : t);

        onTiersChange(updatedTiers);
    }
    
    const { tierValueLabel, pricePerUnitLabel, newTierSoniPlaceholder, newTierNarxiPlaceholder, newTierSummasiPlaceholder } = useMemo(() => {
        if (product.pricingDimension === 'area_sqm') {
            return { tierValueLabel: 'Yuza (m²)', pricePerUnitLabel: 'Narxi (1 m²)', newTierSoniPlaceholder: '1.5', newTierNarxiPlaceholder: '50000', newTierSummasiPlaceholder: '75000', };
        }
        if (product.pricingDimension === 'pageCount') {
            return { tierValueLabel: 'Sahifalar soni', pricePerUnitLabel: 'Narxi (1 sahifa)', newTierSoniPlaceholder: '96', newTierNarxiPlaceholder: '500', newTierSummasiPlaceholder: '48000', };
        }
        return { tierValueLabel: 'Soni (dona)', pricePerUnitLabel: 'Narxi (1 dona)', newTierSoniPlaceholder: '500', newTierNarxiPlaceholder: '800', newTierSummasiPlaceholder: '400000', };
    }, [product.pricingDimension]);

    const headerClasses = "px-2 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider";

    return (
        <Card className="bg-slate-800/60 rounded-xl border border-slate-700/80 overflow-hidden">
            <div className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/30 transition-colors rounded-lg">
                <button onClick={() => setIsOpen(!isOpen)} className="flex-grow flex items-center justify-between text-left" aria-expanded={isOpen}>
                    <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-slate-200 truncate">{variantDescription}</h4>
                        <p className="text-xs text-slate-400">{tiers.length} ta narx pog'onasi</p>
                    </div>
                     <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center flex-shrink-0 ml-2">
                    <button onClick={onCopyVariant} className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors">
                        <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={onDeleteVariant} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="p-2 md:p-4 border-t border-slate-700/50 animate-fade-in-sm space-y-3">
                    <div className="overflow-x-auto">
                         <div className="min-w-[700px] space-y-2">
                            <div className="grid grid-cols-12 gap-2 text-left mb-1">
                                <div className={`col-span-2 ${headerClasses}`}>{tierValueLabel}</div>
                                <div className={`col-span-2 ${headerClasses}`}>{pricePerUnitLabel}</div>
                                <div className={`col-span-2 ${headerClasses}`}>Summasi</div>
                                <div className={`col-span-5 ${headerClasses}`}>Izoh</div>
                                <div className={`col-span-1 ${headerClasses}`}></div>
                            </div>
                            {tiers.length > 0 ? tiers.map(tier => (
                                <div key={tier.id} className="p-1.5 rounded-lg bg-slate-900/40">
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-2"> <Input label="" id={`soni-${tier.id}`} type="number" value={tier.soni} onChange={e => handleTierChange(tier.id, 'soni', e.target.value)} error={tierErrors[tier.id]} /> </div>
                                        <div className="col-span-2"> <Input label="" id={`narxi-${tier.id}`} type="number" value={tier.narxi} onChange={e => handleTierChange(tier.id, 'narxi', e.target.value)} /> </div>
                                        <div className="col-span-2"> <Input label="" id={`summasi-${tier.id}`} type="number" value={tier.summasi} onChange={e => handleTierChange(tier.id, 'summasi', e.target.value)} /> </div>
                                        <div className="col-span-5"> <Input label="" id={`izoh-${tier.id}`} type="text" value={tier.izoh || ''} onChange={e => handleTierChange(tier.id, 'izoh', e.target.value)} /> </div>
                                        <div className="col-span-1 flex justify-center"> <Button variant="secondary" size="small" onClick={() => removeTier(tier.id)} className="p-2 bg-red-900/20 border-red-500/20 text-red-400 hover:bg-red-900/60 hover:border-red-500/50"> <Trash2 className="h-4 w-4" /> </Button> </div>
                                    </div>
                                    <div className="col-span-12 pl-2 mt-2">
                                        {(tier.additionalServices && tier.additionalServices.length > 0) && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {tier.additionalServices.map(service => (
                                                    <div key={service.id} className="flex items-center gap-1 bg-slate-700/50 text-xs px-2 py-1 rounded-full text-slate-300">
                                                        {service.name}: +{service.cost.toLocaleString()}
                                                        <button onClick={() => handleRemoveService(tier.id, service.id)} className="ml-1 text-slate-500 hover:text-red-400"><Trash2 className="h-3 w-3"/></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {addingServiceForTier === tier.id ? (
                                            <div className="flex items-end gap-2 p-2 bg-slate-800 rounded-md">
                                                <Input label="Xizmat nomi" id="new-service-name" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Burchak yumaloqlash"/>
                                                <Input label="Narxi" id="new-service-cost" type="number" value={newServiceCost} onChange={e => setNewServiceCost(e.target.value)} placeholder="10000"/>
                                                <Button onClick={() => handleAddService(tier.id)} size="small" className="p-2 h-[42px]"><Check className="h-4 w-4"/></Button>
                                                <Button onClick={() => setAddingServiceForTier(null)} variant="secondary" size="small" className="p-2 h-[42px]"><Trash2 className="h-4 w-4"/></Button>
                                            </div>
                                        ) : (
                                            <Button onClick={() => setAddingServiceForTier(tier.id)} variant="secondary" size="small" className="border-dashed">
                                                <PlusCircle className="h-3 w-3 mr-1.5"/>Qo'shimcha xizmat
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-center text-slate-500 py-4 col-span-12">Pog'onalar kiritilmagan.</p>}

                             <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg border-t-2 border-dashed border-slate-700/50 mt-2 pt-3">
                                <div className="col-span-2"> <Input label="" id={`new-soni`} type="number" value={newTier.soni} onChange={e => handleNewTierChange('soni', e.target.value)} placeholder={newTierSoniPlaceholder} /> </div>
                                <div className="col-span-2"> <Input label="" id={`new-narxi`} type="number" value={newTier.narxi} onChange={e => handleNewTierChange('narxi', e.target.value)} placeholder={newTierNarxiPlaceholder} /> </div>
                                <div className="col-span-2"> <Input label="" id={`new-summasi`} type="number" value={newTier.summasi} onChange={e => handleNewTierChange('summasi', e.target.value)} placeholder={newTierSummasiPlaceholder} /> </div>
                                <div className="col-span-5"> <Input label="" id={`new-izoh`} type="text" value={newTier.izoh} onChange={e => handleNewTierChange('izoh', e.target.value)} placeholder="Mavsumiy chegirma" /> </div>
                                <div className="col-span-1 flex justify-center"> <Button onClick={addTier} variant="secondary" size="small" className="p-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10"> <PlusCircle className="h-4 w-4" /> </Button> </div>
                            </div>
                        </div>
                    </div>
                     <div className="p-3 bg-slate-900/40 rounded-lg mt-4 border border-purple-500/20">
                        <h5 className="text-md font-semibold text-slate-300 mb-3 flex items-center gap-2"><Sparkles className="text-purple-400 h-5 w-5"/> Ommaviy o'zgartirish</h5>
                         <div className="flex items-end gap-2">
                             <Input 
                                label="Barcha narxlarni o'zgartirish" 
                                id={`adj-${priceListKey}`}
                                type="number"
                                value={adjustment} 
                                onChange={e => setAdjustment(e.target.value)}
                                placeholder="Masalan: 10 yoki -5"
                                unit="%"
                            />
                             <Button onClick={handleBulkAdjust} variant="secondary" className="h-[42px] border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                Qo'llash
                            </Button>
                         </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default PriceVariantAccordion;