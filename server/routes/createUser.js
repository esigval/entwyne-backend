import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { password, ...otherData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        const user = await User.create({ ...otherData, password: hashedPassword });
        console.log('User:', user);
        
        // Exclude the password from the response
        const { password: _, ...userDataWithoutPassword } = user;
        
        res.status(201).json(userDataWithoutPassword);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;