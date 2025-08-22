import React, { useState, useRef, useEffect } from 'react';
import { Product, Material, Template } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Package, ClipboardList, LayoutTemplate, PlusCircle, Trash2, Edit, X, Square } from 'lucide-react';
import { LUCIDE_ICONS } from '../../constants';
import CustomSelect from '../ui/CustomSelect';

const PRODUCT_FIELDS: Array<Product['fields'][0]> = ['dimensions', 'depth', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'pageCount', 'coverMaterial', 'innerMaterial', 'bindingType', 'urgency'];
const PRICING_ATTRIBUTES: Array<Product['pricingAttributes'][0]> = ['material', 'lamination', 'coverMaterial', 'innerMaterial', 'bindingType'];

// Product Modal
const ProductModal: React.FC<{
    product: Product | null;
    onSave: (data: Product) => void;
    onClose: () => void;
    allProducts: Product[];
}> = ({ product, onSave, onClose, allProducts }) => {
    const [data, setData] = useState<Product>(product || { id: '', name: '', description: '', icon: 'Square', fields: [], pricingDimension: undefined, pricingAttributes: [], defaultState: {} });
    const [defaultStateStr, setDefaultStateStr] = useState(JSON.stringify(product?.defaultState || {}, null, 2));
    const [errors, setErrors] = useState<{ id?: string, defaultState?: string }>({});
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleSaveClick = () => {
        const newErrors: typeof errors = {};
        if (!data.id) {
            newErrors.id = "ID bo'sh bo'lishi mumkin emas.";
        } else if (!product && allProducts.some(p => p.id === data.id)) {
            newErrors.id = "Bunday ID bilan mahsulot mavjud.";
        }

        try {
            data.defaultState = JSON.parse(defaultStateStr || '{}');
        } catch (e) {
            newErrors.defaultState = "Noto'g'ri JSON format.";
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        
        onSave(data);
    };

    const handleFieldToggle = (field: Product['fields'][0]) => {
        const newFields = data.fields.includes(field)
            ? data.fields.filter(f => f !== field)
            : [...data.fields, field];
        setData({ ...data, fields: newFields });
    };

    const handleAttributeToggle = (attribute: Product['pricingAttributes'][0]) => {
        const newAttributes = data.pricingAttributes?.includes(attribute)
            ? data.pricingAttributes?.filter(a => a !== attribute)
            : [...(data.pricingAttributes || []), attribute];
        setData({ ...data, pricingAttributes: newAttributes });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"><X/></button>
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold">{product ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <Input label="ID" value={data.id} onChange={e => setData({...data, id: e.target.value})} disabled={!!product} error={errors.id} />
                    <Input label="Nomi" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                    <Input label="Tavsifi" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
                    
                    <CustomSelect
                        id="icon-select"
                        label="Ikona"
                        options={Object.keys(LUCIDE_ICONS).map(name => ({ id: name, name }))}
                        selectedValue={data.icon}
                        onValueChange={value => setData({...data, icon: value})}
                        customInputName="" onCustomInputChange={()=>{}} customInputPlaceholder=""
                    />

                    <div>
                        <h4 className="block text-sm font-medium text-slate-400 mb-2">Forma maydonlari</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PRODUCT_FIELDS.map(field => (
                            <label key={field} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md cursor-pointer">
                                <input type="checkbox" checked={data.fields.includes(field)} onChange={() => handleFieldToggle(field)} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"/>
                                <span className="text-sm">{field}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="block text-sm font-medium text-slate-400 mb-2">Narx hisoblash o'lchami</h4>
                         <select value={data.pricingDimension || ''} onChange={e => setData({...data, pricingDimension: (e.target.value as any) || undefined})} className="w-full appearance-none rounded-lg border border-slate-600/80 bg-slate-800/50 py-2.5 px-4 text-slate-100">
                            <option value="">(Hech qaysi)</option>
                            <option value="quantity">Soni bo'yicha</option>
                            <option value="area_sqm">Yuza (m²) bo'yicha</option>
                        </select>
                    </div>

                    <div>
                        <h4 className="block text-sm font-medium text-slate-400 mb-2">Narxga ta'sir qiluvchi atributlar</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PRICING_ATTRIBUTES.map(attr => (
                            <label key={attr} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md cursor-pointer">
                                <input type="checkbox" checked={data.pricingAttributes?.includes(attr)} onChange={() => handleAttributeToggle(attr)} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"/>
                                <span className="text-sm">{attr}</span>
                            </label>
                        ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="defaultState" className="block text-sm font-medium text-slate-400 mb-2">Standart holat (JSON)</label>
                        <textarea id="defaultState" value={defaultStateStr} onChange={e => setDefaultStateStr(e.target.value)} rows={5} className={`w-full font-mono text-xs rounded-lg border bg-slate-800/50 p-3 text-slate-100 shadow-inner-sm transition-colors focus:bg-slate-800 focus:ring-1 focus:outline-none sm:text-sm ${errors.defaultState ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : 'border-slate-600/80 focus:border-cyan-400 focus:ring-cyan-400'}`}></textarea>
                        {errors.defaultState && <p className="mt-1.5 text-xs text-red-400">{errors.defaultState}</p>}
                    </div>

                </div>
                <div className="p-4 flex justify-end gap-3 pt-2 border-t border-slate-700/50">
                    <Button onClick={onClose} variant="secondary">Bekor qilish</Button>
                    <Button onClick={handleSaveClick} variant="primary">Saqlash</Button>
                </div>
            </Card>
        </div>
    )
}

// Template Modal
const TemplateModal: React.FC<{
    template: Template | null;
    onSave: (data: Template) => void;
    onClose: () => void;
    allTemplates: Template[];
    allProducts: Product[];
}> = ({ template, onSave, onClose, allTemplates, allProducts }) => {
    const [data, setData] = useState<Template>(template || { id: '', name: '', description: '', previewColor: 'bg-slate-200', productId: '', defaultState: {} });
    const [defaultStateStr, setDefaultStateStr] = useState(JSON.stringify(template?.defaultState || {}, null, 2));
    const [errors, setErrors] = useState<{ id?: string, defaultState?: string }>({});
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleSaveClick = () => {
         const newErrors: typeof errors = {};
        if (!data.id) {
            newErrors.id = "ID bo'sh bo'lishi mumkin emas.";
        } else if (!template && allTemplates.some(t => t.id === data.id)) {
            newErrors.id = "Bunday ID bilan shablon mavjud.";
        }

        try {
            data.defaultState = JSON.parse(defaultStateStr || '{}');
        } catch (e) {
            newErrors.defaultState = "Noto'g'ri JSON format.";
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        onSave(data);
    };

    return (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-sm p-4">
            <Card ref={cardRef} className="w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"><X/></button>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{template ? "Shablonni tahrirlash" : "Yangi shablon qo'shish"}</h2>
                    <Input label="ID" value={data.id} onChange={e => setData({...data, id: e.target.value})} disabled={!!template} error={errors.id}/>
                    <Input label="Nomi" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                    <Input label="Tavsifi" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
                    <Input label="Ko'rinish rangi (Tailwind class)" value={data.previewColor} onChange={e => setData({...data, previewColor: e.target.value})} />
                    
                    <CustomSelect
                        id="product-id-select"
                        label="Tegishli mahsulot"
                        options={allProducts.map(p => ({ id: p.id, name: p.name }))}
                        selectedValue={data.productId}
                        onValueChange={value => setData({...data, productId: value})}
                        customInputName="" onCustomInputChange={()=>{}} customInputPlaceholder=""
                    />

                    <div>
                        <label htmlFor="templateDefaultState" className="block text-sm font-medium text-slate-400 mb-2">Standart holat (JSON)</label>
                        <textarea id="templateDefaultState" value={defaultStateStr} onChange={e => setDefaultStateStr(e.target.value)} rows={5} className={`w-full font-mono text-xs rounded-lg border bg-slate-800/50 p-3 text-slate-100 shadow-inner-sm transition-colors focus:bg-slate-800 focus:ring-1 focus:outline-none sm:text-sm ${errors.defaultState ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : 'border-slate-600/80 focus:border-cyan-400 focus:ring-cyan-400'}`}></textarea>
                        {errors.defaultState && <p className="mt-1.5 text-xs text-red-400">{errors.defaultState}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={onClose} variant="secondary">Bekor qilish</Button>
                        <Button onClick={handleSaveClick} variant="primary">Saqlash</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Product Management Component
const ProductManagement: React.FC<{
    products: Product[];
    onUpdateProducts: (products: Product[]) => void;
    onLogAction: (action: string) => void;
}> = ({ products, onUpdateProducts, onLogAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const openModal = (product: Product | null = null) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleSave = (productData: Product) => {
        let updatedProducts;
        if (currentProduct) {
            updatedProducts = products.map(p => p.id === productData.id ? productData : p);
            onLogAction(`Product "${productData.name}" updated.`);
        } else {
            updatedProducts = [...products, productData];
            onLogAction(`New product "${productData.name}" created.`);
        }
        onUpdateProducts(updatedProducts);
        closeModal();
    };

    const handleDelete = (productId: string) => {
        if (window.confirm("Bu mahsulotni o'chirish narxlar jadvalidagi bog'liq yozuvlarga ta'sir qilishi mumkin. Haqiqatan ham o'chirmoqchimisiz?")) {
            const productName = products.find(p => p.id === productId)?.name;
            onUpdateProducts(products.filter(p => p.id !== productId));
            onLogAction(`Product "${productName}" deleted.`);
        }
    };

    return (
        <Card className="p-5">
             {isModalOpen && <ProductModal product={currentProduct} onSave={handleSave} onClose={closeModal} allProducts={products}/>}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-200">Mahsulotlar</h3>
                <Button onClick={() => openModal(null)} size="small" variant="secondary"><PlusCircle className="h-4 w-4 mr-2"/>Yangi qo'shish</Button>
            </div>
            <div className="space-y-3">
                {products.map(product => {
                    const Icon = LUCIDE_ICONS[product.icon] || Square;
                    return (
                    <div key={product.id} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Icon className="h-6 w-6 text-cyan-400"/>
                            <div>
                                <p className="font-semibold text-slate-100">{product.name}</p>
                                <p className="text-xs text-slate-400">{product.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => openModal(product)} size="small" variant="secondary"><Edit className="h-4 w-4"/></Button>
                            <Button onClick={() => handleDelete(product.id)} size="small" variant="secondary" className="hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                )})}
            </div>
        </Card>
    );
};

// Material Management Component (Renamed from AttributeManagement)
const MaterialManagement: React.FC<{
    materials: Material[];
    onUpdateMaterials: (materials: Material[]) => void;
    onLogAction: (action: string) => void;
}> = ({ materials, onUpdateMaterials, onLogAction }) => {
    const [newMaterialName, setNewMaterialName] = useState('');

    const handleAddMaterial = () => {
        if (!newMaterialName.trim()) return;
        const newMaterial: Material = {
            id: newMaterialName.trim().toLowerCase().replace(/\s+/g, '-'),
            name: newMaterialName.trim()
        };
        if (materials.some(m => m.id === newMaterial.id)) {
            alert("Bunday material ID si allaqachon mavjud.");
            return;
        }
        onUpdateMaterials([...materials, newMaterial]);
        onLogAction(`New material "${newMaterial.name}" added.`);
        setNewMaterialName('');
    };

    const handleDeleteMaterial = (id: string) => {
         if (window.confirm("Bu materialni o'chirish narxlar jadvalidagi bog'liq yozuvlarga ta'sir qilishi mumkin. Haqiqatan ham o'chirmoqchimisiz?")) {
            const materialName = materials.find(m => m.id === id)?.name;
            onUpdateMaterials(materials.filter(m => m.id !== id));
            onLogAction(`Material "${materialName}" deleted.`);
        }
    };

    return (
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Atributlar (Materiallar)</h3>
            <p className="text-sm text-slate-400 mb-4">Hisob-kitobda ishlatiladigan materiallar ro'yxati.</p>
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto pr-2">
                {materials.map(material => (
                    <div key={material.id} className="p-2 bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <p className="text-slate-200">{material.name}</p>
                        <Button onClick={() => handleDeleteMaterial(material.id)} size="small" variant="secondary" className="hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 items-end">
                <Input label="Yangi material nomi" id="new-material" placeholder="Masalan: O'zi yopishqoq qog'oz" value={newMaterialName} onChange={e => setNewMaterialName(e.target.value)} />
                <Button onClick={handleAddMaterial} variant="primary" className="h-[46px]">Qo'shish</Button>
            </div>
        </Card>
    );
};

// Template Management Component
const TemplateManagement: React.FC<{
    templates: Template[];
    products: Product[];
    onUpdateTemplates: (templates: Template[]) => void;
    onLogAction: (action: string) => void;
}> = ({ templates, products, onUpdateTemplates, onLogAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

    const openModal = (template: Template | null = null) => {
        setCurrentTemplate(template);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTemplate(null);
    };

     const handleSave = (templateData: Template) => {
        let updatedTemplates;
        if (currentTemplate) {
            updatedTemplates = templates.map(t => t.id === templateData.id ? templateData : t);
            onLogAction(`Template "${templateData.name}" updated.`);
        } else {
            updatedTemplates = [...templates, templateData];
            onLogAction(`New template "${templateData.name}" created.`);
        }
        onUpdateTemplates(updatedTemplates);
        closeModal();
    };

    const handleDelete = (templateId: string) => {
        if (window.confirm("Haqiqatan ham bu shablonni o'chirmoqchimisiz?")) {
            const templateName = templates.find(t => t.id === templateId)?.name;
            onUpdateTemplates(templates.filter(t => t.id !== templateId));
            onLogAction(`Template "${templateName}" deleted.`);
        }
    };


    return (
        <Card className="p-5">
            {isModalOpen && <TemplateModal template={currentTemplate} onSave={handleSave} onClose={closeModal} allTemplates={templates} allProducts={products}/>}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-200">Tayyor Shablonlar</h3>
                <Button onClick={() => openModal(null)} size="small" variant="secondary"><PlusCircle className="h-4 w-4 mr-2"/>Yangi qo'shish</Button>
            </div>
            <p className="text-sm text-slate-400 mb-4">Bosh sahifada chiqadigan tayyor shablonlar.</p>
            <div className="space-y-3">
                {templates.map(template => (
                    <div key={template.id} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-100">{template.name}</p>
                            <p className="text-xs text-slate-400">{template.description}</p>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => openModal(template)} size="small" variant="secondary"><Edit className="h-4 w-4"/></Button>
                            <Button onClick={() => handleDelete(template.id)} size="small" variant="secondary" className="hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const ContentManagement: React.FC<{
    products: Product[];
    materials: Material[];
    templates: Template[];
    onUpdateProducts: (p: Product[]) => void;
    onUpdateMaterials: (m: Material[]) => void;
    onUpdateTemplates: (t: Template[]) => void;
    onLogAction: (action: string) => void;
}> = (props) => {
    const [activeTab, setActiveTab] = useState<'products' | 'materials' | 'templates'>('products');

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Kontent Boshqaruvi</h1>
                <p className="text-slate-400 mt-1">Platformadagi mahsulotlar, atributlar va shablonlarni tahrirlash.</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-1 flex gap-1">
                <button onClick={() => setActiveTab('products')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'products' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <Package className="inline h-4 w-4 mr-2"/>Mahsulotlar
                </button>
                <button onClick={() => setActiveTab('materials')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'materials' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <ClipboardList className="inline h-4 w-4 mr-2"/>Materiallar
                </button>
                 <button onClick={() => setActiveTab('templates')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'templates' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <LayoutTemplate className="inline h-4 w-4 mr-2"/>Shablonlar
                </button>
            </div>

            {activeTab === 'products' && <ProductManagement products={props.products} onUpdateProducts={props.onUpdateProducts} onLogAction={props.onLogAction} />}
            {activeTab === 'materials' && <MaterialManagement materials={props.materials} onUpdateMaterials={props.onUpdateMaterials} onLogAction={props.onLogAction} />}
            {activeTab === 'templates' && <TemplateManagement templates={props.templates} products={props.products} onUpdateTemplates={props.onUpdateTemplates} onLogAction={props.onLogAction} />}

        </div>
    );
};

export default ContentManagement;