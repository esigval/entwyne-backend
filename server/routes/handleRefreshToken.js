import express from 'express';
import { handleRefreshTokenMiddleware } from '../middleware/authentication/handleRefreshTokenMiddleware.js'; // adjust the path as needed

const router = express.Router();

router.post('/', handleRefreshTokenMiddleware);

export default router;