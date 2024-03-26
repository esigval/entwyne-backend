import express from 'express';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import universalPresignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { config } from '../config.js';
import url from 'url';
import path from 'path';
import { removeExtensionFromKey } from '../utils/removeExtensionFromKey.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password; // delete the password field

        const presignedUrlMiddleware = universalPresignedUrl(currentConfig.USER_BUCKET);
        let presignedAvatarUrl;

        if (typeof user.profile.avatarUrl === 'string') {
            const parsedAvatarUrl = url.parse(new URL(user.profile.avatarUrl).pathname);
            const avatarKeyWithExtension = parsedAvatarUrl.path.substring(1); // Remove the leading '/'
            const avatarKey = removeExtensionFromKey(avatarKeyWithExtension);
            console.log('avatarKey:', avatarKey);
            try {
                presignedAvatarUrl = await presignedUrlMiddleware('getObject', avatarKey);
            } catch (error) {
                console.error('Failed to get presigned URL:', error);
                return res.status(500).json({ error: 'Failed to get presigned URL' });
            }
        }

        user.profile.avatarUrl = presignedAvatarUrl;

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;