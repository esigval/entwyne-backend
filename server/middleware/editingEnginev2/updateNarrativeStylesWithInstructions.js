import Storyline from "../../models/storylineModel.js";

/**
 * Takes a constructedNarrative document and a JSON string of new instructions, creating a new document with updated instructions,
 * adjusting only the order and instructions while preserving other details of the template.
 * @param {object} constructedNarrative - The original constructedNarrative document.
 * @param {string} instructionsJson - JSON string of new instructions.
 * @returns {Storyline} Updated instance of Storyline.
 */
const updateNarrativeStylesWithInstructions = async (constructedNarrative, instructionsJson) => {
    // Parse the JSON string of new instructions
    const instructionsObject = JSON.parse(instructionsJson);

    // Iterate over the constructedNarrative's structure and update it with new instructions
    const updatedStructure = constructedNarrative.structure.map(item => {
        const orderString = item.order.toString(); // Convert order to string for key comparison
        if (instructionsObject.hasOwnProperty(orderString)) {
            // If there are matching instructions for this order, add them
            let instruction;
            if (typeof instructionsObject[orderString] === 'string') {
                instruction = instructionsObject[orderString];
            } else if (instructionsObject[orderString].sceneInstructions) {
                instruction = instructionsObject[orderString].sceneInstructions;
            }
            return {
                ...item, // Spread existing item properties
                sceneInstructions: instruction // Add new instruction
            };
        }
        return item; // Return item unchanged if no matching instructions
    });

    // Create a new Storyline instance with the updated structure
    const StorylineInstance = new Storyline({
        ...constructedNarrative,
        _id: undefined, // Omit _id
        structure: updatedStructure,
    });

    // Return the StorylineInstance directly
    return StorylineInstance;
};

export default updateNarrativeStylesWithInstructions;