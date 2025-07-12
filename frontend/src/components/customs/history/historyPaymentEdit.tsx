// import dayjs from "dayjs";
// import { BoxLoadingData } from "../boxLoading/BoxLoadingData";
// import { Box, Text } from "@radix-ui/themes";
// import { PAYMENT_EDITS_LOG } from "@/types/response/response.payment-edits";
// import { GrStatusInfo } from "react-icons/gr";
// import ApproveEditPaymentStatus from "../badges/approveEditPaymentStatus";

// type HistoryPaymentEditProps = {
//   items: PAYMENT_EDITS_LOG[] | undefined;
//   isFetchingHistoryEditPostById: boolean;
// };
// const HistoryPaymentEdit = (props: HistoryPaymentEditProps) => {
//   const { items, isFetchingHistoryEditPostById } = props;

//   return (
//     <Box
//       style={{
//         marginBottom: "24px",
//         // maxHeight: "70vh",
//         padding: "0 16px 24px 16px",
//         overflow: "auto",
//         display: "flex",
//         flexDirection: "column",
//         gap: "8px",
//       }}
//     >
//       {isFetchingHistoryEditPostById ? (
//         <BoxLoadingData />
//       ) : items && items?.length > 0 ? (
//         items?.map((item, index) => (
//           <ActivityItem
//             key={index}
//             data={item}
//             name={item.edit_status}
//             status={item.edit_status}
//             date={item.created_at ?? dayjs().format()}
//             showDivider={index + 1 < items.length}
//           />
//         ))
//       ) : (
//         <div className="flex flex-col text-center w-full p-[8px]">
//           <span className=" text-gray-600 text-sm">ไม่มีประวัติรายการซ่อม</span>
//         </div>
//       )}
//     </Box>
//   );
// };

// export default HistoryPaymentEdit;

// type ActivityItemProps = {
//   name: string;
//   status: string;
//   date: string;
//   showDivider: boolean;
//   data: PAYMENT_EDITS_LOG;
// };
// const ActivityItem = (props: ActivityItemProps) => {
//   const { status, date, showDivider, data } = props;

//   // hooks
//   console.log("data", data);
//   return (
//     <Box style={{ display: "flex", gap: "8px", width: "100%" }}>
//       <Box
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "8px",
//           width: "40px",
//           minHeight: "78px",
//         }}
//       >
//         <Box
//           style={{
//             width: "40px",
//             height: "40px",
//             minHeight: "40px",
//             border: "1px solid #074e9f",
//             borderRadius: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "#074E9F",
//           }}
//         >
//           {/* {status === "pending" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )}
//           {status === "waiting_for_approve" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )}
//           {status === "approved" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )}
//           {status === "reject_approve" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )}
//           {status === "close_deal" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )}
//           {status === "cancel" && (
//             <GrStatusInfo
//               style={{ color: "white", width: "24px", height: "24px" }}
//             />
//           )} */}
//           <GrStatusInfo
//             style={{ color: "white", width: "24px", height: "24px" }}
//           />
//         </Box>
//         {showDivider && (
//           <div
//             style={{
//               height: "calc(100% - 56px)",
//               // status === "expired" ||
//               // status === "approve_request_delete" ||
//               // status === "request_delete" ||
//               // status === "reject_request_delete"
//               //   ? "100px"
//               //   : "30px",
//               width: "20px",
//               borderColor: "#074e9f",
//               borderLeft: "1px solid #074e9f",
//             }}
//           />
//         )}
//       </Box>
//       <Box
//         style={{
//           padding: "0px 8px 24px 8px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "4px",
//           width: "calc(100% - 40px)",
//         }}
//       >
//         <Text
//           style={{
//             fontSize: "18px",
//             fontWeight: "400",
//             lineHeight: "28px",
//             color: "#344054",
//           }}
//         >
//           สถานะการขอแก้ไขใบชำระเงิน
//         </Text>
//         {status === "pending" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <ApproveEditPaymentStatus value={"pending"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่"}: {dayjs(date)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้ดำเนินการ"}:{" "}
//               {(data.created_by_user?.first_name ?? "") +
//                 " " +
//                 (data.created_by_user?.last_name ?? "")}
//             </Text>{" "}
//             <Box
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 wordWrap: "break-word",
//               }}
//             >
//               {"หมายเหตุ"}: {data.remark ?? "-"}
//             </Box>
//           </>
//         )}

