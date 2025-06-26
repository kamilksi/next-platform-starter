
import { FC } from 'react';
import { Language, translations } from '../lib/types';

interface LanguageSwitcherProps { language: Language; setLanguage: (lang: Language) => void; }
export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ language, setLanguage }) => (
    <div className="flex justify-center items-center space-x-2 mb-10">
        <button onClick={() => setLanguage('pl')} className={`p-2 rounded-full transition-all duration-300 ${language === 'pl' ? 'bg-white/20 ring-2 ring-white/80' : 'opacity-50 hover:opacity-100 hover:bg-white/10'}`}>🇵🇱</button>
        <button onClick={() => setLanguage('en')} className={`p-2 rounded-full transition-all duration-300 ${language === 'en' ? 'bg-white/20 ring-2 ring-white/80' : 'opacity-50 hover:opacity-100 hover:bg-white/10'}`}>🇬🇧</button>
    </div>
);
