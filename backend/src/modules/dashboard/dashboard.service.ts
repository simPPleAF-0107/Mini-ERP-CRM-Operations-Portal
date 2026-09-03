import { prisma } from '../../config/database';
import { CustomerStatus, ChallanStatus } from '@prisma/client';

export class DashboardService {
  static async getStats() {
    const [
      totalCustomers,
      leadCustomers,
      activeCustomers,
      totalProducts,
      totalChallans,
      draftChallans,
      confirmedChallans,
      recentChallans,
      upcomingFollowUps,
      lowStockAlerts,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: CustomerStatus.LEAD } }),
      prisma.customer.count({ where: { status: CustomerStatus.ACTIVE } }),

      prisma.product.count({ where: { isActive: true } }),

      prisma.challan.count(),
      prisma.challan.count({ where: { status: ChallanStatus.DRAFT } }),
      prisma.challan.count({ where: { status: ChallanStatus.CONFIRMED } }),

      prisma.challan.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      }),

      prisma.customer.findMany({
        where: {
          followUpDate: { gte: new Date() },
        },
        take: 5,
        orderBy: { followUpDate: 'asc' },
        select: { id: true, name: true, businessName: true, followUpDate: true },
      }),

      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: { id: true, name: true, sku: true, currentStock: true, minStockAlert: true, location: true },
      }),
    ]);

    const lowStockProducts = lowStockAlerts.filter(p => p.currentStock <= p.minStockAlert);

    return {
      customers: { total: totalCustomers, leads: leadCustomers, active: activeCustomers },
      inventory: { totalProducts, lowStockProducts: lowStockProducts.length },
      challans: { total: totalChallans, draft: draftChallans, confirmed: confirmedChallans },
      recentChallans,
      upcomingFollowUps,
      lowStockAlerts: lowStockProducts,
    };
  }
}
