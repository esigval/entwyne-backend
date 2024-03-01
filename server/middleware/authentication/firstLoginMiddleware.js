// firstLoginMiddleware.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js'; // Assuming this is your user model
import { config } from '../../config.js'; // Assuming config.js is set up correctly

export const firstLoginMiddleware = async (req, res, next) => {
    const { email, password } = req; // Assuming email is used as the unique identifier
    console.log('password:', password);

    try {
        // Fetch the user from the database to get the hashed password
        const user = await User.findByUsernameOrEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify the password
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Password is valid, proceed with token creation
        const environment = process.env.NODE_ENV || 'local';
        const currentConfig = config[environment];

        const token = jwt.sign({ id: user._id }, currentConfig.SESSION_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, currentConfig.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        req.token = token;
        req.refreshToken = refreshToken;
        req.user = user; // Attach the user data (excluding the password) to req for use in the final route handler

        next();
    } catch (error) {
        console.log('Error in firstLoginMiddleware:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};
