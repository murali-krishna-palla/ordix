import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Logo from "../../components/common/Logo";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-brand-100) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <Logo className="relative mb-8" />
      <p className="relative font-display text-7xl font-extrabold tracking-tight text-ink">
        404
      </p>
      <h1 className="relative mt-3 text-xl font-semibold text-ink">Page not found</h1>
      <p className="relative mt-1.5 max-w-sm text-[15px] text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="relative mt-6 w-44">
        <Button>
          <FiArrowLeft size={15} />
          Back home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
