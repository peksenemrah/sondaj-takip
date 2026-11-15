# Sondaj İş Takip

Su kuyusu sondaj işletmesi için tek dosyalık web uygulaması: kuyu dosyaları, günlük iş kayıtları, gelir/gider, alacak/borç, personel hak edişi ve cari hesabı, makine/bakım, stok, teklif, harita ve raporlar. Telefonda uygulama gibi kurulur, internet yokken çalışır, veriler Firebase ile cihazlar arasında eşitlenir.

- **Adres:** https://peksenemrah.github.io/sondaj-takip/
- **Depo:** github.com/peksenemrah/sondaj-takip (public, veri içermez)
- **Firebase projesi:** `sondaj-takip-dae9b` (Realtime Database, europe-west1)

---

## 1. Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulamanın tamamı (HTML + CSS + JS, Firebase yapılandırması gömülü) |
| `sw.js` | Service worker — çevrimdışı çalışma ve önbellek |
| `manifest.webmanifest` | Telefona "uygulama olarak kur" bilgileri |
| `icon-192.png`, `icon-512.png` | Ana ekran ikonu (sondaj kulesi + su damlası) |
| `database.rules.json` | Firebase güvenlik kuralları |
| `giderler_eylul_2026.json` | Defterden aktarılan Eylül 2026 giderleri (49 kayıt, 811.900 ₺) |
| `giderler_mayis_agustos_2026.json` | Defterden aktarılan Mayıs–Ağustos 2026 giderleri (167 kayıt, 1.475.250 ₺) |
| `README.md` | Bu belge |

---

## 2. Kurulum

### 2.1 Firebase
1. console.firebase.google.com → proje (`sondaj-takip-dae9b`).
2. **Authentication → Sign-in method → Email/Password → Enable.**
3. **Realtime Database** → europe-west1 → locked mode.
4. **Rules** sekmesine `database.rules.json` içeriğini yapıştır → **Publish**:
   ```json
   {"rules":{"users":{"$uid":{".read":"auth != null && auth.uid === $uid",".write":"auth != null && auth.uid === $uid"}}}}
   ```
5. **Authentication → Settings → Authorized domains** listesinde `peksenemrah.github.io` olmalı.
6. Web uygulaması (`sondaj-web`) yapılandırması `index.html` içindeki `FIREBASE_CONFIG` sabitine gömülüdür. Web `apiKey` gizli değildir; koruma veritabanı kurallarıyla sağlanır.

### 2.2 GitHub Pages
1. Depoya yukarıdaki dosyaları yükle: **Add file → Upload files → Commit changes.**
2. **Settings → Pages → Deploy from a branch → main / (root).**
3. Her commit'ten 1–2 dakika sonra yayına girer; sayfayı yenilemek yeterli.

### 2.3 İlk kullanım
1. Adresi aç → sağ üstte **Bulut: giriş yapılmadı** → e-posta/şifre → **Hesap oluştur**. (İlk seferde "Giriş yap" değil "Hesap oluştur" kullanılır; hesap yokken "e-posta veya şifre hatalı" uyarısı çıkar.)
2. Diğer cihazlarda aynı hesapla **Giriş yap**.
3. Tarayıcıda önceden veri varsa ilk bağlantıda buluta taşınır.

### 2.4 Telefona kurma (PWA)
- **Android / Chrome:** Ayarlar sekmesi → **Uygulamayı yükle**, ya da Chrome menüsü → "Uygulamayı yükle".
- **iPhone / Safari:** Paylaş simgesi → **Ana Ekrana Ekle**.
- Çevrimdışı kullanım için uygulama **bir kez internetliyken açılmış** olmalıdır.

---

## 3. Sekmeler ve özellikler

### Özet
Seçilen ay için iş günü, metraj, saat, bidon; gelir/gider/net; kasa ve banka bakiyesi; açık alacak/borç. Resmi/gayriresmi kırılımı, son 6 ay grafiği, gider kategori dağılımı, kuyu bazlı dönem tablosu. Kritik stok ve eski yedek uyarıları üst bantta görünür.

