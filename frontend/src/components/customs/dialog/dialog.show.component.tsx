import { ReactNode } from "react";
import { Dialog, Flex } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";

type DialogComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  classNameConfirmBtn?: string;
  confirmBtnType?:
    | "search"
    | "submit"
    | "cancel"
    | "delete"
    | "default"
    | "primary"
    | "general";
};

const DialogShow = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  classNameConfirmBtn,
  confirmBtnType,
}: DialogComponentProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="450px" className=" relative">
        <Dialog.Title>{title}</Dialog.Title>
        <Flex
          direction="column"
          className="border-t pt-4 border-b min-h-[220px] mb-12 justify-center"
        >
          {description && (
            <Dialog.Description size="2" mb="4">
              {description}
            </Dialog.Description>
          )}
          <Flex direction="column" gap="3">
            {children}
          </Flex>
        </Flex>
        <Flex
          //gap="3"
          justify="center"
          className="w-full px-6 pt-4 pb-6 left-0 bottom-0  absolute "
        >
          <Dialog.Close>
            <Buttons btnType="cancel" onClick={onClose}>
              {cancelText}
            </Buttons>
          </Dialog.Close>
          
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogShow;
