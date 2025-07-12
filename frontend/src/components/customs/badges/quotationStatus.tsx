import { Badge } from "@radix-ui/themes";

type QuotationStatusType = {
  value: string;
};
const QuotationStatus = (props: QuotationStatusType) => {
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
      textValue = "ระหว่างดำเนินการ";
      color = "sky";
      break;
    case "waiting_for_approve":
      textValue = "รออนุมัติ";
      color = "yellow";
      break;
    case "approved":
      textValue = "อนุมัติ";
      color = "blue";
      break;
    case "reject_approve":
      textValue = "ไม่อนุมัติ";
      color = "red";
      break;
    case "close_deal":
      textValue = "ปิดดีล";
      color = "green";
      break;
    case "cancel":
      textValue = "ยกเลิก";
      color = "gray";
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

export default QuotationStatus;
