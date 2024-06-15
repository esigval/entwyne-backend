import express from 'express';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.post('/:promptId', validateTokenMiddleware, setPromptCollected, (req, res) => {
    const promptId = req.params.promptId;
    res.send(`Set prompt ${promptId}`);
});

export default router;