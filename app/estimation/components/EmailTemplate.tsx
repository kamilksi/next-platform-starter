import * as React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    description?: string;
    projectType: string;
    language: string;
    price: { min: number; max: number };
    selectedFeatures: { [key: string]: { min: number; max: number } };
    featureNames: { [key: string]: string };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    phone,
    company,
    description,
    projectType,
    language,
    price,
    selectedFeatures,
    featureNames,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '30px', borderRadius: '12px' }}>
            <h1 style={{ color: '#a855f7', marginBottom: '20px', fontSize: '28px' }}>
                Nowe zapytanie o wycenę projektu
            </h1>

            <div style={{ backgroundColor: '#334155', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '20px' }}>Dane kontaktowe</h2>
                <p><strong>Imię i nazwisko:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                {phone && <p><strong>Telefon:</strong> {phone}</p>}
                {company && <p><strong>Firma:</strong> {company}</p>}
                <p><strong>Język:</strong> {language === 'pl' ? 'Polski' : 'English'}</p>
            </div>

            <div style={{ backgroundColor: '#334155', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '20px' }}>Szczegóły projektu</h2>
                <p><strong>Typ projektu:</strong> {projectType}</p>
                <p><strong>Szacowana cena:</strong> {price.min.toLocaleString('pl-PL')} - {price.max.toLocaleString('pl-PL')} PLN</p>
                {description && (
                    <div style={{ marginTop: '15px' }}>
                        <strong>Opis projektu:</strong>
                        <p style={{ marginTop: '5px', padding: '10px', backgroundColor: '#475569', borderRadius: '4px' }}>
                            {description}
                        </p>
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: '#334155', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '20px' }}>Wybrane funkcjonalności</h2>
                <ul style={{ listStyle: 'none', padding: '0' }}>
                    {Object.entries(selectedFeatures).map(([featureId, featurePrice]) => (
                        <li key={featureId} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid #475569'
                        }}>
                            <span>✓ {featureNames[featureId] || featureId}</span>
                            <span style={{ fontWeight: 'bold' }}>
                                {featurePrice.min.toLocaleString('pl-PL')} - {featurePrice.max.toLocaleString('pl-PL')} PLN
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                <p>Email wysłany z konfiguratora projektu</p>
                <p>Data: {new Date().toLocaleDateString('pl-PL')}</p>
            </div>
        </div>
    </div>
);

export default EmailTemplate;