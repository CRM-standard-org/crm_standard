// import { Text } from "@radix-ui/themes";

// type CheckboxMainComponentProps = {
//   labelName?: string;
//   checked: boolean; // เปลี่ยนจาก defaultChecked เป็น checked
//   onChange: (checked: boolean) => void;
//   disabled?: boolean;
// };

// const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
//   const { labelName, checked, onChange, disabled } = props;
//   return (
//     <Text as="label" size="2" className=" flex gap-2 ">
//       <input
//         type="checkbox"
//         checked={checked} // ใช้ checked แทน defaultChecked
//         onChange={(e) => onChange(e.target.checked)} // onChange รับค่าจาก e.target.checked
//         disabled={disabled}
//         className=" h-[24px] w-[24px]"
//       />
//       {labelName}
//     </Text>
//   );
// };

// export default CheckboxMainComponent;
// import { Text } from "@radix-ui/themes";

// type CheckboxMainComponentProps = {
//   labelName?: string;
//   checked: boolean; // ต้องเป็น boolean
//   onCheckedChange: (checked: boolean) => void;
//   disabled?: boolean;
// };

// const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
//   const { labelName, checked = false, onCheckedChange, disabled } = props; // กำหนดค่า default เป็น false

//   return (
//     <Text as="label" size="2" className="flex gap-2 items-center">
//       <input
//         type="checkbox"
//         checked={checked} // ใช้ checked แบบแน่ใจว่าเป็น boolean
//         onChange={(e) => onCheckedChange(e.target.checked)}
//         disabled={disabled}
//         className="h-[24px] w-[24px]"
//       />
//       {labelName && <span>{labelName}</span>}
//     </Text>
//   );
// };

// export default CheckboxMainComponent;
import { Text } from "@radix-ui/themes";

type CheckboxMainComponentProps = {
  labelName?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
  const { labelName, checked, onCheckedChange, disabled } = props;
  return (
    <Text as="label" size="2" className=" flex gap-2 ">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)} // ส่งค่าที่เปลี่ยนแปลงไปยัง onCheckedChange
        disabled={disabled}
        className=" h-[24px] w-[24px]"
      />
      {labelName}
    </Text>
  );
};

export default CheckboxMainComponent;
