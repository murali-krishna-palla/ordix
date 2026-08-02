import { useEffect, useState } from "react";
import { FiLoader, FiUser, FiImage, FiSliders, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

import restaurantService from "../../services/restaurant.service";
import ProfileTab from "./ProfileTab";
import BrandingTab from "./BrandingTab";
import BusinessTab from "./BusinessTab";
import SecurityTab from "./SecurityTab";

const TABS = [
  { key: "profile", label: "Profile", icon: FiUser },
  { key: "branding", label: "Branding", icon: FiImage },
  { key: "business", label: "Business", icon: FiSliders },
  { key: "security", label: "Security", icon: FiLock },
];

const Settings = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await restaurantService.getProfile();
        setRestaurant(data);
      } catch (error) {
        toast.error(error.message || "Unable to load your restaurant profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <FiLoader className="animate-spin text-muted" size={22} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          Couldn't load your restaurant
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Refresh the page, or check that the server is running.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-[15px] text-muted">
          Manage your restaurant's profile, branding, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Tab nav */}
        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                tab === key
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-soft hover:bg-canvas-alt hover:text-ink"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600 transition-opacity lg:block ${
                  tab === key ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Active tab panel */}
        <div className="card p-6">
          {tab === "profile" && (
            <ProfileTab restaurant={restaurant} onSaved={setRestaurant} />
          )}
          {tab === "branding" && (
            <BrandingTab restaurant={restaurant} onSaved={setRestaurant} />
          )}
          {tab === "business" && (
            <BusinessTab restaurant={restaurant} onSaved={setRestaurant} />
          )}
          {tab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
