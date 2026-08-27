import { AnimatePresence, motion } from "framer-motion";
import { MouseCursor } from "./components/MouseCursor";
import { BottomNav } from "./components/BottomNav";
import { BookingFlowScreen } from "./screens/BookingFlowScreen";
import { CarDetailScreen } from "./screens/CarDetailScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import {
  BookingsScreen,
  FavoritesScreen,
  GalleryScreen,
  ProfileScreen,
} from "./screens/FavoritesBookingsProfile";
import { FeaturedShowcaseScreen } from "./screens/FeaturedShowcaseScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LocationScreen } from "./screens/LocationScreen";
import { NightlifeScreen } from "./screens/NightlifeScreen";
import { OfficeScreen } from "./screens/OfficeScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { Tour360Screen } from "./screens/Tour360Screen";
import { AppStateProvider, useAppState } from "./store/AppState";
import "./design/global.css";
import "./components/components.css";
import "./screens/screens.css";

function MainTabs() {
  const { activeTab, setActiveTab } = useAppState();
  return (
    <div className="tab-shell">
      <div className="tab-panel">
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "explore" && <ExploreScreen />}
        {activeTab === "bookings" && <BookingsScreen />}
        {activeTab === "favorites" && <FavoritesScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function RootNavigator() {
  const { screen } = useAppState();
  return (
    <div className="site-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          style={{ position: "absolute", inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {screen === "splash" && <SplashScreen />}
          {screen === "onboarding" && <OnboardingScreen />}
          {screen === "location" && <LocationScreen />}
          {screen === "main" && <MainTabs />}
          {screen === "showcase" && <FeaturedShowcaseScreen />}
          {screen === "detail" && <CarDetailScreen />}
          {screen === "tour" && <Tour360Screen />}
          {screen === "gallery" && <GalleryScreen />}
          {(screen === "booking" || screen === "booking-success") && <BookingFlowScreen />}
          {screen === "nightlife" && <NightlifeScreen />}
          {screen === "office" && <OfficeScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="app-shell">
      <div className="site-viewport" role="application" aria-label="re7lety — Al Omda fleet">
        <MouseCursor />
        <RootNavigator />
      </div>
    </div>
    </AppStateProvider>
  );
}
