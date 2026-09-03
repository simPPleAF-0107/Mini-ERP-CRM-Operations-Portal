import { Router } from 'express';
import { getAll, getById, create, update, getLowStock } from './product.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createProductSchema, updateProductSchema } from './product.schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', getAll);
router.get('/low-stock', authorize(Role.ADMIN, Role.WAREHOUSE), getLowStock);
router.get('/:id', getById);
router.post('/', authorize(Role.ADMIN, Role.WAREHOUSE), validate(createProductSchema), create);
router.put('/:id', authorize(Role.ADMIN, Role.WAREHOUSE), validate(updateProductSchema), update);

export default router;
