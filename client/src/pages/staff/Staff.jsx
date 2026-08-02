import { FiUsers, FiUserPlus } from "react-icons/fi";
import Button from "../../components/ui/Button";

const Staff = () => {
  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Staff</h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage roles, shifts, and permissions for your team.
          </p>
        </div>
        <Button className="w-auto shrink-0 px-4" disabled>
          <FiUserPlus size={15} />
          Invite staff
        </Button>
      </div>

      <div className="card p-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiUsers size={22} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">
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
