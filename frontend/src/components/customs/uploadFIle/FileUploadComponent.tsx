import React, { useEffect, useRef, useState } from "react";
import { TiAttachment } from "react-icons/ti";
import { Dialog } from "@radix-ui/themes";
import { useToast } from "@/components/customs/alert/useToast";

type FileUploadProps = {
  onFilesChange: (files: File[]) => void;
  defaultFiles?: File[];
  id?: string;
  label?: string;
  labelFile?: string;
  className?: string;
  classNameInput?: string;
  classNameLabel?: string;
  require?: string;
  // Allow selecting multiple files; default true to preserve current behavior
  multiple?: boolean;
  // Optional cap for total files kept in the component (useful for avatar/logo)
  maxFiles?: number;
  // Optional: override accepted file extensions and mime types
  // If not provided, sensible defaults (images, pdf, office docs, csv, txt) are used
  acceptExtensions?: string[];
  acceptMimeTypes?: string[];
  acceptDescription?: string;
};

const FileUploadComponent: React.FC<FileUploadProps> = ({
  onFilesChange,
  defaultFiles = [],
  id = "",
  label = "",
  labelFile = "",
  className = "",
  classNameInput = "",
  classNameLabel = "",
  require = "",
  multiple = true,
  maxFiles,
  acceptExtensions,
  acceptMimeTypes,
  acceptDescription,
}) => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (files.length === 0 && defaultFiles.length > 0) {
      setFiles(defaultFiles);
    }
  }, [defaultFiles, files.length]);

  // Restrict defaults to match backend: only .jpg, .jpeg, .png, .pdf
  const defaultExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
  const defaultMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  const allowedExtensions = (acceptExtensions && acceptExtensions.length
    ? acceptExtensions
    : defaultExtensions
  ).map((e) => e.toLowerCase());
  const allowedMimeTypes = acceptMimeTypes && acceptMimeTypes.length
    ? acceptMimeTypes
    : defaultMimeTypes;
  const derivedAcceptText = `รองรับ: ${allowedExtensions.join(", ")}`;
  const acceptList = [...allowedExtensions, ...allowedMimeTypes];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    let acceptedFiles = selectedFiles.filter((file) => {
      const typeOk = file.type
        ? allowedMimeTypes.includes(file.type)
        : false;
      const name = (file.name || "").toLowerCase();
      const extOk = allowedExtensions.some((ext) => name.endsWith(ext));
      return typeOk || extOk;
    });

    // Enforce max files if provided
    if (typeof maxFiles === "number" && maxFiles >= 0) {
      const remaining = Math.max(0, maxFiles - files.length);
      if (remaining <= 0) {
        showToast(`ถึงจำนวนไฟล์สูงสุดแล้ว (${maxFiles})`, false);
        e.target.value = "";
        return;
      }
      if (acceptedFiles.length > remaining) {
        acceptedFiles = acceptedFiles.slice(0, remaining);
        showToast(`เลือกได้สูงสุด ${maxFiles} ไฟล์`, false);
      }
    }

    if (acceptedFiles.length === 0) {
      showToast("อนุญาตเฉพาะไฟล์ .jpg, .png และ .pdf เท่านั้น", false);
      return;
    }

    const updatedFiles = [...files, ...acceptedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    showToast("เพิ่มไฟล์เรียบร้อยแล้ว", true);

    e.target.value = "";
  };




  const handleRemoveFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onFilesChange(updated);
  };

  const getFileURL = (file: File) => URL.createObjectURL(file);

  return (
    <>
      <div
        className={`${className || ""} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
      >
  {label && (
          <label htmlFor={id} className={classNameLabel}>
            {label}{require && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex bg-blue-100 hover:bg-blue-200 text-main text-sm px-3 py-1.5 rounded-md shadow"
          >
            <TiAttachment className="mr-1" />
            {labelFile}
          </button>
          <span className="text-sm text-gray-400">{acceptDescription || derivedAcceptText}</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptList.join(",")}
          onChange={handleFileChange}
          className={`hidden ${classNameInput}`}
        />


      </div>
      {/* Preview */}
      <div className="flex overflow-x-auto space-x-4 mt-2">
        {files.map((file, index) => {
          const url = getFileURL(file);

      if (!file.type.startsWith("image/")) {
            return (
              <div
                key={index}
        className="w-40 h-40 bg-gray-100 flex flex-col items-center justify-center border border-gray-300 text-blue-600 text-xs rounded shadow relative p-2"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500 text-center"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 text-xs mt-2"
                >
                  ลบ
                </button>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="w-40 h-40 shrink-0 relative border rounded shadow group"
            >
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-full h-full object-cover rounded cursor-pointer"
                onClick={() => setPreviewImage(url)}
              />
              <button
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-500 text-xs px-1 rounded opacity-0 group-hover:opacity-100"
              >
                ลบ
              </button>
            </div>
          );
        })}
      </div>

      {/* zoom */}
      {previewImage && (
        <Dialog.Root open onOpenChange={() => setPreviewImage(null)}>
          <Dialog.Content className="w-auto flex justify-center items-center bg-white p-4 rounded shadow">
            <img
              src={previewImage}
              className="max-h-[80vh] object-contain"
              alt="Full preview"
            />
          </Dialog.Content>
        </Dialog.Root>
      )}</>
  );
};

export default FileUploadComponent;
