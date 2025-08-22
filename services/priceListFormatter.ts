// src/services/priceListFormatter.ts

import { PriceList, PriceTier, Product, Material } from '../types';
import { parsePriceListKey, getAttributeDisplayName, getOptionDisplayName } from './priceListKeyHelper';

export const formatPriceListForPrompt = (priceListVariants: Record<string, PriceTier[]>, products: Product[], materials: Material[]): string => {
    // --- DEBUG UCHUN ---
    console.log("Formatting Price List. Input Variants:", priceListVariants);

    if (!priceListVariants || Object.keys(priceListVariants).length === 0) {
        console.log("Price list is empty. Returning default message.");
        return "Narxlar jadvali kiritilmagan. Foydalanuvchiga hisob-kitob qilish uchun narxlar jadvalini to'ldirish kerakligini ayting.";
    }

    let markdownString = '';
    const sortedKeys = Object.keys(priceListVariants).sort();

    sortedKeys.forEach(key => {
        const tiers = priceListVariants[key];
        if (tiers && tiers.length > 0) {
            const { productId, attributes } = parsePriceListKey(key);
            const product = products.find(p => p.id === productId);

            if (product) {
                let title = product.name;
                const attributeDescriptions = Object.entries(attributes)
                    .map(([attrKey, attrValue]) => {
                        const attrName = getAttributeDisplayName(attrKey);
                        const optName = getOptionDisplayName(attrValue, materials);
                        return `${attrName}: ${optName}`;
                    })
                    .join(', ');

                if (attributeDescriptions) {
                    title += ` (${attributeDescriptions})`;
                }
                
                markdownString += `### ${title}\n`;
                
                const isAreaBased = product.pricingDimension === 'area_sqm';
                const isPageBased = product.pricingDimension === 'pageCount';
                const headerValueLabel = isPageBased ? 'Sahifalar soni' : isAreaBased ? 'Yuza (m²)' : 'Soni';

                markdownString += `| ${headerValueLabel} | Narxi | Summasi | Izoh |\n`;
                markdownString += `|---|---|---|---|\n`;
                tiers
                    .sort((a, b) => a.soni - b.soni)
                    .forEach(tier => {
                        const servicesString = tier.additionalServices?.map(s => `${s.name} (+${s.cost.toLocaleString()})`).join(', ') || '';
                        const finalIzoh = [tier.izoh, servicesString].filter(Boolean).join(', ');
                        markdownString += `| ${tier.soni} | ${tier.narxi} | ${tier.summasi} | ${finalIzoh || ''} |\n`;
                    });
                markdownString += '\n';
            }
        }
    });

    if (!markdownString.trim()) {
        console.log("Formatted string is empty. Returning default message.");
        return "Narxlar jadvali bo'sh. Foydalanuvchiga hisob-kitob qilish uchun narxlar jadvalini to'ldirish kerakligini ayting.";
    }

    // --- DEBUG UCHUN ---
    console.log("Formatted Price List for AI:", markdownString);

    return markdownString;
};