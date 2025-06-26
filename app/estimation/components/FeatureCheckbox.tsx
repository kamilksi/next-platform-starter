
import { FC } from 'react';
import { CheckCircle } from 'lucide-react';
import { Feature, Price, Language } from '../lib/types';

interface FeatureCheckboxProps { feature: Feature; isSelected: boolean; onToggle: (id: string, price: Price) => void; language: Language; }
export const FeatureCheckbox: FC<FeatureCheckboxProps> = ({ feature, isSelected, onToggle, language }) => (
    <div
        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center space-x-4 ${isSelected ? 'bg-blue-900/50 ring-2 ring-blue-500 shadow-lg' : 'bg-slate-800/60 ring-1 ring-white/10 hover:ring-white/20'}`}
        onClick={() => onToggle(feature.id, feature.price)}
    >
        <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-gray-600 bg-slate-700'}`}>
            {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
        </div>
        <div className="flex-grow">
            <span className="font-semibold text-white">{feature.name[language]}</span>
            <p className="text-sm text-gray-400">{feature.description[language]}</p>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-200 text-sm whitespace-nowrap">+ {feature.price.min.toLocaleString('pl-PL')} zł</p>
        </div>
    </div>
);
