export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES', 
  WAREHOUSE = 'WAREHOUSE',
  ACCOUNTS = 'ACCOUNTS',
}

export enum CustomerType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export enum CustomerStatus {
  LEAD = 'LEAD',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export enum ChallanStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  followUpNotes?: FollowUpNote[];
}

export interface FollowUpNote {
  id: number;
  note: string;
  customerId: number;
  createdById: number;
  createdBy?: { name: string };
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdById: number;
  createdBy?: { name: string };
  product?: { name: string; sku: string };
  createdAt: string;
}

export interface ChallanItem {
  id: number;
  challanId: number;
  productId: number;
  quantity: number;
  productName: string;
  productSku: string;
  productCategory: string;
  unitPrice: number;
}

export interface Challan {
  id: number;
  challanNumber: string;
  customerId: number;
  totalQuantity: number;
  status: ChallanStatus;
  createdById: number;
  createdBy?: { name: string };
  customer?: Customer;
  items?: ChallanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  leadCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalChallans: number;
  draftChallans: number;
  confirmedChallans: number;
  recentChallans: Challan[];
  upcomingFollowUps: Customer[];
  lowStockAlerts: Product[];
}
