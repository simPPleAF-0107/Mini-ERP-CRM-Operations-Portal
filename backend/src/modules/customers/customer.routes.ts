import { Router } from 'express';
import { getAll, getById, create, update, addNote } from './customer.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createCustomerSchema, updateCustomerSchema, addNoteSchema } from './customer.schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN, Role.SALES), getAll);
router.get('/:id', authorize(Role.ADMIN, Role.SALES), getById);
router.post('/', authorize(Role.ADMIN, Role.SALES), validate(createCustomerSchema), create);
router.put('/:id', authorize(Role.ADMIN, Role.SALES), validate(updateCustomerSchema), update);
router.post('/:id/notes', authorize(Role.ADMIN, Role.SALES), validate(addNoteSchema), addNote);

export default router;
