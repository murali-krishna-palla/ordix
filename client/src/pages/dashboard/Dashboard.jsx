import { FiTrendingUp, FiUsers, FiShoppingBag, FiClock, FiArrowUpRight } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const STATS = [
  { label: "Orders today", value: "0", icon: FiShoppingBag, hint: "No orders yet" },
  { label: "Active staff", value: "1", icon: FiUsers, hint: "Just you, for now" },
  { label: "Revenue today", value: "₹0", icon: FiTrendingUp, hint: "No sales yet" },
  { label: "Avg. table time", value: "—", icon: FiClock, hint: "Not enough data" },
];

const CHECKLIST = [
  { label: "Create your account", done: true },
  { label: "Set up your hotel profile", done: false, to: "/dashboard/settings" },
  { label: "Add your first staff member", done: false, to: "/dashboard/staff" },
  { label: "Take your first order", done: false },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Welcome, {user?.firstName || "there"} 👋
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Here's what's happening at your restaurant today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="card card-hover p-5">
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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Activity placeholder */}
        <div className="card relative overflow-hidden p-8 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-brand-100) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <FiShoppingBag size={20} />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-ink">
              Your dashboard is ready
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Orders, staff schedules, and customer activity will show up here as
              soon as your team starts using ORDIX.
            </p>
          </div>
        </div>

        {/* Getting started checklist */}
        <div className="card p-6">
          <h2 className="font-display text-base font-semibold text-ink">
            Getting started
          </h2>
          <p className="mt-0.5 text-sm text-muted">Finish setting up your workspace.</p>

          <ul className="mt-4 space-y-1">
            {CHECKLIST.map(({ label, done, to }) => (
              <li key={label}>
                {to ? (
                  <a
                    href={to}
                    className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2.5 text-sm transition hover:bg-canvas-alt"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          done
                            ? "bg-success text-white"
                            : "border border-line text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={done ? "text-muted line-through" : "text-ink-soft"}>
                        {label}
                      </span>
                    </span>
                    <FiArrowUpRight size={14} className="text-faint" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        done
                          ? "bg-success text-white"
                          : "border border-line text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={done ? "text-muted line-through" : "text-ink-soft"}>
                      {label}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
