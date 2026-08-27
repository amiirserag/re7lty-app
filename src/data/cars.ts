/**
 * Al Omda Office — re7lety demo fleet
 * Egypt locations: Cairo, Giza, Alexandria, North Coast, Luxor, Aswan
 *
 * Drop real photos/videos in public/fleet/{carId}/ — they overlay automatically.
 *
 * Identified-unit trims (Hermes media pass, Aug 2026) drive names/badges/specs.
 * Daily rates follow relative Egypt street value, not a linear % of list price.
 */

import {
  applyLocationArt,
  extraFolderIds,
  overlayCarMedia,
  readFolder,
  resolveBrandMedia,
} from "./fleetMedia";

export type CarCategory =
  | "SUV"
  | "Luxury"
  | "Van"
  | "Sports"
  | "Executive"
  | "Supercar"
  | "Electric"
  | "7 Seats"
  | "Economy"
  | "Compact"
  | "Mini";

/** Whether an office is a real re7lety partnership or an independently
 * researched external supplier — never label the latter as a partner. */
export type OfficeRelationship = "re7lety-partner" | "external-supplier";

export type RentalMode = "daily" | "trip" | "wedding";

/** "estimated" = a verified live price converted to EGP; "on-request" = not
 * verifiable, must render as "السعر عند الطلب" — never invented. */
export type PriceType = "estimated_starting_price" | "on_request";

/** Fixed bilingual disclaimer required under every imported/estimated price. */
export const PRICE_DISCLAIMER_AR =
  "سعر استرشادي قابل للتغيير حسب التاريخ، مدة الإيجار، التوافر، التأمين ومكان الاستلام.";
export const PRICE_DISCLAIMER_EN =
  "Estimated starting price. Final price depends on dates, availability, rental duration, insurance and pickup location.";
export const PRICE_LAST_UPDATED_AR = "آخر تحديث: 26 أغسطس 2026";

/** Configurable exchange rates used only to record originalPrice at research
 * time (26 Aug 2026) — update manually in this admin/data layer when
 * refreshing supplier prices; the app never recalculates EGP automatically. */
export const EXCHANGE_RATES: Record<string, number> = {
  EUR_TO_EGP: 58.85,
  DKK_TO_EGP: 7.88,
};

const EASTERN_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export function toEasternArabicDigits(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => EASTERN_DIGITS[Number(d)]);
}
export function startingFromLabelAr(egp: number): string {
  return `يبدأ من ${toEasternArabicDigits(egp)} ج.م / اليوم`;
}
export function startingFromLabelEn(egp: number): string {
  return `Starting from ${egp.toLocaleString("en-EG")} EGP / day`;
}

export type HaloTone = "red" | "cool" | "warm" | "neutral";

export interface CarSpec {
  label: string;
  value: string;
}

export interface CarHotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  body: string;
}

export interface CarAngle {
  id: string;
  label: string;
  image: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  modelLine: string;
  category: CarCategory;
  companyId: string;
  companyName: string;
  pricePerDay: number;
  currency: string;
  locationId: string;
  city: string;
  pickupZones: string[];
  topSpeed: number;
  topSpeedUnit: string;
  performanceLabel: string;
  horsepower: number;
  acceleration: string;
  engine: string;
  drivetrain: string;
  transmission: string;
  seats: number;
  fuel: string;
  rangeKm?: number;
  description: string;
  features: string[];
  specs: CarSpec[];
  heroImage: string;
  detailImage: string;
  tourImage: string;
  gallery: string[];
  angles: CarAngle[];
  hotspots: CarHotspot[];
  halo: HaloTone;
  rating: number;
  reviews: number;
  available: boolean;
  badge?: string;
  limited?: boolean;
  heroVideo?: string;
  tourVideo?: string;
  nationwide?: boolean;

  // --- External-supplier provenance metadata (optional; undefined for every
  // existing Al Omda car, so nothing about the current fleet changes). ---
  supplierId?: string;
  supplierNameAr?: string;
  supplierNameEn?: string;
  vehicleNameAr?: string;
  vehicleNameEn?: string;
  vehicleOrSimilar?: boolean;
  priceEGP?: number;
  originalPrice?: number;
  originalCurrency?: string;
  priceType?: PriceType;
  priceSourceURL?: string;
  priceLastCheckedAt?: string;
  priceDisclaimerAr?: string;
  priceDisclaimerEn?: string;
  pickupLocations?: string[];
  rentalModes?: RentalMode[];
  imageSource?: string;
  imageNeedsReview?: boolean;
  availabilityStatus?: string;
  transmissionType?: "Automatic" | "Manual";
  withDriver?: boolean;
}

export function fleetPaths(id: string) {
  return {
    heroVideo: `/fleet/${id}/hero.mp4`,
    tourVideo: `/fleet/${id}/tour.mp4`,
    poster: `/fleet/${id}/poster.jpg`,
  };
}

export interface LocationOption {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  artwork: string;
  pickupZones: string[];
  deliveryAvailable: boolean;
}

export interface RentalCompany {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  rating: number;

  // --- Supplier profile metadata (optional; undefined for existing Al Omda
  // offices, which keep exactly their current behavior). ---
  relationship?: OfficeRelationship;
  logoInitial?: string;
  pickupLocationsAr?: string[];
  pickupLocationsEn?: string[];
  offersSelfDrive?: boolean;
  offersWithDriver?: boolean;
  rentalModes?: RentalMode[];
  depositInfoAr?: string;
  depositInfoEn?: string;
  insuranceInfoAr?: string;
  insuranceInfoEn?: string;
  contactActionAr?: string;
  sourceURL?: string;
  lastUpdatedAr?: string;
}

export interface Booking {
  id: string;
  reference: string;
  carId: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  pickupLocation: string;
  returnLocation: string;
  deliveryRequested: boolean;
  deliveryAddress?: string;
  startDate: string;
  endDate: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  deposit: number;
  total: number;
  createdAt: string;
}

