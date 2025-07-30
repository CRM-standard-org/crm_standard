import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "@common/middleware/errorHandler";
import cookieParser from "cookie-parser";
import path from 'path';

import { env } from "@common/utils/envConfig";
import { pino } from "pino";
import { authRouter } from "@modules/auth/authRouter";
import { employeeRouter } from "@modules/employee/employeeRouter";
import { tagRouter } from "@modules/tag/tagRouter";
import { characterRouter } from "@modules/character/characterRouter";
import { customerRoleRouter } from "@modules/customerRole/customerRoleRouter";
import { teamRouter } from "@modules/team/teamRouter";
import { addressRouter } from "@modules/address/addressRouter";
import { socialRouter } from "@modules/social/socialRouter";
import { employeeStatusRouter } from "@modules/employeeStatus/employeeStatusRouter";
import { customerRouter } from "@modules/customer/customerRouter";
import { groupProductRouter } from "@modules/groupProduct/groupProductRouter";
import { productRouter } from "@modules/product/productRouter";
import { unitRouter } from "@modules/unit/unitRouter";
import { paymentMethodRouter } from "@modules/paymentMethod/paymentMethodRouter";
import { currencyRouter } from "@modules/currency/currencyRouter";
import { vatRouter } from "@modules/vat/vatRouter";
import { quotationRouter } from "@modules/quotation/quotationRouter";
import { saleOrderRouter } from "@modules/saleOrder/saleOrderRouter";
import { activityRouter } from "@modules/activity/activityRouter";
import { companyRouter } from "@modules/company/companyRouter";

import { roleRouter } from "@modules/role/roleRouter";

const logger = pino({ name: "server start" });
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Routes
app.use("/v1/auth", authRouter);
app.use("/v1/tag", tagRouter);
app.use("/v1/character", characterRouter);
app.use("/v1/customer-role", customerRoleRouter);
app.use("/v1/team", teamRouter);
app.use("/v1/employee", employeeRouter);
app.use("/v1/social", socialRouter);
app.use("/v1/address", addressRouter);
app.use("/v1/employee-status", employeeStatusRouter);
app.use("/v1/customer", customerRouter);
app.use("/v1/group-product", groupProductRouter);
app.use("/v1/product", productRouter);
app.use("/v1/unit", unitRouter);
app.use("/v1/payment-method", paymentMethodRouter);
app.use("/v1/currency", currencyRouter);
app.use("/v1/vat", vatRouter);
app.use("/v1/quotation", quotationRouter);
app.use("/v1/sale-order", saleOrderRouter);
app.use("/v1/activity", activityRouter);
app.use("/v1/company", companyRouter);

app.use("/v1/role", roleRouter);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // สำคัญสำหรับรูป
    },
  })
);

app.use(errorHandler());
export { app, logger };
