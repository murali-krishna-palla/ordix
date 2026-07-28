import {
  FiWifi,
  FiTruck,
  FiCoffee,
  FiTv,
  FiWind,
  FiShield,
  FiPhone,
  FiSun,
  FiDroplet,
  FiHeart,
  FiHome,
  FiTag,
} from "react-icons/fi";
import { MdOutlinePool, MdOutlineFitnessCenter, MdOutlineLocalBar, MdOutlinePets } from "react-icons/md";

// Best-effort keyword match so amenities saved as free text ("Free WiFi",
// "Swimming Pool") still get a sensible icon instead of a generic tag.
const ICON_RULES = [
  [/wi[\s-]?fi|internet/i, FiWifi],
  [/park/i, FiTruck],
  [/breakfast|coffee|cafe/i, FiCoffee],
  [/pool|swim/i, MdOutlinePool],
  [/gym|fitness/i, MdOutlineFitnessCenter],
  [/bar|lounge/i, MdOutlineLocalBar],
  [/pet/i, MdOutlinePets],
  [/tv|television/i, FiTv],
  [/ac|air.?condition/i, FiWind],
  [/security|safe/i, FiShield],
  [/room service|reception|front desk/i, FiPhone],
  [/spa|sauna/i, FiSun],
  [/laundry|dry clean/i, FiDroplet],
  [/health|first aid/i, FiHeart],
  [/elevator|lift/i, FiHome],
];

export const getAmenityIcon = (label = "") => {
  const match = ICON_RULES.find(([pattern]) => pattern.test(label));
  return match ? match[1] : FiTag;
};
