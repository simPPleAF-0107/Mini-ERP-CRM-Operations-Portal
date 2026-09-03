import { Router } from 'express';
import { getMovements, createMovement } from './inventory.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createMovementSchema } from './inventory.schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN, Role.WAREHOUSE));

router.get('/movements', getMovements);
router.post('/movements', validate(createMovementSchema), createMovement);

export default router;
