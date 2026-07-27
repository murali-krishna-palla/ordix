const Staff = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Staff</h1>
      <p className="mt-1 text-[15px] text-muted">
        Manage roles, shifts, and permissions for your team.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          No staff added yet
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Invite your team to start assigning roles and shifts.
        </p>
      </div>
    </div>
  );
};

export default Staff;
