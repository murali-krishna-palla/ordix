import { useEffect, useState } from "react";
import { FiTrendingUp, FiUsers, FiShoppingBag, FiClock } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import employeeService from "../../services/employee.service";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeStaffCount, setActiveStaffCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadActiveStaff = async () => {
      try {
        const data = await employeeService.getEmployees({
          employeeStatus: "ACTIVE",
          page: 1,
          limit: 1,
        });

        if (!cancelled) {
          setActiveStaffCount(data?.count || 0);
        }
      } catch (error) {
        if (!cancelled) {
          setActiveStaffCount(0);
        }
      }
    };

    loadActiveStaff();

    return () => {
      cancelled = true;
    };
  }, []);

  const STATS = [
    { label: "Orders today", value: "0", icon: FiShoppingBag, hint: "No orders yet" },
    {
      label: "Active staff",
      value: String(activeStaffCount),
      icon: FiUsers,
      hint:
        activeStaffCount > 0
          ? `${activeStaffCount} active staff member${activeStaffCount === 1 ? "" : "s"}`
          : "No active team members",
    },
    { label: "Revenue today", value: "₹0", icon: FiTrendingUp, hint: "No sales yet" },
    { label: "Avg. table time", value: "—", icon: FiClock, hint: "Not enough data" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">
          Welcome, {user?.firstName || "there"} 👋
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Here's what's happening at your restaurant today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon size={15} />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
            <p className="mt-1 text-xs text-muted">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">Your dashboard is ready</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Orders, staff schedules, and customer activity will show up here as soon as your team starts using ORDIX.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
