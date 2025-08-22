// src/components/OrderStatusTracker.tsx

import React from 'react';
import { OrderStatus } from '../types';
import { CheckCircle, Clock, Package, Truck, XCircle, Check } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const statusSteps: OrderStatus[] = ['Qabul qilindi', 'Jarayonda', 'Tayyor', 'Yetkazildi'];

const statusMap: { [key in OrderStatus]: { text: string, icon: React.ElementType, color: string } } = {
    'Qabul qilindi': { text: 'Qabul qilindi', icon: CheckCircle, color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' },
    'Jarayonda': { text: 'Jarayonda', icon: Clock, color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10' },
    'Tayyor': { text: 'Tayyor', icon: Package, color: 'text-green-400 border-green-500/50 bg-green-500/10' },
    'Yetkazildi': { text: 'Yetkazildi', icon: Truck, color: 'text-purple-400 border-purple-500/50 bg-purple-500/10' },
    'Bekor qilindi': { text: 'Bekor qilindi', icon: XCircle, color: 'text-red-400 border-red-500/50 bg-red-500/10' },
};

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
    if (status === 'Bekor qilindi') {
        const { text, icon: Icon, color } = statusMap[status];
        const statusClass = color.split(' ')[0]
        return (
            <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800/60 ${statusClass}`}>
                <Icon className="h-4 w-4" />
                <span>{text}</span>
            </div>
        );
    }
    
    const currentStepIndex = statusSteps.indexOf(status);

    return (
        <div className="w-full pt-2">
            <div className="flex items-center">
                {statusSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const stepDetails = statusMap[step];

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-cyan-500 border-cyan-500' : isCurrent ? `border-cyan-500 ${stepDetails.color.split(' ')[2]}` : 'bg-slate-700 border-slate-600'}`}>
                                    {isCompleted ? <Check className="h-5 w-5 text-white" /> : <stepDetails.icon className={`h-5 w-5 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />}
                                </div>
                                <p className={`mt-2 text-xs text-center break-words w-20 ${isCurrent || isCompleted ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>{stepDetails.text}</p>
                            </div>
                            {index < statusSteps.length - 1 && (
                                <div className={`flex-grow h-1 transition-all duration-500 rounded-full mx-1 sm:mx-2 -mt-10 ${isCompleted ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;