//         {status === "approved" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <ApproveEditPaymentStatus value={"approved"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่อนุมัติ"}: {dayjs(date)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้อนุมัติ"}:{" "}
//               {(data.created_by_user?.first_name ?? "") +
//                 " " +
//                 (data.created_by_user?.last_name ?? "")}
//             </Text>{" "}
//             <Box
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 wordWrap: "break-word",
//               }}
//             >
//               {"หมายเหตุ"}: {data.remark ?? "-"}
//             </Box>
//           </>
//         )}

//         {status === "rejected" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <ApproveEditPaymentStatus value={"rejected"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่ปฏิเสธ"}:{" "}
//               {dayjs(data.created_at)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้ปฏิเสธคำขอ"}:{" "}
//               {(data.created_by_user?.first_name ?? "") +
//                 " " +
//                 (data.created_by_user?.last_name ?? "")}
//             </Text>{" "}
//             <Box
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 wordWrap: "break-word",
//               }}
//             >
//               {"หมายเหตุ"}: {data.remark ?? "-"}
//             </Box>
//           </>
//         )}

//         {/* {status === "not_active" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <QuotationStatus value={"waiting_for_approve"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่รออนุมัติ"}:{" "}
//               {dayjs(data.created_at)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้รออนุมัติ"}:{" "}
//               {(data.profile?.first_name ?? "") +
//                 " " +
//                 (data.profile?.last_name ?? "")}
//             </Text>
//           </>
//         )}

//         {status === "approved" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <QuotationStatus value={"approved"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่อนุมัติ"}: {dayjs(date)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้อนุมัติ"}:{" "}
//               {(data.profile?.first_name ?? "") +
//                 " " +
//                 (data.profile?.last_name ?? "")}
//             </Text>
//           </>
//         )}

//         {status === "reject_approve" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <QuotationStatus value={"reject_approve"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่ปฏิเสธ"}:{" "}
//               {dayjs(data.created_at)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้ปฏิเสธคำขอ"}:{" "}
//               {(data.profile?.first_name ?? "") +
//                 " " +
//                 (data.profile?.last_name ?? "")}
//             </Text>
//           </>
//         )}
//         {status === "close_deal" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <QuotationStatus value={"close_deal"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่ปิดดีล"}:{" "}
//               {dayjs(data.created_at)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้ปิดดีล"}:{" "}
//               {(data.profile?.first_name ?? "") +
//                 " " +
//                 (data.profile?.last_name ?? "")}
//             </Text>
//           </>
//         )} */}
//         {status === "canceled" && (
//           <>
//             <Box style={{ display: "flex" }}>
//               <ApproveEditPaymentStatus value={"canceled"} />
//             </Box>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//               }}
//             >
//               {"วันที่ยกเลิก"}:{" "}
//               {dayjs(data.created_at)?.format(`DD/MM/YYYY, HH:mm น.`)}
//             </Text>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {"ชื่อผู้ยกเลิก"}:{" "}
//               {(data.created_by_user?.first_name ?? "") +
//                 " " +
//                 (data.created_by_user?.last_name ?? "")}
//             </Text>{" "}
//             <Box
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "400",
//                 lineHeight: "22px",
//                 color: "#344054",
//                 wordWrap: "break-word",
//               }}
//             >
//               {"หมายเหตุ"}: {data.remark ?? "-"}
//             </Box>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// };
