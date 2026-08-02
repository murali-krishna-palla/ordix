import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiPlus,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiUserX,
  FiUserCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import EmployeeFormModal from "../../components/common/EmployeeFormModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import employeeService from "../../services/employee.service";
import roleService from "../../services/role.service";
import { DEPARTMENT_OPTIONS, EMPLOYEE_STATUS } from "../../constants";
import { toLabel } from "../../utils/format";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: EMPLOYEE_STATUS.ACTIVE, label: "Active" },
  { key: EMPLOYEE_STATUS.INACTIVE, label: "Inactive" },
  { key: EMPLOYEE_STATUS.SUSPENDED, label: "Suspended" },
];

const STATUS_STYLES = {
  ACTIVE: "bg-success/10 text-success",
  INACTIVE: "bg-canvas text-muted",
  SUSPENDED: "bg-danger/10 text-danger",
};

const initials = (employee) =>
  `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase();

const LIMIT = 10;

const Staff = () => {
  const [employees, setEmployees] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formTarget, setFormTarget] = useState(null); // employee being edited, or {} for "add"
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles();
      // Owners shouldn't be able to hand out the primary admin role.
      setRoles(
        (Array.isArray(data) ? data : []).filter(
          (role) => role.name !== "RESTAURANT_ADMIN"
        )
      );
    } catch (error) {
      toast.error(error.message || "Unable to load roles.");
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees({
        page,
        limit: LIMIT,
        search: search || undefined,
        department: department || undefined,
        employeeStatus: statusFilter === "all" ? undefined : statusFilter,
      });
      setEmployees(data?.rows || []);
      setCount(data?.count || 0);
    } catch (error) {
      toast.error(error.message || "Unable to load staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, department, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, department, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(count / LIMIT));

  const handleSave = async (values) => {
    try {
      if (formTarget?.id) {
        const { roleId, ...rest } = values;
        await employeeService.updateEmployee(formTarget.id, rest);

        const currentRoleId = formTarget.roles?.[0]?.id;
        if (roleId && roleId !== currentRoleId) {
          await employeeService.changeEmployeeRole(formTarget.id, roleId);
        }

        toast.success("Employee updated.");
      } else {
        await employeeService.createEmployee(values);
        toast.success("Employee added.");
      }
      setFormTarget(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || "Unable to save this employee.");
    }
  };

  const handleToggleStatus = async (employee) => {
    const next =
      employee.employeeStatus === EMPLOYEE_STATUS.ACTIVE
        ? EMPLOYEE_STATUS.INACTIVE
        : EMPLOYEE_STATUS.ACTIVE;

    setBusyId(employee.id);
    try {
      await employeeService.updateEmployeeStatus(employee.id, next);
      toast.success(`${employee.firstName} is now ${next.toLowerCase()}.`);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setBusyId(deleteTarget.id);
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      toast.success(`${deleteTarget.firstName} has been removed.`);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.message || "Unable to remove this employee.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Staff</h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage roles, shifts, and permissions for your team.
          </p>
        </div>

        <Button className="sm:w-auto" onClick={() => setFormTarget({})}>
          <FiPlus size={16} />
          Add employee
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <span className="relative block w-full sm:max-w-xs">
            <FiSearch
              size={15}
              className="pointer-events-none absolute inset-y-0 left-3 my-auto text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone…"
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </span>

          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="sm:max-w-[200px]"
          >
            <option value="">All departments</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {toLabel(option)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                statusFilter === key
                  ? "bg-ink text-white"
                  : "border border-line bg-surface text-ink-soft hover:bg-canvas"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Employment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    <FiLoader className="mx-auto animate-spin" size={20} />
                  </td>
                </tr>
              )}

              {!loading && employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <p className="font-display text-base font-semibold text-ink">
                      No staff added yet
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                      Invite your team to start assigning roles and shifts.
                    </p>
                  </td>
                </tr>
              )}

              {!loading &&
                employees.map((employee) => {
                  const isBusy = busyId === employee.id;
                  const isActive =
                    employee.employeeStatus === EMPLOYEE_STATUS.ACTIVE;

                  return (
                    <tr key={employee.id} className="text-ink-soft">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
                            {initials(employee)}
                          </span>
                          <div>
                            <p className="font-medium text-ink">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-xs text-muted">
                              {employee.employeeCode || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p>{employee.email}</p>
                        <p className="text-xs text-muted">{employee.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {toLabel(employee.roles?.[0]?.name)}
                      </td>
                      <td className="px-5 py-3.5">
                        {toLabel(employee.department)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p>{toLabel(employee.employmentType)}</p>
                        <p className="text-xs text-muted">
                          {toLabel(employee.shift)}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            STATUS_STYLES[employee.employeeStatus] ||
                            "bg-canvas text-muted"
                          }`}
                        >
                          {employee.employeeStatus?.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setFormTarget(employee)}
                            disabled={isBusy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-canvas disabled:opacity-50"
                            aria-label="Edit employee"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(employee)}
                            disabled={isBusy}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-canvas disabled:opacity-50 ${
                              isActive ? "text-ember-500" : "text-success"
                            }`}
                            aria-label={
                              isActive
                                ? "Deactivate employee"
                                : "Activate employee"
                            }
                          >
                            {isActive ? (
                              <FiUserX size={14} />
                            ) : (
                              <FiUserCheck size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(employee)}
                            disabled={isBusy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-danger hover:bg-danger/10 disabled:opacity-50"
                            aria-label="Remove employee"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && count > 0 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-muted">
            <span>
              Page {page} of {totalPages} · {count} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-canvas disabled:opacity-40"
                aria-label="Previous page"
              >
                <FiChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-canvas disabled:opacity-40"
                aria-label="Next page"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <EmployeeFormModal
        open={!!formTarget}
        employee={formTarget?.id ? formTarget : null}
        roles={roles}
        onClose={() => setFormTarget(null)}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this employee?"
        description={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName} will lose access immediately. This can't be undone.`
            : ""
        }
        confirmLabel="Remove"
        loading={busyId === deleteTarget?.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Staff;
