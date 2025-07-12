// import { OPTION_PAYMENT, PAYMENT_STATUS } from "@/types/requests/request.payment";
// import { Badge } from "@radix-ui/themes";

// type PaymentStatusType = {
//   value: string;
// };
// const PaymentStatus = (props: PaymentStatusType) => {
//   const { value } = props;

//   let color:
//     | "gray"
//     | "gold"
//     | "bronze"
//     | "brown"
//     | "yellow"
//     | "amber"
//     | "orange"
//     | "tomato"
//     | "red"
//     | "ruby"
//     | "crimson"
//     | "pink"
//     | "plum"
//     | "purple"
//     | "violet"
//     | "iris"
//     | "indigo"
//     | "blue"
//     | "cyan"
//     | "teal"
//     | "jade"
//     | "green"
//     | "grass"
//     | "lime"
//     | "mint"
//     | "sky" = "blue";

//   let textValue = value;

//   switch (value) {
//     case OPTION_PAYMENT.NOT_YET_PAID:
//       textValue = "ยังไม่ชำระ";
//       color = "red";
//       break;
//     case OPTION_PAYMENT.PARTIAL_PAYMENT:
//       textValue = "ชำระบางส่วน";
//       color = "blue";
//       break;
//     case OPTION_PAYMENT.FULL_PAYMENT:
//       textValue = "ชำระเต็มจำนวน";
//       color = "green";
//       break;
//     default:
//       break;
//   }

//   return (
//     <Badge variant="soft" color={color} size={"3"}>
//       {textValue}
//     </Badge>
//   );
// };

// export default PaymentStatus;
