import { Badge } from "@radix-ui/themes";

type ListRepairReceiptStatusType = {
  value: string;
};
const ListRepairReceiptStatus = (props: ListRepairReceiptStatusType) => {
  const { value } = props;

  let color:
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "yellow"
    | "amber"
    | "orange"
    | "tomato"
    | "red"
    | "ruby"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "lime"
    | "mint"
    | "sky" = "blue";

  let textValue = value;

  switch (value) {
    case "active":
      textValue = "เพิ่มรายการ";
      color = "blue";
      break;
    case "not_active":
      textValue = "ยกเลิกรายการ";
      color = "red";
      break;

    default:
      break;
  }

  return (
    <Badge variant="soft" color={color} size={"3"}>
      {textValue}
    </Badge>
  );
};

export default ListRepairReceiptStatus;
