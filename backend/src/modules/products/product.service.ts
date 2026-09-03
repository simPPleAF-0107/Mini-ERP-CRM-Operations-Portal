import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class ProductService {
  static async getAll(filters: any, pagination: { skip: number; take: number; page: number; limit: number }) {
    const where: Prisma.ProductWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.category) where.category = filters.category;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { data: products, total };
  }

  static async getById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { createdBy: { select: { name: true } } },
        },
      },
    });
  }

  static async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }

  static async update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  static async getLowStock() {
    return prisma.$queryRaw`SELECT * FROM products WHERE "currentStock" <= "minStockAlert" AND "isActive" = true`;
  }
}
