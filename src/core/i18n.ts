/**
 * UI string dictionary for the language toggle (Profile → Language).
 * Car data (names, specs, descriptions) stays as-is; locations/companies
 * already carry their own nameAr in the data layer.
 */

const en = {
  // Bottom navigation
  "nav.home": "Home",
  "nav.explore": "Explore",
  "nav.bookings": "Bookings",
  "nav.favorites": "Favorites",
  "nav.profile": "Profile",

  // Shared
  "common.limitedEdition": "Limited Edition",
  "common.topSpeed": "Top Speed",
  "common.perDay": "/ DAY",
  "common.back": "Back",

  // Home / showcase
  "home.moreDetail": "More Detail",
  "home.tourCar": "Tour Car",
  "showcase.book": "Book",

  // Explore
  "explore.searchPlaceholder": "Search vehicles, brand, model...",
  "explore.nightlifeBanner": "Cairo & Giza Nightlife — cafés, late-night spots",
  "explore.noMatches": "No matches.",
  "filter.All": "All",
  "filter.Supercar": "Supercar",
  "filter.SUV": "SUV",
  "filter.Luxury": "Luxury",
  "filter.Electric": "Electric",
  "filter.Sports": "Sports",
  "filter.Van": "Van",
  "filter.7 Seats": "7 Seats",
  "filter.Economy": "Economy",
  "filter.Compact": "Compact",
  "filter.Mini": "Mini",

  // Car detail
  "detail.engine": "Engine",
  "detail.drivetrain": "Drivetrain",
  "detail.acceleration": "0-100 Km/h",
  "detail.tour": "Tour",
  "detail.open": "Open",
  "detail.bookNow": "Book Now",

  // Tour
  "tour.rotate": "Rotate 360°",

  // Booking flow
  "booking.title": "Booking",
  "booking.step": "Step {n}",
  "booking.stepDates": "Dates",
  "booking.stepPickup": "Pickup",
  "booking.stepDelivery": "Delivery",
  "booking.stepRenter": "Renter",
  "booking.stepSummary": "Summary",
  "booking.pickupDate": "Pickup date",
  "booking.returnDate": "Return date",
  "booking.daysBig": "{n} DAYS",
  "booking.conflict":
    "You already have a booking for {car} on these dates. Pick a different range to continue.",
  "booking.pickupLocation": "Pickup location",
  "booking.returnLocation": "Return location",
  "booking.delivery": "Delivery",
  "booking.pickupOnly": "Pickup only",
  "booking.deliver": "Deliver",
  "booking.deliveryAddress": "Delivery address",
  "booking.deliveryPlaceholder": "Building, street, area",
  "booking.deliveryUnavailable": "Delivery is not available in {city}. Pickup only.",
  "booking.fullName": "Full name",
  "booking.phone": "Phone",
  "booking.email": "Email",
  "booking.priceBreakdown": "Price breakdown",
  "booking.duration": "Duration",
  "booking.durationDays": "{n} days",
  "booking.baseRate": "Base rate",
  "booking.serviceFee": "Service fee",
  "booking.discount": "Discount",
  "booking.depositHold": "Deposit hold",
  "booking.total": "Total",
  "booking.continue": "Continue",
  "booking.confirm": "Confirm Booking",
  "booking.confirmed": "Confirmed",
  "booking.ready": "You're Ready",
  "booking.reserved": "{car} reserved",
  "booking.yourCar": "Your car",
  "booking.viewBooking": "View Booking",
  "booking.backHome": "Back Home",

  // Favorites
  "fav.title": "Favorites",
  "fav.sub": "Your saved dream machines",
  "fav.empty": "No favorites yet.",

  // Bookings list
  "bookings.title": "My Bookings",
  "bookings.sub": "Your drives, your journey",
  "bookings.upcoming": "Upcoming",
  "bookings.past": "Past",
  "bookings.pickup": "Pickup",
  "bookings.dates": "Dates",
  "bookings.reference": "Booking reference",
  "bookings.viewDetails": "View Details →",
  "bookings.emptyUpcoming": "No upcoming trips yet.",
  "bookings.emptyPast": "No past trips yet.",

  // Trip Concierge
  "concierge.action": "Trip Plan →",
  "concierge.title": "Trip Concierge",
  "concierge.intro": "A day-by-day driving plan for your rental, built for Egypt's roads.",
  "concierge.destination": "Destination",
  "concierge.generate": "Generate Itinerary",
  "concierge.generating": "...",
  "concierge.day": "Day {n}",
  "concierge.tips": "Road Tips",
  "concierge.error": "Couldn't build the itinerary. Please try again.",

  "status.upcoming": "UPCOMING",
  "status.active": "ACTIVE",
  "status.completed": "COMPLETED",
  "status.cancelled": "CANCELLED",

  // Profile
  "profile.title": "Profile",
  "profile.personalInfo": "Personal Info",
  "profile.paymentMethods": "Payment Methods",
  "profile.savedCount": "{n} saved",
  "profile.notifications": "Notifications",
  "profile.language": "Language",
  "profile.help": "Help",
  "profile.logout": "Log Out",
  "profile.openShowcase": "Open Showcase",
  "profile.city": "City",
  "profile.saveChanges": "Save Changes",
  "profile.cardBrand": "Card brand",
  "profile.last4": "Last 4 digits",
  "profile.addCard": "Add Card",
  "profile.noPayment": "No payment methods saved.",
  "profile.removeCard": "Remove {brand} ending {last4}",
  "profile.bookingUpdates": "Booking Updates",
  "profile.priceAlerts": "Price Alerts",
  "profile.promotions": "Promotions",
  "profile.on": "On",
  "profile.off": "Off",
  "profile.helpSheet": "Help & Support",
  "profile.helpText":
    "Need help with a booking, delivery, or your account? Al Omda Office support is here every day, 9am–11pm Cairo time.",
  "profile.callSupport": "Call Support",
  "profile.whatsapp": "WhatsApp Us",

  // Auth
  "auth.signIn": "Sign In",
  "auth.signUp": "Create Account",
  "auth.password": "Password",
  "auth.continueGoogle": "Continue with Google",
  "auth.continueApple": "Continue with Apple",
  "auth.or": "or continue with",
  "auth.error.invalidCredentials": "Incorrect email or password.",
  "auth.error.emailInUse": "This email is already registered.",
  "auth.error.weakPassword": "Password is too weak — use at least 6 characters.",
  "auth.error.missingFields": "Please fill in all fields.",
  "auth.error.confirmEmail": "Account created. Confirm the link we emailed you, then sign in.",
  "auth.error.emailNotConfirmed": "Confirm the link we emailed you, then sign in.",
  "auth.error.invalidEmail": "Enter a valid email address.",
  "auth.error.generic": "Something went wrong. Please try again.",

  // Location
  "location.title": "Select City",
  "location.sub": "Al Omda Office · Egypt",
  "location.close": "CLOSE",

  // Onboarding
  "onboarding.kicker1": "RENT THE",
  "onboarding.title1": "EXTRAORDINARY",
  "onboarding.body1": "Premium car rental experiences crafted for Egypt.",
  "onboarding.kicker2": "DRIVE",
  "onboarding.title2": "EGYPT",
  "onboarding.body2": "Cairo · Giza · Alexandria · North Coast · Luxor · Aswan.",
  "onboarding.kicker3": "AL OMDA",
  "onboarding.title3": "FLEET",
  "onboarding.body3": "Curated presence vehicles. Book in minutes.",
  "onboarding.continue": "Continue",
  "onboarding.getStarted": "Get Started",

  // Splash
  "splash.tag": "DRIVE BEYOND ORDINARY",

  // Nightlife
  "nightlife.title": "Cairo & Giza Nightlife",
  "nightlife.sub":
    "Curated coffee, cafés, and late-night spots — a work-in-progress list, not a full directory. Details sourced from Waffarha merchant listings.",
  "nightlife.cafes": "Coffee & Cafés",
  "nightlife.lounges": "Late-Night & Lounges",
  "nightlife.open24h": "24 Hours",
  "nightlife.lateNight": "Late Night",
  "nightlife.source": "Source: {source}",
};

