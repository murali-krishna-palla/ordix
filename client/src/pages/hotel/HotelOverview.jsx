import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiImage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiFileText,
  FiClock,
  FiEdit2,
  FiInfo,
} from "react-icons/fi";

import restaurantService from "../../services/restaurant.service";
import { resolveAssetUrl } from "../../utils/assets";
import { getAmenityIcon } from "../../utils/amenityIcons";
import Button from "../../components/ui/Button";

const InfoCard = ({ icon: Icon, label, value, href }) => (
  <div className="card card-hover p-5">
    <div className="flex items-center gap-2 text-sm font-medium text-muted">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas-alt text-brand-600">
        <Icon size={14} />
      </span>
      {label}
    </div>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2.5 block break-words text-[15px] font-semibold text-brand-600 hover:underline"
      >
        {value}
      </a>
    ) : (
      <p className="mt-2.5 break-words text-[15px] font-semibold text-ink">{value}</p>
    )}
  </div>
);

const EmptyNote = ({ children }) => (
  <div className="rounded-xl border border-dashed border-line bg-canvas-alt px-5 py-6 text-center text-sm text-muted">
    {children}
  </div>
);

const HotelOverview = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await restaurantService.getProfile();
        setRestaurant(data);
      } catch (error) {
        toast.error(error.message || "Unable to load your hotel profile.");
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
          Couldn't load your hotel
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Refresh the page, or check that the server is running.
        </p>
      </div>
    );
  }

  const bannerUrl = resolveAssetUrl(restaurant.banner);
  const logoUrl = resolveAssetUrl(restaurant.logo);
  const initials = (restaurant.name || "H").slice(0, 2).toUpperCase();

  // These three sections only render once the backend actually returns the
  // field — amenities, check-in/out, and policies aren't part of the current
  // Restaurant model, so nothing is fabricated here.
  const hasAmenities = Array.isArray(restaurant.amenities) && restaurant.amenities.length > 0;
  const hasBusinessHours = Boolean(restaurant.checkInTime || restaurant.checkOutTime);
  const hasPolicies = Array.isArray(restaurant.policies) && restaurant.policies.length > 0;

  return (
    <div>
      {/* Hero: banner with overlapping logo */}
      <div className="relative">
        <div className="aspect-[3/1] w-full overflow-hidden rounded-2xl border border-line bg-canvas shadow-sm sm:aspect-[4/1]">
          {bannerUrl ? (
            <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 via-canvas-alt to-canvas text-muted">
              <FiImage size={26} />
            </div>
          )}
        </div>

        <div className="absolute -bottom-8 left-4 sm:-bottom-10 sm:left-6">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={restaurant.name}
              className="h-16 w-16 rounded-2xl border-4 border-surface bg-surface object-cover shadow-md sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-surface bg-gradient-to-br from-ink to-brand-900 text-lg font-bold text-white shadow-md sm:h-20 sm:w-20">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Name, description, edit action */}
      <div className="mt-12 flex flex-col gap-4 sm:mt-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold text-ink">
            {restaurant.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
            {restaurant.description || "No description added yet."}
          </p>
        </div>

        <Button
          variant="secondary"
          className="w-auto shrink-0 px-4"
          onClick={() => navigate("/dashboard/settings")}
        >
          <FiEdit2 size={15} />
          Edit hotel
        </Button>
      </div>

      {/* Core info */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard icon={FiMapPin} label="Address" value={formatAddress(restaurant)} />
        <InfoCard icon={FiPhone} label="Contact number" value={restaurant.phone} />
        <InfoCard icon={FiMail} label="Email" value={restaurant.email} />
        {restaurant.website && (
          <InfoCard
            icon={FiGlobe}
            label="Website"
            value={restaurant.website}
            href={restaurant.website}
          />
        )}
        {restaurant.gstNumber && (
          <InfoCard icon={FiFileText} label="GST number" value={restaurant.gstNumber} />
        )}
      </div>

      {/* Business hours — only when the backend provides it */}
      {hasBusinessHours && (
        <section className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Business hours</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {restaurant.checkInTime && (
              <InfoCard icon={FiClock} label="Check-in" value={restaurant.checkInTime} />
            )}
            {restaurant.checkOutTime && (
              <InfoCard icon={FiClock} label="Check-out" value={restaurant.checkOutTime} />
            )}
          </div>
        </section>
      )}

      {/* Amenities */}
      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Amenities</h2>
        {hasAmenities ? (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {restaurant.amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <span
                  key={amenity}
                  className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft shadow-sm"
                >
                  <Icon size={15} className="text-brand-600" />
                  {amenity}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyNote>No amenities added yet.</EmptyNote>
          </div>
        )}
      </section>

      {/* Policies — only when the backend provides it (skipped entirely otherwise) */}
      {hasPolicies && (
        <section className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Hotel policies</h2>
          <ul className="mt-3 space-y-2">
            {restaurant.policies.map((policy, i) => (
              <li
                key={i}
                className="card flex items-start gap-2.5 p-4 text-sm text-ink-soft"
              >
                <FiInfo size={15} className="mt-0.5 shrink-0 text-brand-600" />
                {policy}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const formatAddress = (restaurant) => {
  const { address, city, state, country, postalCode } = restaurant;
  return [address, city, state, postalCode, country].filter(Boolean).join(", ");
};

export default HotelOverview;
