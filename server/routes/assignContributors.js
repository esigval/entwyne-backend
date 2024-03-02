import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { assignContributorsMiddleware } from '../middleware/users/assignContributortoPrompt.js';
import express from 'express';
const router = express.Router();


router.post('/', validateTokenMiddleware, assignContributorsMiddleware, (req, res) => {
    res.status(200).json({ message: 'Contributors assigned successfully', result: res.locals.result });
});

export default router;