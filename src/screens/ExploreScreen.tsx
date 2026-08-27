import { Menu, MoonStar, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { FilterRow } from "../components/FilterChip";
import { BrandMark, StatusBar, TopIconButton } from "../components/ui";
import { COMPANIES, formatPrice, type FilterId } from "../data/cars";
import { useAppState } from "../store/AppState";

const EXPLORE_FILTERS = [
  "All",
  "Supercar",
  "SUV",
  "Luxury",
  "Electric",
  "Sports",
  "Van",
  "Economy",
  "Compact",
  "Mini",
] as const;

export function ExploreScreen() {
  const {
    filteredCars,
    filter,
    setFilter,
    officeFilter,
    setOfficeFilter,
    searchQuery,
    setSearchQuery,
    openDetail,
    openOffice,
    openLocationPicker,
    openNightlife,
    t,
  } = useAppState();

  return (
    <div className="tab-view pack-explore">
      <div className="grid-bg" />
      <div className="red-flare" />
      <StatusBar />

      <div className="home-topbar">
        <TopIconButton aria-label="Menu" onClick={openLocationPicker}>
          <Menu size={16} />
        </TopIconButton>
        <BrandMark />
        <TopIconButton aria-label="Focus search" onClick={() => document.getElementById("explore-search")?.focus()}>
          <Search size={16} />
        </TopIconButton>
      </div>

      <div className="search-field pack">
        <Search size={16} color="var(--text-secondary)" />
        <input
          id="explore-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("explore.searchPlaceholder")}
          aria-label="Search"
        />
      </div>

      <FilterRow
        filters={EXPLORE_FILTERS}
        active={filter}
        onChange={(f) => setFilter(f as FilterId)}
        getLabel={(f) => t(`filter.${f}` as Parameters<typeof t>[0])}
      />

      <div style={{ padding: "10px 20px 0", display: "flex", gap: 8, overflowX: "auto" }}>
        {["All", ...COMPANIES.map((c) => c.id)].map((id) => {
          const company = COMPANIES.find((c) => c.id === id);
          return (
            <button
              key={id}
              type="button"
              className={`filter-chip pressable ${officeFilter === id ? "active" : ""}`}
              onClick={() => setOfficeFilter(id)}
            >
              {company ? company.name : "All Offices"}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "10px 20px 0", display: "flex", gap: 8, overflowX: "auto" }}>
        {COMPANIES.map((company) => (
          <button
            key={company.id}
            type="button"
            className="pressable"
            style={{
              flex: "0 0 auto",
              padding: "8px 12px",
              borderRadius: 12,
              background: "var(--surface-2, rgba(255,255,255,0.06))",
              fontSize: 12,
              fontWeight: 600,
            }}
            onClick={() => openOffice(company.id)}
          >
            {company.name} →
          </button>
        ))}
      </div>

      <button
        type="button"
        className="nightlife-banner pressable"
        onClick={openNightlife}
        style={{ margin: "14px 20px 0" }}
      >
        <MoonStar size={16} />
        <span>{t("explore.nightlifeBanner")}</span>
        <span aria-hidden>→</span>
      </button>

      <div className="screen-scroll with-tab-bar pack-explore-list">
        {filteredCars.map((car, i) => (
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
              <div className="model">{car.name}</div>
              <div className="brand">{car.brand}</div>
              <div className="red-rule" />
              <div className="price-row">
                <span className="price">
                  {formatPrice(car.pricePerDay)} <span className="day">{t("common.perDay")}</span>
                </span>
                <span className="rating">
                  <Star size={11} fill="var(--accent)" color="var(--accent)" /> {car.rating}
                </span>
              </div>
            </div>
            <div className="go icon-btn accent" aria-hidden>
              →
            </div>
          </motion.button>
        ))}
        {filteredCars.length === 0 && <div className="empty-state">{t("explore.noMatches")}</div>}
      </div>
    </div>
  );
}