### Saha
Telefonda hızlı iş günü girişi: kuyu, tarih, inkişaf delgi/boru, makine/kompresör, personel.

### Kuyular
- Her kuyu ayrı dosya: müşteri, telefon, tür (resmi/gayriresmi), anlaşma bedeli, koordinat, teslim tarihi/tutanağı, notlar, fotoğraflar.
- **Konumumu al:** sahada koordinat tek dokunuşla girilir.
- **Kuyu teknik föyü:** statik ve dinamik su seviyesi, debi (lt/sn), pompa montaj derinliği, pompa marka/model ve gücü, garanti bitiş tarihi (kalan gün gösterilir), teknik not. Kuyu sayfasında ve müşteri raporunda yer alır.
- **Kuyu sayfası:** metre başı maliyet/gelir, günlük seyir, gider kalemleri, para hareketleri, tahsil edilen ve **kalan tahsilat**.
- **Düğmeler:** Tahsilat gir · Düzenle · Müşteri raporu (yazdır) · Raporu paylaş · Müşteri ekstresi · Ekstre → WhatsApp/PDF · Fatura görünümü · Bu kuyuya yeni gün · Sil.
- **Harita:** "Harita" düğmesi tüm kuyuları OpenStreetMap üzerinde gösterir. Yeşil = tamamlandı, turuncu = devam ediyor, mavi = bekleyen teklif. İşarete tıklayınca özet, "Dosyayı aç" ve "Yol tarifi".

### Teklifler
- Tarih, müşteri, telefon, yer, iş türü, **tahmini derinlik × metre başı fiyat**, ek kalem (ör. pompa + montaj), KDV (dahil / hariç / yok), geçerlilik süresi, koordinat, şartlar.
- Form altında toplam anlık hesaplanır.
- **Kabul → kuyu:** teklif tek tıkla kuyu dosyasına dönüşür; teklif toplamı anlaşma bedeli olur.
- Reddet, Yazdır, WhatsApp/PDF, Düzenle, Sil. Durum filtresi: bekleyen / kabul / red.

### İşler
Kuyu seçerek tüm teknik alanlarla iş günü girişi; "Kopyala" ile önceki günden yeni gün. Kaydedince otomatik olarak:
- makine/kompresör **yakıt gideri** (bidon × litre × mazot fiyatı),
- personel **hak edişi** (metre bazlı, bkz. §4.3),
- **stok düşümü** (boru metresi, bkz. §4.5)

oluşur. Bir gün düzenlenir veya silinirse aynı kuyunun diğer günleri de yeniden hesaplanır.

### Gelir / Gider
Tür, kategori, tutar, KDV, ödeme (Nakit / Havale / Çek / Alacak / Borç), kuyu bağlantısı, defter (resmi/gayriresmi), "Gayriresmiye aktar (₺)", vade. Otomatik kayıtlar "oto" etiketlidir.

### Alacak / Borç
Açık ve kapanmış alacak/borçlar, kısmi tahsilat/ödeme (nakit veya havale), vade takibi.

### Personel
- Kişi başına yalnızca **metre başı ücret (₺/m)** girilir.
- **Personel cari hesap:** toplam hak ediş, ödenen, bakiye (Ödenecek / Avans / Kapalı).
- **Ödeme / avans girişi:** tarih, personel, tutar, yöntem (Nakit / Havale / PTT), tür (Ödeme / Avans), açıklama.
- **Ekstre** ve **WhatsApp/PDF** paylaşımı.
- **Gider olarak girilmiş personel ödemeleri** paneli: eski "Ramazan (eleman)" türü kayıtları **Ödemeye dönüştür** (tek tek ya da "Eşleşenlerin tümünü dönüştür").
- Dönem hak ediş dökümü: kuyu toplam boru, o gün eklenen metre, ₺/m, hak ediş; CSV.

### Makineler
Makine/kompresör kartları (bidon litresi + mazot fiyatı). Bakım/arıza kayıtları (maliyet girilirse gider oluşur); iş notlarındaki arıza kelimeleri listede görünür.

