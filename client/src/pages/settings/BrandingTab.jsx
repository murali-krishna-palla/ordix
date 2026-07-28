import { useRef, useState } from "react";
import { FiUploadCloud, FiImage, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import clsx from "clsx";

import Button from "../../components/ui/Button";
import restaurantService from "../../services/restaurant.service";
import { resolveAssetUrl } from "../../utils/assets";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UploadCard = ({
  title,
  hint,
  shape, // "square" | "wide"
  currentPath,
  maxSizeMb,
  uploading,
  onUpload,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const currentUrl = preview || resolveAssetUrl(currentPath);
  const hasImage = Boolean(currentUrl);

  const handleFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be under ${maxSizeMb}MB.`);
      return;
    }

    setPreview(URL.createObjectURL(file));
    onUpload(file);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
      <p className="mt-0.5 text-sm text-muted">{hint}</p>

      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        className={clsx(
          "group relative mt-4 block overflow-hidden rounded-xl border bg-canvas text-left transition disabled:cursor-wait",
          shape === "square" ? "aspect-square w-32" : "aspect-[3/1] w-full",
          hasImage ? "border-line" : "border-2 border-dashed border-line hover:border-brand-300 hover:bg-brand-50/40"
        )}
      >
        {hasImage ? (
          <>
            <img src={currentUrl} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/50 group-hover:opacity-100">
              <FiEdit2 size={15} />
              <span className="text-sm font-medium">Replace</span>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted transition group-hover:text-brand-600">
            <FiImage size={20} />
            <span className="px-2 text-center text-xs font-medium">Click to upload</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
            <FiUploadCloud className="animate-pulse text-brand-600" size={20} />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="mt-2.5 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-auto px-3.5 py-2 text-sm"
          loading={uploading}
          onClick={openPicker}
        >
          <FiUploadCloud size={14} />
          {hasImage ? "Replace" : "Upload"}
        </Button>
        <p className="text-xs text-muted">JPG, PNG, or WEBP · up to {maxSizeMb}MB</p>
      </div>
    </div>
  );
};

const BrandingTab = ({ restaurant, onSaved }) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleLogoUpload = async (file) => {
    setUploadingLogo(true);
    try {
      const { logo } = await restaurantService.uploadLogo(file);
      onSaved({ ...restaurant, logo });
      toast.success("Logo updated.");
    } catch (error) {
      toast.error(error.message || "Unable to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (file) => {
    setUploadingBanner(true);
    try {
      const { banner } = await restaurantService.uploadBanner(file);
      onSaved({ ...restaurant, banner });
      toast.success("Banner updated.");
    } catch (error) {
      toast.error(error.message || "Unable to upload banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="space-y-8">
      <UploadCard
        title="Logo"
        hint="Shown on your Hotel Overview page and in the sidebar. Square images work best."
        shape="square"
        currentPath={restaurant.logo}
        maxSizeMb={2}
        uploading={uploadingLogo}
        onUpload={handleLogoUpload}
      />

      <div className="border-t border-line pt-8">
        <UploadCard
          title="Banner"
          hint="The wide cover image at the top of your Hotel Overview page."
          shape="wide"
          currentPath={restaurant.banner}
          maxSizeMb={5}
          uploading={uploadingBanner}
          onUpload={handleBannerUpload}
        />
      </div>
    </div>
  );
};

export default BrandingTab;
