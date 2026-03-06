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
  const { bannerImageUrl, setBannerImage, setStep, eventId } =
    useEventBuilderStore();

  // State for Cropping
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [minCropDims, setMinCropDims] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      if (!eventId) throw new Error("No Event ID found");
      const data = await uploadImage(eventId, file);

      setBannerImage(data.banner_image_url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setBannerImage("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const imageUrl = bannerImageUrl || null;

  // Initial file selection
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Logic to generate the cropped blob and upload
  const getCroppedImg = async () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
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
        completedCrop.width,
        completedCrop.height,
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        setIsUploading(true);
        setShowCropModal(false);
        try {
          if (!eventId) throw new Error("No event ID to upload to.");
          const data = await uploadImage(eventId, blob);
          setBannerImage(data.banner_image_url);
        } catch (err) {
          setError("Upload failed");
        } finally {
          setIsUploading(false);
        }
      }, "image/jpeg");
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

    if (naturalWidth < 1280 || naturalHeight < 720) {
      setShowCropModal(false);
      setError("Image is too small. Minimum dimensions are 1280x720px.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const cssMinWidth = (1280 / naturalWidth) * width;
    const cssMinHeight = (720 / naturalHeight) * height;
    setMinCropDims({ width: cssMinWidth, height: cssMinHeight });

    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  return (
    <div className="mx-auto">
      <div className="p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <FormSection title="Event Media">
            <p className="text-white/30 text-sm mb-6">
              Upload a banner image that captures the vibe.
            </p>

            {/* Upload Zone */}
            <div className="mb-6">
              {!imageUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();

                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 py-16"
                  style={{
                    border: `2px dashed ${isDragging ? "#f97316" : "rgba(255,255,255,0.12)"}`,

                    background: isDragging
                      ? "rgba(249,115,22,0.05)"
                      : isUploading
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.02)",

                    boxShadow: isDragging
                      ? "0 0 30px rgba(249,115,22,0.15)"
                      : "none",
                  }}
                >
                  {isUploading ? (
                    <>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(249,115,22,0.1)" }}
                      >
                        <Loader2 className="w-7 h-7 text-orange-400 animate-spin" />
                      </div>

                      <div className="text-center">
                        <p className="text-white/60 font-semibold text-sm">
                          Uploading your banner...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: isDragging
                            ? "rgba(249,115,22,0.2)"
                            : "rgba(255,255,255,0.05)",
                        }}
                      >
                        <Upload
                          className="w-6 h-6"
                          style={{
                            color: isDragging
                              ? "#f97316"
                              : "rgba(255,255,255,0.3)",
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <p className="font-bold text-sm text-white/70">
                          {isDragging
                            ? "Drop it here!"
                            : "Click or drag to upload"}
                        </p>

                        <p className="text-white/30 text-xs mt-1">
                          JPG, PNG, WebP — max 5MB
                        </p>
                      </div>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              ) : (
                <div
                  className="relative rounded-xl overflow-hidden group"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <img
                    src={imageUrl}
                    alt="Event Banner"
                    className="w-full h-full object-cover aspect-video"
                  />

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      onClick={clearImage}
                      className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
                      style={{
                        background: "rgba(239,68,68,0.8)",

                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                  </div>

                  {/* Success badge */}

                  <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(0,0,0,0.6)",

                      backdropFilter: "blur(10px)",

                      color: "#4ade80",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Banner uploaded
                  </div>
                </div>
              )}

              {error && (
                <p className="text-orange-400 text-xs mt-2 font-medium">
                  {error}
                </p>
              )}
            </div>
          </FormSection>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={() => setStep(4)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] bg-orange-700"
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
          title="Crop Image"
          description="Upload a 1280 x 720 (16:9) image for a better result"
        >
          <div className="flex flex-col gap-4 max-w-full">
            <div className="max-h-[60vh] overflow-auto rounded-lg px-2">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
                minWidth={minCropDims.width}
                minHeight={minCropDims.height}
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 text-white/50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={getCroppedImg}
                className="px-6 py-2 bg-orange-700 rounded-xl font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Apply & Upload
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