### Stok
- Kalem, birim (m / adet / bidon / kg / litre / paket), kritik seviye, açılış miktarı, başlangıç tarihi, not.
- **Otomatik düşüm:** "İnkişaf borusu metresi" veya "Ağız borusu metresi" seçilen kalem, başlangıç tarihinden sonraki her iş gününde o gün eklenen boru metresi kadar azalır.
- Giriş / Çıkış düğmeleri, hareket listesi (kalem ve dönem filtresi), kritik seviyede üst bant uyarısı, eksi stok uyarısı.

### Raporlar
İş günü bazlı, kuyu bazlı kârlılık (metre başı maliyet), gün bazlı, ay bazlı, tarih aralığı özeti, gider kalemleri (kategori ara toplamlı), personel hak ediş (eklenen boru metresi ve ₺/m ile), kasa/banka hareketleri (açılış + yürüyen bakiye). Her rapor CSV, Excel (.xlsx) ve yazdırma.

### Arşiv
- **Arşivle ve yeni döneme geç:** dönemi kapatır. İş günleri, gelir/gider, tahsilat ve ödemeler, personel ödemeleri, bakım ve stok hareketleri arşive taşınır ve sıfırlanır. **Personel, makineler, stok kalemleri, kategoriler ve firma ayarları olduğu gibi kalır.**
- Arşivleme penceresinde **devredilecekler** seçilir (hepsi varsayılan olarak açık):
  - Kasa ve banka kapanış bakiyesi yeni dönemin açılış bakiyesi olur.
  - Açık alacak ve borçlar kalan tutarıyla "Devir (dönem adı)" açıklamasıyla yeni döneme aktarılır.
  - Tamamlanmamış veya açık alacağı olan kuyular devredilir; derinlik, tahsilat geçmişi ve tamamlandı durumu korunur (kuyu kartında "devir" rozeti çıkar).
  - Bekleyen teklifler devredilir.
  - Stok bakiyeleri "Devir" girişi olarak yeni döneme aktarılır.
  - Dönemin tam JSON yedeği (fotoğraflar dahil) indirilir.
  - Tek sayfalık dönem özeti PDF'i oluşturulur.
- **Arşivlenmiş dönem kartları:** Ayrıntılar (tam döküm), PDF raporu, Yazdır, JSON indir, Sil.
- Arşiv kayıtlarında kuyu fotoğrafları saklanmaz (depolama sınırı); tam kopya için arşivleme sırasında inen JSON yedeği kullanılır.

### Ayarlar
**Arşivle ve sıfırla (yeni dönem)** düğmesi buradan da çalışır. Ayrıca: telefona uygulama olarak kurma; firma bilgileri (rapor/teklif/fatura başlığı); KDV oranı; kasa/banka açılış bakiyesi; otomatik yakıt gideri ve otomatik personel hak edişi anahtarları; tüm verileri Excel'e aktarma (teklif, stok, stok hareketleri ve personel ödemeleri sayfaları dahil); **Hareket listesi içe aktar (ekler)**; bulut yapılandırması; JSON yedek al / geri yükle. 7 günden eski yedekte uyarı.

---

## 4. İş kuralları

### 4.1 Resmi / gayriresmi defter
Tür kuyu dosyasında belirlenir. Gelir kaydındaki "Gayriresmiye aktar (₺)" ile resmi gelirin bir kısmı gayriresmi deftere aktarılır. Özet ve raporlar bu ayrıma göre kırılım verir.

### 4.2 Kalan tahsilat
- Kuyuya bağlı gelirlerde **Nakit/Havale** kaydın tutarı tahsil edilmiş sayılır; **Alacak** kaydında yalnızca girilen tahsilatlar sayılır.
- Anlaşma bedeli varsa: **kalan = anlaşma − tahsil edilen**. Yoksa: kalan = açık alacak.
- Parça ödeme için kuyu sayfasındaki **Tahsilat gir** kullanılır: açık alacak varsa ona işlenir, yoksa "Kısmi tahsilat" gelir kaydı açılır.
- Gelir kaydında **kuyu seçilmezse** ödeme hiçbir kuyunun bakiyesine düşmez.

