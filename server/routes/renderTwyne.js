import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import renderVideo from '../middleware/renderEngine/narrativeBlockHandler.js';
import { render } from 'ejs';
const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    const userId = req.userId;
    const jsonConfig = req.body;

    console.log(jsonConfig);
    renderVideo(jsonConfig, userId);
    

    res.send('Processing Twyne');
});

export default router;