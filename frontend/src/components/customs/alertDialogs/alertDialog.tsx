"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Box, Text } from "@radix-ui/themes";
import ButtonDefault from "../button/buttonDefault";
import ButtonOutline from "../button/buttonOutline";

type AlertDialogComponentProps = {
  id?: string;
  isOpen: boolean;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  handleClose: () => void;
  handleSubmit: () => void;
  btnSubmitName?: string;
  btnCancelName?: string;
  iconDailog?: ReactNode;
};

const AlertDialogComponent = ({
  id,
  isOpen,
  className,
  title,
  description,
  handleClose,
  handleSubmit,
  btnCancelName,
  btnSubmitName,
  iconDailog,
}: AlertDialogComponentProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={`${className} AlertDialogContent`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="AlertDialogTitle">
            {iconDailog}
            <div className=" text-2xl text-center">{title}</div>
          </AlertDialogTitle>
          <AlertDialogDescription className="AlertDialogDescription">
            <div className="  text-base text-black text-center">
              {description}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center">
          <Box
            style={{
              width: "100%",
              padding: "10px 16px 10px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <ButtonDefault
              id={id}
              type="submit"
              width="calc(100% - 34px)"
              onClick={handleSubmit}
            >
              <Text className=" text-base ">{btnSubmitName}</Text>
            </ButtonDefault>
            <ButtonOutline
              type="button"
              onClick={handleClose}
              width="calc(100% - 34px)"
            >
              <Text className=" text-base ">{btnCancelName}</Text>
            </ButtonOutline>
          </Box>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
