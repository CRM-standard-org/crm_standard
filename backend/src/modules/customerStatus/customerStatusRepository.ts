import prisma from '@src/db';
import { TypePayloadCustomerStatus } from './customerStatusModel';

export const customerStatusRepository = {
  findByName: async (name: string) => {
    return prisma.customerStatus.findFirst({ where: { name: name.trim() } });
  },
  count: async (search?: string) => {
    const s = search?.trim();
    return prisma.customerStatus.count({
      where: { ...(s && { name: { contains: s, mode: 'insensitive' } }) },
    });
  },
  findById: async (customer_status_id: string) => {
    return prisma.customerStatus.findUnique({ where: { customer_status_id } });
  },
  findAll: async (page: number, limit: number, search?: string) => {
    const s = search?.trim();
    return prisma.customerStatus.findMany({
      where: { ...(s && { name: { contains: s, mode: 'insensitive' } }) },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { order_no: 'asc' },
    });
  },
  select: async (search?: string) => {
    const s = search?.trim();
    return prisma.customerStatus.findMany({
      where: { ...(s && { name: { contains: s, mode: 'insensitive' } }) },
      orderBy: { order_no: 'asc' },
      select: { customer_status_id: true, name: true },
    });
  },
  create: async (payload: TypePayloadCustomerStatus, employee_id: string) => {
    return prisma.customerStatus.create({
      data: {
        name: payload.name.trim(),
        start_condition: payload.start_condition,
        end_condition: payload.end_condition,
        description: payload.description || null,
        order_no: payload.order_no ?? 1,
        is_active: payload.is_active ?? true,
        category: payload.category || null,
        created_by: employee_id,
        updated_by: employee_id,
      },
    });
  },
  update: async (customer_status_id: string, payload: TypePayloadCustomerStatus, employee_id: string) => {
    // @ts-ignore prisma client needs regenerate for new model fields
    return prisma.customerStatus.update({
      where: { customer_status_id },
      data: {
        ...(payload.name && { name: payload.name.trim() }),
        ...(payload.start_condition && { start_condition: payload.start_condition }),
        ...(payload.end_condition && { end_condition: payload.end_condition }),
        description: payload.description ?? null,
        ...(payload.order_no && { order_no: payload.order_no }),
        ...(payload.is_active !== undefined && { is_active: payload.is_active }),
        ...(payload.category !== undefined && { category: payload.category }),
        updated_by: employee_id,
      },
    });
  },
  delete: async (customer_status_id: string) => {
    // @ts-ignore prisma client needs regenerate for new model fields
    return prisma.customerStatus.delete({ where: { customer_status_id } });
  },
};
