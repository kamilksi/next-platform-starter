
import { FC, ComponentProps } from 'react';
import { Briefcase } from 'lucide-react';

// --- I18N (Internationalization) Configuration ---
export const translations = {
    pl: {
        headerTitle: "Interaktywny Konfigurator Projektu",
        headerSubtitle: "Zbuduj swój projekt krok po kroku i uzyskaj natychmiastową, szacunkową wycenę. Zobacz, co wpływa na koszt oprogramowania.",
        section1Title: "1. Wybierz typ projektu",
        section2Title: "2. Dobierz funkcjonalności",
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
        submitButton: "Wyślij zapytanie o wycenę",
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
        submitButton: "Send Estimation Inquiry",
    }
};

export type Language = keyof typeof translations;


export type Price = { min: number; max: number };
export type TranslatableString = { [key in Language]: string };
export type Feature = {
    id: string;
    name: TranslatableString;
    description: TranslatableString;
    price: Price;
    type?: 'web' | 'mobile';
};
export type LucideIcon = FC<ComponentProps<typeof Briefcase>>;
export type FeatureCategory = {
    name: TranslatableString;
    icon: LucideIcon;
    features: Feature[];
};
export type Project = {
    basePrice: Price;
    icon: LucideIcon;
    label: TranslatableString;
};
export type ProjectData = { [key: string]: Project };
