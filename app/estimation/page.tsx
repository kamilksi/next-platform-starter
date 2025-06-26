
"use client";
import React, { useState, useMemo, FC, ComponentProps } from 'react';
import { Briefcase, Code, Smartphone, CreditCard, MessageSquare, User, Send, CheckCircle, Mail, Phone, Building, MessageCircle } from 'lucide-react';


const translations = {
    pl: {
        headerTitle: "Interaktywny Konfigurator Projektu",
        headerSubtitle: "Zbuduj swój projekt krok po kroku i uzyskaj natychmiastową, szacunkową wycenę. Zobacz, co wpływa na koszt oprogramowania.",
        section1Title: "1. Wybierz typ projektu",
        section2Title: "2. Wybierz funkcjonalności",
        summaryTitle: "Podsumowanie wyceny",
        estimatedCost: "Szacowany koszt projektu",
        netPriceInfo: "Netto. Ostateczna cena zależy od szczegółów.",
        selectedElements: "Wybrane elementy:",
        base: "Baza",
        contactTitle: "Zainteresowany? Porozmawiajmy!",
        contactSubtitle: "Wypełnij formularz, a my odezwiemy się z dopasowaną ofertą i darmową konsultacją.",
        namePlaceholder: "Imię i nazwisko",
        emailPlaceholder: "Adres e-mail",
        phonePlaceholder: "Numer telefonu (opcjonalnie)",
        companyPlaceholder: "Nazwa firmy (opcjonalnie)",
        descriptionPlaceholder: "Krótki opis projektu (opcjonalnie)",
        submitButton: "Wyślij zapytanie",
    },
    en: {
        headerTitle: "Interactive Project Configurator",
        headerSubtitle: "Build your project step by step and get an instant price estimate. See what factors influence the software cost.",
        section1Title: "1. Choose project type",
        section2Title: "2. Select functionalities",
        summaryTitle: "Estimate Summary",
        estimatedCost: "Estimated project cost",
        netPriceInfo: "Net. The final price depends on the details.",
        selectedElements: "Selected elements:",
        base: "Base",
        contactTitle: "Interested? Let's talk!",
        contactSubtitle: "Fill out the form, and we'll get back to you with a tailored offer and a free consultation.",
        namePlaceholder: "Full Name",
        emailPlaceholder: "Email address",
        phonePlaceholder: "Phone number (optional)",
        companyPlaceholder: "Company name (optional)",
        descriptionPlaceholder: "Brief project description (optional)",
        submitButton: "Send Inquiry",
    }
};

type Language = keyof typeof translations;


type Price = { min: number; max: number };
type TranslatableString = { [key in Language]: string };
type Feature = {
    id: string;
    name: TranslatableString;
    description: TranslatableString;
    price: Price;
    type?: 'web' | 'mobile';
};
type LucideIcon = FC<ComponentProps<typeof Briefcase>>;
type FeatureCategory = {
    name: TranslatableString;
    icon: LucideIcon;
    features: Feature[];
};
type Project = {
    basePrice: Price;
    icon: LucideIcon;
    label: TranslatableString;
};
type ProjectData = { [key: string]: Project };


const projectData: ProjectData = {
    web: {
        basePrice: { min: 5000, max: 8000 },
        icon: Code,
        label: { pl: "Aplikacja Webowa", en: "Web Application" },
    },
    mobile: {
        basePrice: { min: 8000, max: 12000 },
        icon: Smartphone,
        label: { pl: "Aplikacja Mobilna", en: "Mobile Application" },
    },
    webmobile: {
        basePrice: { min: 12000, max: 18000 },
        icon: Briefcase,
        label: { pl: "Web + Mobile", en: "Web + Mobile" },
    }
};

