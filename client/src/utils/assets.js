import { SERVER_BASE_URL } from "../constants";

// Server stores relative paths like "uploads/logos/xyz.png" — resolve
// them against the API root (not /api/v1) since /uploads is served separately.
export const resolveAssetUrl = (path) => (path ? `${SERVER_BASE_URL}/${path}` : null);
