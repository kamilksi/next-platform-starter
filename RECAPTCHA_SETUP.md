# 🔐 Jak uzyskać prawdziwe klucze Google reCAPTCHA

⚠️ **WAŻNE:** Jeśli widzisz komunikat "reCAPTCHA is for testing purposes only", oznacza to, że używasz kluczy testowych. Musisz uzyskać prawdziwe klucze produkcyjne!

## 🧪 Klucze testowe (tylko do rozwoju)
```bash
# Te klucze pokazują komunikat "testing purposes only"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## 🚀 Prawdziwe klucze produkcyjne

### Krok 1: Przejdź do Google reCAPTCHA Admin
Otwórz: https://www.google.com/recaptcha/admin/create

### Krok 2: Zaloguj się
Zaloguj się swoim kontem Google.

### Krok 3: Utwórz nową stronę
Wypełnij formularz:

#### Label (Nazwa)
```
AppsValue Platform Starter
```

#### reCAPTCHA type
Wybierz: **reCAPTCHA v2** → **"I'm not a robot" Checkbox**

#### Domains (Domeny)
Dodaj następujące domeny (każdą w nowej linii):
```
localhost
next-platform-starter.netlify.app
twoja-domena.com
```
⚠️ **Zamień na prawdziwą nazwę swojej domeny Netlify!**

#### Accept the Terms of Service
Zaznacz checkbox.

### Krok 4: Kliknij "Submit"

### Krok 5: Skopiuj klucze
Po utworzeniu otrzymasz:
- **Site Key** (publiczny) - zaczyna się od `6Le...`
- **Secret Key** (prywatny) - zaczyna się od `6Le...`

### Krok 6: Dodaj klucze do .env.local
```bash
# Zamień na prawdziwe klucze z Google reCAPTCHA Admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeYourRealSiteKeyHere
RECAPTCHA_SECRET_KEY=6LeYourRealSecretKeyHere
```

### Krok 7: Dodaj klucze do Netlify
W panelu Netlify:
1. Site Settings → Environment Variables
2. Dodaj obie zmienne:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`

### Krok 8: Restart dev server
```bash
npm run dev
```

### Krok 9: Deploy na Netlify
Po dodaniu zmiennych środowiskowych, redeploy aplikację.

## ✅ Weryfikacja
Po ustawieniu prawdziwych kluczy:
- Komunikat "testing purposes only" zniknie
- reCAPTCHA będzie działać prawidłowo w produkcji
- Formularz będzie w pełni bezpieczny

## 🔧 Troubleshooting

### Problem: "Invalid site key"
- Sprawdź czy domena jest dodana w Google reCAPTCHA Admin
- Upewnij się, że używasz Site Key (publicznego) na froncie

### Problem: "Invalid secret key"  
- Sprawdź czy używasz Secret Key (prywatnego) w API
- Upewnij się, że klucz jest ustawiony w zmiennych środowiskowych
Po dodaniu prawdziwych kluczy, deploy ponownie.

---

## ⚠️ Ważne!
- **Site Key** jest publiczny (NEXT_PUBLIC_) - może być widoczny w kodzie
- **Secret Key** jest prywatny - NIGDY nie dodawaj go do frontendu
- Dodaj wszystkie domeny gdzie będzie używana strona
- Dla testów lokalnych zawsze dodaj `localhost`

## 🎯 Po uzyskaniu kluczy:
reCAPTCHA przestanie pokazywać "testing purposes only" i będzie działać normalnie!