export const COMPANIES: RentalCompany[] = [
  { id: "al-omda", name: "Al Omda Office", nameAr: "مكتب العمدة", city: "Cairo", rating: 4.9 },
  { id: "al-omda-alex", name: "Al Omda Alexandria", nameAr: "العمدة الإسكندرية", city: "Alexandria", rating: 4.8 },
  { id: "al-omda-sahel", name: "Al Omda North Coast", nameAr: "العمدة الساحل", city: "North Coast", rating: 4.9 },

  // External economy suppliers researched via discovercars.com (26 Aug 2026).
  // Not re7lety partners — always labeled "متاح عبر مزود خارجي" in the UI.
  {
    id: "alamo",
    name: "Alamo",
    nameAr: "ألامو",
    city: "Cairo",
    rating: 4.3,
    relationship: "external-supplier",
    pickupLocationsAr: ["مطار القاهرة الدولي"],
    pickupLocationsEn: ["Cairo International Airport"],
    offersSelfDrive: true,
    offersWithDriver: false,
    rentalModes: ["daily", "trip"],
    insuranceInfoAr: "تفاصيل التأمين تُحدد عند الحجز مع المزود.",
    insuranceInfoEn: "Insurance details are confirmed with the supplier at booking.",
    contactActionAr: "احجز عبر الموقع الرسمي",
    sourceURL: "https://www.discovercars.com/egypt",
    lastUpdatedAr: PRICE_LAST_UPDATED_AR,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameAr: "إنتربرايز",
    city: "Cairo",
    rating: 4.4,
    relationship: "external-supplier",
    pickupLocationsAr: ["مطار القاهرة الدولي", "فروع القاهرة"],
    pickupLocationsEn: ["Cairo International Airport", "Cairo branches"],
    offersSelfDrive: true,
    offersWithDriver: false,
    rentalModes: ["daily", "trip"],
    insuranceInfoAr: "تفاصيل التأمين تُحدد عند الحجز مع المزود.",
    insuranceInfoEn: "Insurance details are confirmed with the supplier at booking.",
    contactActionAr: "احجز عبر الموقع الرسمي",
    sourceURL: "https://www.discovercars.com/egypt",
    lastUpdatedAr: PRICE_LAST_UPDATED_AR,
  },
  {
    id: "budget",
    name: "Budget",
    nameAr: "بدجت",
    city: "Cairo",
    rating: 4.2,
    relationship: "external-supplier",
    pickupLocationsAr: ["مطار القاهرة الدولي"],
    pickupLocationsEn: ["Cairo International Airport"],
    offersSelfDrive: true,
    offersWithDriver: false,
    rentalModes: ["daily", "trip"],
    insuranceInfoAr: "تفاصيل التأمين تُحدد عند الحجز مع المزود.",
    insuranceInfoEn: "Insurance details are confirmed with the supplier at booking.",
    contactActionAr: "احجز عبر الموقع الرسمي",
    sourceURL: "https://www.discovercars.com/egypt/cairo/cai",
    lastUpdatedAr: PRICE_LAST_UPDATED_AR,
  },
  {
    id: "hertz",
    name: "Hertz",
    nameAr: "هيرتز",
    city: "Giza",
    rating: 4.5,
    relationship: "external-supplier",
    pickupLocationsAr: ["4 البطل أحمد عبد العزيز، الدقي، الجيزة"],
    pickupLocationsEn: ["4 El-Batal Ahmed Abd El-Aziz, Dokki, Giza"],
    offersSelfDrive: true,
    offersWithDriver: false,
    rentalModes: ["daily", "trip"],
    insuranceInfoAr: "تفاصيل التأمين تُحدد عند الحجز مع المزود.",
    insuranceInfoEn: "Insurance details are confirmed with the supplier at booking.",
    contactActionAr: "احجز عبر الموقع الرسمي",
    sourceURL: "https://www.discovercars.com/egypt/cairo",
    lastUpdatedAr: PRICE_LAST_UPDATED_AR,
  },
  {
    id: "autounion",
    name: "Autounion",
    nameAr: "أوتو يونيون",
    city: "Cairo",
    rating: 4.1,
    relationship: "external-supplier",
    pickupLocationsAr: ["24 شارع الشهيد مصطفى رياض، مدينة نصر، القاهرة"],
    pickupLocationsEn: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
    offersSelfDrive: true,
    offersWithDriver: true,
    rentalModes: ["daily", "trip", "wedding"],
    insuranceInfoAr: "تفاصيل التأمين تُحدد عند الحجز مع المزود.",
    insuranceInfoEn: "Insurance details are confirmed with the supplier at booking.",
    contactActionAr: "احجز عبر الموقع الرسمي",
    sourceURL: "https://www.discovercars.com/partners/autounion-1905",
    lastUpdatedAr: PRICE_LAST_UPDATED_AR,
  },
];

const LOCATION_CATALOG: LocationOption[] = [
  {
    id: "cairo",
    name: "Cairo",
    nameAr: "القاهرة",
    city: "Cairo",
    artwork:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["Zamalek Desk", "New Cairo Hub", "Cairo Intl Airport T3", "Downtown Nile"],
    deliveryAvailable: true,
  },
  {
    id: "giza",
    name: "Giza",
    nameAr: "الجيزة",
    city: "Giza",
    artwork:
      "https://images.unsplash.com/photo-1541769740-098e80269166?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["Pyramid Road Desk", "Sheikh Zayed", "6th October Gate"],
    deliveryAvailable: true,
  },
  {
    id: "alexandria",
    name: "Alexandria",
    nameAr: "الإسكندرية",
    city: "Alexandria",
    artwork:
      "https://images.unsplash.com/photo-1646559988263-d521979257ab?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["Corniche Stanley", "San Stefano", "Borg El Arab Airport"],
    deliveryAvailable: true,
  },
  {
    id: "north-coast",
    name: "North Coast",
    nameAr: "الساحل الشمالي",
    city: "North Coast",
    artwork:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["Hacienda Bay", "Marassi Gate", "Telal El Alamein"],
    deliveryAvailable: true,
  },
  {
    id: "luxor",
    name: "Luxor",
    nameAr: "الأقصر",
    city: "Luxor",
    artwork:
      "https://images.unsplash.com/photo-1679058616751-2b91ee543913?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["East Bank Desk", "Luxor Airport"],
    deliveryAvailable: false,
  },
  {
    id: "aswan",
    name: "Aswan",
    nameAr: "أسوان",
    city: "Aswan",
    artwork:
      "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=1400&q=80",
    pickupZones: ["Corniche Desk", "Aswan Airport"],
    deliveryAvailable: false,
  },
];

const img = {
  gClass:
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
  rangeRover:
    "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=80",
  landCruiser:
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
  patrol:
    "https://images.unsplash.com/photo-1564779067972-d2c2672776f9?auto=format&fit=crop&w=1600&q=80",
  escalade:
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
  vClass:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
  carnival:
    "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1600&q=80",
  macan:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  x5: "https://images.unsplash.com/photo-1635990215241-4d2805d729bb?auto=format&fit=crop&w=1600&q=80",
  bentayga:
    "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1600&q=80",
  cullinan:
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80",
  urus: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1600&q=80",
  gt63: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
  modelX:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80",
  velocity:
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
  velocityDetail:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
  interior:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  u8: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80",
  def: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
  sClass:
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
  cayenne:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  /** Reused existing placeholder for external-supplier cars without a
   * licensed photo yet — never a newly hotlinked search-result image. */
  economyPlaceholder:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
};

function angles(primary: string, secondary: string, tertiary: string): CarAngle[] {
  return [
    { id: "front", label: "Front", image: primary },
    { id: "side", label: "Side", image: secondary },
    { id: "rear", label: "Rear", image: tertiary },
    { id: "detail", label: "Detail", image: secondary },
  ];
}

