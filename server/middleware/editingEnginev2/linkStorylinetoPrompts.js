import Twyne from "../../models/twyneModel.js";
import Storyline from "../../models/storylineModel.js";
import Prompts from "../../models/promptModel.js";

async function linkStorylineToPrompts(twyneId, storylineId) {
    const twyne = await Twyne.findById(twyneId);
    console.log('Twyne:', twyne);
    const promptIds = twyne.prompts;
    console.log('Prompt IDs:', promptIds);
    await Prompts.linkStorylineIdtoPrompts(storylineId, promptIds);
    console.log('Storyline linked to prompts successfully!');
}

// Call the function with the provided twyneId
linkStorylineToPrompts('661edb7d8efc37640c3d451b', '6626f799166564484bf405bb');