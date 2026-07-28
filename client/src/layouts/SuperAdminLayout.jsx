import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiGrid, FiClipboard, FiLogOut, FiMenu, FiShield } from "react-icons/fi";

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
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-ink-soft hover:bg-canvas hover:text-ink"
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
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-canvas hover:text-danger"
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
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface px-4 py-6 shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-3.5 lg:px-8">
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
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
