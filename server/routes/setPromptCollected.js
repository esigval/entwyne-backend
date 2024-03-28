import express from 'express';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.post('/:promptId/:status', validateTokenMiddleware, setPromptCollected, (req, res) => {
    const promptId = req.params.promptId;
    const status = req.params.status;
    console.log('Set prompt collected status');
    res.send(`Set prompt ${promptId} collected status to ${status}`);
});

export default router;