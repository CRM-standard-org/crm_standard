import { master_color } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadColor } from "./colorModel";

export const keys = ["color_name", "created_at", "updated_at"];

const prisma = new PrismaClient();

export const colorRepository = {
  count: async (searchText?: string) => {
    return await prisma.master_color.count({
      where: {
        ...(searchText
          ? {
              OR: [
                {
                  color_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    });
  },
  findAll: async ( skip: number, take: number, searchText: string) => {
          return await prisma.master_color.findMany({
            where: searchText
            ? {
                OR: [{
                          color_name: {
                              contains: searchText,
                              mode: 'insensitive'
                          }
                      }]
                  }
                  : {},  // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
              skip,
              take,
              orderBy: { created_at: 'asc' }
          });
      },


  findAllNoPagination: async () => {
    return await prisma.master_color.findMany({
      orderBy: { created_at: "asc" },
    });
  },

  findByName: async (color_name: string) => {

    return prisma.master_color.findFirst({
      where: {color_name: color_name }, 
    });
  },
  findById: async (color_id: string) => {
    return prisma.master_color.findFirst({
      where: { color_id: color_id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },

  create: async (
    userId: string,
    payload: TypePayloadColor
  ) => {
    const color_name = payload.color_name.trim();

    const setPayload: any = {
      color_name: color_name,
      created_by: userId,
      updated_by: userId,
    };

    return await prisma.master_color.create({
      data: setPayload,
    });
  },

  update: async (
    userId: string,
    color_id: string,
    payload: TypePayloadColor
  ) => {
    const color_name = payload.color_name.trim();
    if (!color_id)
      throw new Error("Color ID are required");
    const setPayload: Partial<master_color> = {
      color_name: color_name,
      updated_by: userId,
    };
    return await prisma.master_color.update({
      where: { color_id: color_id }, // ตรวจสอบว่าเงื่อนไขถูกต้อง
      data: setPayload,
    });
  },

  delete: async (color_id: string) => {
    if (!color_id) {
      throw new Error("color_id are required");
    }

    // ตรวจสอบสีที่ต้องการลบ
    const colorToDelete = await prisma.master_color.findFirst({
      where: {  color_id: color_id },
    });
    if (!colorToDelete) {
      throw new Error("Color not found");
    }

    // ดำเนินการลบ
    return await prisma.master_color.delete({
      where: { color_id: color_id },
    });
  },

  search: async (query: string) => {
    return await prisma.master_color.findMany({
      where: {
        color_name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },
  
};
