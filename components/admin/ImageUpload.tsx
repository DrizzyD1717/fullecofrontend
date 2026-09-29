// src/components/admin/ImageUpload.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aureooecommerce";

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-square w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-zinc-200 dark:bg-zinc-800">
          <Image
            src={value}
            alt="Product preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white shadow-md hover:bg-red-700 transition-colors"
            title="Remove Image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            folder: "aureooecommerce",
            maxFiles: 1,
            resourceType: "image",
          }}
          onSuccess={(result: any) => {
            if (result?.info?.secure_url) {
              onChange(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-400 dark:border-zinc-700 bg-white dark:bg-zinc-800/40 p-6 text-black dark:text-zinc-300 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm font-bold">
                Click to Upload Product Image
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Uploads directly to /aureooecommerce on Cloudinary
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
