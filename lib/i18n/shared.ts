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
    signIn: { en: "Sign in", fr: "Se connecter", ar: "تسجيل الدخول" },
    logOut: { en: "Log out", fr: "Se déconnecter", ar: "تسجيل الخروج" },
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
    phone: { en: "Phone", fr: "Téléphone", ar: "الهاتف" },
    dzd: { en: "DZD", fr: "DZD", ar: "دج" },
    km: { en: "km", fr: "km", ar: "كم" },
    deleteListing: {
      en: "Delete listing",
      fr: "Supprimer l’annonce",
      ar: "حذف الإعلان",
    },
    deleteConfirm: {
      en: "Delete this listing permanently? This cannot be undone.",
      fr: "Supprimer définitivement cette annonce ? Cette action est irréversible.",
      ar: "حذف هذا الإعلان نهائيًا؟ لا يمكن التراجع عن ذلك.",
    },
    deleting: { en: "Deleting…", fr: "Suppression…", ar: "جارٍ الحذف…" },
    deleteFailed: {
      en: "Could not delete this listing.",
      fr: "Impossible de supprimer l’annonce.",
      ar: "تعذّر حذف الإعلان.",
    },
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
      en: "Signed-in users only. Listings are saved to Supabase with your account so you can remove them later (run the cars user_id migration + RLS in Supabase).",
      fr: "Réservé aux utilisateurs connectés. Les annonces sont enregistrées avec votre compte pour pouvoir les supprimer plus tard (migration user_id + RLS dans Supabase).",
      ar: "للمستخدمين المسجلين فقط. تُحفظ الإعلانات مع حسابك لتتمكن من حذفها لاحقًا (نفّذ migration user_id وRLS في Supabase).",
    },
    carPhoto: { en: "Car photo", fr: "Photo de la voiture", ar: "صورة السيارة" },
    coverHint: {
      en: "Cover after save. Auto-fill reads your photo (Gemma). Generate cover uses Gemma 4 for a prompt plus an image model for pixels — illustrative only; add a real photo when you can.",
      fr: "Couverture après enregistrement. Remplir auto analyse votre photo (Gemma). Générer la couverture : Gemma 4 pour le prompt + modèle image — indicatif seulement ; ajoutez une vraie photo si possible.",
      ar: "صورة الغلاف بعد الحفظ. الملء التلقائي يقرأ صورتك (Gemma). توليد الغلاف: Gemma 4 للوصف + نموذج صور — توضيحي فقط؛ أضف صورة حقيقية عند الإمكان.",
    },
    analyzing: { en: "Analyzing…", fr: "Analyse…", ar: "جارٍ التحليل…" },
    autofill: { en: "Auto-fill", fr: "Remplir auto", ar: "ملء تلقائي" },
    generateCoverAi: {
      en: "Generate cover (AI)",
      fr: "Générer la couverture (IA)",
      ar: "توليد صورة الغلاف (ذكاء اصطناعي)",
    },
    generatingCoverAi: {
      en: "Generating image…",
      fr: "Génération de l’image…",
      ar: "جارٍ توليد الصورة…",
    },
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
    phone: {
      en: "Phone (optional)",
      fr: "Téléphone (optionnel)",
      ar: "الهاتف (اختياري)",
    },
    clear: { en: "Clear", fr: "Effacer", ar: "مسح" },
    add: { en: "Add car", fr: "Ajouter", ar: "إضافة" },
    saving: { en: "Saving…", fr: "Enregistrement…", ar: "جارٍ الحفظ…" },
    signInRequiredTitle: {
      en: "Sign in to add a car",
      fr: "Connectez-vous pour ajouter une voiture",
      ar: "سجّل الدخول لإضافة سيارة",
    },
    signInRequiredBody: {
      en: "Posting is available once you are signed in. You can remove listings you created from the car page or the listings grid.",
      fr: "La publication est disponible une fois connecté. Vous pouvez supprimer vos annonces depuis la fiche ou la grille.",
      ar: "النشر متاح بعد تسجيل الدخول. يمكنك حذف إعلاناتك من صفحة السيارة أو من القائمة.",
    },
    goToSignIn: {
      en: "Go to sign in",
      fr: "Aller à la connexion",
      ar: "الذهاب لتسجيل الدخول",
    },
    checkingSession: {
      en: "Checking sign-in…",
      fr: "Vérification de la connexion…",
      ar: "جارٍ التحقق من الجلسة…",
    },
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

