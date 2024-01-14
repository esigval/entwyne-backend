import express from 'express';
import { ObjectId } from 'mongodb';
import Twyne from '../models/twyneModel.js';

const router = express.Router();

router.delete('/deleteTwyne/:id', async (req, res) => {
  console.log(`DELETE request received for Twyne with id: ${req.params.id}`);

  try {
    const twyneId = req.params.id;
    const result = await Twyne.deleteOne(twyneId);
    if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Successfully deleted twyne.' });
    } else {
        res.status(404).json({ message: 'Twyne not found.' });
    }
} catch (error) {
    console.error("Error in DELETE /twyne/:id:", error);
    res.status(500).json({ message: 'Internal server error.' });
}
});

export default router;