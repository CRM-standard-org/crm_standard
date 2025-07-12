import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { Dialog } from "@radix-ui/themes";
import { IoClose } from "react-icons/io5";

type DialogShowImagesProps = {
  images: string[];
  onClose: () => void;
  isOpen: boolean;
};

const DialogShowImages = (props: DialogShowImagesProps) => {
  const { images, isOpen, onClose } = props;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="fixed top-0 right-0 w-screen h-screen max-w-full bg-black bg-opacity-80 flex items-center justify-center">
        {/* Close Button */}
        <Dialog.Title className="absolute top-4 right-4 z-50">
          <IoClose
            className="cursor-pointer w-8 h-8 text-white"
            onClick={onClose}
          />
        </Dialog.Title>
        {/* Swiper Container */}
        <div className="w-full h-full">
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center"
              >
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogShowImages;
