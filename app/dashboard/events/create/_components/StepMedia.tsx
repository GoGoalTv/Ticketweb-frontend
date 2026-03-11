"use client";

import { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { useEventBuilderStore } from "@/lib/store/eventBuilderStore";
import { Event } from "@/lib/schema/eventTied";
import { uploadImage } from "@/lib/api";
import { Upload, X, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import FormSection from "@/components/ui/FormSection";
import Modal from "@/components/ui/Modal"; // Ensure you have a modal component

// Utility to handle 16:9 aspect ratio
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export default function StepMedia() {
  const { bannerImageUrl, eventImageUrl, setBannerImage, setEventImage, setStep, eventId } =
    useEventBuilderStore();

  // State for Cropping
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [minCropDims, setMinCropDims] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropType, setCropType] = useState<"banner" | "portrait">("banner");
  const [portraitAspect, setPortraitAspect] = useState<number>(4/5);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState<"banner" | "portrait" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portraitFileInputRef = useRef<HTMLInputElement>(null);

  const clearImage = (type: "banner" | "portrait") => {
    if (type === "banner") setBannerImage("");
    else setEventImage("");
  };

  // Initial file selection
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "portrait") => {
    setError(null);
    setCropType(type);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Logic to generate the cropped blob and upload
  const getCroppedImg = async () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        setIsUploading(true);
        setUploadingField(cropType);
        setShowCropModal(false);
        try {
          if (!eventId) throw new Error("No event ID to upload to.");
          const fieldName = cropType === "banner" ? "banner_image" : "event_image";
          const data = await uploadImage(eventId, blob, fieldName);
          if (cropType === "banner") {
            setBannerImage(data.banner_image_url);
          } else {
            setEventImage(data.image_url);
          }
        } catch (err) {
          setError("Upload failed");
        } finally {
          setIsUploading(false);
          setUploadingField(null);
        }
      }, "image/jpeg", 0.9);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    const aspect = cropType === "banner" ? 16 / 9 : portraitAspect;

    setCrop(centerAspectCrop(width, height, aspect));
  }

  return (
    <div className="mx-auto">
      <div className="p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          <FormSection title="Event Media">
            <p className="text-white/30 text-sm mb-6">
              Upload a banner image (16:9) for the event page and a portrait image (4:5 or 9:16) for lists.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* BANNER SECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Banner Image (16:9)</label>
                {!bannerImageUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-white/[0.02]"
                  >
                    {uploadingField === "banner" ? (
                      <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-white/30" />
                        <div className="text-center">
                          <p className="font-bold text-xs text-white/70">Upload Banner</p>
                          <p className="text-white/30 text-[10px] mt-1">16:9 — Recommended</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSelectFile(e, "banner")}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden group border border-white/10 aspect-video">
                    <img src={bannerImageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button onClick={() => clearImage("banner")} className="px-3 py-1.5 bg-red-500/80 rounded-lg text-[10px] font-bold">Remove</button>
                    </div>
                  </div>
                )}
              </div>

              {/* PORTRAIT SECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Portrait Image (4:5 / 9:16)</label>
                {!eventImageUrl ? (
                  <div
                    onClick={() => portraitFileInputRef.current?.click()}
                    className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-white/[0.02]"
                  >
                    {uploadingField === "portrait" ? (
                      <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-white/30" />
                        <div className="text-center">
                          <p className="font-bold text-xs text-white/70">Upload Portrait</p>
                          <p className="text-white/30 text-[10px] mt-1">For mobile & lists</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={portraitFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSelectFile(e, "portrait")}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden group border border-white/10 h-48 mx-auto aspect-[4/5]">
                    <img src={eventImageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button onClick={() => clearImage("portrait")} className="px-3 py-1.5 bg-red-500/80 rounded-lg text-[10px] font-bold">Remove</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-orange-400 text-xs mt-4 font-medium">{error}</p>}
          </FormSection>
        </div>

        <div className="flex justify-between mt-12">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={() => setStep(4)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] bg-orange-700"
          >
            Next: Preview <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CROP MODAL */}
      {showCropModal && (
        <Modal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          title={`Crop ${cropType === "banner" ? "Banner" : "Portrait Image"}`}
        >
          <div className="flex flex-col gap-4 max-w-full">
            {cropType === "portrait" && (
                <div className="flex gap-4 mb-2">
                    <button 
                        onClick={() => setPortraitAspect(4/5)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${portraitAspect === 4/5 ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}
                    >
                        4:5 Ratio
                    </button>
                    <button 
                        onClick={() => setPortraitAspect(9/16)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${portraitAspect === 9/16 ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}
                    >
                        9:16 Ratio
                    </button>
                </div>
            )}
            <div className="max-h-[60vh] overflow-auto rounded-lg px-2">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={cropType === "banner" ? 16 / 9 : portraitAspect}
                className="w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-3 p-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 text-white/50 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={getCroppedImg}
                disabled={isUploading}
                className="px-6 py-2 bg-orange-700 rounded-xl font-bold text-white flex items-center gap-2"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Apply & Upload
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
