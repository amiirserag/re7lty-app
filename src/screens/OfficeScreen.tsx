import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Info, MapPin, Shield, Star, Wallet } from "lucide-react";
import { BrandMark, PrimaryCTA, StatusBar, TopIconButton } from "../components/ui";
import { COMPANIES, formatPrice, startingFromLabelAr, startingFromLabelEn, type Car } from "../data/cars";
import { useAppState } from "../store/AppState";

/**
 * Office profile page: name/logo, verified/unverified status, pickup
 * locations, available cars, starting price, with-driver/self-drive,
 * rental modes (daily/trip/wedding), deposit/insurance info, contact
 * action, and source/last-updated line — per the office-experience spec.
 */
export function OfficeScreen() {
  const { selectedCompanyId, cars, goBack, openDetail, t } = useAppState();
  const company = COMPANIES.find((c) => c.id === selectedCompanyId);
  if (!company) return null;

  const officeCars: Car[] = cars.filter((c) => c.companyId === company.id);
  const isPartner = (company.relationship ?? "re7lety-partner") === "re7lety-partner";
  const priced = officeCars.filter((c) => typeof c.priceEGP === "number");
  const startingPriceEGP = priced.length
    ? Math.min(...priced.map((c) => c.priceEGP as number))
    : officeCars.length
      ? Math.min(...officeCars.map((c) => c.pricePerDay))
      : undefined;

  return (
    <div className="screen pack-detail">
      <StatusBar />
      <div className="screen-scroll">
        <div className="home-topbar" style={{ padding: "12px 20px" }}>
          <TopIconButton aria-label="Back" onClick={goBack}>
            <ArrowLeft size={16} />
          </TopIconButton>
          <BrandMark size={13} />
          <div style={{ width: 32 }} />
        </div>

        <div style={{ padding: "8px 20px 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 2 }}>{company.name}</h1>
          <div dir="rtl" style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 10 }}>
            {company.nameAr}
          </div>

          <div
            className="pressable"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              marginBottom: 14,
            }}
          >
            {isPartner ? (
              <BadgeCheck size={16} color="var(--accent)" />
            ) : (
              <Info size={16} color="var(--text-secondary)" />
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {isPartner ? "re7lety Partner" : "Available via External Supplier"}
              </div>
              <div dir="rtl" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {isPartner ? "شريك re7lety" : "متاح عبر مزود خارجي"}
              </div>
            </div>
          </div>

          {startingPriceEGP !== undefined && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{startingFromLabelEn(startingPriceEGP)}</div>
              <div dir="rtl" style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                {startingFromLabelAr(startingPriceEGP)}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 14, marginBottom: 16, fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={13} fill="var(--accent)" color="var(--accent)" /> {company.rating}
            </span>
            <span>{company.offersSelfDrive === false ? "No self-drive" : "Self-drive available"}</span>
            <span>{company.offersWithDriver ? "With-driver available" : "No driver option"}</span>
          </div>

          {!!company.rentalModes?.length && (
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {company.rentalModes.map((mode) => (
                <span
                  key={mode}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: "var(--bg-card)",
              border: "1px solid var(--border)",
                  }}
                >
                  {mode === "daily" ? "Daily Rental" : mode === "trip" ? "Per Trip" : "Wedding Rental"}
                </span>
              ))}
            </div>
          )}

          {!!company.pickupLocationsEn?.length && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Pickup Locations</div>
              {company.pickupLocationsEn.map((loc) => (
                <div key={loc} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 4 }}>
                  <MapPin size={13} /> {loc}
                </div>
              ))}
            </div>
          )}

          {(company.depositInfoEn || company.insuranceInfoEn) && (
            <div style={{ marginBottom: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
              {company.depositInfoEn && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Wallet size={13} /> {company.depositInfoEn}
                </div>
              )}
              {company.insuranceInfoEn && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Shield size={13} /> {company.insuranceInfoEn}
                </div>
              )}
            </div>
          )}

          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
            عرض السيارات <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>· View Cars</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {officeCars.map((car, i) => (
              <motion.button
                key={car.id}
                type="button"
                className="pack-list-card pressable"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => openDetail(car.id)}
              >
                <img src={car.heroImage} alt="" />
                <div className="meta">
                  <div className="model">{car.vehicleNameEn ?? car.name}</div>
                  <div className="brand">{car.brand}</div>
                  <div className="red-rule" />
                  <div className="price-row">
                    <span className="price">
                      {car.priceType === "on_request" || !car.priceEGP
                        ? "السعر عند الطلب"
                        : `${formatPrice(car.pricePerDay)} ${t("common.perDay")}`}
                    </span>
                  </div>
                </div>
                <div className="go icon-btn accent" aria-hidden>
                  →
                </div>
              </motion.button>
            ))}
            {officeCars.length === 0 && <div className="empty-state">No cars available from this office yet.</div>}
          </div>

          {company.sourceURL && (
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
              Source: {company.sourceURL}
            </div>
          )}
          {company.lastUpdatedAr && (
            <div dir="rtl" style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 8 }}>
              {company.lastUpdatedAr}
            </div>
          )}
          {!isPartner && (
            <>
              <div dir="rtl" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                سعر استرشادي قابل للتغيير حسب التاريخ، مدة الإيجار، التوافر، التأمين ومكان الاستلام.
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 16 }}>
                Estimated starting price. Final price depends on dates, availability, rental duration, insurance and
                pickup location.
              </div>
            </>
          )}

          {company.contactActionAr && (
            <PrimaryCTA onClick={() => officeCars[0] && openDetail(officeCars[0].id)}>
              {company.contactActionAr}
            </PrimaryCTA>
          )}
        </div>
      </div>
    </div>
  );
}
