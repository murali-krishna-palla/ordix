import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiGrid,
  FiHome,
  FiUsers,
  FiClipboard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

import Logo from "../components/common/Logo";
import useAuth from "../hooks/useAuth";
import restaurantService from "../services/restaurant.service";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/hotel", label: "Hotel", icon: FiHome },
  { to: "/dashboard/staff", label: "Staff", icon: FiUsers },
  { to: "/dashboard/customers", label: "Customers", icon: FiClipboard },
  { to: "/dashboard/settings", label: "Settings", icon: FiSettings },
];

const navLinkClass = ({ isActive }) =>
  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-ink-soft hover:bg-canvas-alt hover:text-ink"
  }`;

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState(null);
  const menuRef = useRef(null);

  // The auth payload doesn't carry the restaurant relation, so pull the
  // name from the dedicated profile endpoint for the topbar.
  useEffect(() => {
    let cancelled = false;

    restaurantService
      .getProfile()
      .then((data) => {
        if (!cancelled) setRestaurantName(data.name);
      })
      .catch(() => {
        // Non-critical — the topbar just falls back to a generic label.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    navigate("/login", { replace: true });
  };

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  const SidebarContent = (
    <>
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
          Workspace
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon size={17} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="ticket-edge pb-4" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-danger-soft hover:text-danger"
      >
        <FiLogOut size={17} />
        Log out
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="animate-fade-in absolute inset-y-0 left-0 flex w-64 flex-col bg-surface px-4 py-6 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted hover:bg-canvas-alt hover:text-ink"
            >
              <FiX size={18} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/90 px-5 py-3.5 backdrop-blur lg:px-8">
          <button
            className="text-ink-soft lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden lg:block">
            <Link
              to="/dashboard/hotel"
              className="flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {restaurantName || "Your restaurant"}
            </Link>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm font-medium text-ink transition hover:bg-canvas-alt"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
                {initials || "U"}
              </span>
              <span className="hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
              <FiChevronDown size={14} className="hidden text-muted sm:inline" />
            </button>

            {menuOpen && (
              <div className="animate-fade-in absolute right-0 top-[calc(100%+8px)] w-52 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-[var(--shadow-card-hover)]">
                <div className="border-b border-line-soft px-3.5 py-2.5">
                  <p className="truncate text-sm font-semibold text-ink">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-xs text-muted">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink-soft transition hover:bg-canvas-alt hover:text-ink"
                >
                  <FiSettings size={15} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-danger transition hover:bg-danger-soft"
                >
                  <FiLogOut size={15} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
