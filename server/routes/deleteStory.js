// In your Express router or controller
router.delete('/stories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Storyline.deleteOne({ _id: id }); // Assuming Storyline is your model
      res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting story' });
    }
  });
  