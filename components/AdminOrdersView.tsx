// src/components/AdminOrdersView.tsx

import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import Card from './ui/Card';
import { ArrowLeft, Search, Package, Calendar, User, DollarSign, ChevronDown, Square } from 'lucide-react';
import Input from './ui/Input';
import OrderStatusTracker from './OrderStatusTracker';
import { LUCIDE_ICONS } from '../constants';

interface AdminOrdersViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
  onBack: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);
const ALL_STATUSES: OrderStatus[] = ['Qabul qilindi', 'Jarayonda', 'Tayyor', 'Yetkazildi', 'Bekor qilindi'];

const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({ orders, onUpdateStatus, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    
    const sortedOrders = orders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredOrders = sortedOrders.filter(order => 
        order.id.toString().includes(searchQuery) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery)
    );
    
    const StatusSelect: React.FC<{order: Order}> = ({ order }) => {
        return (
            <div className="relative">
                <select 
                    value={order.status} 
                    onChange={e => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="w-full appearance-none rounded-lg border border-slate-600/80 bg-slate-800/50 py-2 pl-3 pr-8 text-sm text-slate-100 shadow-inner-sm transition-colors focus:border-cyan-400 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                    onClick={e => e.stopPropagation()}
                >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700/80 transition-colors flex-shrink-0" aria-label="Orqaga">
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100" style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.4)' }}>
                        Buyurtmalarni Boshqarish
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm sm:text-base">{filteredOrders.length} ta buyurtma topildi.</p>
                </div>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Input 
                        label="Buyurtma ID, mijoz ismi yoki raqami bo'yicha qidirish"
                        id="order-search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Qidiruv..."
                    />
                    <Search className="absolute top-10 right-3 h-5 w-5 text-slate-500" />
                </div>
            </Card>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <Card key={order.id} className="p-4 transition-all cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <p className="font-bold text-slate-200">Buyurtma #{order.id}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5"/> {order.customer.name} ({order.customer.phone})</span>
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> {new Date(order.createdAt).toLocaleDateString('uz-UZ')}</span>
                                    <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5"/> {formatCurrency(order.totalCost)}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-48 flex-shrink-0">
                                <StatusSelect order={order} />
                            </div>
                        </div>

                        {expandedOrderId === order.id && (
                             <div className="animate-fade-in-sm mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Buyurtma tarkibi:</h4>
                                {order.items.map(item => {
                                    const Icon = LUCIDE_ICONS[item.product.icon] || Square;
                                    return (
                                    <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                                        <div className="bg-slate-700/50 p-2 rounded-md"><Icon className="h-5 w-5 text-cyan-400"/></div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-slate-200">{item.product.name}</p>
                                            <p className="text-xs text-slate-400">{item.request.quantity} dona &bull; {item.request.width}x{item.request.height}mm</p>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300">{formatCurrency(item.result.totalCost)}</p>
                                    </div>
                                    );
                                })}
                                <div className="mt-4">
                                     <OrderStatusTracker status={order.status} />
                                </div>
                             </div>
                        )}
                    </Card>
                )) : (
                    <Card className="text-center py-10 text-slate-500">
                        <Package className="mx-auto h-12 w-12 mb-4" />
                        <p className="font-semibold">Buyurtmalar topilmadi</p>
                        <p className="text-sm mt-1">{searchQuery ? "Qidiruv so'rovingizga mos kelmadi." : "Hozircha buyurtmalar yo'q."}</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersView;