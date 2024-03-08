import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Adjust path as necessary
import sendMessage from '../utils/sendSESMEssage.js';
import { config } from '../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];
const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Route hit. Request body:', req.body); 
    const { emailOrUsername } = req.body;

    try {
        // Find user by email or username
        const user = await User.findByUsernameOrEmail(emailOrUsername);

        if (!user) {
            // Response without revealing user existence
            return res.status(404).send('If a user with that email or username exists, a password reset link has been sent.');
        }

        // Generate a token with a 30-minute expiration
        const token = jwt.sign({ userId: user._id.toString() }, currentConfig.PASSWORD_SECRET, { expiresIn: '15m' });

        // Create a reset link to be sent via email
        const resetLink = `${currentConfig.EMAIL_RESET_BASE_URL}?token=${token}`;

        const htmlBody = `
  <div>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the link below to set a new password:</p>
    <p><a href="${resetLink}" style="color: #1155cc;">Reset Password</a></p>
    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p>Thank you,</p>
    <p>Entwyne Customer Support</p>
  </div>
`;

        // Send the email
        await sendMessage(currentConfig.FROM_NAME, user.email, 'Password Reset Request', htmlBody);

        res.send('If a user with that email or username exists, a password reset link has been sent.');
    } catch (error) {
        console.error('Password Reset Error:', error);
        res.status(500).send('An error occurred while processing your password reset request.');
    }
});

export default router;
