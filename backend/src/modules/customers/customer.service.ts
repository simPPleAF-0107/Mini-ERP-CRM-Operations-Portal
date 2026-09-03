import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CustomerService {
  static async getAll(filters: any, pagination: { skip: number; take: number; page: number; limit: number }) {
    const where: Prisma.CustomerWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { mobile: { contains: filters.search } },
        { businessName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.customerType) where.customerType = filters.customerType;

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { data: customers, total };
  }

  static async getById(id: number) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        followUpNotes: {
          include: { createdBy: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async create(data: Prisma.CustomerCreateInput) {
    return prisma.customer.create({ data });
  }

  static async update(id: number, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({ where: { id }, data });
  }

  static async addNote(customerId: number, note: string, createdById: number) {
    return prisma.followUpNote.create({
      data: {
        note,
        customerId,
        createdById,
      },
      include: {
        createdBy: { select: { name: true } }
      }
    });
  }
}
