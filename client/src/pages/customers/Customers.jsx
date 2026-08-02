import { FiClipboard } from "react-icons/fi";

const Customers = () => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">Customers</h1>
        <p className="mt-1 text-[15px] text-muted">
          Track visits, favorites, and feedback from your regulars.
        </p>
      </div>

      <div className="card p-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiClipboard size={22} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
          No customers yet
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Customer profiles will appear here once orders start coming in.
        </p>
      </div>
    </div>
  );
};

export default Customers;
