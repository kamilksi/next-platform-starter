
import { FC } from 'react';
import { User, Mail, Phone, Building, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Price, Language, Feature, translations } from '../lib/types';
import { projectData } from '../lib/data';

interface SummarySidebarProps { price: Price; selectedFeatures: { [key: string]: Price }; projectType: string; featureDetails: Feature[]; language: Language; }
export const SummarySidebar: FC<SummarySidebarProps> = ({ price, selectedFeatures, projectType, featureDetails, language }) => {
    const t = translations[language];
    const selectedFeatureItems = Object.keys(selectedFeatures).map(id => featureDetails.find(f => f.id === id)).filter((feature): feature is Feature => !!feature);
    const ProjectIcon = projectData[projectType].icon;

    return (
        <div className="w-full lg:w-2/5 lg:sticky top-8 self-start">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/10 p-6 space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">{t.summaryTitle}</h3>

                <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 ring-1 ring-white/10">
                    <p className="text-gray-400 text-sm font-medium">{t.estimatedCost}</p>
                    <p className="text-5xl font-extrabold my-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {price.min.toLocaleString('pl-PL')} zł
                    </p>
                    <p className="text-xs text-gray-500">{t.netPriceInfo}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-300 mb-3">{t.selectedElements}</h4>
                    <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                        <li className="flex justify-between items-center text-gray-300">
                            <span><ProjectIcon className="inline w-4 h-4 mr-2" /> {t.base}: {projectData[projectType].label[language]}</span>
                            <span className="font-medium">{projectData[projectType].basePrice.min.toLocaleString('pl-PL')} zł</span>
                        </li>
                        {selectedFeatureItems.map(feature => (
                            <li key={feature.id} className="flex justify-between items-center text-gray-300">
                                <span className="flex items-center"><CheckCircle className="inline w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /> {feature.name[language]}</span>
                                <span className="font-medium ml-2">{feature.price.min.toLocaleString('pl-PL')} zł</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-2">{t.contactTitle}</h3>
                    <p className="text-sm text-gray-400 mb-4">{t.contactSubtitle}</p>
                    <form className="space-y-4">
                        {[
                            { placeholder: t.namePlaceholder, icon: User, type: 'text' },
                            { placeholder: t.emailPlaceholder, icon: Mail, type: 'email' },
                            { placeholder: t.phonePlaceholder, icon: Phone, type: 'tel' },
                            { placeholder: t.companyPlaceholder, icon: Building, type: 'text' },
                        ].map(({ placeholder, icon: Icon, type }) => (
                            <div key={placeholder} className="relative">
                                <Icon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-500" />
                                <input type={type} placeholder={placeholder} className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                        ))}
                        <div className="relative">
                            <MessageCircle className="absolute top-3 left-3 w-5 h-5 text-gray-500" />
                            <textarea placeholder={t.descriptionPlaceholder} rows={3} className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 flex items-center justify-center space-x-2">
                            <span>{t.submitButton}</span>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
