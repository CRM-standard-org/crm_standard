import { Address } from "@prisma/client";
import prisma from "@src/db";
import { TypePayloadAddress } from "@modules/address/addressModel";
import { object } from "zod";
import e from "express";
import { select } from "@common/models/selectData";

export const Keys = [
  "status_id",
  "name",
  "created_by",
  "updated_by",
  "created_at",
  "updated_at",
];

export const addressRepository = {
  findByName: async (status_name: string) => {
    status_name = status_name.trim();
    return prisma.employeeStatus.findFirst({
      where: { name: status_name },
    });
  },

  select: async () => {
    return await prisma.country.findMany({
      select: {
        country_id: true,
        country_name: true,
        province: {
          select: {
            province_id: true,
            province_name: true,
            country_id: true,
            district: {
              select: {
                district_id: true,
                district_name: true,
                province_id: true,
              },
              orderBy: { district_name: "asc" },
            },
          },
          orderBy: { province_name: "asc" },
        },
      },
      orderBy: { country_name: "asc" },
    });
  },
};
