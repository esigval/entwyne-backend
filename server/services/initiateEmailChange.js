import dotenv from 'dotenv';
import sendMessage from '../utils/sendSESMEssage.js';
import User from '../models/userModel.js';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

// Make Email Token
async function generateTokenForEmailChange(userId, newEmail) {
    const token = jwt.sign({ userId, newEmail }, currentConfig.EMAIL_CONFIRMATION_SECRET, { expiresIn: '48h' });
    return token; 
}

const sendEmailChangeConfirmation = async (fromName, newEmail, subject, htmlBody, token) => {
    const url = `${currentConfig.EMAIL_CONFIRMATION_URL}/${token}`;
    htmlBody += `<p>Please click <a href="${url}">here</a> to confirm your email change.</p>`;
    await sendMessage(fromName, newEmail, subject, htmlBody);
};

const initiateEmailChange = async (userId, newEmail) => {
    try {
        const token = await generateTokenForEmailChange(userId, newEmail);

        // Store the token in the database, associate it with the user
        // await User.storeEmailChangeToken(userId, token);

        const fromName = currentConfig.FROM_NAME;
        console.log(process.env.LOCAL_FROM_NAME);
        console.log('fromName:', fromName);
        const subject = 'Confirm Your Email Change';
        let htmlBody = 'You requested to change your email. '; // Initial part of the email body

        // Now, call the sendEmailChangeConfirmation function with the necessary parameters
        await sendEmailChangeConfirmation(fromName, newEmail, subject, htmlBody, token);
    } catch (error) {
        console.error('Error initiating email change:', error);
        // Depending on your setup, you might want to throw the error or handle it differently
        throw error;
    }
};

export default initiateEmailChange;
