import { Outlet, Link } from "react-router-dom";
import Logo from "../components/common/Logo";

const STATS = [
  { value: "12k+", label: "Orders served daily" },
  { value: "340+", label: "Restaurants onboard" },
  { value: "99.9%", label: "Uptime this quarter" },
];

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-ink via-ink to-brand-900 px-12 py-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

        <Logo mark="light" className="relative z-10" />

        <div className="relative z-10 max-w-md">
          <p className="font-display text-[28px] font-semibold leading-snug">
            Every table, ticket and till — one dashboard for the whole
            service.
          </p>
          <p className="mt-4 text-sm text-white/60">
            ORDIX gives restaurant owners a single place to run staff,
            orders, and operations without the spreadsheet chaos.
          </p>
        </div>

        <div className="relative z-10 ticket-edge flex gap-8 pb-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mb-10 flex justify-between lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
