export type Lang = "en" | "fr" | "ar";

export function isRtl(lang: Lang): boolean {
  return lang === "ar";
}

export const t = {
  nav: {
    home: { en: "Home", fr: "Accueil", ar: "الرئيسية" },
    contact: { en: "Contact", fr: "Contact", ar: "اتصل بنا" },
    about: { en: "About", fr: "À propos", ar: "حول" },
    addCar: { en: "Add a Car", fr: "Ajouter une voiture", ar: "أضف سيارة" },
    login: { en: "Login", fr: "Connexion", ar: "تسجيل الدخول" },
  },
  language: { en: "Language", fr: "Langue", ar: "اللغة" },
  carDetails: {
    morePhotos: { en: "More photos", fr: "Plus de photos", ar: "صور إضافية" },
    price: { en: "Price", fr: "Prix", ar: "السعر" },
    mileage: { en: "Mileage", fr: "Kilométrage", ar: "المسافة" },
    powertrain: {
      en: "Powertrain",
      fr: "Motorisation",
      ar: "مجموعة الحركة",
    },
    body: { en: "Body", fr: "الهيكل", ar: "الهيكل" },
    status: { en: "Status", fr: "État", ar: "الحالة" },
    year: { en: "Year", fr: "Année", ar: "السنة" },
    fuel: { en: "Fuel", fr: "Carburant", ar: "الوقود" },
    transmission: { en: "Transmission", fr: "Boîte", ar: "ناقل الحركة" },
    engine: { en: "Engine", fr: "Moteur", ar: "المحرك" },
    color: { en: "Color", fr: "Couleur", ar: "اللون" },
    doors: { en: "Doors", fr: "Portes", ar: "الأبواب" },
    seats: { en: "Seats", fr: "Sièges", ar: "المقاعد" },
    dzd: { en: "DZD", fr: "DZD", ar: "دج" },
    km: { en: "km", fr: "km", ar: "كم" },
  },
  home: {
    searchPlaceholder: {
      en: "Search cars…",
      fr: "Rechercher des voitures…",
      ar: "ابحث عن سيارات…",
    },
    searchButton: { en: "Search", fr: "Rechercher", ar: "بحث" },
  },
  addCar: {
    title: { en: "Add a car", fr: "Ajouter une voiture", ar: "أضف سيارة" },
    subtitle: {
      en: "Saved to your Supabase cars table (requires RLS policies for anon insert).",
      fr: "Enregistré dans la table Supabase cars (nécessite des politiques RLS pour l’insertion anonyme).",
      ar: "يتم الحفظ في جدول Supabase cars (يتطلب سياسات RLS للسماح بالإضافة للمستخدم المجهول).",
    },
    carPhoto: { en: "Car photo", fr: "Photo de la voiture", ar: "صورة السيارة" },
    coverHint: {
      en: "Main photo becomes the listing cover after save. Use Auto-fill for Gemini hints.",
      fr: "La photo principale devient la couverture après l’enregistrement. Utilisez Remplir auto pour des suggestions Gemini.",
      ar: "تُصبح الصورة الرئيسية صورة الغلاف بعد الحفظ. استخدم الملء التلقائي لاقتراحات Gemini.",
    },
    analyzing: { en: "Analyzing…", fr: "Analyse…", ar: "جارٍ التحليل…" },
    autofill: { en: "Auto-fill", fr: "Remplir auto", ar: "ملء تلقائي" },
    additionalPhotos: {
      en: "Add additional photos",
      fr: "Ajouter des photos supplémentaires",
      ar: "إضافة صور أخرى",
    },
    additionalHint: {
      en: "Optional — shown on the car detail page after save.",
      fr: "Optionnel — affiché sur la page détails après l’enregistrement.",
      ar: "اختياري — يظهر في صفحة التفاصيل بعد الحفظ.",
    },
    location: {
      en: "Location (optional)",
      fr: "Lieu (optionnel)",
      ar: "الموقع (اختياري)",
    },
    notes: { en: "Notes (optional)", fr: "Notes (optionnel)", ar: "ملاحظات (اختياري)" },
    name: { en: "Name", fr: "Nom", ar: "الاسم" },
    status: { en: "Status", fr: "État", ar: "الحالة" },
    color: { en: "Color", fr: "Couleur", ar: "اللون" },
    price: { en: "Price (DZD)", fr: "Prix (DZD)", ar: "السعر (دج)" },
    mileage: { en: "Mileage (km)", fr: "Kilométrage (km)", ar: "المسافة (كم)" },
    year: { en: "Year", fr: "Année", ar: "السنة" },
    fuel: { en: "Fuel", fr: "Carburant", ar: "الوقود" },
    transmission: { en: "Transmission", fr: "Boîte", ar: "ناقل الحركة" },
    engine: { en: "Engine", fr: "Moteur", ar: "المحرك" },
    doors: { en: "Doors", fr: "Portes", ar: "الأبواب" },
    seats: { en: "Seats", fr: "Sièges", ar: "المقاعد" },
    clear: { en: "Clear", fr: "Effacer", ar: "مسح" },
    add: { en: "Add car", fr: "Ajouter", ar: "إضافة" },
    saving: { en: "Saving…", fr: "Enregistrement…", ar: "جارٍ الحفظ…" },
  },
} as const;

