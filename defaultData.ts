
import { Product, Material, Template, TariffPlan } from './types';

export const PRODUCTS: Product[] = [
  { id: 'vizitka', name: 'Vizitka', description: 'Standart o\'lchamdagi vizitkalar', icon: 'CreditCard', fields: ['dimensions', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingAttributes: ['material', 'lamination'], defaultState: { width: 90, height: 50, material: 'coated-300', quantity: 1000, color: '4+4', lamination: 'matte', urgency: 'standard' } },
  { id: 'flayer', name: 'Flayer', description: 'Reklama varaqalari', icon: 'Newspaper', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 99, height: 210, material: 'coated-150', quantity: 1000, color: '4+4', urgency: 'standard' } },
  { id: 'doorhanger', name: 'Doorhanger', description: 'Eshik uchun reklama ilgichlari', icon: 'DoorOpen', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 100, height: 280, material: 'coated-300', quantity: 500, color: '4+0', urgency: 'standard' } },
  { id: 'kubarik', name: 'Kubarik', description: 'Yozuv uchun kubik bloklar', icon: 'Blocks', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 90, height: 90, material: 'offset-80', quantity: 500, color: '1+0', urgency: 'standard' } },
  { id: 'buklet', name: 'Buklet', description: 'Bir necha buklangan mahsulot', icon: 'BookOpen', fields: ['dimensions', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingAttributes: ['material', 'lamination'], defaultState: { width: 210, height: 297, material: 'coated-150', quantity: 500, color: '4+4', lamination: 'glossy', urgency: 'standard' } },
  { id: 'liflet', name: 'Liflet', description: 'Buklangan reklama varaqalari', icon: 'FileText', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 99, height: 210, material: 'coated-150', quantity: 1000, color: '4+4', urgency: 'standard' } },
  { id: 'katalog', name: 'Katalog', description: 'Ko\'p sahifali mahsulot katalogi', icon: 'Presentation', fields: ['dimensions', 'pageCount', 'coverMaterial', 'innerMaterial', 'bindingType', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingAttributes: ['coverMaterial', 'innerMaterial', 'bindingType', 'lamination'], defaultState: { width: 210, height: 297, pageCount: 16, coverMaterial: 'coated-300', innerMaterial: 'coated-150', bindingType: 'saddle-stitch', quantity: 100, color: '4+4', lamination: 'matte', urgency: 'standard' } },
  { id: 'ruchka', name: 'Ruchka', description: 'Logotipli firma ruchkalari', icon: 'PenSquare', fields: ['quantity', 'color', 'file-upload', 'urgency'], defaultState: { quantity: 1000, color: '1+0', urgency: 'standard' } },
  { id: 'blaknotlar', name: 'Blaknotlar', description: 'Firma uchun bloknotlar', icon: 'BookMarked', fields: ['dimensions', 'material', 'bindingType', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material', 'bindingType'], defaultState: { width: 148, height: 210, material: 'offset-80', bindingType: 'wire-o', quantity: 200, color: '1+0', urgency: 'standard' } },
  { id: 'kalendar', name: 'Kalendar', description: 'Cho\'ntak, stol, devor kalendarlari', icon: 'CalendarDays', fields: ['dimensions', 'material', 'bindingType', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material', 'bindingType'], defaultState: { width: 90, height: 50, material: 'coated-300', quantity: 1000, color: '4+4', urgency: 'standard' } },
  { id: 'paket_gift', name: 'Paket Gift', description: 'Qog\'ozli sovg\'a paketlari', icon: 'Gift', fields: ['dimensions', 'depth', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 250, height: 350, depth: 100, material: 'coated-150', quantity: 500, color: '4+0', urgency: 'standard' } },
  { id: 'paket_kraft', name: 'Paket Kraft', description: 'Kraft qog\'ozdan paketlar', icon: 'ShoppingBag', fields: ['dimensions', 'depth', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingAttributes: ['material'], defaultState: { width: 250, height: 350, depth: 100, material: 'coated-150', quantity: 500, color: '1+0', urgency: 'standard' } },
  { id: 'shtamp', name: 'Shtamp', description: 'Pechat va shtamplar yasash', icon: 'Stamp', fields: ['dimensions', 'quantity', 'file-upload', 'urgency'], defaultState: { width: 40, height: 40, quantity: 1, urgency: 'standard' } },
  { id: 'papka', name: 'Papka', description: 'Hujjatlar uchun firma papkalari', icon: 'Folder', fields: ['dimensions', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingAttributes: ['material', 'lamination'], defaultState: { width: 220, height: 310, material: 'cardboard-270', quantity: 100, color: '4+0', lamination: 'matte', urgency: 'standard' } },
  { id: 'banner', name: 'Banner', description: 'Katta formatli reklama bannerlari', icon: 'Square', fields: ['dimensions', 'material', 'quantity', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', pricingAttributes: ['material'], defaultState: { width: 2000, height: 1000, material: 'banner-flex', quantity: 1, urgency: 'standard' } },
  { id: 'tablichka', name: 'Tablichka', description: 'Ofis va eshik uchun belgilar', icon: 'Clipboard', fields: ['dimensions', 'material', 'quantity', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', pricingAttributes: ['material'], defaultState: { width: 300, height: 200, material: 'pvc-3mm', quantity: 1, urgency: 'standard' } },
  { id: 'glyans', name: 'Glyans chop etish', description: 'Yaltiroq sirtli mahsulotlar', icon: 'Sun', fields: ['dimensions', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', pricingAttributes: ['material'], defaultState: { width: 1000, height: 1000, material: 'coated-150', quantity: 1, color: '4+0', lamination: 'glossy', urgency: 'standard' } },
  { id: 'ofset_chop', name: 'Ofset chop etish', description: 'Katta tirajli ofset bosma', icon: 'Printer', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', pricingAttributes: ['material'], defaultState: { width: 640, height: 900, material: 'offset-80', quantity: 1000, color: '4+0', urgency: 'standard' } },
  { id: 'samokleyka', name: 'Samokleyka', description: 'O\'zi yopishqoq stikerlar', icon: 'Sticker', fields: ['dimensions', 'material', 'quantity', 'color', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', pricingAttributes: ['material'], defaultState: { width: 1000, height: 1000, material: 'sticker-paper', quantity: 1, color: '4+0', urgency: 'standard' } },
  { id: 'dtf', name: 'DTF chop etish', description: 'Matoga bosish uchun (futbolka, kepka)', icon: 'Shirt', fields: ['dimensions', 'quantity', 'color', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', defaultState: { width: 500, height: 500, quantity: 10, color: '4+0', urgency: 'standard' } },
  { id: 'uv_dtf', name: 'UV DTF chop etish', description: 'Har qanday sirtga UV stikerlar', icon: 'Layers', fields: ['dimensions', 'quantity', 'color', 'file-upload', 'urgency'], pricingDimension: 'area_sqm', defaultState: { width: 500, height: 500, quantity: 10, color: '4+0', urgency: 'standard' } },
  { id: 'kitob', name: 'Kitob chop etish', description: 'Kitob va jurnallar nashri', icon: 'BookCopy', fields: ['dimensions', 'pageCount', 'coverMaterial', 'innerMaterial', 'bindingType', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], pricingDimension: 'pageCount', pricingAttributes: ['coverMaterial', 'innerMaterial', 'bindingType', 'lamination'], defaultState: { width: 148, height: 210, pageCount: 96, coverMaterial: 'cardboard-270', innerMaterial: 'offset-80', bindingType: 'perfect-binding', quantity: 500, color: '1+1', lamination: 'matte', urgency: 'standard' } },
  { id: 'boshqalar', name: 'Boshqa xizmatlar', description: 'Maxsus buyurtma va hisob-kitob', icon: 'FileQuestion', fields: ['dimensions', 'depth', 'material', 'quantity', 'color', 'lamination', 'file-upload', 'urgency'], defaultState: { width: 100, height: 100, quantity: 100, material: 'coated-150', color: '4+0', lamination: 'none', urgency: 'standard' } }
];

export const MATERIALS: Material[] = [
    { id: 'coated-150', name: 'Melovanniy qog\'oz 150gr' },
    { id: 'coated-300', name: 'Melovanniy qog\'oz 300gr' },
    { id: 'offset-80', name: 'Ofset qog\'oz 80gr' },
    { id: 'offset-120', name: 'Ofset qog\'oz 120gr' },
    { id: 'designer-250', name: 'Dizaynerlik qog\'oz 250gr' },
    { id: 'cardboard-270', name: 'Karton 270gr (quti uchun)'},
    { id: 'sticker-paper', name: 'O\'zi yopishqoq qog\'oz' },
    { id: 'sticker-film', name: 'O\'zi yopishqoq plyonka (vinil)' },
    { id: 'banner-flex', name: 'Banner matosi (flex)'},
    { id: 'pvc-3mm', name: 'PVX plastik 3mm'},
    { id: 'pvc-5mm', name: 'PVX plastik 5mm'},
    { id: 'other', name: 'Boshqa (o\'zingiz kiriting)'}
];

export const TEMPLATES: Template[] = [
  {
    id: 'classic-business-card',
    name: 'Klassik Vizitka',
    description: "Tezkor va standart yechim. 300gr qog'oz, ikki tomonlama rangli.",
    previewColor: 'bg-slate-200',
    productId: 'vizitka',
    defaultState: {
        quantity: 100,
        material: 'coated-300',
        color: '4+4',
        lamination: 'none',
        width: 90,
        height: 50,
        urgency: 'standard',
    }
  },
  {
    id: 'premium-laminated-card',
    name: 'Premium Laminatli Vizitka',
    description: "Matoviy laminatsiya bilan qoplangan, mustahkam va ko'rkam vizitkalar.",
    previewColor: 'bg-slate-700',
    productId: 'vizitka',
    defaultState: {
        quantity: 100,
        material: 'coated-300',
        color: '4+4',
        lamination: 'matte',
        width: 90,
        height: 50,
        urgency: 'standard',
    }
  },
  {
    id: 'euro-flayer',
    name: 'Yevro Flayer',
    description: "Reklama va e'lonlar uchun mashhur Yevro formatdagi flayerlar.",
    previewColor: 'bg-sky-200',
    productId: 'flayer',
    defaultState: {
        quantity: 500,
        material: 'coated-150',
        color: '4+4',
        width: 99,
        height: 210,
        urgency: 'standard',
    }
  },
  {
    id: 'a5-booklet',
    name: 'A5 Buklet',
    description: "Kompaniya va mahsulotlar taqdimoti uchun ixcham bukletlar.",
    previewColor: 'bg-rose-200',
    productId: 'buklet',
    defaultState: {
        quantity: 100,
        material: 'coated-150',
        color: '4+4',
        lamination: 'glossy',
        width: 148,
        height: 210,
        urgency: 'standard',
    }
  },
];

export const TARIFF_PLANS: TariffPlan[] = [
    {
        id: 'basic',
        name: 'Asosiy',
        price: 500000,
        period: 'monthly',
        features: ['10 tagacha xodim', 'Asosiy hisob-kitoblar', 'Buyurtma tarixi', 'Email qo\'llab-quvvatlash'],
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 1500000,
        period: 'monthly',
        features: ['Cheksiz xodimlar', 'Barcha hisob-kitoblar', 'Narxlar jadvalini sozlash', 'Telefon orqali qo\'llab-quvvatlash'],
    },
    {
        id: 'enterprise',
        name: 'Korporativ',
        price: 5000000,
        period: 'monthly',
        features: ['Pro-dagi barcha imkoniyatlar', 'Shaxsiy menejer', 'API integratsiyasi', 'White-labeling'],
    }
];