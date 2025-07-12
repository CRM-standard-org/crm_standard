// import { Box, Dialog, Flex, Text } from "@radix-ui/themes";
// import HistoryActivity from "../history/historyActivity";
// import { IoClose } from "react-icons/io5";
// import { useEffect, useState } from "react";
// import { getQuotationLogStatusByQuotationId } from "@/services/ms-quotation.log.status.service";
// import { QUOTATION_LOG_STATUS } from "@/types/response/response.quotation-log-status";

// type DialogHistoryQuotationProps = {
//   quotationId: string | undefined;
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
// };

// const DialogHistoryQuotation = ({
//   isOpen,
//   onClose,
//   title,
//   quotationId,
// }: DialogHistoryQuotationProps) => {
//   const [quotationLogStatus, setQuotationLogStatus] =
//     useState<QUOTATION_LOG_STATUS[]>();

//   useEffect(() => {
//     if (quotationId&& isOpen) {
//       getQuotationLogStatusByQuotationId(quotationId).then((response) => {
//         console.log("getQuotationLogStatusByQuotationId", response);
//         setQuotationLogStatus(response.responseObject);
//       });
//     }
//   }, [quotationId, isOpen]);

//   return (
//     <Dialog.Root open={isOpen} onOpenChange={onClose}>
//       <Dialog.Content maxWidth="850px" className=" relative">
//         <Dialog.Title>
//           <Text>{title}</Text>
//           <Box className="absolute top-4 right-4 z-50 text-[#939393]">
//             <IoClose className="cursor-pointer " onClick={onClose} />
//           </Box>
//         </Dialog.Title>
//         <Flex
//           direction="column"
//           className="border-t pt-4 border-b min-h-[220px] max-h-[70vh] overflow-auto"
//         >
//           <HistoryActivity
//             items={quotationLogStatus}
//             isFetchingHistoryEditPostById={false}
//           />
//         </Flex>
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// };

// export default DialogHistoryQuotation;
