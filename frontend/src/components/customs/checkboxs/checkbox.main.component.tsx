import { Text } from "@radix-ui/themes";

type CheckboxMainComponentProps = {
  labelName?: string;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};
const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
  const { labelName, defaultChecked, onChange, disabled } = props;
  return (
    <Text as="label" size="3" className="flex gap-2 ">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className=" h-[22px] w-[22px]"
      ></input>
      <div className="whitespace-nowrap">{labelName}</div>
      
    </Text>
  );
};

export default CheckboxMainComponent;
