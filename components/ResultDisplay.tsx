import React, { useState, useEffect } from 'react';
import { CalculationResult, FormState, Product, Material } from '../types';
import { COLORS, LAMINATIONS, BINDING_TYPES, URGENCY_OPTIONS, LUCIDE_ICONS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import NestingVisualization from './NestingVisualization';
import { FileText, Package, Layers, Ruler, Boxes, Palette, CheckCircle, Lightbulb, ShieldCheck, ShieldAlert, ShieldX, BrainCircuit, BookOpen, Clock, ChevronDown, Share2, Pencil, Square } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
};

const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1200;
        const startValue = 0;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            const nextValue = Math.floor(easeOutProgress * (value - startValue) + startValue);
            setCurrentValue(nextValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCurrentValue(value);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    return <span>{formatCurrency(currentValue)}</span>;
};

const AccordionItem: React.FC<{
    icon: React.ElementType,
    title: string,
    children: React.ReactNode,
    borderColor: string,
    iconColor: string
}> = ({ icon: Icon, title, children, borderColor, iconColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className={`overflow-hidden border ${borderColor} bg-slate-900/30`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${iconColor}`} style={{filter: "drop-shadow(0 0 5px currentColor)"}}/>
                    <h3 className="font-bold text-lg text-slate-200">{title}</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 animate-fade-in-sm">
                    <div className="border-t border-slate-700/50 pt-3 text-sm text-slate-300 whitespace-pre-wrap">
                        {children}
                    </div>
                </div>
            )}
        </Card>
    )
}

const SpecItem: React.FC<{ icon: React.ElementType, label: string, value: string | number | undefined }> = ({ icon: Icon, label, value }) => {
    if (value === undefined || value === null || value === 'Laminatsiyasiz' || value === 'none' || value === '') return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="h-5 w-5 text-cyan-400/80 flex-shrink-0 mt-0.5" />
            <div>
                <span className="text-sm text-slate-400">{label}</span>
                <p className="text-sm font-semibold text-slate-100">{value}</p>
            </div>
        </div>
    );
}

interface ResultDisplayProps {
  result: CalculationResult;
  request: FormState;
  product: Product;
  onEdit?: () => void;
  materials: Material[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, request, product, onEdit, materials }) => {
  const [copied, setCopied] = useState(false);
  const showOptimization = result.itemsPerSheet > 0 && result.totalSheets > 0;
  
  const { totalCost, materialCost, printingCost, postPressCost } = result;
  const breakdownItems = [
      { label: "Chop etish", value: printingCost, color: "bg-cyan-500" },
      { label: "Material", value: materialCost, color: "bg-teal-500" },
      { label: "Qo'shimcha", value: postPressCost, color: "bg-purple-500" }
  ].filter(item => item.value > 0);

  const handleShare = () => {
    const specs = [
        `Mahsulot: ${product.name}`,
        `Soni: ${request.quantity} dona`,
        `O'lcham: ${request.width}x${request.height} mm`,
        request.material ? `Material: ${materials.find(m => m.id === request.material)?.name || request.material}` : null,
        request.color ? `Rang: ${COLORS.find(c => c.id === request.color)?.name || request.color}` : null,
        request.lamination !== 'none' ? `Laminatsiya: ${LAMINATIONS.find(l => l.id === request.lamination)?.name || request.lamination}`: null,
        `Yakuniy narx: ${formatCurrency(result.totalCost)}`
    ].filter(Boolean).join('\n');
    
    const shareText = `--- AI-Print Hisob-kitobi ---\n${specs}\n\nUshbu hisob-kitob AI-Print Calculator orqali amalga oshirildi.`;

    navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    });
  };
  
  const ProductIcon = LUCIDE_ICONS[product.icon] || Square;

  return (
    <div className="mt-6 space-y-5 animate-fade-in" aria-live="polite">
        
        <div className="[animation-delay:100ms] animate-fade-in-up relative">
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/50 p-6 text-center overflow-hidden">
                 <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-center gap-2">
                    <ProductIcon className="h-5 w-5 text-cyan-400" />
                    <p className="font-semibold text-slate-200">{product.name} uchun narx</p>
                </div>
                <p className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-sky-400 tracking-tight my-3" style={{ textShadow: '0 0 25px rgba(56, 189, 248, 0.4)'}}>
                    <AnimatedNumber value={result.totalCost} />
                </p>
                <p className="text-sm text-slate-400">{request.quantity} dona uchun yakuniy narx</p>
            </Card>
            <button onClick={handleShare} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-700/50" aria-label="Ulashish">
                {copied ? <CheckCircle className="h-5 w-5 text-green-400"/> : <Share2 className="h-5 w-5" />}
            </button>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in [animation-delay:150ms]">
            {onEdit && (
                <Button onClick={onEdit} variant="secondary" className="w-full">
                    <Pencil className="h-4 w-4 mr-2" />
                    Parametrlarni o'zgartirish
                </Button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="[animation-delay:200ms] animate-fade-in-up">
                <Card className="p-5 h-full">
                    <h3 className="font-bold text-lg text-slate-200 mb-4">Narx tarkibi</h3>
                    {breakdownItems.length > 0 ? (
                        <div className="space-y-4">
                            <div className="w-full flex rounded-full h-3 bg-slate-700/50 overflow-hidden">
                                {breakdownItems.map(item => (
                                    <div key={item.label} className={`${item.color} transition-all duration-1000 ease-out`} style={{width: `${(item.value / totalCost) * 100}%`, transformOrigin: 'left', animation: 'scale-in 1s ease-out forwards'}}></div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                {breakdownItems.map(item => (
                                    <div key={item.label} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`}></span>
                                            <span className="text-slate-300">{item.label}</span>
                                        </div>
                                        <span className="font-medium text-slate-200">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center py-4">
                            <CheckCircle className="h-10 w-10 text-green-400 mb-2" />
                            <p className="text-slate-300 text-sm">Yakuniy narx hisoblandi</p>
                            <p className="text-slate-400 text-xs">Barcha xarajatlar umumiy narxga kiritilgan.</p>
                        </div>
                    )}
                </Card>
            </div>
            <div className="[animation-delay:300ms] animate-fade-in-up">
                <Card className="p-5 h-full">
                    <h3 className="font-bold text-lg text-slate-200 mb-2">Texnik tavsiflar</h3>
                    <div className="divide-y divide-slate-700/50">
                        <SpecItem icon={Ruler} label="O'lcham" value={request.width && request.height ? (request.depth ? `${request.width}x${request.height}x${request.depth} mm` : `${request.width}x${request.height} mm`) : 'N/A'} />
                        <SpecItem icon={Boxes} label="Soni" value={`${request.quantity} dona`} />
                        <SpecItem icon={Clock} label="Bajarilish muddati" value={URGENCY_OPTIONS.find(o => o.id === request.urgency)?.name || request.urgency} />
                        <SpecItem icon={FileText} label="Sahifalar soni" value={request.pageCount ? `${request.pageCount} bet` : undefined} />
                        <SpecItem icon={Layers} label="Material" value={materials.find(m => m.id === request.material)?.name || request.material} />
                        <SpecItem icon={Layers} label="Muqova materiali" value={materials.find(m => m.id === request.coverMaterial)?.name || request.coverMaterial} />
                        <SpecItem icon={BookOpen} label="Muqovalash" value={BINDING_TYPES.find(b => b.id === request.bindingType)?.name || request.bindingType} />
                        <SpecItem icon={Palette} label="Rang" value={COLORS.find(c => c.id === request.color)?.name || request.color} />
                    </div>
                </Card>
            </div>
        </div>

        <div className="space-y-4 [animation-delay:400ms] animate-fade-in-up">
             {result.calculationExplanation && (
                 <AccordionItem icon={BrainCircuit} title="Hisoblash formulasi" borderColor="border-purple-500/30" iconColor="text-purple-400">
                    {result.calculationExplanation}
                 </AccordionItem>
             )}
              {result.advice && (
                 <AccordionItem icon={Lightbulb} title="Aqlli Maslahat" borderColor="border-yellow-500/30" iconColor="text-yellow-300">
                    {result.advice}
                 </AccordionItem>
             )}
             {result.preflightCheck && (
                  <AccordionItem icon={result.preflightCheck.status === 'OK' ? ShieldCheck : result.preflightCheck.status === 'WARNING' ? ShieldAlert : ShieldX} title="Fayl Tekshiruvi Natijasi" borderColor={result.preflightCheck.status === 'OK' ? 'border-green-500/30' : result.preflightCheck.status === 'WARNING' ? 'border-yellow-500/30' : 'border-red-500/30'} iconColor={result.preflightCheck.status === 'OK' ? 'text-green-400' : result.preflightCheck.status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'}>
                    {result.preflightCheck.message}
                 </AccordionItem>
             )}
        </div>

        {showOptimization && (
          <div className="[animation-delay:500ms] animate-fade-in-up">
            <Card>
                <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-200 mb-3">Optimallashtirish</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="divide-y divide-slate-700/50">
                                <SpecItem icon={Layers} label="Bitta listga sig'imi" value={`${result.itemsPerSheet} dona`} />
                                <SpecItem icon={FileText} label="Jami listlar soni" value={`${result.totalSheets} dona`} />
                                {result.unfoldedDimensions && (
                                    <SpecItem icon={Package} label="Quti yoyilmasi (en x bo'y)" value={`${result.unfoldedDimensions.width.toFixed(0)} x ${result.unfoldedDimensions.height.toFixed(0)} mm`} />
                                )}
                            </div>
                        </div>
                        {result.nestingLayout && result.nestingLayout.length > 0 && (
                             <div>
                                 <h4 className="text-sm font-semibold text-slate-300 mb-2 text-center">Listdagi joylashuv</h4>
                                 <NestingVisualization layout={result.nestingLayout} />
                             </div>
                        )}
                    </div>
                </div>
            </Card>
          </div>
        )}
        <style>{`
            @keyframes scale-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
            @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
        `}</style>
    </div>
  );
};

export default ResultDisplay;