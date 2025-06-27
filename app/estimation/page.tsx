"use client";
import { useMemo, useState } from 'react';
import { FeatureCheckbox } from './components/FeatureCheckbox';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { SummarySidebar } from './components/SummarySidebar';
import { featureCategories, projectData } from './lib/data';
import { Language, Price, translations } from './lib/types';

export default function Page() {
    const [language, setLanguage] = useState<Language>('pl');
    const [projectType, setProjectType] = useState<string>('web');
    const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: Price }>({});

    const t = translations[language];
    const allFeatures = useMemo(() => featureCategories.flatMap(cat => cat.features), []);

    const handleFeatureToggle = (featureId: string, price: Price) => {
        setSelectedFeatures(prev => {
            const newSelection = { ...prev };
            if (newSelection[featureId]) delete newSelection[featureId];
            else newSelection[featureId] = price;
            return newSelection;
        });
    };

    const calculatedPrice = useMemo(() => {
        const base = projectData[projectType].basePrice;
        return Object.values(selectedFeatures).reduce((acc, price) => ({
            min: acc.min + price.min,
            max: acc.max + price.max
        }), { min: base.min, max: base.max });
    }, [selectedFeatures, projectType]);

    const filteredFeatureCategories = useMemo(() => {
        return featureCategories.map(category => ({
            ...category,
            features: category.features.filter(feature => projectType === 'webmobile' || !feature.type || feature.type === projectType)
        })).filter(category => category.features.length > 0);
    }, [projectType]);

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <div className="absolute inset-0 bg-grid-slate-700/20 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
            <div className="relative container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">{t.headerTitle}</h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{t.headerSubtitle}</p>
                </header>
                <LanguageSwitcher language={language} setLanguage={setLanguage} />

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    <main className="w-full lg:w-3/5 space-y-10">
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-5">{t.section1Title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(projectData).map(([key, { label, icon: Icon }]) => (
                                    <button key={key} onClick={() => { setProjectType(key); setSelectedFeatures({}); }}
                                        className={`p-6 rounded-xl text-left transition-all duration-300 flex flex-col items-center justify-center space-y-3 relative overflow-hidden ${projectType === key ? 'bg-violet-600/80 ring-2 ring-violet-400 shadow-2xl shadow-violet-500/30' : 'bg-slate-800/60 ring-1 ring-white/10 hover:ring-white/20 hover:bg-slate-800'}`}>
                                        <Icon className={`w-12 h-12 transition-colors ${projectType === key ? 'text-white' : 'text-[#7439FA]'}`} />
                                        <span className="text-lg font-semibold text-center text-white">{label[language]}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-5">{t.section2Title}</h2>
                            <div className="space-y-8">
                                {filteredFeatureCategories.map(category => (
                                    <div key={category.name[language]}>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-2 bg-slate-800 rounded-lg ring-1 ring-white/10"><category.icon className="w-6 h-6 text-[#7439FA]" /></div>
                                            <h3 className="text-xl font-semibold text-gray-200">{category.name[language]}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {category.features.map(feature => (
                                                <FeatureCheckbox key={feature.id} feature={feature} isSelected={!!selectedFeatures[feature.id]} onToggle={handleFeatureToggle} language={language} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                    <SummarySidebar price={calculatedPrice} selectedFeatures={selectedFeatures} projectType={projectType} featureDetails={allFeatures} language={language} />
                </div>
            </div>
        </div>
    );
}
