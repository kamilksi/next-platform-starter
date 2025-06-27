# 🔐 Jak uzyskać prawdziwe klucze Google reCAPTCHA

## Krok 1: Przejdź do Google reCAPTCHA Admin
Otwórz: https://www.google.com/recaptcha/admin/create

## Krok 2: Zaloguj się
Zaloguj się swoim kontem Google.

## Krok 3: Utwórz nową stronę
Wypełnij formularz:

### Label (Nazwa)
```
Project Configurator
```

### reCAPTCHA type
Wybierz: **reCAPTCHA v2** → **"I'm not a robot" Checkbox**

### Domains (Domeny)
Dodaj następujące domeny (każdą w nowej linii):
```
localhost
yourdomain.netlify.app
yourdomain.com
```
⚠️ **Zamień `yourdomain` na prawdziwą nazwę swojej domeny!**

### Accept the Terms of Service
Zaznacz checkbox.

## Krok 4: Kliknij "Submit"

## Krok 5: Skopiuj klucze
Po utworzeniu otrzymasz:
- **Site Key** (publiczny) - zaczyna się od `6Le...`
- **Secret Key** (prywatny) - zaczyna się od `6Le...`

## Krok 6: Dodaj klucze do .env.local
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeYourRealSiteKeyHere
RECAPTCHA_SECRET_KEY=6LeYourRealSecretKeyHere
```

## Krok 7: Dodaj klucze do Netlify
W panelu Netlify:
1. Site Settings → Environment Variables
2. Dodaj obie zmienne

## Krok 8: Deploy
Po dodaniu prawdziwych kluczy, deploy ponownie.

---

## ⚠️ Ważne!
- **Site Key** jest publiczny (NEXT_PUBLIC_) - może być widoczny w kodzie
- **Secret Key** jest prywatny - NIGDY nie dodawaj go do frontendu
- Dodaj wszystkie domeny gdzie będzie używana strona
- Dla testów lokalnych zawsze dodaj `localhost`

## 🎯 Po uzyskaniu kluczy:
reCAPTCHA przestanie pokazywać "testing purposes only" i będzie działać normalnie!
