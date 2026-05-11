export type Lang = "en" | "fr" | "ar";

/** Fired on `window` when the user selects a language (`LanguageSelect`). Client pages can listen to stay in sync without a full reload. */
export const LANG_CHANGE_EVENT = "carsdz-lang";

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
    useGpsLocation: {
      en: "Use my location (GPS)",
      fr: "Utiliser ma position (GPS)",
      ar: "استخدام موقعي (GPS)",
    },
    locatingGps: {
      en: "Getting location…",
      fr: "Localisation…",
      ar: "جارٍ تحديد الموقع…",
    },
    gpsNotSupported: {
      en: "Location is not supported in this browser.",
      fr: "La géolocalisation n’est pas prise en charge.",
      ar: "المتصفح لا يدعم تحديد الموقع.",
    },
    gpsDenied: {
      en: "Location permission denied. Allow location access in your browser settings.",
      fr: "Permission de localisation refusée. Autorisez l’accès dans les paramètres du navigateur.",
      ar: "تم رفض إذن الموقع. اسمح بالوصول من إعدادات المتصفح.",
    },
    gpsUnavailable: {
      en: "Could not read your position. Try again or enter the city manually.",
      fr: "Impossible de lire votre position. Réessayez ou saisissez la ville.",
      ar: "تعذّر قراءة موقعك. أعد المحاولة أو أدخل المدينة يدويًا.",
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
  aboutPage: {
    title: { en: "About", fr: "À propos", ar: "حول" },
    body: {
      en: "Loto-dz is an Algerian page for buying and selling cars. Our goal is to make it easy to discover listings across Algeria, compare key details like price, mileage, year, fuel and transmission, and quickly reach out to the seller.\n\nYou can add a car with photos (including additional angles), browse the latest listings, and open a car page to see a full gallery and specifications. We focus on a clean, fast experience that works well on mobile and desktop.\n\nLoto-dz is built for the local market: prices in DZD, common trims and fuel types, and a simple workflow for posting and managing ads.",
      fr: "Loto-dz est une page algérienne dédiée à l’achat et à la vente de voitures. Notre objectif est de faciliter la recherche d’annonces partout en Algérie, de comparer rapidement les informations essentielles (prix, kilométrage, année, carburant, boîte) et de contacter le vendeur sans friction.\n\nVous pouvez ajouter une voiture avec des photos (y compris plusieurs angles), parcourir les dernières annonces et ouvrir une fiche pour consulter la galerie et les caractéristiques complètes. Nous privilégions une expérience simple, rapide et agréable, sur mobile comme sur ordinateur.\n\nLoto-dz est pensé pour le marché local : prix en DZD, types de carburant courants et un processus clair pour publier et gérer vos annonces.",
      ar: "Loto-dz صفحة جزائرية مخصّصة لشراء وبيع السيارات. هدفنا هو تسهيل اكتشاف الإعلانات عبر مختلف ولايات الجزائر، ومقارنة أهم التفاصيل مثل السعر، المسافة المقطوعة، السنة، نوع الوقود وناقل الحركة، ثم التواصل مع البائع بسرعة.\n\nيمكنك إضافة سيارة مع صور (بما في ذلك صور إضافية من زوايا مختلفة)، تصفّح أحدث الإعلانات، وفتح صفحة السيارة لرؤية معرض الصور والمواصفات كاملة. نركز على تجربة بسيطة وسريعة تعمل بشكل ممتاز على الهاتف والكمبيوتر.\n\nتم تصميم Loto-dz للسوق المحلي: الأسعار بالدينار الجزائري، الخيارات الشائعة، وخطوات واضحة لنشر الإعلانات وإدارتها.",
    },
  },
} as const;