function baseHotspots(kind: "suv" | "van" | "sport"): CarHotspot[] {
  if (kind === "van") {
    return [
      {
        id: "interior",
        x: 48,
        y: 42,
        title: "Interior Comfort",
        subtitle: "Captain seats",
        body: "Quilted lounge seating with ambient lighting for VIP transfers.",
      },
      {
        id: "tech",
        x: 68,
        y: 55,
        title: "Technology",
        subtitle: "Cabin suite",
        body: "Dual screens, climate zones, and quiet-ride isolation.",
      },
      {
        id: "safety",
        x: 28,
        y: 58,
        title: "Safety",
        subtitle: "ADAS ready",
        body: "Full surround cameras and highway assist for Egypt roads.",
      },
    ];
  }
  if (kind === "sport") {
    return [
      {
        id: "engine",
        x: 30,
        y: 45,
        title: "Engine Performance",
        subtitle: "Powertrain",
        body: "Track-calibrated response with explosive mid-range torque.",
      },
      {
        id: "lights",
        x: 62,
        y: 38,
        title: "Headlights",
        subtitle: "Signature LED",
        body: "Sharp light graphic with adaptive high-beam control.",
      },
      {
        id: "wheels",
        x: 72,
        y: 68,
        title: "Wheels",
        subtitle: "Carbon ceramics",
        body: "Forged alloys with high-performance brake package.",
      },
      {
        id: "aero",
        x: 45,
        y: 28,
        title: "Exterior Design",
        subtitle: "Active aero",
        body: "Sculpted surfaces engineered for presence and downforce.",
      },
    ];
  }
  return [
    {
      id: "engine",
      x: 32,
      y: 48,
      title: "Engine Performance",
      subtitle: "Power delivery",
      body: "Confident highway thrust tuned for Egyptian long-distance drives.",
    },
    {
      id: "lights",
      x: 58,
      y: 40,
      title: "Headlights",
      subtitle: "LED signature",
      body: "Distinctive lighting that cuts through Cairo nights.",
    },
    {
      id: "wheels",
      x: 74,
      y: 66,
      title: "Wheels",
      subtitle: "All-terrain ready",
      body: "Large-diameter alloys with premium street composure.",
    },
    {
      id: "interior",
      x: 44,
      y: 58,
      title: "Interior Comfort",
      subtitle: "Cabin",
      body: "Executive materials, quiet glass, and massage seating options.",
    },
  ];
}

