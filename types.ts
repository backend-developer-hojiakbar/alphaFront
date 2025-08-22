// src/types.ts

export type Urgency = 'standard' | 'express' | 'super_express';

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Array<'dimensions' | 'depth' | 'material' | 'quantity' | 'color' | 'lamination' | 'file-upload' | 'pageCount' | 'coverMaterial' | 'innerMaterial' | 'bindingType' | 'urgency'>;
  pricingDimension?: 'quantity' | 'area_sqm' | 'pageCount';
  pricingAttributes?: Array<'material' | 'lamination' | 'coverMaterial' | 'innerMaterial' | 'bindingType'>;
  defaultState?: Partial<FormState>;
}

export interface Material {
  id: string;
  name:string;
}

export interface FileInfo {
  data: string;
  mimeType: string;
  name: string;
}

export interface FormState {
  productType: string;
  width: number;
  height: number;
  depth?: number;
  material: string;
  customMaterial?: string;
  quantity: number;
  color: string;
  customColor?: string;
  lamination: string;
  customLamination?: string;
  urgency: Urgency;
  file?: FileInfo;
  pageCount?: number;
  coverMaterial?: string;
  customCoverMaterial?: string;
  innerMaterial?: string;
  customInnerMaterial?: string;
  bindingType?: string;
  customBindingType?: string;
}

export interface CalculationRequest extends FormState {}

export interface CalculationResult {
  itemsPerSheet: number;
  totalSheets: number;
  materialCost: number;
  printingCost: number;
  postPressCost: number;
  totalCost: number;
  unfoldedDimensions: {
    width: number;
    height: number;
  } | null;
  nestingLayout: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  advice?: string;
  preflightCheck?: {
    status: 'OK' | 'WARNING' | 'ERROR';
    message: string;
  };
  calculationExplanation: string;
  requestData: FormState;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    result?: CalculationResult;
    isLoading?: boolean;
    suggestedActions?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  productId: string;
  defaultState: Partial<FormState>;
}

export interface User {
  phone: string;
  name: string;
  status: 'active' | 'blocked';
}

export interface CartItem {
  id: string;
  product: Product;
  request: FormState;
  result: CalculationResult;
}

export type OrderStatus = 'Qabul qilindi' | 'Jarayonda' | 'Tayyor' | 'Yetkazildi' | 'Bekor qilindi';

export interface Order {
  id: number;
  user: string;
  items: CartItem[];
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  promoCode?: string;
  discount: number;
  additionalServices: { name: string; cost: number }[];
  totalCost: number;
  customer: {
      name: string;
      phone: string;
  };
  delivery: {
      method: 'pickup' | 'delivery';
      address?: string;
  };
  paymentMethod: string;
}

export interface AdditionalService {
    id: string;
    name: string;
    cost: number;
}

export interface PriceTier {
  id: string;
  soni: number;
  narxi: number;
  summasi: number;
  additionalServices?: AdditionalService[];
  izoh?: string;
}

export interface PriceList {
  variants: Record<string, PriceTier[]>;
  lastUpdated?: string;
}

export interface TariffPlan {
    id: string;
    name: string;
    price: number;
    period: 'monthly' | 'yearly';
    features: string[];
}

export interface Subscription {
    id: number;
    user: User;
    plan: TariffPlan;
    status: 'active' | 'cancelled' | 'expired';
    expiresAt: string;
}

export interface PromoCode {
    id: string;
    type: 'percentage' | 'fixed';
    value: number;
    uses: number;
    isActive: boolean;
}

export interface AuditLogEntry {
    id: number;
    timestamp: string;
    user: User | null;
    action: string;
}