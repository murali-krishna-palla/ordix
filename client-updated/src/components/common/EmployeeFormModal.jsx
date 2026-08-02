import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";

import FormField from "../ui/FormField";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  employeeSchema,
  employeeEditSchema,
} from "../../utils/validationSchemas";
import {
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SHIFT_OPTIONS,
} from "../../constants";
import { toLabel } from "../../utils/format";

const EMPTY_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  roleId: "",
  department: "",
  employmentType: "FULL_TIME",
  shift: "",
};

// Handles both "add employee" and "edit employee" — the only structural
// difference is that the password field (and its schema rule) only
// applies when creating a brand-new account.
const EmployeeFormModal = ({ open, employee, roles, onClose, onSubmit }) => {
  const isEdit = Boolean(employee);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEdit ? employeeEditSchema : employeeSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;

    if (employee) {
      reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        roleId: employee.roles?.[0]?.id || "",
        department: employee.department || "",
        employmentType: employee.employmentType || "FULL_TIME",
        shift: employee.shift || "",
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open, employee, reset]);

  if (!open) return null;

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onClose();
  };

  const submit = async (values) => {
    await onSubmit(values);
    reset(EMPTY_VALUES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <div className="absolute inset-0 bg-ink/40" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {isEdit ? "Edit employee" : "Add employee"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {isEdit
                ? "Update this team member's details and role."
                : "Invite a new team member to your restaurant."}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-muted hover:text-ink"
          >
            <FiX size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="mt-5 max-h-[70vh] space-y-4 overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="First name"
              placeholder="Riya"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <FormField
              label="Last name"
              placeholder="Sharma"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <FormField
            label="Email"
            type="email"
            placeholder="riya@ordix.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Phone"
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register("phone")}
            />

            {!isEdit && (
              <FormField
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                error={errors.password?.message}
                {...register("password")}
              />
            )}
          </div>

          <Select
            label="Role"
            error={errors.roleId?.message}
            {...register("roleId")}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {toLabel(role.name)}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Department"
              error={errors.department?.message}
              {...register("department")}
            >
              <option value="">Unassigned</option>
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {toLabel(option)}
                </option>
              ))}
            </Select>

            <Select
              label="Employment type"
              error={errors.employmentType?.message}
              {...register("employmentType")}
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {toLabel(option)}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Shift"
            error={errors.shift?.message}
            {...register("shift")}
          >
            <option value="">Unassigned</option>
            {SHIFT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {toLabel(option)}
              </option>
            ))}
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "Save changes" : "Add employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
