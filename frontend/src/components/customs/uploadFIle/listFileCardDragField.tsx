// import { Reorder, AnimatePresence, motion } from "framer-motion";
// // import ErrorField from "./errorField";
// // import CardsFile from "./cardsFile";
// import { Box } from "@radix-ui/themes";
// import { IoIosClose, IoMdDownload } from "react-icons/io";
// import ErrorField from "./errorField";
// import { blobToFile } from "@/types/file";
// import { FaFile } from "react-icons/fa6";
// import { formatFileSize } from "@/utils/formatFileSize";
// import { downloadFIle } from "@/utils/downloadfile";
// import DialogShowImages from "../dialog/dialog.show.images";
// import { useState } from "react";

// type ListFileCardFieldProps = {
//   files: blobToFile[];
//   setFiles: (files: blobToFile[]) => void;
//   onClickDelete: (file: blobToFile) => void;
//   disable?: boolean;
// };
// const ListFileCardDragField = (props: ListFileCardFieldProps) => {
//   const { files, setFiles, onClickDelete, disable } = props;

//   const [isOpenFullImage, setIsOpenFullImage] = useState(false);

//   console.log("files", files);
//   return (
//     <Box>
//       <Reorder.Group
//         as="ul"
//         axis="x"
//         onReorder={setFiles}
//         values={files}
//         className=" flex gap-[8px] h-[235px] pt-[10px]"
//       >
//         <AnimatePresence initial={false}>
//           {files?.map((file) => (
//             <div key={file?.id}>
//               <Box
//                 key={file?.id}
//                 style={{ position: "relative" }}
//                 className="block"
//               >
//                 <motion.span
//                   layout="position"
//                   style={{
//                     borderRadius: "8px",
//                     padding: "0px",
//                     width: "168px",
//                     height: "225px",
//                     maxHeight: "225px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {file?.error ? (
//                     <ErrorField />
//                   ) : file?.type?.includes("image") ||
//                     file?.file_type?.includes("image") ? (
//                     <CardImage
//                       imageURL={file?.imageURL}
//                       onClickImage={() => setIsOpenFullImage(true)}
//                     />
//                   ) : (
//                     <CardFile
//                       url={file.file_url || file.imageURL}
//                       name={file?.name ?? file?.file_name}
//                       size={file?.size ?? file?.file_size}
//                     />
//                   )}
//                   {!disable && (
//                     <Box
//                       onClick={() => {
//                         onClickDelete(file);
//                       }}
//                       style={{
//                         position: "absolute",
//                         top: -8,
//                         right: -8,
//                         width: 32,
//                         height: 32,
//                         backgroundColor: "white",
//                         borderRadius: "50%",
//                         padding: "8px",
//                         cursor: "pointer",
//                         boxShadow:
//                           "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
//                       }}
//                     >
//                       <IoIosClose
//                         style={{
//                           width: "16px",
//                           height: "16px",
//                           minWidth: "16px",
//                         }}
//                       />
//                     </Box>
//                   )}
//                 </motion.span>
//               </Box>

//               {/* <Reorder.Item
//                 value={file}
//                 key={file?.id}
//                 id={file?.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{
//                   opacity: 1,
//                   backgroundColor: "#fff",
//                   y: 0,
//                   transition: { duration: 0.15 },
//                 }}
//                 exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
//                 whileDrag={{
//                   backgroundColor: "transparent",
//                   boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
//                   borderRadius: "8px",
//                 }}
//                 style={{
//                   position: "relative",
//                   backgroundColor: "transparent",
//                   borderRadius: "8px",
//                 }}
//                 className=" sm:block hidden"
//               >
//                 <motion.span
//                   layout="position"
//                   style={{
//                     cursor: "pointer",
//                     borderRadius: "8px",
//                     padding: "0px",
//                     width: "168px",
//                     height: "225px",
//                     maxHeight: "225px",
//                   }}
//                 >
//                   {file?.error ? <ErrorField /> : <CardImage imageURL={file?.imageURL} />}
//                   <Box
//                     onClick={() => onClickDelete(file)}
//                     style={{
//                       position: "absolute",
//                       top: -8,
//                       right: -8,
//                       width: 32,
//                       height: 32,
//                       backgroundColor: "white",
//                       borderRadius: "50%",
//                       padding: "8px",
//                       cursor: "pointer",
//                       boxShadow: "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
//                     }}
//                   >
//                     <IoIosClose
//                       style={{
//                         width: "16px",
//                         height: "16px",
//                         minWidth: "16px",
//                       }}
//                     />
//                   </Box>
//                 </motion.span>
//               </Reorder.Item> */}
//             </div>
//           ))}
//         </AnimatePresence>
//       </Reorder.Group>

//       <DialogShowImages
//         images={files?.map((f) => f.imageURL)}
//         onClose={() => setIsOpenFullImage(false)}
//         isOpen={isOpenFullImage}
//       />
//     </Box>
//   );
// };

// export default ListFileCardDragField;

// const CardImage = ({
//   imageURL,
//   onClickImage,
// }: {
//   imageURL: string;
//   onClickImage: () => void;
// }) => {
//   return (
//     <Box
//       style={{
//         borderRadius: "8px",
//         padding: "0px",
//         width: "168px",
//         height: "225px",
//         maxHeight: "225px",
//         overflow: "hidden",
//         cursor: "pointer",
//       }}
//       onClick={onClickImage}
//     >
//       <div
//         style={{
//           backgroundImage: `url(${imageURL})`,
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//           backgroundSize: "cover",
//           touchAction: "none",
//           pointerEvents: "none",
//           borderRadius: "8px",
//           overflow: "hidden",
//         }}
//         className=" h-[225px] rounded-8 min-w-[168px] max-h-[225px]"
//       />
//     </Box>
//   );
// };

// const CardFile = ({
//   name,
//   size,
//   url,
// }: {
//   name: string;
//   size: number;
//   url: string;
// }) => {
//   return (
//     <Box
//       style={{
//         borderRadius: "8px",
//         padding: "0px",
//         width: "168px",
//         height: "225px",
//         maxHeight: "225px",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         position: "relative",
//       }}
//     >
//       <FaFile
//         style={{
//           touchAction: "none",
//           pointerEvents: "none",
//           color: "#F39C12",
//         }}
//         className=" h-[180px] rounded-8 w-[100px] "
//       />
//       <Box className=" text-sm custom-pre text-overflow-line-clamp-1 max-w-[120px]">
//         {name}
//       </Box>
//       <Box className=" text-xs custom-pre text-overflow-line-clamp-1 max-w-[120px]">
//         {formatFileSize(size)}
//       </Box>
//       <Box
//         onClick={() => downloadFIle(url, name)}
//         className="bg-green-600 hover:opacity-100 text-white bottom-4 right-4 opacity-50 flex flex-col justify-center items-center absolute cursor-pointer rounded-sm  w-8 h-8 "
//       >
//         <IoMdDownload className=" w-6 h-6 " />
//       </Box>
//     </Box>
//   );
// };
