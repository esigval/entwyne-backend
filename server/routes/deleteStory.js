import express from 'express';
import { ObjectId } from 'mongodb';
import Story from '../models/storyModel.js';

const router = express.Router();

router.delete('/deleteStory/:id', async (req, res) => {
  console.log(`DELETE request received for story with id: ${req.params.id}`);

  try {
    const id = new ObjectId(req.params.id); // Convert to ObjectId
    await Story.deleteOne(id);
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting story' });
  }
});

export default router;