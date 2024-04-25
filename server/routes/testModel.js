import Storyline from '../models/storylineModel.js'; 

const countTokens = (text) => {
    // Split the text into words
    const words = text.split(/\s+/);
    // Return the number of words
    return words.length;
};

const storylineSummary = async (twyneId) => {
    const storylineSummary = await Storyline.getStorylineByTwyneId(twyneId);
    console.log('Storyline Summary:', storylineSummary);

    // Convert the storyline summary to a string
    const storylineString = JSON.stringify(storylineSummary);

    // Count the tokens in the storyline summary
    const tokenCount = countTokens(storylineString);
    console.log(`The storyline summary has ${tokenCount} tokens.`);
};

storylineSummary('6625e3223b59f96f6c0e1dc9');