// middleware/enrichTwynesMiddleware.js
import Twyne from '../../models/twyneModel.js';
import User from '../../models/userModel.js';

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

async function enrichTwyne(twyne) {
    const coCreatorsInfo = await Promise.all(twyne.coCreators.map(GetContributorInfo));
    const contributorsInfo = await Promise.all(twyne.contributors.map(GetContributorInfo));

    twyne.avatarInfo = [...coCreatorsInfo, ...contributorsInfo].filter(info => info !== null);
    await Twyne.calculateTwyneProgressFunction(twyne._id);

    return twyne;
}

export async function enrichTwynesMiddleware(req, res, next) {
    try {
        if (Array.isArray(req.twynes)) {
            for (let twyne of req.twynes) {
                await enrichTwyne(twyne);
            }
        } else if (req.twyne) {
            await enrichTwyne(req.twyne);
        }

        next();
    } catch (error) {
        console.error('Error in enrichTwynesMiddleware:', error);
        res.status(500).json({ message: 'Error enriching Twynes' });
    }
}
