
import { getCollaborationStories } from '../middleware/stories/getCollaborationStories.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import express from 'express';
// Import necessary modules
const router = express.Router();


router.get('/', validateTokenMiddleware, getCollaborationStories, (req, res) => {
    res.json(res.stories);
});

// Export the router
export default router;