const CATALOG: Car[] = [
  {
    id: "g-class-night",
    name: "G 63",
    brand: "Mercedes-AMG",
    modelLine: "Night Edition",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 14750,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Downtown Nile", "Zamalek Desk"],
    topSpeed: 220,
    topSpeedUnit: "Km/h",
    performanceLabel: "Urban Command",
    horsepower: 585,
    acceleration: "4.5s",
    engine: "4.0L V8",
    drivetrain: "AWD",
    transmission: "9-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description:
      "W463 facelift AMG G 63 Night Edition — blacked-out presence vehicle, Al Omda’s most requested G-Wagen.",
    features: ["Burmester sound", "Off-road modes", "Massage seats", "360 cameras", "Night package"],
    specs: [
      { label: "Engine", value: "4.0L V8" },
      { label: "Power", value: "585 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.5 s" },
    ],
    heroImage: img.gClass,
    detailImage: img.gClass,
    tourImage: img.gClass,
    gallery: [img.gClass, img.def, img.rangeRover],
    angles: angles(img.gClass, img.def, img.rangeRover),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.9,
    reviews: 214,
    available: true,
    badge: "NIGHT EDITION",
  },
  {
    id: "rr-sport",
    name: "RANGE ROVER",
    brand: "Land Rover",
    modelLine: "Autobiography",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 19000,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["New Cairo Hub", "Cairo Intl Airport T3"],
    topSpeed: 250,
    topSpeedUnit: "Km/h",
    performanceLabel: "Quiet Authority",
    horsepower: 523,
    acceleration: "4.6s",
    engine: "4.4L V8",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description:
      "L460 Autobiography with Black Design Package — flagship Range Rover, not Sport. Egypt landed listings sit well above the G 63.",
    features: ["Air suspension", "Meridian audio", "Pixel LED", "Terrain Response", "Panoramic roof"],
    specs: [
      { label: "Engine", value: "4.4L V8" },
      { label: "Power", value: "523 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.6 s" },
    ],
    heroImage: img.rangeRover,
    detailImage: img.rangeRover,
    tourImage: img.rangeRover,
    gallery: [img.rangeRover, img.landCruiser, img.patrol],
    angles: angles(img.rangeRover, img.landCruiser, img.patrol),
    hotspots: baseHotspots("suv"),
    halo: "cool",
    rating: 4.8,
    reviews: 176,
    available: true,
    badge: "AUTOBIOGRAPHY",
  },
  {
    id: "lc300",
    name: "LAND CRUISER 300",
    brand: "Toyota",
    modelLine: "VXR",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 4922,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Zamalek Desk", "Downtown Nile"],
    topSpeed: 210,
    topSpeedUnit: "Km/h",
    performanceLabel: "Desert Royalty",
    horsepower: 409,
    acceleration: "6.7s",
    engine: "3.5L V6",
    drivetrain: "AWD",
    transmission: "10-Speed Auto",
    seats: 7,
    fuel: "Petrol",
    description:
      "J300 VXR chrome-luxury grade — Egypt’s desert essential, 7 seats. Street listings EGP 3.3M–4.9M.",
    features: ["7 seats", "Crawl control", "Cool box", "Multi-terrain monitor", "Premium leather"],
    specs: [
      { label: "Engine", value: "3.5L V6" },
      { label: "Power", value: "409 HP" },
      { label: "Seats", value: "7" },
      { label: "0–100", value: "6.7 s" },
    ],
    heroImage: img.landCruiser,
    detailImage: img.landCruiser,
    tourImage: img.landCruiser,
    gallery: [img.landCruiser, img.patrol, img.gClass],
    angles: angles(img.landCruiser, img.patrol, img.gClass),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.9,
    reviews: 301,
    available: true,
    badge: "VXR",
  },
  {
    id: "patrol-platinum",
    name: "PATROL PLATINUM",
    brand: "Nissan",
    modelLine: "Y62",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 9635,
    currency: "EGP",
    locationId: "giza",
    city: "Giza",
    pickupZones: ["Pyramid Road Desk", "Sheikh Zayed"],
    topSpeed: 210,
    topSpeedUnit: "Km/h",
    performanceLabel: "Night Presence",
    horsepower: 400,
    acceleration: "6.5s",
    engine: "5.6L V8",
    drivetrain: "AWD",
    transmission: "7-Speed Auto",
    seats: 7,
    fuel: "Petrol",
    description:
      "Y62 facelift Platinum — tailgate badge confirmed. Egypt listings EGP 7.5M–9.6M, above the LC 300 on the street market.",
    features: ["Hydraulic body motion", "Bose sound", "Captain seats", "Intelligent 4WD", "DVD rear"],
    specs: [
      { label: "Engine", value: "5.6L V8" },
      { label: "Power", value: "400 HP" },
      { label: "Seats", value: "7" },
      { label: "0–100", value: "6.5 s" },
    ],
    heroImage: img.patrol,
    detailImage: img.patrol,
    tourImage: img.patrol,
    gallery: [img.patrol, img.landCruiser, img.escalade],
    angles: angles(img.patrol, img.landCruiser, img.escalade),
    hotspots: baseHotspots("suv"),
    halo: "red",
    rating: 4.8,
    reviews: 188,
    available: true,
    badge: "PLATINUM",
  },
  {
    id: "escalade-night",
    name: "ESCALADE",
    brand: "Cadillac",
    modelLine: "Sport",
    category: "Luxury",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 9200,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["New Cairo Hub", "Cairo Intl Airport T3"],
    topSpeed: 210,
    topSpeedUnit: "Km/h",
    performanceLabel: "Hotel Arrival",
    horsepower: 420,
    acceleration: "5.9s",
    engine: "6.2L V8",
    drivetrain: "AWD",
    transmission: "10-Speed Auto",
    seats: 7,
    fuel: "Petrol",
    description: "Vertical light signature and lounge-scale cabin for statement arrivals.",
    features: ["OLED displays", "AKG studio", "Super Cruise", "Air ride", "Executive seating"],
    specs: [
      { label: "Engine", value: "6.2L V8" },
      { label: "Power", value: "420 HP" },
      { label: "Seats", value: "7" },
      { label: "0–100", value: "5.9 s" },
    ],
    heroImage: img.escalade,
    detailImage: img.escalade,
    tourImage: img.escalade,
    gallery: [img.escalade, img.bentayga, img.cullinan],
    angles: angles(img.escalade, img.bentayga, img.cullinan),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.7,
    reviews: 96,
    available: true,
  },
  {
    id: "v-class-omda",
    name: "V 300 d",
    brand: "Mercedes-Benz",
    modelLine: "Exclusive LWB",
    category: "Van",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 7975,
    currency: "EGP",
    locationId: "alexandria",
    city: "Alexandria",
    pickupZones: ["Corniche Stanley", "San Stefano"],
    topSpeed: 200,
    topSpeedUnit: "Km/h",
    performanceLabel: "VIP Transfer",
    horsepower: 237,
    acceleration: "7.9s",
    engine: "2.0L Diesel",
    drivetrain: "RWD",
    transmission: "9-Speed Auto",
    seats: 7,
    fuel: "Diesel",
    description:
      "W447 facelift V 300 d Exclusive — 7-seat long-wheelbase diesel VIP van, Luxury/Exclusive trim.",
    features: ["Lounge seating", "Privacy glass", "Ambient suite", "Electric doors", "Table console"],
    specs: [
      { label: "Engine", value: "2.0L" },
      { label: "Power", value: "237 HP" },
      { label: "Seats", value: "7" },
      { label: "Drive", value: "RWD" },
    ],
    heroImage: img.vClass,
    detailImage: img.vClass,
    tourImage: img.interior,
    gallery: [img.vClass, img.carnival, img.interior],
    angles: angles(img.vClass, img.carnival, img.interior),
    hotspots: baseHotspots("van"),
    halo: "red",
    rating: 4.8,
    reviews: 142,
    available: true,
    badge: "EXCLUSIVE",
  },
  {
    id: "carnival-hi",
    name: "CARNIVAL LIMO",
    brand: "Kia",
    modelLine: "SX Prestige",
    category: "Van",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 3638,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Cairo Intl Airport T3", "New Cairo Hub"],
    topSpeed: 190,
    topSpeedUnit: "Km/h",
    performanceLabel: "Chauffeur Class",
    horsepower: 294,
    acceleration: "8.1s",
    engine: "3.5L V6",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 7,
    fuel: "Petrol",
    description:
      "KA4 Carnival Limousine — high-roof SX Prestige with AWD. Egypt listings EGP 1.4M–3.6M.",
    features: ["High roof", "Quilted captains", "Star-map LED", "Rear lounge", "Dual climate"],
    specs: [
      { label: "Engine", value: "3.5L V6" },
      { label: "Power", value: "294 HP" },
      { label: "Seats", value: "7" },
      { label: "Drive", value: "AWD" },
    ],
    heroImage: img.carnival,
    detailImage: img.carnival,
    tourImage: img.interior,
    gallery: [img.carnival, img.vClass, img.interior],
    angles: angles(img.carnival, img.vClass, img.interior),
    hotspots: baseHotspots("van"),
    halo: "cool",
    rating: 4.7,
    reviews: 118,
    available: true,
    badge: "SX PRESTIGE",
  },
  {
    id: "bmw-x5",
    name: "X5 M SPORT",
    brand: "BMW",
    modelLine: "xDrive40i",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 6400,
    currency: "EGP",
    locationId: "north-coast",
    city: "North Coast",
    pickupZones: ["Hacienda Bay", "Marassi Gate"],
    topSpeed: 250,
    topSpeedUnit: "Km/h",
    performanceLabel: "Coastal Pace",
    horsepower: 340,
    acceleration: "5.4s",
    engine: "3.0L I6",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description: "Sahel weekends with M Sport attitude — sharp, composed, ready.",
    features: ["Adaptive M suspension", "Harman Kardon", "Gesture control", "Laser lights"],
    specs: [
      { label: "Engine", value: "3.0L I6" },
      { label: "Power", value: "340 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "5.4 s" },
    ],
    heroImage: img.x5,
    detailImage: img.x5,
    tourImage: img.x5,
    gallery: [img.x5, img.macan, img.cayenne],
    angles: angles(img.x5, img.macan, img.cayenne),
    hotspots: baseHotspots("suv"),
    halo: "cool",
    rating: 4.8,
    reviews: 133,
    available: true,
  },
  {
    id: "macan-s",
    name: "MACAN S",
    brand: "Porsche",
    modelLine: "Macan",
    category: "Sports",
    companyId: "al-omda-sahel",
    companyName: "Al Omda North Coast",
    pricePerDay: 7500,
    currency: "EGP",
    locationId: "north-coast",
    city: "North Coast",
    pickupZones: ["Telal El Alamein", "Hacienda Bay"],
    topSpeed: 254,
    topSpeedUnit: "Km/h",
    performanceLabel: "Sports Precision",
    horsepower: 380,
    acceleration: "4.8s",
    engine: "2.9L V6",
    drivetrain: "AWD",
    transmission: "PDK",
    seats: 5,
    fuel: "Petrol",
    description: "Compact Porsche energy for North Coast boulevard runs.",
    features: ["PDK", "Sport Chrono", "PASM", "BOSE", "Sport exhaust"],
    specs: [
      { label: "Engine", value: "2.9L V6" },
      { label: "Power", value: "380 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.8 s" },
    ],
    heroImage: img.macan,
    detailImage: img.macan,
    tourImage: img.macan,
    gallery: [img.macan, img.cayenne, img.x5],
    angles: angles(img.macan, img.cayenne, img.x5),
    hotspots: baseHotspots("sport"),
    halo: "red",
    rating: 4.9,
    reviews: 87,
    available: true,
  },
  {
    id: "urus-pearle",
    name: "URUS",
    brand: "Lamborghini",
    modelLine: "S",
    category: "Supercar",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 22000,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Zamalek Desk"],
    topSpeed: 305,
    topSpeedUnit: "Km/h",
    performanceLabel: "Super SUV",
    horsepower: 666,
    acceleration: "3.5s",
    engine: "4.0L V8",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description: "Al Omda halo unit — when the brief is impossible to ignore.",
    features: ["ANIMA modes", "Carbon package", "Bang & Olufsen", "Torque vectoring"],
    specs: [
      { label: "Engine", value: "4.0L V8" },
      { label: "Power", value: "666 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "3.5 s" },
    ],
    heroImage: img.urus,
    detailImage: img.urus,
    tourImage: img.urus,
    gallery: [img.urus, img.velocity, img.gt63],
    angles: angles(img.urus, img.velocity, img.gt63),
    hotspots: baseHotspots("sport"),
    halo: "red",
    rating: 5.0,
    reviews: 54,
    available: true,
    limited: true,
    badge: "LIMITED",
  },
  {
    id: "gt63",
    name: "GT 63 S",
    brand: "Mercedes-AMG",
    modelLine: "4-Door Coupe",
    category: "Sports",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 11000,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["New Cairo Hub", "Downtown Nile"],
    topSpeed: 315,
    topSpeedUnit: "Km/h",
    performanceLabel: "Grand Tour",
    horsepower: 630,
    acceleration: "3.2s",
    engine: "4.0L V8",
    drivetrain: "AWD",
    transmission: "9-Speed MCT",
    seats: 4,
    fuel: "Petrol",
    description: "Four-door fury with executive rear seats — rare and loud.",
    features: ["AMG Dynamics", "Carbon ceramics", "Burmester 4D", "Drift mode"],
    specs: [
      { label: "Engine", value: "4.0L V8" },
      { label: "Power", value: "630 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "3.2 s" },
    ],
    heroImage: img.gt63,
    detailImage: img.gt63,
    tourImage: img.gt63,
    gallery: [img.gt63, img.sClass, img.urus],
    angles: angles(img.gt63, img.sClass, img.urus),
    hotspots: baseHotspots("sport"),
    halo: "red",
    rating: 4.9,
    reviews: 71,
    available: true,
  },
  {
    id: "cullinan",
    name: "CULLINAN",
    brand: "Rolls-Royce",
    modelLine: "Black Badge",
    category: "Luxury",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 25000,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Zamalek Desk", "Cairo Intl Airport T3"],
    topSpeed: 250,
    topSpeedUnit: "Km/h",
    performanceLabel: "Silent Wealth",
    horsepower: 600,
    acceleration: "4.9s",
    engine: "6.7L V12",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description: "Black Badge presence for the rarest Cairo evenings.",
    features: ["Starlight headliner", "Champagne cooler", "Bespoke audio", "Viewing suite"],
    specs: [
      { label: "Engine", value: "6.7L V12" },
      { label: "Power", value: "600 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.9 s" },
    ],
    heroImage: img.cullinan,
    detailImage: img.cullinan,
    tourImage: img.cullinan,
    gallery: [img.cullinan, img.bentayga, img.escalade],
    angles: angles(img.cullinan, img.bentayga, img.escalade),
    hotspots: baseHotspots("suv"),
    halo: "neutral",
    rating: 5.0,
    reviews: 39,
    available: true,
    limited: true,
  },
  {
    id: "bentayga",
    name: "BENTAYGA",
    brand: "Bentley",
    modelLine: "V8",
    category: "Luxury",
    companyId: "al-omda-alex",
    companyName: "Al Omda Alexandria",
    pricePerDay: 16000,
    currency: "EGP",
    locationId: "alexandria",
    city: "Alexandria",
    pickupZones: ["San Stefano", "Corniche Stanley"],
    topSpeed: 290,
    topSpeedUnit: "Km/h",
    performanceLabel: "Coastal Grand",
    horsepower: 550,
    acceleration: "4.5s",
    engine: "4.0L V8",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description: "Hand-finished cabin for Alexandria arrivals that must feel intentional.",
    features: ["Naim audio", "Diamond quilting", "All-terrain spec", "Mood lighting"],
    specs: [
      { label: "Engine", value: "4.0L V8" },
      { label: "Power", value: "550 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.5 s" },
    ],
    heroImage: img.bentayga,
    detailImage: img.bentayga,
    tourImage: img.bentayga,
    gallery: [img.bentayga, img.cullinan, img.rangeRover],
    angles: angles(img.bentayga, img.cullinan, img.rangeRover),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.9,
    reviews: 62,
    available: true,
  },
  {
    id: "model-x",
    name: "MODEL X",
    brand: "Tesla",
    modelLine: "Plaid",
    category: "Electric",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 7800,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["New Cairo Hub", "Sheikh Zayed"],
    topSpeed: 262,
    topSpeedUnit: "Km/h",
    performanceLabel: "Electric Rush",
    horsepower: 1020,
    acceleration: "2.5s",
    engine: "Tri Motor",
    drivetrain: "AWD",
    transmission: "Single Speed",
    seats: 6,
    fuel: "Electric",
    rangeKm: 528,
    description: "Falcon-wing arrivals and instant torque — future-facing Cairo mobility.",
    features: ["Falcon doors", "Autopilot", "Yoke steering", "Premium connectivity"],
    specs: [
      { label: "Power", value: "1020 HP" },
      { label: "0–100", value: "2.5 s" },
      { label: "Range", value: "528 km" },
      { label: "Drive", value: "AWD" },
    ],
    heroImage: img.modelX,
    detailImage: img.modelX,
    tourImage: img.modelX,
    gallery: [img.modelX, img.u8, img.macan],
    angles: angles(img.modelX, img.u8, img.macan),
    hotspots: baseHotspots("sport"),
    halo: "cool",
    rating: 4.8,
    reviews: 101,
    available: true,
  },
  {
    id: "u8-giza",
    name: "U8",
    brand: "YangWang",
    modelLine: "Off-Road",
    category: "Electric",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 8900,
    currency: "EGP",
    locationId: "giza",
    city: "Giza",
    pickupZones: ["Pyramid Road Desk"],
    topSpeed: 200,
    topSpeedUnit: "Km/h",
    performanceLabel: "Pyramid Statement",
    horsepower: 1180,
    acceleration: "3.6s",
    engine: "Quad Motor",
    drivetrain: "AWD",
    transmission: "Single Speed",
    seats: 5,
    fuel: "Electric",
    rangeKm: 490,
    description: "Pixel-light grille against Giza nights — tech theater meets desert scale.",
    features: ["Tank turn", "Dissimilar road mode", "Pixel headlights", "Air suspension"],
    specs: [
      { label: "Power", value: "1180 HP" },
      { label: "0–100", value: "3.6 s" },
      { label: "Range", value: "490 km" },
      { label: "Drive", value: "AWD" },
    ],
    heroImage: img.u8,
    detailImage: img.u8,
    tourImage: img.u8,
    gallery: [img.u8, img.modelX, img.patrol],
    angles: angles(img.u8, img.modelX, img.patrol),
    hotspots: baseHotspots("suv"),
    halo: "cool",
    rating: 4.7,
    reviews: 44,
    available: true,
  },
  {
    id: "s-class",
    name: "S 500",
    brand: "Mercedes-Benz",
    modelLine: "Long Wheelbase",
    category: "Executive",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 8200,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Cairo Intl Airport T3", "Downtown Nile"],
    topSpeed: 250,
    topSpeedUnit: "Km/h",
    performanceLabel: "Boardroom Pace",
    horsepower: 435,
    acceleration: "4.9s",
    engine: "3.0L I6",
    drivetrain: "AWD",
    transmission: "9-Speed Auto",
    seats: 5,
    fuel: "Hybrid",
    description:
      "W223 long-wheelbase S 500. Cabin stills in the media set are Maybach-spec; the exterior listing stays S 500 until a full Maybach plate is confirmed.",
    features: ["Rear executive pack", "Digital light", "Burmester 4D", "Chauffeur mode"],
    specs: [
      { label: "Engine", value: "3.0L I6" },
      { label: "Power", value: "435 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.9 s" },
    ],
    heroImage: img.sClass,
    detailImage: img.sClass,
    tourImage: img.sClass,
    gallery: [img.sClass, img.gt63, img.vClass],
    angles: angles(img.sClass, img.gt63, img.vClass),
    hotspots: baseHotspots("suv"),
    halo: "neutral",
    rating: 4.9,
    reviews: 155,
    available: true,
  },
  {
    id: "cayenne",
    name: "CAYENNE",
    brand: "Porsche",
    modelLine: "S",
    category: "SUV",
    companyId: "al-omda-sahel",
    companyName: "Al Omda North Coast",
    pricePerDay: 8800,
    currency: "EGP",
    locationId: "north-coast",
    city: "North Coast",
    pickupZones: ["Marassi Gate", "Telal El Alamein"],
    topSpeed: 265,
    topSpeedUnit: "Km/h",
    performanceLabel: "Sport Utility",
    horsepower: 440,
    acceleration: "5.0s",
    engine: "2.9L V6",
    drivetrain: "AWD",
    transmission: "Tiptronic S",
    seats: 5,
    fuel: "Petrol",
    description: "Porsche manners with SUV practicality for the coast circuit.",
    features: ["Sport Chrono", "Air suspension", "Off-road package", "Matrix LED"],
    specs: [
      { label: "Engine", value: "2.9L V6" },
      { label: "Power", value: "440 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "5.0 s" },
    ],
    heroImage: img.cayenne,
    detailImage: img.cayenne,
    tourImage: img.cayenne,
    gallery: [img.cayenne, img.macan, img.x5],
    angles: angles(img.cayenne, img.macan, img.x5),
    hotspots: baseHotspots("suv"),
    halo: "red",
    rating: 4.8,
    reviews: 90,
    available: true,
  },
  {
    id: "defender-luxor",
    name: "DEFENDER",
    brand: "Land Rover",
    modelLine: "110 X",
    category: "SUV",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 6100,
    currency: "EGP",
    locationId: "luxor",
    city: "Luxor",
    pickupZones: ["East Bank Desk", "Luxor Airport"],
    topSpeed: 191,
    topSpeedUnit: "Km/h",
    performanceLabel: "Temple Roads",
    horsepower: 395,
    acceleration: "6.1s",
    engine: "3.0L I6",
    drivetrain: "AWD",
    transmission: "8-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description: "Capable luxury for Upper Egypt routes and temple-hour light.",
    features: ["Wade sensing", "Configurable cabin", "Air suspension", "ClearSight"],
    specs: [
      { label: "Engine", value: "3.0L I6" },
      { label: "Power", value: "395 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "6.1 s" },
    ],
    heroImage: img.def,
    detailImage: img.def,
    tourImage: img.def,
    gallery: [img.def, img.rangeRover, img.landCruiser],
    angles: angles(img.def, img.rangeRover, img.landCruiser),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.7,
    reviews: 58,
    available: true,
  },
  {
    id: "lc-aswan",
    name: "LAND CRUISER ZX",
    brand: "Toyota",
    modelLine: "ZX",
    category: "7 Seats",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 4922,
    currency: "EGP",
    locationId: "aswan",
    city: "Aswan",
    pickupZones: ["Corniche Desk", "Aswan Airport"],
    topSpeed: 210,
    topSpeedUnit: "Km/h",
    performanceLabel: "Nile Command",
    horsepower: 409,
    acceleration: "6.7s",
    engine: "3.5L V6",
    drivetrain: "AWD",
    transmission: "10-Speed Auto",
    seats: 7,
    fuel: "Petrol",
    description: "J300 ZX chrome-luxury grade — seven-seat confidence for Aswan heat and Nile-side evenings.",
    features: ["Cool box", "7 seats", "Multi-terrain", "Premium audio", "Sunroof"],
    specs: [
      { label: "Engine", value: "3.5L V6" },
      { label: "Power", value: "409 HP" },
      { label: "Seats", value: "7" },
      { label: "Drive", value: "AWD" },
    ],
    heroImage: img.landCruiser,
    detailImage: img.landCruiser,
    tourImage: img.landCruiser,
    gallery: [img.landCruiser, img.patrol, img.def],
    angles: angles(img.landCruiser, img.patrol, img.def),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.8,
    reviews: 77,
    available: true,
    badge: "ZX",
  },
  {
    id: "g-class-sahel",
    name: "G 63",
    brand: "Mercedes-AMG",
    modelLine: "Night Edition",
    category: "SUV",
    companyId: "al-omda-sahel",
    companyName: "Al Omda North Coast",
    pricePerDay: 14750,
    currency: "EGP",
    locationId: "north-coast",
    city: "North Coast",
    pickupZones: ["Hacienda Bay", "Marassi Gate"],
    topSpeed: 220,
    topSpeedUnit: "Km/h",
    performanceLabel: "Sahel Icon",
    horsepower: 585,
    acceleration: "4.5s",
    engine: "4.0L V8",
    drivetrain: "AWD",
    transmission: "9-Speed Auto",
    seats: 5,
    fuel: "Petrol",
    description:
      "North Coast AMG G 63 Night Edition — same W463 facelift as Cairo, weekend rate for the Sahel. Brabus 800 footage exists in the media set as a separate cut.",
    features: ["Performance exhaust", "Night package", "AMG ride control", "Burmester"],
    specs: [
      { label: "Engine", value: "4.0L V8" },
      { label: "Power", value: "585 HP" },
      { label: "Drive", value: "AWD" },
      { label: "0–100", value: "4.5 s" },
    ],
    heroImage: img.gClass,
    detailImage: img.gClass,
    tourImage: img.gClass,
    gallery: [img.gClass, img.macan, img.cayenne],
    angles: angles(img.gClass, img.macan, img.cayenne),
    hotspots: baseHotspots("suv"),
    halo: "warm",
    rating: 4.9,
    reviews: 120,
    available: true,
    badge: "NIGHT EDITION",
  },

  ...buildSupplierCars(),
];

/**
 * External economy suppliers (researched, not re7lety-partner fleet).
 * Source: https://www.discovercars.com/egypt — checked 26 Aug 2026.
 * Only listings with a verifiable live price get priceEGP + pricePerDay and
 * priceType "estimated_starting_price"; every other model has no priceEGP
 * and priceType "on_request", rendered as "السعر عند الطلب" — no invented
 * figures. All use the reused placeholder image and imageNeedsReview: true.
 */
function buildSupplierCars(): Car[] {
  interface SupplierCarSeed {
    id: string;
    brand: string;
    model: string;
    modelAr: string;
    category: CarCategory;
    supplierId: string;
    supplierNameAr: string;
    supplierNameEn: string;
    city: string;
    locationId: string;
    seats: number;
    priceEGP?: number;
    originalPrice?: number;
    originalCurrency?: string;
    sourceURL: string;
    pickupLocations: string[];
    rentalModes: RentalMode[];
  }

  const seeds: SupplierCarSeed[] = [
    {
      id: "alamo-nissan-sunny",
      brand: "Nissan",
      model: "Sunny",
      modelAr: "نيسان صني أو ما يماثلها",
      category: "Economy",
      supplierId: "alamo",
      supplierNameAr: "ألامو",
      supplierNameEn: "Alamo",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      priceEGP: 700,
      originalPrice: 11.89,
      originalCurrency: "EUR",
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-nissan-sunny",
      brand: "Nissan",
      model: "Sunny",
      modelAr: "نيسان صني أو ما يماثلها",
      category: "Economy",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      priceEGP: 740,
      originalPrice: 12.6,
      originalCurrency: "EUR",
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-nissan-sentra",
      brand: "Nissan",
      model: "Sentra",
      modelAr: "نيسان سنترا أو ما يماثلها",
      category: "Economy",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-toyota-corolla",
      brand: "Toyota",
      model: "Corolla",
      modelAr: "تويوتا كورولا أو ما يماثلها",
      category: "Economy",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-hyundai-elantra",
      brand: "Hyundai",
      model: "Elantra",
      modelAr: "هيونداي إلنترا أو ما يماثلها",
      category: "Economy",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-nissan-qashqai",
      brand: "Nissan",
      model: "Qashqai",
      modelAr: "نيسان قشقاي أو ما يماثلها",
      category: "SUV",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-peugeot-508",
      brand: "Peugeot",
      model: "508",
      modelAr: "بيجو 508 أو ما يماثلها",
      category: "Economy",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-peugeot-3008",
      brand: "Peugeot",
      model: "3008",
      modelAr: "بيجو 3008 أو ما يماثلها",
      category: "SUV",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-kia-sorento",
      brand: "Kia",
      model: "Sorento",
      modelAr: "كيا سورينتو أو ما يماثلها",
      category: "SUV",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 7,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "enterprise-volvo-xc60",
      brand: "Volvo",
      model: "XC60",
      modelAr: "فولفو XC60 أو ما يماثلها",
      category: "SUV",
      supplierId: "enterprise",
      supplierNameAr: "إنتربرايز",
      supplierNameEn: "Enterprise",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt",
      pickupLocations: ["Cairo International Airport", "Cairo branches"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "budget-nissan-sunny",
      brand: "Nissan",
      model: "Sunny",
      modelAr: "نيسان صني أو ما يماثلها",
      category: "Compact",
      supplierId: "budget",
      supplierNameAr: "بدجت",
      supplierNameEn: "Budget",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      priceEGP: 925,
      originalPrice: 15.71,
      originalCurrency: "EUR",
      sourceURL: "https://www.discovercars.com/egypt/cairo/cai",
      pickupLocations: ["Cairo International Airport"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "hertz-nissan-sunny",
      brand: "Nissan",
      model: "Sunny",
      modelAr: "نيسان صني أو ما يماثلها",
      category: "Compact",
      supplierId: "hertz",
      supplierNameAr: "هيرتز",
      supplierNameEn: "Hertz",
      city: "Giza",
      locationId: "giza",
      seats: 5,
      priceEGP: 1080,
      originalPrice: 137.19,
      originalCurrency: "DKK",
      sourceURL: "https://www.discovercars.com/egypt/cairo",
      pickupLocations: ["4 El-Batal Ahmed Abd El-Aziz, Dokki, Giza"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "hertz-renault-megane",
      brand: "Renault",
      model: "Megane",
      modelAr: "رينو ميجان أو ما يماثلها",
      category: "Compact",
      supplierId: "hertz",
      supplierNameAr: "هيرتز",
      supplierNameEn: "Hertz",
      city: "Giza",
      locationId: "giza",
      seats: 5,
      sourceURL: "https://www.discovercars.com/egypt/cairo",
      pickupLocations: ["4 El-Batal Ahmed Abd El-Aziz, Dokki, Giza"],
      rentalModes: ["daily", "trip"],
    },
    {
      id: "autounion-hyundai-i10",
      brand: "Hyundai",
      model: "i10",
      modelAr: "هيونداي i10 أو ما يماثلها",
      category: "Mini",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 4,
      priceEGP: 2040,
      originalPrice: 34.63,
      originalCurrency: "EUR",
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-chevrolet-aveo",
      brand: "Chevrolet",
      model: "Aveo",
      modelAr: "شيفروليه أفيو أو ما يماثلها",
      category: "Economy",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-nissan-sunny",
      brand: "Nissan",
      model: "Sunny",
      modelAr: "نيسان صني أو ما يماثلها",
      category: "Economy",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-nissan-sentra",
      brand: "Nissan",
      model: "Sentra",
      modelAr: "نيسان سنترا أو ما يماثلها",
      category: "Economy",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-hyundai-elantra",
      brand: "Hyundai",
      model: "Elantra",
      modelAr: "هيونداي إلنترا أو ما يماثلها",
      category: "Economy",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-hyundai-tucson",
      brand: "Hyundai",
      model: "Tucson",
      modelAr: "هيونداي توسان أو ما يماثلها",
      category: "SUV",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-chevrolet-captiva",
      brand: "Chevrolet",
      model: "Captiva",
      modelAr: "شيفروليه كابتيفا أو ما يماثلها",
      category: "SUV",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-mitsubishi-pajero",
      brand: "Mitsubishi",
      model: "Pajero",
      modelAr: "ميتسوبيشي باجيرو أو ما يماثلها",
      category: "SUV",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 7,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-mercedes-c-class",
      brand: "Mercedes-Benz",
      model: "C-Class",
      modelAr: "مرسيدس بنز الفئة C أو ما يماثلها",
      category: "Luxury",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
    {
      id: "autounion-mercedes-e-class",
      brand: "Mercedes-Benz",
      model: "E-Class",
      modelAr: "مرسيدس بنز الفئة E أو ما يماثلها",
      category: "Luxury",
      supplierId: "autounion",
      supplierNameAr: "أوتو يونيون",
      supplierNameEn: "Autounion",
      city: "Cairo",
      locationId: "cairo",
      seats: 5,
      sourceURL: "https://www.discovercars.com/partners/autounion-1905",
      pickupLocations: ["24 El Shaheed Mostafa Riad Street, Nasr City, Cairo"],
      rentalModes: ["daily", "trip", "wedding"],
    },
  ];

  return seeds.map((s) => {
    const company = COMPANIES.find((c) => c.id === s.supplierId);
    const verified = typeof s.priceEGP === "number";
    return {
      id: s.id,
      name: s.brand.toUpperCase(),
      brand: s.brand,
      modelLine: s.model,
      category: s.category,
      companyId: s.supplierId,
      companyName: company?.name ?? s.supplierNameEn,
      pricePerDay: s.priceEGP ?? 0,
      currency: "EGP",
      locationId: s.locationId,
      city: s.city,
      pickupZones: s.pickupLocations,
      topSpeed: 180,
      topSpeedUnit: "Km/h",
      performanceLabel: "Daily Rental",
      horsepower: 0,
      acceleration: "—",
      engine: "—",
      drivetrain: "FWD",
      transmission: "Automatic",
      seats: s.seats,
      fuel: "Petrol",
      description: `${s.model} ${s.modelAr}, offered by ${s.supplierNameEn} (${s.supplierNameAr}) — ${s.modelAr}.`,
      features: ["Air Conditioning"],
      specs: [
        { label: "Transmission", value: "Automatic" },
        { label: "Seats", value: String(s.seats) },
      ],
      heroImage: img.economyPlaceholder,
      detailImage: img.economyPlaceholder,
      tourImage: img.economyPlaceholder,
      gallery: [img.economyPlaceholder],
      angles: angles(img.economyPlaceholder, img.economyPlaceholder, img.economyPlaceholder),
      hotspots: [],
      halo: "neutral",
      rating: company?.rating ?? 4.2,
      reviews: 0,
      available: true,

      supplierId: s.supplierId,
      supplierNameAr: s.supplierNameAr,
      supplierNameEn: s.supplierNameEn,
      vehicleNameAr: s.modelAr,
      vehicleNameEn: `${s.brand} ${s.model} or similar`,
      vehicleOrSimilar: true,
      priceEGP: s.priceEGP,
      originalPrice: s.originalPrice,
      originalCurrency: s.originalCurrency,
      priceType: verified ? "estimated_starting_price" : "on_request",
      priceSourceURL: s.sourceURL,
      priceLastCheckedAt: "2026-08-26",
      priceDisclaimerAr: PRICE_DISCLAIMER_AR,
      priceDisclaimerEn: PRICE_DISCLAIMER_EN,
      pickupLocations: s.pickupLocations,
      rentalModes: s.rentalModes,
      imageSource: "placeholder",
      imageNeedsReview: true,
      availabilityStatus: verified ? "available" : "priceOnRequest",
      transmissionType: "Automatic",
      withDriver: s.supplierId === "autounion",
    };
  });
}

function makeAutoCar(id: string): Car {
  const media = readFolder(id);
  const poster = media.poster || media.images[0] || img.velocity;
  const name = id.replace(/[-_]+/g, " ").toUpperCase();
  return overlayCarMedia({
    id,
    name,
    brand: "Al Omda",
    modelLine: "Fleet",
    category: "Luxury",
    companyId: "al-omda",
    companyName: "Al Omda Office",
    pricePerDay: 6500,
    currency: "EGP",
    locationId: "cairo",
    city: "Cairo",
    pickupZones: ["Zamalek Desk", "Cairo Intl Airport T3"],
    topSpeed: 220,
    topSpeedUnit: "Km/h",
    performanceLabel: "Al Omda Fleet",
    horsepower: 400,
    acceleration: "5.5s",
    engine: "V8",
    drivetrain: "AWD",
    transmission: "Auto",
    seats: 5,
    fuel: "Petrol",
    description: "From the Al Omda Office fleet — listed for re7lety with your own film and photography.",
    features: ["Al Omda maintained", "Egypt delivery", "Premium interior"],
    specs: [
      { label: "Fleet", value: "Al Omda" },
      { label: "City", value: "Cairo" },
      { label: "Class", value: "Luxury" },
      { label: "Drive", value: "AWD" },
    ],
    heroImage: poster,
    detailImage: poster,
    tourImage: media.images[1] || poster,
    gallery: media.images.length ? media.images : [poster],
    angles: angles(poster, media.images[1] || poster, media.images[2] || poster),
    hotspots: baseHotspots("suv"),
    halo: "red",
    rating: 4.8,
    reviews: 12,
    available: true,
    badge: "AL OMDA",
    nationwide: true,
  });
}

export const LOCATIONS = LOCATION_CATALOG.map(applyLocationArt);

export const CARS: Car[] = [
  ...CATALOG.map(overlayCarMedia),
  ...extraFolderIds(new Set(CATALOG.map((car) => car.id))).map(makeAutoCar),
];

export const BRAND_MEDIA = resolveBrandMedia();

export const FILTERS = [
  "All",
  "SUV",
  "Luxury",
  "Sports",
  "Van",
  "Executive",
  "Electric",
  "Supercar",
  "7 Seats",
  "Economy",
  "Compact",
  "Mini",
] as const;

export type FilterId = (typeof FILTERS)[number];

export const FEATURED_IDS = [
  ...CARS.filter((car) => car.heroVideo).map((car) => car.id),
  "g-class-night",
  "rr-sport",
  "lc300",
  "macan-s",
  "patrol-platinum",
].filter((id, index, all) => all.indexOf(id) === index);

export function formatPrice(amount: number, currency = "EGP") {
  return `${amount.toLocaleString("en-EG")} ${currency}`;
}

export function daysBetween(start: string, end: string) {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86400000));
}

/** Local-timezone today as YYYY-MM-DD (toISOString alone would use UTC). */
export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function makeReference() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `RE7-${n}`;
}
