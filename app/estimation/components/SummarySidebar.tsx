import { Building, CheckCircle, Mail, MessageCircle, Phone, Send, User } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { projectData } from '../lib/data';
import { Feature, Language, Price, translations } from '../lib/types';

// Dynamically import Google reCAPTCHA to avoid SSR issues
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => <div className="h-20 bg-slate-700/50 rounded animate-pulse flex items-center justify-center">
    <span className="text-gray-400">Loading verification...</span>
  </div>
});

interface SummarySidebarProps {
    price: Price;
    selectedFeatures: { [key: string]: Price };
    projectType: string;
    featureDetails: Feature[];
    language: Language;
}

export const SummarySidebar: FC<SummarySidebarProps> = ({ price, selectedFeatures, projectType, featureDetails, language }) => {
    const t = translations[language];
    const selectedFeatureItems = Object.keys(selectedFeatures).map(id => featureDetails.find(f => f.id === id)).filter((feature): feature is Feature => !!feature);
    const ProjectIcon = projectData[projectType].icon;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        description: '',
        website: '' // Honeypot field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [submissionTime, setSubmissionTime] = useState<number>(Date.now());
    const [csrfToken, setCsrfToken] = useState<string>('');
    const [fingerprint, setFingerprint] = useState<string>('');
    const [captchaToken, setCaptchaToken] = useState<string>('');

    // Track when form was first rendered for timing analysis
    const formRenderTime = useState(() => Date.now())[0];

    // Get CSRF token on component mount
    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                const response = await fetch('/api/csrf');
                const data = await response.json();
                setCsrfToken(data.token);
                setFingerprint(data.fingerprint);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        fetchCSRFToken();
    }, []);

    // Assuming an average hourly rate of 100 PLN for estimation
    const hourlyRate = 100;
    const estimatedHours = {
        min: Math.round(price.min / hourlyRate),
        max: Math.round(price.max / hourlyRate)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Enhanced security checks
            if (formData.website) {
                setError('Wystąpił błąd podczas wysyłania');
                return;
            }

            if (!captchaToken) {
                setError('Proszę zweryfikować, że nie jesteś robotem');
                return;
            }

            if (!csrfToken || !fingerprint) {
                setError('Błąd bezpieczeństwa. Odśwież stronę i spróbuj ponownie.');
                return;
            }

            // Timing check
            const timeTaken = Date.now() - formRenderTime;
            if (timeTaken < 5000) {
                setError('Proszę wypełnić formularz dokładniej');
                return;
            }

            // Prepare feature names for email
            const featureNames: { [key: string]: string } = {};
            selectedFeatureItems.forEach(feature => {
                featureNames[feature.id] = feature.name[language];
            });

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    description: formData.description,
                    projectType: projectData[projectType].label[language],
                    language,
                    price,
                    selectedFeatures,
                    featureNames,
                    timestamp: formRenderTime,
                    csrfToken,
                    fingerprint,
                    captchaToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send email');
            }

            setSubmitted(true);
            setSubmissionTime(Date.now());
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                if (error.message.includes('429')) {
                    setError('Zbyt wiele prób. Spróbuj ponownie za chwilę.');
                } else if (error.message.includes('security')) {
                    setError('Błąd bezpieczeństwa. Odśwież stronę i spróbuj ponownie.');
                } else {
                    setError('Wystąpił błąd podczas wysyłania. Spróbuj ponownie.');
                }
            } else {
                setError('Wystąpił nieoczekiwany błąd.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="w-full lg:w-2/5 lg:sticky top-8 self-start">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/10 p-6 space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">{t.summaryTitle}</h3>

                <div className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 ring-1 ring-white/10">
                    <p className="text-gray-400 text-sm font-medium">{t.estimatedCost}</p>
                    <p className="text-4xl lg:text-5xl font-extrabold my-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {price.min.toLocaleString('pl-PL')} - {price.max.toLocaleString('pl-PL')} zł
                    </p>
                    <p className="text-gray-400 text-sm font-medium mt-4">{t.estimatedHours}</p>
                    <p className="text-2xl font-bold text-gray-200">
                        {estimatedHours.min} - {estimatedHours.max} godzin
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{t.netPriceInfo}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-300 mb-3">{t.selectedElements}</h4>
                    <ul className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                        <li className="flex justify-between items-center text-gray-300">
                            <span><ProjectIcon className="inline w-4 h-4 mr-2" /> {t.base}: {projectData[projectType].label[language]}</span>
                            <span className="font-medium">{projectData[projectType].basePrice.min.toLocaleString('pl-PL')} - {projectData[projectType].basePrice.max.toLocaleString('pl-PL')} zł</span>
                        </li>
                        {selectedFeatureItems.map(feature => {
                            const featurePrice = selectedFeatures[feature.id];
                            return (
                                <li key={feature.id} className="flex justify-between items-center text-gray-300">
                                    <span className="flex items-center"><CheckCircle className="inline w-4 h-4 mr-2 text-[#7439FA] flex-shrink-0" /> {feature.name[language]}</span>
                                    <span className="font-medium ml-2">{featurePrice.min.toLocaleString('pl-PL')} - {featurePrice.max.toLocaleString('pl-PL')} zł</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-2">{t.contactTitle}</h3>
                    <p className="text-sm text-gray-400 mb-4">{t.contactSubtitle}</p>

                    {submitted ? (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center">
                            <h4 className="text-xl font-semibold text-green-400 mb-2">Dziękujemy!</h4>
                            <p className="text-gray-300">Twoje zapytanie zostało wysłane. Odezwiemy się w ciągu 24 godzin.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Honeypot field - hidden from users */}
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                            />

                            <div className="relative">
                                <User className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="fullname" // Use different name than expected
                                    placeholder={t.namePlaceholder}
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7439FA] focus:border-[#7439FA] transition"
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="contact-email" // Use different name
                                    placeholder={t.emailPlaceholder}
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7439FA] focus:border-[#7439FA] transition"
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="tel"
                                    name="contact-phone"
                                    placeholder={t.phonePlaceholder}
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7439FA] focus:border-[#7439FA] transition"
                                />
                            </div>

                            <div className="relative">
                                <Building className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="organization"
                                    placeholder={t.companyPlaceholder}
                                    value={formData.company}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7439FA] focus:border-[#7439FA] transition"
                                />
                            </div>

                            <div className="relative">
                                <MessageCircle className="absolute top-3 left-3 w-5 h-5 text-gray-500" />
                                <textarea
                                    name="project-details"
                                    placeholder={t.descriptionPlaceholder}
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full pl-10 p-2.5 bg-slate-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7439FA] focus:border-[#7439FA] transition resize-none"
                                />
                            </div>

                            {/* Google reCAPTCHA */}
                            <div className="flex justify-center">
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                                    onChange={(token) => setCaptchaToken(token || '')}
                                    onExpired={() => setCaptchaToken('')}
                                    theme="dark"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !captchaToken}
                                className="w-full bg-gradient-to-r bg-[#7439FA] hover:bg-purple-700 disabled:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <span>{isSubmitting ? 'Wysyłanie...' : t.submitButton}</span>
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
