import { CheckCircle } from 'lucide-react';
import { FC } from 'react';
import { Feature, Language, Price, PricingStructure } from '../lib/types';

interface FeatureCheckboxProps {
    feature: Feature;
    isSelected: boolean;
    onToggle: (id: string, price: Price) => void;
    language: Language;
    projectType: string;
}

const getFeaturePrice = (feature: Feature, projectType: string): Price => {
    // Jeśli to jest stara struktura (tylko Price)
    if ('min' in feature.price && 'max' in feature.price) {
        return feature.price as Price;
    }

    // Nowa struktura z różnymi cenami dla web i mobile
    const pricing = feature.price as PricingStructure;

    if (projectType === 'webmobile') {
        // Sumuj ceny dla web + mobile
        return {
            min: pricing.web.min + pricing.mobile.min,
            max: pricing.web.max + pricing.mobile.max
        };
    }

    if (projectType === 'mobile') {
        return pricing.mobile;
    }

    // Domyślnie web
    return pricing.web;
};

export const FeatureCheckbox: FC<FeatureCheckboxProps> = ({ feature, isSelected, onToggle, language, projectType }) => {
    const price = getFeaturePrice(feature, projectType);

    return (
        <div
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center space-x-4 ${isSelected ? 'bg-blue-900/50 ring-2 ring-[#7439FA] shadow-lg' : 'bg-slate-800/60 ring-1 ring-white/10 hover:ring-white/20'}`}
            onClick={() => onToggle(feature.id, price)}
        >
            <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${isSelected ? 'bg-[#7439FA] border-[#7439FA]' : 'border-gray-600 bg-slate-700'}`}>
                {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-grow">
                <span className="font-semibold text-white">{feature.name[language]}</span>
                <p className="text-sm text-gray-400">{feature.description[language]}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-200 text-sm whitespace-nowrap">+ {price.min.toLocaleString('pl-PL')} - {price.max.toLocaleString('pl-PL')} zł</p>
            </div>
        </div>
    );
};
