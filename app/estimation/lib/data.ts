
import { Briefcase, Code, CreditCard, MessageSquare, Smartphone, User } from 'lucide-react';
import { FeatureCategory, ProjectData } from './types';

export const projectData: ProjectData = {
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

export const featureCategories: FeatureCategory[] = [
    {
        name: { pl: "Uwierzytelnianie i Użytkownicy", en: "Authentication & Users" }, icon: User, features: [
            { 
                id: 'auth_email', 
                name: { pl: 'Logowanie e-mail/hasło', en: 'Email/Password Login' }, 
                description: { pl: 'Rejestracja i logowanie użytkowników.', en: 'User registration and login.' }, 
                price: { 
                    web: { min: 1500, max: 2500 },
                    mobile: { min: 2000, max: 3000 }
                }
            },
            { 
                id: 'auth_social', 
                name: { pl: 'Logowanie przez social media', en: 'Social Media Login' }, 
                description: { pl: 'Integracja z Google, Facebook, etc.', en: 'Integration with Google, Facebook, etc.' }, 
                price: { 
                    web: { min: 2000, max: 3000 },
                    mobile: { min: 2500, max: 3500 }
                }
            },
            { 
                id: 'auth_roles', 
                name: { pl: 'Role i uprawnienia', en: 'Roles & Permissions' }, 
                description: { pl: 'System ról (admin, user, etc.).', en: 'Role system (admin, user, etc.).' }, 
                price: { 
                    web: { min: 2500, max: 4000 },
                    mobile: { min: 3000, max: 4500 }
                }
            },
        ]
    },
    {
        name: { pl: "Płatności", en: "Payments" }, icon: CreditCard, features: [
            { 
                id: 'payment_stripe', 
                name: { pl: 'Integracja z Stripe', en: 'Stripe Integration' }, 
                description: { pl: 'Płatności kartą, subskrypcje.', en: 'Card payments, subscriptions.' }, 
                price: { 
                    web: { min: 4000, max: 6000 },
                    mobile: { min: 5000, max: 7000 }
                }
            },
            { 
                id: 'payment_blik', 
                name: { pl: 'Integracja z BLIK', en: 'BLIK Integration' }, 
                description: { pl: 'Szybkie płatności lokalne.', en: 'Fast local payments.' }, 
                price: { 
                    web: { min: 3000, max: 5000 },
                    mobile: { min: 3500, max: 5500 }
                }
            },
            { 
                id: 'payment_invoice', 
                name: { pl: 'Faktury i rozliczenia', en: 'Invoicing & Billing' }, 
                description: { pl: 'Automatyczne generowanie faktur.', en: 'Automatic invoice generation.' }, 
                price: { 
                    web: { min: 3500, max: 5500 },
                    mobile: { min: 4000, max: 6000 }
                }
            },
        ]
    },
    {
        name: { pl: "Komunikacja", en: "Communication" }, icon: MessageSquare, features: [
            { 
                id: 'comm_notifications', 
                name: { pl: 'Powiadomienia e-mail', en: 'Email Notifications' }, 
                description: { pl: 'Automatyczne wysyłanie e-maili.', en: 'Automatic email sending.' }, 
                price: { 
                    web: { min: 1000, max: 2000 },
                    mobile: { min: 1200, max: 2200 }
                }
            },
            { 
                id: 'comm_push', 
                name: { pl: 'Powiadomienia Push (mobile)', en: 'Push Notifications (mobile)' }, 
                description: { pl: 'Wiadomości push na urządzenia mobilne.', en: 'Push messages to mobile devices.' }, 
                price: { min: 2500, max: 4000 }, 
                type: 'mobile' 
            },
            { 
                id: 'comm_chat', 
                name: { pl: 'Czat w czasie rzeczywistym', en: 'Real-time Chat' }, 
                description: { pl: 'Wbudowany komunikator dla użytkowników.', en: 'Built-in messenger for users.' }, 
                price: { 
                    web: { min: 5000, max: 8000 },
                    mobile: { min: 6000, max: 9000 }
                }
            },
        ]
    },
    {
        name: { pl: "Dodatkowe Funkcjonalności", en: "Additional Features" }, icon: Briefcase, features: [
            { 
                id: 'feat_admin', 
                name: { pl: 'Panel Administracyjny', en: 'Admin Panel' }, 
                description: { pl: 'Zarządzanie treścią i użytkownikami.', en: 'Content and user management.' }, 
                price: { 
                    web: { min: 6000, max: 10000 },
                    mobile: { min: 7000, max: 11000 }
                }
            },
            { 
                id: 'feat_search', 
                name: { pl: 'Zaawansowane wyszukiwanie', en: 'Advanced Search' }, 
                description: { pl: 'Filtrowanie i sortowanie wyników.', en: 'Filtering and sorting results.' }, 
                price: { 
                    web: { min: 2000, max: 3500 },
                    mobile: { min: 2500, max: 4000 }
                }
            },
            { 
                id: 'feat_cms', 
                name: { pl: 'Integracja z CMS (np. Strapi)', en: 'CMS Integration (e.g. Strapi)' }, 
                description: { pl: 'Zarządzanie treścią przez zewnętrzny system.', en: 'Content management via an external system.' }, 
                price: { 
                    web: { min: 4000, max: 6000 },
                    mobile: { min: 4500, max: 6500 }
                }
            },
        ]
    },
];
