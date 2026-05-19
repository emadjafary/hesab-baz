# راهنمای دیپلوی روی Netlify

این پروژه برای دیپلوی روی Netlify کاملاً آماده است. فقط مراحل زیر را دنبال کن.

## پیش‌نیاز

- یک حساب رایگان Netlify: https://app.netlify.com/signup
- یک حساب GitHub/GitLab (راحت‌ترین روش)

---

## روش ۱ — دیپلوی از طریق GitHub (پیشنهادی)

### قدم ۱: push به GitHub

```bash
cd hesab-baz
git init
git add .
git commit -m "Initial commit"
git branch -M main

# روی github.com یه repo جدید بساز (مثلا hesab-baz)، بعد:
git remote add origin https://github.com/YOUR_USERNAME/hesab-baz.git
git push -u origin main
```

### قدم ۲: اتصال به Netlify

1. به https://app.netlify.com/start برو
2. **"Import from Git"** → **GitHub** را انتخاب کن
3. اجازه دسترسی به repo را بده
4. repo `hesab-baz` را انتخاب کن
5. تنظیمات build به صورت خودکار از `netlify.toml` خوانده می‌شود — فقط روی **Deploy** کلیک کن

### قدم ۳: تنظیم متغیرهای محیطی (اختیاری، برای قیمت زنده)

در داشبورد Netlify:
**Site settings → Environment variables → Add a variable**

یکی از این دو را اضافه کن:
- `BRSAPI_KEY` = کلید BrsAPI تو
- یا `NAVASAN_KEY` = کلید Navasan تو

بعد از اضافه کردن، یه **redeploy** بزن: **Deploys → Trigger deploy → Deploy site**

اگه هیچ‌کدوم را ست نکنی، اپ با داده‌های mock کار می‌کنه (همه چیز دیده می‌شه، فقط قیمت‌ها واقعی نیستن).

---

## روش ۲ — دیپلوی مستقیم با Netlify CLI

```bash
# نصب CLI
npm install -g netlify-cli

# login
netlify login

# داخل پوشه پروژه
cd hesab-baz
netlify init           # سایت جدید رو می‌سازه و به repo وصلش می‌کنه
netlify deploy --prod  # build و deploy
```

---

## نکات مهم

### ⚠️ مصرف Function Invocation

API route `/api/prices` روی Netlify به‌صورت **Serverless Function** اجرا می‌شه. هوک ما هر ۶۰ ثانیه قیمت‌ها رو refresh می‌کنه، یعنی:

- **هر کاربر فعال** = ۶۰ invocation در ساعت = ۱۴۴۰ در روز
- پلن رایگان Netlify: **۱۲۵ هزار invocation در ماه**
- یعنی ~۸۶ کاربر فعال در ماه (در پلن رایگان)

اگه ترافیک بیشتری انتظار داری، یا interval رو در `useAssets.ts` بزرگ‌تر کن:
```ts
const AUTO_REFRESH_MS = 300_000  // ۵ دقیقه به جای ۱ دقیقه
```
یا به پلن Pro برو ($19/ماه = ۲ میلیون invocation).

### 🌍 محدودیت دسترسی به منابع قیمت

سرورهای Netlify خارج از ایران هستن (US/Europe). این یعنی:
- ✅ دسترسی به Navasan و BrsAPI معمولاً کار می‌کنه
- ⚠️ بعضی APIهای ایرانی ممکنه فقط روی IP داخلی جواب بدن
- اگه به مشکل خوردی، می‌تونی منبع قیمت رو عوض کنی یا از یه proxy استفاده کنی

### 🔄 cold start

اولین درخواست بعد از مدتی بی‌کاری ممکنه ۱-۲ ثانیه طول بکشه (cold start). درخواست‌های بعدی سریع هستن. این رفتار طبیعی Serverless هست.

### 📱 PWA و کش

UI با Tailwind و فونت Vazirmatn روی Netlify CDN کش می‌شه و خیلی سریع لود می‌شه. فقط داده‌های قیمت تازه از Function میان.

---

## بررسی deploy

بعد از deploy موفق:
1. آدرس داده‌شده توسط Netlify (مثلا `your-site.netlify.app`) رو باز کن
2. خودکار به `/dashboard/assets` ری‌دایرکت می‌شه
3. ۵ تا دارایی نمونه (seed) باید دیده بشن
4. توی Console مرورگر (F12 → Network) باید درخواست به `/api/prices?kinds=...` رو ببینی
5. هر ۶۰ ثانیه یه درخواست جدید زده می‌شه

---

## دامنه‌ی شخصی

روی **Site settings → Domain management → Add custom domain** می‌تونی دامنه‌ی خودت رو وصل کنی. Netlify SSL رایگان (Let's Encrypt) رو خودکار فعال می‌کنه.