### 4.3 Personel hak edişi (metre bazlı)
- **Hak ediş = o gün eklenen inkişaf boru metresi × kişinin metre ücreti.** İş gününde seçili her personel için ayrı kayıt açılır.
- İş formunda inkişaf boru metrajı kuyunun o güne kadarki **toplam** boyu olarak girilir. Bu yüzden **eklenen metre = o günkü metraj − aynı kuyunun önceki günlerdeki en yüksek boru metrajı** (ilk gün tamamı). Örnek: Sakarkaya 01.09'da 108 m, 03.09'da 119 m → ikinci gün 11 m ödenir.
- Boru metrajı girilmeyen günlerde ödeme çıkmaz. Metre ücreti değişince geçmiş kayıtların yeniden hesaplanması sorulur.
- İş formunda kaydetmeden önce "(X m eklenen boru)" önizlemesi görünür.

### 4.4 Personel cari hesabı ve kasa
- Hak ediş **tahakkuk** olarak kaydedilir: gider tablosunda görünür ama **kasadan/bankadan düşmez**.
- Personel ödeme ve avansları kasadan (Nakit) veya bankadan (Havale/PTT) düşer, gider olarak **ikinci kez sayılmaz**.
- Bakiye = toplam hak ediş − ödenen. Pozitif: ödenecek; negatif: avans/fazla ödeme.

### 4.5 Stok düşümü
Otomatik düşümlü kalem, başlangıç tarihinden sonraki iş günlerinde, ilgili borunun (inkişaf veya ağız) **eklenen metresi** kadar azalır. İş günü silinir veya değiştirilirse düşüm otomatik güncellenir. Aynı boru tipine birden fazla kalem bağlanırsa hepsinden düşülür.

### 4.6 Kasa / banka
Nakit ve havale hareketleri ayrı izlenir; açılış bakiyesi Ayarlar'dan girilir. Alacak tahsilatları ve borç ödemeleri seçilen yönteme göre kasaya/bankaya yansır.

### 4.7 Paylaşım (WhatsApp / PDF)
Teklif, müşteri ekstresi, iş raporu ve personel ekstresi PDF olarak üretilir.
- **Telefonda:** paylaşım menüsü açılır, PDF doğrudan WhatsApp'a gönderilir.
- **Bilgisayarda:** PDF iner ve kişinin numarasıyla WhatsApp sohbeti açılır; dosya sohbete eklenir.
- Müşteri ekstresi aynı müşteri adındaki **tüm kuyuları** birlikte gösterir: iş özeti, borç/ödeme hareketleri, yürüyen bakiye, kalan borç.

### 4.8 Eşitleme ve çevrimdışı çalışma
- Her kayıt önce cihaza, ~0,7 sn sonra Firebase'e yazılır. Başka cihazdan gelen daha yeni veri "Buluttan güncellendi" bildirimiyle yansır.
- İnternet yoksa üstte "çevrimdışı · cihazda kayıtlı" görünür; bağlantı gelince otomatik gönderilir.
- Çakışmada **son kaydeden kazanır**; iki cihazdan aynı anda (özellikle çevrimdışıyken) düzenleme yapılmamalı.

### 4.9 Toplu içe aktarma
Ayarlar → **Hareket listesi içe aktar (ekler)** — JSON dizisi `[{tarih, tur, kat, tutar, not, odeme, defter, kuyu}]`. Mevcut verileri silmez, sadece ekler; aynı dosya ikinci kez yüklenirse tekrar eklemez. Eksik kategoriler otomatik açılır; `kuyu` alanı kuyu adıyla eşleşirse kayıt o kuyuya bağlanır.

---

## 5. Veri yapısı (özet)

Kullanıcı verisi Firebase'de `users/<uid>` altında, cihazda `localStorage: sondaj_takip_v2` anahtarında tutulur.

