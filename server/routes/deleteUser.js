import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.delete('/:userId', async (req, res) => {

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).send();
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

export default router;