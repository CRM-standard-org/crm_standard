const EmptyImage = ({ text }: { text?: string }) => {
  return (
    <div
      className={`w-full h-[225px] flex justify-center items-center bg-[#F6F7F9] border-[1px]${"border-[#E4E7EC]"} rounded-[8px] border-dashed  touch-none mt-4`}
    >
      <div className="flex flex-col text-center w-full p-[8px]">
        <span className=" font-semibold text-16">{text ?? "ไม่มีรูปภาพ"}</span>
      </div>
    </div>
  );
};

export default EmptyImage;
