import { blobToFile } from "@/types/file";
import { ReactNode } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { BiImageAdd } from "react-icons/bi";

type UploadFieldProps = {
  id?: string;
  files: blobToFile[];
  isError: boolean;
  onCheckFileUpload: (acceptedFiles: File[]) => void;
  acceptOption?: Accept | undefined;
  acceptDescription?: string;
  onLoading: (loading: boolean) => void;
  multiple?: boolean;
  iconFileUpload?: ReactNode;
};

export default function UploadField(props: UploadFieldProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles) {
      props.onLoading(false);
      props.onCheckFileUpload(acceptedFiles);
    },
    accept: props.acceptOption ?? {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
    },
    multiple: props.multiple ?? true,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-[225px] flex justify-center items-center bg-[#F6F7F9] border-[1px]${
        props.isError ? "border-[#D92D20]" : "border-[#E4E7EC]"
      } rounded-[8px] border-dashed cursor-pointer touch-none `}
    >
      <div className="flex flex-col text-center w-full p-[8px]">
        <input id={props.id ?? "fileupload"} {...getInputProps()} />
        {props.iconFileUpload ?? (
          <BiImageAdd
            style={{ width: "64px", height: "64px" }}
            className="mb-4 self-center mt-[8px] touch-none pointer-events-none"
          />
        )}
        <span className=" font-semibold text-16">คลิกเพื่ออัปโหลด</span>
        {props.files && props.files?.length > 0 ? null : (
          <span className="text-[#98A2B3] text-sm">
            {props.acceptDescription ??
              "กรุณาเลือกรูป 3:4 กว้างxสูง  (ประเภทไฟล์ PNG หรือ JPG, 5 Mb/ไฟล์)"}
          </span>
        )}
      </div>
    </div>
  );
}
