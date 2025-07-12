// import { DatePickerInput } from "@/components/ui/datePickerInput";
// import { Label } from "@/components/ui/label";
// import { Flex } from "@radix-ui/themes";

// type InputDatePickerProps = {
//   id?: string;
//   labelName: string;
//   onchange: (date: Date | undefined) => void;
//   defaultDate?: Date | undefined;
//   disabled?: boolean;
// };
// const InputDatePicker = (props: InputDatePickerProps) => {
//   const { id, labelName, onchange, defaultDate, disabled } = props;
//   return (
//     <Flex direction={"column"} gap={"2"}>
//       <Label htmlFor={id} className=" text-base">
//         {labelName}
//       </Label>

//       <DatePickerInput
//         id={id}
//         onchange={onchange}
//         defaultDate={defaultDate}
//         disabled={disabled}
//       />
//     </Flex>
//   );
// };

// export default InputDatePicker;
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { Label } from "@/components/ui/label";
import { Flex } from "@radix-ui/themes";

type InputDatePickerProps = {
  id?: string;
  labelName: string;
  onchange: (date: Date | undefined) => void;
  defaultDate?: Date | undefined;
  disabled?: boolean;
  labelOrientation?: "horizontal" | "vertical"; // Label position
};

const InputDatePicker = (props: InputDatePickerProps) => {
  const {
    id,
    labelName,
    onchange,
    defaultDate,
    disabled,
    labelOrientation = "vertical",
  } = props;

  return (
    <Flex direction={labelOrientation === "horizontal" ? "row" : "column"} gap="2">
      <Label
        htmlFor={id}
        style={{
          marginBottom: labelOrientation === "vertical" ? "0" : "0",
        }}
        className=" text-base"
      >
        {labelName}
      </Label>

      <DatePickerInput
        id={id}
        onchange={onchange}
        defaultDate={defaultDate}
        disabled={disabled}
        // labelOrientation={labelOrientation}
      />
    </Flex>
  );
};

export default InputDatePicker;
