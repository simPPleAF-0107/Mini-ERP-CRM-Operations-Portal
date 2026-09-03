import { Router } from 'express';
import { getAll, getById, create, update, confirm, cancel } from './challan.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createChallanSchema, updateChallanSchema } from './challan.schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.ADMIN, Role.SALES, Role.ACCOUNTS), getAll);
router.get('/:id', authorize(Role.ADMIN, Role.SALES, Role.ACCOUNTS), getById);
router.post('/', authorize(Role.ADMIN, Role.SALES), validate(createChallanSchema), create);
router.put('/:id', authorize(Role.ADMIN, Role.SALES), validate(updateChallanSchema), update);
router.patch('/:id/confirm', authorize(Role.ADMIN, Role.SALES), confirm);
router.patch('/:id/cancel', authorize(Role.ADMIN, Role.SALES), cancel);

export default router;
