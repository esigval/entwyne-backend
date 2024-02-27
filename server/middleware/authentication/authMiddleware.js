import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findByUsernameOrEmail(username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.user = user;
    next();
};