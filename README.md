# Sondaj İş Takip — GitHub Pages + Firebase kurulumu

Tek dosyalık uygulama (`index.html`) GitHub Pages'te yayınlanır; veriler Firebase Realtime Database'de, giriş yapan hesaba bağlı olarak saklanır. Tarayıcıdaki yerel kopya da tutulur, internet yokken çalışmaya devam eder.

## 1. Firebase projesi
1. https://console.firebase.google.com → **Proje ekle** (ör. `sondaj-takip`). Analytics gerekmez.
2. Sol menü **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
3. **Build → Realtime Database → Create database** → bölge seç (Belgium/europe-west1 uygun) → **Start in locked mode**.
4. Realtime Database → **Rules** sekmesine `database.rules.json` içeriğini yapıştır → **Publish**.
   (Kural: her kullanıcı yalnızca `users/<kendi uid>` altını okur/yazar.)
5. Proje ayarları (dişli) → **General → Your apps → Web (</>) → Register app**. Çıkan `firebaseConfig` nesnesini kopyala. `databaseURL` alanı yoksa Realtime Database sayfasındaki adresi (`https://....firebasedatabase.app`) ekle.
6. **Authentication → Settings → Authorized domains** listesine GitHub Pages adresini ekle: `KULLANICI.github.io`.

## 2. Yapılandırmayı uygulamaya verme (iki yol)
- **A) Dosyaya göm (önerilen, Pages için):** `index.html` içinde `const FIREBASE_CONFIG=null;` satırını `const FIREBASE_CONFIG={apiKey:"...",...};` olarak doldur.
- **B) Uygulama içinden:** Ayarlar → *Bulut senkron* alanına nesneyi yapıştır → *Kaydet ve bağlan*. (Her cihazda bir kez yapılır; tarayıcıda saklanır.)

Not: Web `apiKey` gizli değildir; koruma Realtime Database kurallarıyla sağlanır.

## 3. GitHub Pages
1. GitHub'da yeni depo (ör. `sondaj-takip`; public olabilir, veri içermez).
2. `index.html` ve `database.rules.json` dosyalarını yükle (Add file → Upload).
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root) → Save**.
4. Birkaç dakika sonra adres: `https://KULLANICI.github.io/sondaj-takip/`.

Komut satırıyla:
```bash
git init && git add index.html database.rules.json README.md
git commit -m "Sondaj iş takip"
git branch -M main
git remote add origin https://github.com/KULLANICI/sondaj-takip.git
git push -u origin main
```

## 4. İlk kullanım
1. Sayfayı aç → sağ üstte **Bulut: giriş yapılmadı** yazısına tıkla → e-posta/şifre ile **Hesap oluştur**.
2. Tarayıcıda zaten veri varsa ilk bağlantıda buluta yüklenir; ikinci cihazda aynı hesapla girince aynı veriler gelir.
3. Diğer kişilerin de aynı verileri görmesi için aynı hesabı kullanmaları gerekir (tek firma hesabı).

## Senkron kuralı
Her kayıt zaman damgası taşır; en son kaydeden cihaz kazanır. Aynı anda iki cihazdan düzenleme yapılmamalı. Telefonu ana sayfaya ekleyerek (Chrome → *Ana ekrana ekle*) uygulama gibi kullanabilirsiniz.

## Sorun giderme
- **"okuma hatası: permission-denied"** → kurallar yayınlanmamış ya da giriş yapılmamış.
- **"auth/operation-not-allowed"** → Email/Password yöntemi etkin değil.
- **Giriş penceresi açılmıyor / "kütüphane yüklenemedi"** → internet yok ya da gstatic.com engelli.
- **Pages'te giriş çalışmıyor** → Authorized domains'e `KULLANICI.github.io` eklenmemiş.
