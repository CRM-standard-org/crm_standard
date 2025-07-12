import { AspectRatio, Box } from "@radix-ui/themes";

const ErrorField = () => {
  return (
    <Box
      style={{
        borderRadius: "8px",
        padding: "0px",
        width: "168px",
        height: "225px",
        maxHeight: "225px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <AspectRatio
        ratio={1.67}
        style={{
          borderRadius: "8px",
          padding: "0px",
          width: "168px",
          height: "225px",
          maxHeight: "225px",
          overflow: "hidden",
          touchAction: "none",
          pointerEvents: "none",
        }}
      >
        {/* <Image
          src={"/images/empty-axons-images.svg"}
          alt={"axons-placeholder"}
          width={168}
          height={225}
          // objectFit="fill"
          className="h-full rounded-8 min-w-[168px] max-h-[225px] object-fill"
        /> */}
        <div
          style={{
            backgroundImage: `url(/images/empty-axons-images.svg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            touchAction: "none",
            pointerEvents: "none",
          }}
          className="h-full rounded-8 min-w-[168px] max-h-[225px] object-fill"
        ></div>
      </AspectRatio>
      <div
        // {...getRootProps()}
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          backgroundColor: "black",
          opacity: "0.4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // cursor: "pointer",
        }}
        // onClick={onClickReUploadFileError}
      >
        {/* <input multiple={false} id="fileupload-error" {...getInputProps()} /> */}
        {/* <Restart
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            color: "white",
          }}
        /> */}
      </div>
      <Box
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "0px 30px 30px 0px",
          backgroundColor: "#D92D20",
          position: "absolute",
          bottom: 0,
        }}
      />
    </Box>
  );
};

export default ErrorField;
