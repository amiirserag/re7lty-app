import { useMemo, useState } from "react";
import { Bell, ChevronDown, MapPin, Search, UserRound } from "lucide-react";
import { FilterRow } from "../components/FilterChip";
import { IOSCarCard } from "../components/Cards";
import { haptic } from "../core/motion";
import type { FilterId } from "../data/cars";
import { useAppState } from "../store/AppState";

const HOME_FILTERS = [
  "All",
  "SUV",
  "Luxury",
  "Sports",
  "Executive",
  "Van",
  "Electric",
  "Economy",
] as const;

/** Home — matches iOS `HomeView` (greeting, search, chips, Popular list). */
export function HomeScreen() {
  const {
    inventoryForLocation,
    profile,
    selectedLocation,
    favorites,
    toggleFavorite,
    openDetail,
    setActiveTab,
    openLocationPicker,
    t,
  } = useAppState();

  const [category, setCategory] = useState<FilterId>("All");

  const popularCars = useMemo(() => {
    let list = inventoryForLocation.filter((car) => {
      if (category === "All") return car.available;
      if (category === "7 Seats") return car.available && car.seats >= 7;
      return car.available && car.category === category;
    });
    list = [...list].sort((a, b) => {
      const aOmda = a.companyId.startsWith("al-omda") ? 0 : 1;
      const bOmda = b.companyId.startsWith("al-omda") ? 0 : 1;
      if (aOmda !== bOmda) return aOmda - bOmda;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [inventoryForLocation, category]);

  const openSearch = () => {
    haptic("selection");
    setActiveTab("explore");
    requestAnimationFrame(() => document.getElementById("explore-search")?.focus());
  };

  return (
    <div className="tab-view ios-home">
      <div className="ios-home-scroll">
        <header className="ios-greeting">
          <div className="ios-avatar" aria-hidden>
            <UserRound size={22} strokeWidth={1.5} />
          </div>
          <div className="ios-greeting-text">
            <strong>Hello {profile.name.split(" ")[0] || "Amir"}</strong>
            <button type="button" className="ios-location-btn pressable" onClick={openLocationPicker}>
              <MapPin size={12} fill="currentColor" />
              <span>{selectedLocation.city}</span>
              <ChevronDown size={10} strokeWidth={3} />
            </button>
          </div>
          <button type="button" className="ios-bell pressable" aria-label="Notifications">
            <Bell size={16} />
            <span className="ios-bell-dot" />
          </button>
        </header>

        <button type="button" className="ios-search-pill pressable" onClick={openSearch}>
          <Search size={16} />
          <span>Type here to search</span>
        </button>

        <FilterRow
          filters={HOME_FILTERS}
          active={category}
          onChange={setCategory}
          getLabel={(f) => (f === "All" ? "All" : t(`filter.${f}` as Parameters<typeof t>[0]))}
        />

        <div className="ios-popular-head">
          <div>
            <h2>Popular</h2>
            <p>{popularCars.length} cars available</p>
          </div>
          <button type="button" className="ios-see-all pressable" onClick={openSearch}>
            See All
          </button>
        </div>

        <div className="ios-car-list">
          {popularCars.length === 0 ? (
            <p className="ios-empty">No cars found. Try another city or category.</p>
          ) : (
            popularCars.map((car) => (
              <IOSCarCard
                key={car.id}
                car={car}
                favorited={favorites.includes(car.id)}
                onOpen={() => openDetail(car.id)}
                onToggleFavorite={() => toggleFavorite(car.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
