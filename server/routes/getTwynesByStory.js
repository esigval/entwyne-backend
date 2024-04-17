import express from 'express';
import Twyne from '../models/twyneModel.js';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

async function GetContributorInfo(userId) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return null;
        }

        const userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.profile.avatarUrl,
            username: user.username
        };

        return userInfo;
    } catch (error) {
        console.error('Error in GetContributorInfo:', error);
    }
}

async function enrichTwynes(twynes) {
    for (let twyne of twynes) {
        const coCreatorsInfo = await Promise.all(twyne.coCreators.map(GetContributorInfo));
        const contributorsInfo = await Promise.all(twyne.contributors.map(GetContributorInfo));

        twyne.avatarInfo = [...coCreatorsInfo, ...contributorsInfo].filter(info => info !== null);
        await Twyne.calculateTwyneProgressFunction(twyne._id);
    }

    return twynes;
}

router.get('/:storyId', validateTokenMiddleware, async (req, res) => {
    try {
        const storyId = req.params.storyId;
        let twynes = await Twyne.findByStoryId(storyId); // Use the provided method to fetch Twynes by storyId

        twynes = await enrichTwynes(twynes);

        res.status(200).json(twynes);
    } catch (error) {
        console.error('Error fetching Twynes by story ID:', error);
        res.status(500).json({ message: 'Error fetching Twynes by story ID' });
    }
});

export default router;