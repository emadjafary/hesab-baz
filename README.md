# حساب باز — صفحه «سایر دارایی‌ها»

پیاده‌سازی کامل صفحه‌ی **«سایر دارایی‌ها»** از روی طرح ارسالی، با تمام امکانات:

- مدیریت دارایی‌های متنوع: تتر، دلار، سکه (تمام/نیم/ربع/گرمی)، طلای ۱۸ و ۲۴ عیار
- **قیمت‌گیری خودکار** هر ۶۰ ثانیه از طریق `/api/prices`
- بروزرسانی دستی هر کارت یا کل دارایی‌ها
- افزودن/ویرایش/حذف با فرم اعتبارسنجی‌شده (Zod)
- ذخیره وضعیت در localStorage (پایداری بین جلسات)
- UI کاملاً RTL با فونت Vazirmatn و طراحی مطابق طرح اصلی

## راه‌اندازی

```bash
cd hesab-baz
npm install
cp .env.example .env.local   # (اختیاری) برای قیمت زنده، یکی از کلیدها را پر کنید
npm run dev
```

سپس به آدرس `http://localhost:3000` بروید (به صورت خودکار به `/dashboard/assets` ری‌دایرکت می‌شود).

> اگر هیچ کلید API ست نشود، endpoint قیمت داده‌های mock با نوسان کوچک برمی‌گرداند تا کل UI بدون نیاز به کانفیگ بیرونی کار کند.

## معماری

```
src/
├── app/
│   ├── api/prices/route.ts        # GET /api/prices?kinds=tether,full_coin
│   ├── dashboard/
│   │   ├── layout.tsx             # سایدبار + ناحیه main
│   │   └── assets/page.tsx        # صفحه ساير دارايى‌ها
│   ├── layout.tsx                 # RTL + Vazirmatn
│   └── globals.css
├── components/
│   ├── layout/Sidebar.tsx
│   └── ui/                        # Button, Input, Select, Dialog (shadcn-style minimal)
├── features/assets/
│   ├── components/
│   │   ├── AssetCard.tsx          # کارت دارایی (مطابق طرح)
│   │   ├── AssetForm.tsx          # مودال افزودن/ویرایش
│   │   ├── AssetsList.tsx         # ترکیب کننده
│   │   ├── SummaryHeader.tsx      # هدر بالای صفحه با ارزش کل
│   │   ├── ConfirmDialog.tsx
│   │   └── SeedAssetsOnce.tsx     # داده اولیه برای دموی اولیه
│   ├── hooks/useAssets.ts         # auto-refresh 60s + CRUD
│   ├── store/assetsSlice.ts       # Zustand slice
│   ├── api/pricesApi.ts           # fetch wrapper
│   ├── types.ts                   # Zod schemas + types
│   └── index.ts                   # Public API
├── lib/
│   ├── cn.ts                      # clsx + twMerge
│   └── format.ts                  # toman/persian digits/time ago
└── store/index.ts                 # root store با persist middleware
```

## نکات مهم

### قیمت‌گیری زنده
سه adapter داخل `app/api/prices/route.ts` پیاده شده:
- **BrsAPI** (پیشنهادی، دقیق‌تر برای بازار ایران)
- **Navasan** (پشتیبان)
- **Mock** (fallback خودکار)

برای افزودن منبع جدید (مثلاً TGJU API)، فقط یک adapter جدید بنویسید و در ابتدای handler اولویتش را تعیین کنید.

### auto-refresh
هوک `useAssets` با `setInterval` هر ۶۰ ثانیه `refreshAll` را صدا می‌زند. لیست `kinds` به صورت اتمیک از state گرفته می‌شود تا اگر کاربر دارایی جدید اضافه کرد، interval خود به خود آن را هم پوشش دهد.

### قیمت دستی vs آنلاین
اگر کاربر هنگام ثبت، قیمت دستی وارد کند (`manualUnitPrice`)، آن قیمت در refreshهای بعدی **بازنویسی نمی‌شود** تا اختیار کاربر حفظ شود. حذف قیمت دستی از طریق ویرایش امکان‌پذیر است.

### State Persistence
از `zustand/middleware/persist` با localStorage استفاده می‌شود. فقط فیلدهای ماندگار (`assets`, `lastGlobalRefresh`) پایدار می‌شوند؛ flagهای UI مثل `isRefreshing` در هر reload صفر می‌شوند.
