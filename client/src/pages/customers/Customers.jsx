const Customers = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Customers</h1>
      <p className="mt-1 text-[15px] text-muted">
        Track visits, favorites, and feedback from your regulars.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">
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
