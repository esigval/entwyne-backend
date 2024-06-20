import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import renderVideo from '../middleware/renderEngine/narrativeBlockHandler.js';
import { render } from 'ejs';
const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const jsonConfig = req.body;

        console.log(jsonConfig);
        const result = await renderVideo(jsonConfig, userId);
        
        if (result.status === 'error') {
            return res.status(500).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing Twyne');
    }
});

export default router;
