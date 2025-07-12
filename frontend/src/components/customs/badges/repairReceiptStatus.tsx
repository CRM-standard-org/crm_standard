import { Badge } from "@radix-ui/themes";

type RepairCeiptStatusType = {
  value: string;
};
const RepairCeiptStatus = (props: RepairCeiptStatusType) => {
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
    case "pending":
      textValue = "กำลังดำเนินการ";
      color = "sky";
      break;
    case "success":
      textValue = "เสร็จสมบูรม์";
      color = "green";
      break;
    case "cancel":
      textValue = "ยกเลิก";
      color = "gray";
      break;
    default:
      textValue = "กำลังดำเนินการ";
      color = "sky";
      break;
  }

  return (
    <Badge variant="soft" color={color} size={"3"}>
      {textValue}
    </Badge>
  );
};

export default RepairCeiptStatus;
