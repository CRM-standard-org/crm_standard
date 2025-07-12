import { TextArea } from "@radix-ui/themes";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaFormProps {
  placeholder: string;
  register: UseFormRegisterReturn; // Proper typing for register
  msgError?: string;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const { register, placeholder, msgError } = props;
  return (
    <>
      <TextArea
        {...register}
        variant="soft"
        placeholder={placeholder}
        className="[&>*]:!text-white [&>*]:!border-[1px] [&>*]:!border-solid [&>*]:!outline-main [&>*]:!placeholder-white"
      />
      {msgError && <div className="text-require">{msgError}</div>}
      <div className="grid grid-cols-3 grid-rows-8 gap-4">
        <div className="p-2 bg-red-500 col-span-2 row-span-4">1</div>
        <div className=" p-2 bg-red-500 col-start-3">2</div>
        <div className="p-2 bg-red-500 col-start-3 row-start-2">3</div>
        <div className="p-2 bg-red-500 col-start-3 row-start-3">4</div>
        <div className="p-2 bg-red-500 row-span-2">5</div>
        <div className="p-2 bg-red-500 col-span-2 row-span-4 row-start-5">6</div>
      </div>
    </>
  );
};

export default TextAreaForm;