const featureCategories: FeatureCategory[] = [
    {
        name: { pl: "Uwierzytelnianie i Użytkownicy", en: "Authentication & Users" },
        icon: User,
        features: [
            { id: 'auth_email', name: { pl: 'Logowanie e-mail/hasło', en: 'Email/Password Login' }, description: { pl: 'Rejestracja i logowanie użytkowników.', en: 'User registration and login.' }, price: { min: 1500, max: 2500 } },
            { id: 'auth_social', name: { pl: 'Logowanie przez social media', en: 'Social Media Login' }, description: { pl: 'Integracja z Google, Facebook, etc.', en: 'Integration with Google, Facebook, etc.' }, price: { min: 2000, max: 3000 } },
            { id: 'auth_roles', name: { pl: 'Role i uprawnienia', en: 'Roles & Permissions' }, description: { pl: 'System ról (admin, user, etc.).', en: 'Role system (admin, user, etc.).' }, price: { min: 2500, max: 4000 } },
        ],
    },
    {
        name: { pl: "Płatności", en: "Payments" },
        icon: CreditCard,
        features: [
            { id: 'payment_stripe', name: { pl: 'Integracja z Stripe', en: 'Stripe Integration' }, description: { pl: 'Płatności kartą, subskrypcje.', en: 'Card payments, subscriptions.' }, price: { min: 4000, max: 6000 } },
            { id: 'payment_blik', name: { pl: 'Integracja z BLIK', en: 'BLIK Integration' }, description: { pl: 'Szybkie płatności lokalne.', en: 'Fast local payments.' }, price: { min: 3000, max: 5000 } },
            { id: 'payment_invoice', name: { pl: 'Faktury i rozliczenia', en: 'Invoicing & Billing' }, description: { pl: 'Automatyczne generowanie faktur.', en: 'Automatic invoice generation.' }, price: { min: 3500, max: 5500 } },
        ],
    },
    {
        name: { pl: "Komunikacja", en: "Communication" },
        icon: MessageSquare,
        features: [
            { id: 'comm_notifications', name: { pl: 'Powiadomienia e-mail', en: 'Email Notifications' }, description: { pl: 'Automatyczne wysyłanie e-maili.', en: 'Automatic email sending.' }, price: { min: 1000, max: 2000 } },
            { id: 'comm_push', name: { pl: 'Powiadomienia Push (mobile)', en: 'Push Notifications (mobile)' }, description: { pl: 'Wiadomości push na urządzenia mobilne.', en: 'Push messages to mobile devices.' }, price: { min: 2500, max: 4000 }, type: 'mobile' },
            { id: 'comm_chat', name: { pl: 'Czat w czasie rzeczywistym', en: 'Real-time Chat' }, description: { pl: 'Wbudowany komunikator dla użytkowników.', en: 'Built-in messenger for users.' }, price: { min: 5000, max: 8000 } },
        ],
    },
    {
        name: { pl: "Dodatkowe Funkcjonalności", en: "Additional Features" },
        icon: Briefcase,
        features: [
            { id: 'feat_admin', name: { pl: 'Panel Administracyjny', en: 'Admin Panel' }, description: { pl: 'Zarządzanie treścią i użytkownikami.', en: 'Content and user management.' }, price: { min: 6000, max: 10000 } },
            { id: 'feat_search', name: { pl: 'Zaawansowane wyszukiwanie', en: 'Advanced Search' }, description: { pl: 'Filtrowanie i sortowanie wyników.', en: 'Filtering and sorting results.' }, price: { min: 2000, max: 3500 } },
            { id: 'feat_cms', name: { pl: 'Integracja z CMS (np. Strapi)', en: 'CMS Integration (e.g. Strapi)' }, description: { pl: 'Zarządzanie treścią przez zewnętrzny system.', en: 'Content management via an external system.' }, price: { min: 4000, max: 6000 } },
        ],
    },
];



interface LanguageSwitcherProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}
const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ language, setLanguage }) => (
    <div className="flex justify-center items-center space-x-3 mb-8">
        <button onClick={() => setLanguage('pl')} className={`px-3 py-1 rounded-md transition-all ${language === 'pl' ? 'bg-blue-100 ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'}`}>🇵🇱</button>
        <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-md transition-all ${language === 'en' ? 'bg-blue-100 ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'}`}>🇬🇧</button>
    </div>
);

interface FeatureCheckboxProps {
    feature: Feature;
    isSelected: boolean;
    onToggle: (id: string, price: Price) => void;
    language: Language;
}
const FeatureCheckbox: FC<FeatureCheckboxProps> = ({ feature, isSelected, onToggle, language }) => (
    <div
        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${isSelected ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white hover:border-gray-400'}`}
        onClick={() => onToggle(feature.id, feature.price)}
    >
        <label htmlFor={feature.id} className="flex items-center space-x-4 cursor-pointer">
            <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <div>
                <span className="font-semibold text-gray-800">{feature.name[language]}</span>
                <p className="text-sm text-gray-500">{feature.description[language]}</p>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
                <p className="font-bold text-gray-800 text-sm whitespace-nowrap">
                    + {feature.price.min.toLocaleString('pl-PL')} zł
                </p>
            </div>
        </label>
    </div>
);

