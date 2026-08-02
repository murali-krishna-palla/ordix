import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiGrid, FiClipboard, FiLogOut, FiMenu, FiX, FiShield } from "react-icons/fi";

import Logo from "../components/common/Logo";
import useSuperAdminAuth from "../hooks/useSuperAdminAuth";

const NAV_ITEMS = [
  { to: "/super-admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  {
    to: "/super-admin/registration-requests",
    label: "Registration Requests",
    icon: FiClipboard,
  },
];

const navLinkClass = ({ isActive }) =>
  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-ink-soft hover:bg-canvas-alt hover:text-ink"
  }`;

// Kept independent from DashboardLayout.jsx (restaurant admins) per the
// "separate layout for /super-admin/*" requirement — the two audiences
// should never share a navbar or sidebar.
const SuperAdminLayout = () => {
  const { admin, logout } = useSuperAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    navigate("/super-admin/login", { replace: true });
  };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 px-2">
        <Logo />
        <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Admin
        </span>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
          Console
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

          <div className="hidden items-center gap-1.5 text-sm text-muted lg:flex">
            <FiShield size={14} />
            <Link to="/super-admin/dashboard" className="hover:text-ink">
              Super Admin Console
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ink to-brand-900 text-xs font-semibold text-white">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </span>
            <span className="hidden sm:inline">{admin?.name || "Super Admin"}</span>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
