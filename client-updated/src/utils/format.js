// Turns backend ENUM values like "FULL_TIME" into readable labels
// like "Full Time" for use in selects, badges, and table cells.
export const toLabel = (value) => {
  if (!value) return "—";
  return String(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
