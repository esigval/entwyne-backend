import Twyne from "../../models/twyneModel.js";
import Storyline from "../../models/storylineModel.js";

const linkStorylineToTwyne = (twyneId, storylineId) => {
    console.log('linkStorylineToTwyne', twyneId, storylineId);

    return new Promise(async (resolve, reject) => {
        try {
            await Storyline.linkStorylineToTwyne(storylineId, twyneId);
            await Twyne.linkStorylineToTwyne(storylineId, twyneId);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export default linkStorylineToTwyne;