interface SummarySidebarProps {
    price: Price;
    selectedFeatures: { [key: string]: Price };
    projectType: string;
    featureDetails: Feature[];
    language: Language;
}
const SummarySidebar: FC<SummarySidebarProps> = ({ price, selectedFeatures, projectType, featureDetails, language }) => {
    const t = translations[language];
    const selectedFeatureItems = Object.keys(selectedFeatures).map(id =>
        featureDetails.find(f => f.id === id)
    ).filter((feature): feature is Feature => !!feature);

    const ProjectIcon = projectData[projectType].icon;

    return (
        <div className="w-full lg:w-1/3 lg:sticky top-8 self-start">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4">{t.summaryTitle}</h3>

                <div className="text-center bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-500 text-sm">{t.estimatedCost}</p>
                    <p className="text-4xl font-extrabold text-blue-600 my-2">
                        {price.min.toLocaleString('pl-PL')} - {price.max.toLocaleString('pl-PL')} zł
                    </p>
                    <p className="text-xs text-gray-400">{t.netPriceInfo}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t.selectedElements}</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center text-gray-600">
                            <span><ProjectIcon className="inline w-4 h-4 mr-2" /> {t.base}: {projectData[projectType].label[language]}</span>
                            <span className="font-medium">{projectData[projectType].basePrice.min.toLocaleString('pl-PL')} zł</span>
                        </li>
                        {selectedFeatureItems.map(feature => (
                            <li key={feature.id} className="flex justify-between items-center text-gray-600">
                                <span><CheckCircle className="inline w-4 h-4 mr-2 text-blue-500" /> {feature.name[language]}</span>
                                <span className="font-medium">{feature.price.min.toLocaleString('pl-PL')} zł</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t.contactTitle}</h3>
                    <p className="text-sm text-gray-500 mb-4">{t.contactSubtitle}</p>
                    <form className="space-y-4">
                        <div className="relative">
                            <User className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder={t.namePlaceholder} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="relative">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                            <input type="email" placeholder={t.emailPlaceholder} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="relative">
                            <Phone className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                            <input type="tel" placeholder={t.phonePlaceholder} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="relative">
                            <Building className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder={t.companyPlaceholder} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="relative">
                            <MessageCircle className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <textarea placeholder={t.descriptionPlaceholder} rows={3} className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 flex items-center justify-center space-x-2">
                            <span>{t.submitButton}</span>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


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
            features: category.features.filter(feature =>
                projectType === 'webmobile' || !feature.type || feature.type === projectType
            )
        })).filter(category => category.features.length > 0);
    }, [projectType]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">{t.headerTitle}</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{t.headerSubtitle}</p>
                </header>
                <LanguageSwitcher language={language} setLanguage={setLanguage} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <main className="w-full lg:w-2/3 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.section1Title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(projectData).map(([key, { label, icon: Icon }]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setProjectType(key); setSelectedFeatures({}); }}
                                        className={`p-6 rounded-xl border-2 text-left transition-all duration-300 flex items-center space-x-4 ${projectType === key ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-md'}`}
                                    >
                                        <Icon className={`w-10 h-10 flex-shrink-0 ${projectType === key ? 'text-white' : 'text-blue-600'}`} />
                                        <div><span className="text-xl font-bold">{label[language]}</span></div>
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.section2Title}</h2>
                            <div className="space-y-8">
                                {filteredFeatureCategories.map(category => (
                                    <div key={category.name[language]}>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <category.icon className="w-6 h-6 text-gray-500" />
                                            <h3 className="text-xl font-semibold text-gray-700">{category.name[language]}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {category.features.map(feature => (
                                                <FeatureCheckbox
                                                    key={feature.id}
                                                    feature={feature}
                                                    isSelected={!!selectedFeatures[feature.id]}
                                                    onToggle={handleFeatureToggle}
                                                    language={language}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                    <SummarySidebar
                        price={calculatedPrice}
                        selectedFeatures={selectedFeatures}
                        projectType={projectType}
                        featureDetails={allFeatures}
                        language={language}
                    />
                </div>
            </div>
        </div>
    );
}
