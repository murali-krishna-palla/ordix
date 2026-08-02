import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="font-display text-6xl font-extrabold text-ink">404</p>
      <h1 className="mt-3 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-1.5 max-w-sm text-[15px] text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="mt-6 w-40">
        <Button>Back home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