export type StringKey = keyof typeof en;
export type Language = "en" | "ar";

const ar: Record<StringKey, string> = {
  "nav.home": "الرئيسية",
  "nav.explore": "استكشف",
  "nav.bookings": "حجوزاتي",
  "nav.favorites": "المفضلة",
  "nav.profile": "حسابي",

  "common.limitedEdition": "إصدار محدود",
  "common.topSpeed": "السرعة القصوى",
  "common.perDay": "/ يوم",
  "common.back": "رجوع",

  "home.moreDetail": "تفاصيل أكثر",
  "home.tourCar": "جولة بالسيارة",
  "showcase.book": "احجز",

  "explore.searchPlaceholder": "ابحث عن سيارة أو ماركة أو موديل...",
  "explore.nightlifeBanner": "سهرات القاهرة والجيزة — كافيهات وأماكن سهر",
  "explore.noMatches": "لا توجد نتائج.",
  "filter.All": "الكل",
  "filter.Supercar": "سوبر كار",
  "filter.SUV": "دفع رباعي",
  "filter.Luxury": "فاخرة",
  "filter.Electric": "كهربائية",
  "filter.Sports": "رياضية",
  "filter.Van": "فان",
  "filter.7 Seats": "٧ مقاعد",
  "filter.Economy": "اقتصادية",
  "filter.Compact": "مدمجة",
  "filter.Mini": "ميني",

  "detail.engine": "المحرك",
  "detail.drivetrain": "نظام الدفع",
  "detail.acceleration": "٠-١٠٠ كم/س",
  "detail.tour": "جولة",
  "detail.open": "افتح",
  "detail.bookNow": "احجز الآن",

  "tour.rotate": "دوران ٣٦٠°",

  "booking.title": "الحجز",
  "booking.step": "الخطوة {n}",
  "booking.stepDates": "التواريخ",
  "booking.stepPickup": "الاستلام",
  "booking.stepDelivery": "التوصيل",
  "booking.stepRenter": "المستأجر",
  "booking.stepSummary": "الملخص",
  "booking.pickupDate": "تاريخ الاستلام",
  "booking.returnDate": "تاريخ الإرجاع",
  "booking.daysBig": "{n} يوم",
  "booking.conflict":
    "لديك حجز بالفعل لسيارة {car} في هذه التواريخ. اختر تواريخ أخرى للمتابعة.",
  "booking.pickupLocation": "مكان الاستلام",
  "booking.returnLocation": "مكان الإرجاع",
  "booking.delivery": "التوصيل",
  "booking.pickupOnly": "استلام فقط",
  "booking.deliver": "توصيل",
  "booking.deliveryAddress": "عنوان التوصيل",
  "booking.deliveryPlaceholder": "المبنى، الشارع، المنطقة",
  "booking.deliveryUnavailable": "التوصيل غير متاح في {city}. الاستلام فقط.",
  "booking.fullName": "الاسم بالكامل",
  "booking.phone": "رقم الهاتف",
  "booking.email": "البريد الإلكتروني",
  "booking.priceBreakdown": "تفاصيل السعر",
  "booking.duration": "المدة",
  "booking.durationDays": "{n} أيام",
  "booking.baseRate": "السعر الأساسي",
  "booking.serviceFee": "رسوم الخدمة",
  "booking.discount": "الخصم",
  "booking.depositHold": "مبلغ التأمين",
  "booking.total": "الإجمالي",
  "booking.continue": "متابعة",
  "booking.confirm": "تأكيد الحجز",
  "booking.confirmed": "تم التأكيد",
  "booking.ready": "كل شيء جاهز",
  "booking.reserved": "تم حجز {car}",
  "booking.yourCar": "سيارتك",
  "booking.viewBooking": "عرض الحجز",
  "booking.backHome": "العودة للرئيسية",

  "fav.title": "المفضلة",
  "fav.sub": "سياراتك المحفوظة",
  "fav.empty": "لا توجد مفضلات بعد.",

  "bookings.title": "حجوزاتي",
  "bookings.sub": "رحلاتك ومشاويرك",
  "bookings.upcoming": "القادمة",
  "bookings.past": "السابقة",
  "bookings.pickup": "الاستلام",
  "bookings.dates": "التواريخ",
  "bookings.reference": "رقم الحجز",
  "bookings.viewDetails": "عرض التفاصيل ←",
  "bookings.emptyUpcoming": "لا توجد رحلات قادمة بعد.",
  "bookings.emptyPast": "لا توجد رحلات سابقة بعد.",

  "concierge.action": "خطة الرحلة ←",
  "concierge.title": "مرشد الرحلة",
  "concierge.intro": "خطة قيادة يومًا بيوم لسيارتك المستأجرة، مصممة لطرق مصر.",
  "concierge.destination": "الوجهة",
  "concierge.generate": "إنشاء خطة الرحلة",
  "concierge.generating": "...",
  "concierge.day": "اليوم {n}",
  "concierge.tips": "نصائح الطريق",
  "concierge.error": "تعذّر إنشاء خطة الرحلة. حاول مرة أخرى.",

  "status.upcoming": "قادم",
  "status.active": "جارٍ",
  "status.completed": "مكتمل",
  "status.cancelled": "ملغي",

  "profile.title": "حسابي",
  "profile.personalInfo": "البيانات الشخصية",
  "profile.paymentMethods": "طرق الدفع",
  "profile.savedCount": "{n} محفوظة",
  "profile.notifications": "الإشعارات",
  "profile.language": "اللغة",
  "profile.help": "المساعدة",
  "profile.logout": "تسجيل الخروج",
  "profile.openShowcase": "افتح المعرض",
  "profile.city": "المدينة",
  "profile.saveChanges": "حفظ التغييرات",
  "profile.cardBrand": "نوع البطاقة",
  "profile.last4": "آخر ٤ أرقام",
  "profile.addCard": "إضافة بطاقة",
  "profile.noPayment": "لا توجد طرق دفع محفوظة.",
  "profile.removeCard": "إزالة {brand} المنتهية بـ {last4}",
  "profile.bookingUpdates": "تحديثات الحجز",
  "profile.priceAlerts": "تنبيهات الأسعار",
  "profile.promotions": "العروض",
  "profile.on": "تشغيل",
  "profile.off": "إيقاف",
  "profile.helpSheet": "المساعدة والدعم",
  "profile.helpText":
    "تحتاج مساعدة في حجز أو توصيل أو حسابك؟ دعم مكتب العمدة متاح يوميًا من ٩ صباحًا حتى ١١ مساءً بتوقيت القاهرة.",
  "profile.callSupport": "اتصل بالدعم",
  "profile.whatsapp": "راسلنا واتساب",

  "auth.signIn": "تسجيل الدخول",
  "auth.signUp": "إنشاء حساب",
  "auth.password": "كلمة المرور",
  "auth.continueGoogle": "المتابعة عبر جوجل",
  "auth.continueApple": "المتابعة عبر آبل",
  "auth.or": "أو تابع باستخدام",
  "auth.error.invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth.error.emailInUse": "هذا البريد الإلكتروني مسجّل بالفعل.",
  "auth.error.weakPassword": "كلمة المرور ضعيفة — استخدم ٦ أحرف على الأقل.",
  "auth.error.missingFields": "من فضلك أكمل جميع الحقول.",
  "auth.error.confirmEmail": "تم إنشاء الحساب. أكّد الرابط الذي أرسلناه إلى بريدك ثم سجّل الدخول.",
  "auth.error.emailNotConfirmed": "أكّد الرابط الذي أرسلناه إلى بريدك ثم سجّل الدخول.",
  "auth.error.invalidEmail": "أدخل بريدًا إلكترونيًا صالحًا.",
  "auth.error.generic": "حدث خطأ ما. حاول مرة أخرى.",

  "location.title": "اختر المدينة",
  "location.sub": "مكتب العمدة · مصر",
  "location.close": "إغلاق",

  "onboarding.kicker1": "استأجر",
  "onboarding.title1": "الاستثنائي",
  "onboarding.body1": "تجارب تأجير سيارات فاخرة صُممت لمصر.",
  "onboarding.kicker2": "انطلق في",
  "onboarding.title2": "مصر",
  "onboarding.body2": "القاهرة · الجيزة · الإسكندرية · الساحل الشمالي · الأقصر · أسوان.",
  "onboarding.kicker3": "مكتب العمدة",
  "onboarding.title3": "الأسطول",
  "onboarding.body3": "سيارات مختارة بعناية. احجز في دقائق.",
  "onboarding.continue": "متابعة",
  "onboarding.getStarted": "ابدأ الآن",

  "splash.tag": "قُد أبعد من المألوف",

  "nightlife.title": "سهرات القاهرة والجيزة",
  "nightlife.sub":
    "قائمة مختارة من الكافيهات وأماكن السهر — قائمة قيد التطوير وليست دليلًا كاملًا. التفاصيل من قوائم تجار وفّرها.",
  "nightlife.cafes": "قهوة وكافيهات",
  "nightlife.lounges": "سهر ولاونجات",
  "nightlife.open24h": "٢٤ ساعة",
  "nightlife.lateNight": "سهر متأخر",
  "nightlife.source": "المصدر: {source}",
};

const DICTIONARIES: Record<Language, Record<StringKey, string>> = { en, ar };

export type Translate = (key: StringKey, vars?: Record<string, string | number>) => string;

export function makeT(language: Language): Translate {
  const dict = DICTIONARIES[language];
  return (key, vars) => {
    let text = dict[key] ?? en[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}
