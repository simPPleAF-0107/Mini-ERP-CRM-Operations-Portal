import { z } from 'zod';
import { CustomerType, CustomerStatus } from '@prisma/client';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    mobile: z.string().min(10),
    email: z.string().email().optional().nullable(),
    businessName: z.string().min(1),
    gstNumber: z.string().optional().nullable(),
    customerType: z.nativeEnum(CustomerType),
    address: z.string().min(1),
    status: z.nativeEnum(CustomerStatus).optional(),
    followUpDate: z.string().datetime().optional().nullable(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    mobile: z.string().min(10).optional(),
    email: z.string().email().optional().nullable(),
    businessName: z.string().min(1).optional(),
    gstNumber: z.string().optional().nullable(),
    customerType: z.nativeEnum(CustomerType).optional(),
    address: z.string().min(1).optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    followUpDate: z.string().datetime().optional().nullable(),
  }),
});

export const addNoteSchema = z.object({
  body: z.object({
    note: z.string().min(1),
  }),
});