| Alan | İçerik |
|---|---|
| `kuyular` | yer, müşteri, tel, tür, anlaşma, koordinat, teslim, tutanak, not, fotoğraflar, `teknik{statik, dinamik, debi, pderin, pmarka, pguc, garanti, tnot}` |
| `isler` | tarih, kuyu, ağız/inkişaf delgi ve boru (çap, metre), saatler, makine/kompresör, bidon, personel, not |
| `fin` | gelir/gider hareketleri; otomatik kayıtlarda `oto`, `isId`, `perId`; hak edişte `odeme: "Tahakkuk"` |
| `personel` | ad, görev, telefon, `yevmiye` (= metre başı ücret) |
| `perOdeme` | personel ödeme/avansları: tarih, personel, tutar, yöntem, tür, not |
| `makineler`, `bakim` | makine kartları ve bakım kayıtları |
| `teklifler` | tarih, müşteri, tel, yer, tür, derinlik, mFiyat, ek kalem, KDV, geçerlilik, koordinat, not, durum, kuyuId |
| `stok`, `stokHar` | stok kalemleri ve hareketleri (otomatik düşümlerde `oto`, `isId`) |
| `arsiv` | kapatılmış dönemler: `ad`, `tarih`, `bas`, `bit`, `ozet` (dönem özeti) ve `veri` (o dönemin kayıtları, fotoğrafsız) |
| `kat`, `ayar` | kategori listeleri ve ayarlar (`donem`, `donemBas` açık dönemi tutar) |

Devredilen kuyularda `devir` alanı bulunur: `{donem, metraj, tahsil, inbm, agbm, gun, gider, tamam, tarih}`. Derinlik, tahsilat ve metre bazlı hak ediş hesapları bu tabanı kullanır.

Eski sürüm verileri açılışta otomatik dönüştürülür (v1 → v2; eski hak edişler "Tahakkuk"a çevrilir; tüm personel metre bazlı olur).

---

## 6. Sürüm geçmişi

### v1 — İlk sürüm
Kağıt sondaj çizelgesinden (Eylül 2026) türetilen tablo yapısı: tarih, yer, müşteri, ağız borusu, inkişaf, iş saatleri, makine/kompresör ve bidon, arıza notları, personel. Çizelgedeki 7 iş günü örnek veri olarak yüklenir.

### v2 — Kapsamlı yeniden yapım + bulut
Kuyu dosyaları, gelir/gider, alacak/borç, personel, makineler, 8 rapor türü, Excel dışa aktarım, müşteri raporu ve fatura görünümü, otomatik yakıt/yevmiye gideri, resmi/gayriresmi defter, kasa/banka takibi. Firebase Auth + Realtime Database eşitlemesi, GitHub Pages yayını.

### Güncelleme — Defterden gider aktarımı
- **Hareket listesi içe aktar (ekler)** özelliği.
- Eylül 2026 defteri: 49 gider, 811.900 ₺.
- Mayıs–Ağustos 2026 defteri: 167 gider, 1.475.250 ₺ (Mayıs toplamı defterdeki 100.500 ₺ ile birebir tutuyor).
- Yeni kategoriler: Kredi/borç ödemesi, Hediye/ikram, Hayvan/adak, Ekipman/demirbaş.

### Güncelleme — Parça tahsilat düzeltmesi
Kalan tahsilat artık fiilen alınan paraya göre hesaplanıyor; kuyu sayfasına **Tahsilat gir** eklendi; kuyu kartı, özet, kuyu raporu ve müşteri raporu aynı mantığa geçti.

### Güncelleme — Metre bazlı personel ücreti
Günlük yevmiye kaldırıldı; hak ediş = eklenen inkişaf boru metresi × metre ücreti. Hak ediş dökümü, rapor ve Excel sütunları buna göre yenilendi.

### v4 — Dönem arşivi
- **Arşiv** sekmesi ve **Arşivle ve sıfırla** akışı; seçilebilir devir kalemleri.
- Tek sayfalık (A4 yatay) dönem özeti PDF'i: iş günü, derinlik, gelir/gider/net, nakit akışı ve kapanış bakiyesi, defter kırılımı, gider kategorileri, personel ve kuyu tablosu.
- Arşivlenmiş dönemlerin uygulama içinden incelenmesi, yazdırılması ve JSON olarak indirilmesi.
- Excel çıktısına "Arşiv dönemleri" sayfası eklendi.

