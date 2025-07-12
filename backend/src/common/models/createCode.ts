import prisma from "@src/db";
import { Decimal } from '@prisma/client/runtime/library';

// /**
//  * สร้างรหัสอัตโนมัติ เช่น EMP0001, CUST0010
//  */
// export const createCode = async (
//   length: number,
//   firstCode: string,
//   table: keyof typeof prisma,
//   codeField: string // เช่น "employee_code"
// ): Promise<string> => {
//   const model = prisma[table] as any; // แปลง type เพื่อให้ dynamic (ยืดหยุ่น)

//   const latest = await model.findMany({
//     orderBy: {
//       [codeField]: 'desc'
//     },
//     take: 1
//   });

//   let lastCode = latest[0]?.[codeField] || `${firstCode}${'0'.repeat(length)}`;

//   // แยกตัวเลขจาก code เช่น EMP0012 → 12
//   const numericPart = parseInt(lastCode.replace(firstCode, '')) || 0;

//   // เพิ่ม 1 แล้วเติม 0 หน้าให้ครบ
//   const nextNumber = (numericPart + 1).toString().padStart(length, '0');

//   return `${firstCode}${nextNumber}`;
// };


// -------ใช้สำหรับสร้างเลขสำหรับใบเสนอราคา , ใบสั่งขาย ---------
const tableMap = {
  quotation: prisma.quotation,
  saleOrder: prisma.saleOrder,
};

export const generateNumber = async (tableName : keyof typeof tableMap ) => {
  const table = tableMap[tableName] as any;
    if(!tableName) return ('Invalid table');

  const today = new Date();
  const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');

  // ดึงรายการที่สร้างวันนี้
  const countToday = await table.count({
    where: {
      created_at: {
        gte: new Date(`${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}T00:00:00.000Z`),
        lt: new Date(`${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}T23:59:59.999Z`),
      },
    },
  });

  // นับจาก 1 และต่อท้ายด้วยเลข 6 หลัก
  const sequence = String(countToday + 1).padStart(6, '0');
  return `${yyyymmdd}${sequence}`;
};


// แปลง response type decimal
export function convertDecimalToNumber<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalToNumber) as T;
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Decimal) {
        result[key] = Number(value.toString()); // หรือ value.toNumber()
      } else if (value instanceof Date) {
        result[key] = value; //  ปล่อย Date กลับไปตรง ๆ
      } else {
        result[key] = convertDecimalToNumber(value);
      }
    }
    return result as T;
  }

  return obj;
}
