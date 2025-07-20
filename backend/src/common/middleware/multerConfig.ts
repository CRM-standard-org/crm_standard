import multer, {FileFilterCallback} from "multer";
import path from "path";
import fs from "fs";
import { Request , Response , NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';

const uploadDirQuotation = path.join(__dirname, '../../uploads/quotation');
const uploadDirSaleOrder = path.join(__dirname, '../../uploads/sale-order');
const uploadDirSaleOrderPayment = path.join(__dirname, '../../uploads/sale-order/payment');
const uploadDirCompany = path.join(__dirname, '../../uploads/company');
const uploadDirEmployee = path.join(__dirname, '../../uploads/employee');

if( !fs.existsSync(uploadDirQuotation)){
    fs.mkdirSync(uploadDirQuotation, { recursive: true });
}
if( !fs.existsSync(uploadDirSaleOrder)){
    fs.mkdirSync(uploadDirSaleOrder, { recursive: true });
}
if( !fs.existsSync(uploadDirSaleOrderPayment)){
    fs.mkdirSync(uploadDirSaleOrderPayment, { recursive: true });
}
if( !fs.existsSync(uploadDirCompany)){
    fs.mkdirSync(uploadDirCompany, { recursive: true });
}
if( !fs.existsSync(uploadDirEmployee)){
    fs.mkdirSync(uploadDirEmployee, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === 'quotation'){
      cb(null, uploadDirQuotation); // Save to /uploads folder
    }
    if(file.fieldname === 'sale-order'){
      cb(null, uploadDirSaleOrder); // Save to /uploads folder
    }
    if(file.fieldname === 'payment'){
      cb(null, uploadDirSaleOrderPayment); // Save to /uploads folder
    }
    if(file.fieldname === 'company'){
      cb(null, uploadDirCompany); // Save to /uploads folder
    }
    if(file.fieldname === 'emp'){
      cb(null, uploadDirEmployee); // Save to /uploads folder
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fullFileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, fullFileName);
  },
});

const fileFilter = (req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, cb:FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .png, and .pdf files are allowed!"));
  }
  // console.log("Uploaded MIME type:", file.mimetype);
};



// Set up Multer to handle multiple files
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 , files: 30 }, // Optional: Limit file size to 10MB
  fileFilter,
})

export const handleMulter = (multerMiddleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err: any) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          new ServiceResponse(
            ResponseStatus.Failed,
            "Upload file error: " + err.message,
            null,
            StatusCodes.BAD_REQUEST
          )
        );
      }
      next();
    });
  };
};


