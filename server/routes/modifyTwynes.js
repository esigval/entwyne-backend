import express from 'express';
import Twyne from '../models/twyneModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js' // Import the middleware

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        const twyne = await Twyne.create(req.body);
        res.status(200).json(twyne);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Twyne' });
    }
});

router.delete('/:id', validateTokenMiddleware, async (req, res) => {
    try {
        await Twyne.delete(req.params.id);
        res.status(200).json({ message: 'Twyne deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Twyne' });
    }
});

router.get('/:id', validateTokenMiddleware, async (req, res) => {
    try {
        const twyne = await Twyne.findById(req.params.id);
        res.status(200).json(twyne);
    } catch (error) {
        res.status(500).json({ message: 'Error finding Twyne' });
    }
});

router.patch('/:id', validateTokenMiddleware, async (req, res) => {
    try {
        const twyne = await Twyne.update(req.params.id, req.body);
        res.status(200).json(twyne);
    } catch (error) {
        res.status(500).json({ message: 'Error updating Twyne' });
    }
});

export default router;