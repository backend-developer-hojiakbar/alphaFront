// src/services/priceListKeyHelper.ts

import { LAMINATIONS, BINDING_TYPES } from '../constants';
import { Material } from '../types';

export const generatePriceListKey = (productId: string, attributes: Record<string, string>): string => {
    if (!attributes || Object.keys(attributes).length === 0) {
        return productId;
    }
    const sortedAttributeKeys = Object.keys(attributes).sort();
    const attributeString = sortedAttributeKeys
        .filter(key => attributes[key] && attributes[key] !== 'other')
        .map(key => `${key}=${attributes[key]}`)
        .join(':');
    
    return attributeString ? `${productId}:${attributeString}` : productId;
};

export const parsePriceListKey = (key: string): { productId: string, attributes: Record<string, string> } => {
    const parts = key.split(':');
    const productId = parts[0];
    const attributes: Record<string, string> = {};

    if (parts.length > 1) {
        parts.slice(1).forEach(part => {
            const [attrKey, attrValue] = part.split('=');
            if (attrKey && attrValue) {
                attributes[attrKey] = attrValue;
            }
        });
    }

    return { productId, attributes };
};

const STATIC_OPTIONS = [
    ...LAMINATIONS,
    ...BINDING_TYPES,
];

const STATIC_OPTIONS_MAP = new Map(STATIC_OPTIONS.map(opt => [opt.id, opt.name]));

export const getAttributeDisplayName = (attributeKey: string): string => {
    const names: Record<string, string> = {
        material: 'Material',
        lamination: 'Laminatsiya',
        coverMaterial: 'Muqova Materiali',
        innerMaterial: 'Ichki Sahifa Materiali',
        bindingType: 'Muqova Turi'
    };
    return names[attributeKey] || attributeKey;
}

export const getOptionDisplayName = (optionId: string, allMaterials: Material[]): string => {
    const material = allMaterials.find(m => m.id === optionId);
    if(material) return material.name;
    return STATIC_OPTIONS_MAP.get(optionId) || optionId;
};

export const getAttributeToOptionsMap = (allMaterials: Material[]) => ({
    material: allMaterials,
    lamination: LAMINATIONS,
    coverMaterial: allMaterials,
    innerMaterial: allMaterials,
    bindingType: BINDING_TYPES,
});