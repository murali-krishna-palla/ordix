import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiLoader, FiTrash2 } from "react-icons/fi";

import superAdminService from "../../services/superAdminService";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Unable to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (restaurant) => {
    setBusyId(restaurant.id);
    try {
      await superAdminService.deleteRestaurant(restaurant.id);
      toast.success(`${restaurant.name} removed successfully.`);
      fetchRestaurants();
    } catch (error) {
      toast.error(error.message || "Unable to remove this restaurant.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Restaurants</h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage active restaurants and remove stale records from the platform.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <FiLoader className="mx-auto animate-spin" size={20} />
                  </td>
                </tr>
              )}

              {!loading && restaurants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No restaurants available.
                  </td>
                </tr>
              )}

              {!loading &&
                restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="text-ink-soft">
                    <td className="px-5 py-3.5 font-medium text-ink">{restaurant.name}</td>
                    <td className="px-5 py-3.5">{restaurant.email}</td>
                    <td className="px-5 py-3.5">{restaurant.phone}</td>
                    <td className="px-5 py-3.5">{restaurant.city}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted capitalize">
                        {restaurant.status?.toLowerCase() || "unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(restaurant)}
                        disabled={busyId === restaurant.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-danger hover:bg-danger/10 disabled:opacity-50"
                        aria-label="Delete restaurant"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