### v3 — Saha ve operasyon
- Boru ve malzeme **stoğu** (otomatik düşüm, kritik uyarı).
- **Kuyu teknik föyü** (müşteri raporunda da).
- **Teklif modülü** (kabul → kuyu dosyası).
- **Kuyu haritası** ve "konumumu al".
- **Telefona uygulama (PWA)** ve çevrimdışı çalışma.
- **Personel cari hesabı** (tahakkuk, ödeme/avans, ekstre, gider kaydını ödemeye dönüştürme).
- **Müşteri cari ekstresi** ve teklif/rapor/ekstreler için **WhatsApp/PDF paylaşımı**.

---

## 6.1 Dönem kapatma sırası (önerilen)

1. Açık alacak/borçlara son tahsilat ve ödemeleri gir.
2. Stok sayımını yap, farkları Stok sekmesinden giriş/çıkış olarak işle.
3. Raporlar → Tarih aralığı özeti ile dönemi gözden geçir.
4. Arşiv → **Arşivle ve yeni döneme geç**: dönem adını yaz, devredilecekleri seç, onayla.
5. İnen JSON yedeğini ve PDF özetini güvenli bir yere (ör. Drive) kopyala.

---

## 7. Yapılacaklar ve kontrol listesi

**Yayın:** v3 dosyaları (`index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`) GitHub'a yüklenmeli; otomatik yükleme tamamlanamadı. Add file → Upload files ile beşi birlikte yüklenip commit edilmeli.

**İlk açılışta:**
1. Personel sekmesinde Ramazan ve İsmail için metre ücreti gir; geçmiş kayıtları yeniden hesaplat.
2. Personel sekmesindeki "Gider olarak girilmiş personel ödemeleri" panelinden eski eleman ödemelerini **Ödemeye dönüştür**.
3. Stok sekmesinde 140 mm / 225 mm boru kalemlerini açılış miktarı ve başlangıç tarihiyle oluştur.
4. Gider JSON dosyaları henüz yüklenmediyse Ayarlar → Hareket listesi içe aktar.
5. Örnek kuyudaki "Karabayat" adını **Karahayıt** olarak düzelt.

**Defterde okunamayan / kontrol edilecek kalemler** (açıklamalarında "okunamadı" yazar):
- 03.09 Ramazan Dayı kredi 80.000 + 80.000 → tek kayıt 160.000
- 04.09 "… Yemi Lamel" 1.500 (Yumurta / yem olarak girildi)
- 19.09 Canlı hayvan (tavşan?) 800
- 11.05 Hisarcık yemler + … 2.500
- 09.07 "… (öğleye – Serkan)" 11.000 ve "Ali Sarı (Ç4?) muhtar" 1.250
- 01.08 İzmir, Durukan'dan iki kalem (7.500 ve 6.500); 03.08 "İzmir … kiralık" 8.400
- 12.08 "Baha …" 1.500
- 19.08 "Hidro motor … (5-6)" 43.000
- 26.08 "… çimento depo" 12.000
- Son sayfadaki tarihsiz "Depo inşaat malzemesi 7.000" ve "Kepçe 4.000" → 31.08'e yazıldı

---

## 8. Sorun giderme

- **"E-posta veya şifre hatalı"** → hesap henüz yoksa önce **Hesap oluştur**.
- **"permission-denied"** → veritabanı kuralları yayınlanmamış veya giriş yapılmamış.
- **"auth/unauthorized-domain"** → `peksenemrah.github.io` yetkili alan adlarına eklenmeli.
- **Yeni özellikler görünmüyor** → sayfayı yenile; PWA kuruluysa uygulamayı kapatıp yeniden aç (yeni sürüm arka planda iner).
- **Harita açılmıyor / PDF oluşmuyor** → ilgili kütüphaneler internetle yüklenir; bir kez internetliyken açınca önbelleğe alınır. PDF üretilemezse yazdırma penceresi açılır ("PDF olarak kaydet").
- **Depolama dolu** → kuyu fotoğraflarını azalt, JSON yedek alıp temizle.
