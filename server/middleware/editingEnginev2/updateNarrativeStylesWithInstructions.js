import NarrativeStyles from "../../models/narrativeStylesModel.js";
import Storyline from "../../models/storylineModel.js";

/**
 * Takes a NarrativeStylesTemplate document and a JSON string of new instructions, creating a new document with updated instructions,
 * adjusting only the order and instructions while preserving other details of the template.
 * @param {object} NarrativeStylesTemplate - The original NarrativeStylesTemplate document.
 * @param {string} instructionsJson - JSON string of new instructions.
 * @returns {NarrativeStyles} Updated instance of NarrativeStyles.
 */
const updateNarrativeStylesWithInstructions = async (NarrativeStylesTemplate, instructionsJson) => {
    // Parse the JSON string of new instructions
    const instructionsObject = JSON.parse(instructionsJson);

    const NarrativeStyle = await NarrativeStyles.findByName(NarrativeStylesTemplate);
    console.log('instructionsObject', instructionsObject);

    // Iterate over the template's structure and update it with new instructions
    const updatedStructure = NarrativeStyle.structure.map(item => {
        const orderString = item.order.toString(); // Convert order to string for key comparison
        if (instructionsObject.hasOwnProperty(orderString)) {
            // If there are matching instructions for this order, add them
            let instruction;
            if (typeof instructionsObject[orderString] === 'string') {
                instruction = instructionsObject[orderString];
            } else if (instructionsObject[orderString].instructions) {
                instruction = instructionsObject[orderString].instructions;
            }
            return {
                ...item, // Spread existing item properties
                instructions: instruction // Add new instruction
            };
        }
        return item; // Return item unchanged if no matching instructions
    });

    console.log('updated', updatedStructure)

    // Create a new NarrativeStyles instance with the updated structure
    const NarrativeStylesInstance = new NarrativeStyles({
        ...NarrativeStyle,
        _id: undefined, // Omit _id
        structure: updatedStructure,
    });

    console.log('NarrativeStylesInstance', NarrativeStylesInstance);

    // Assuming createStorylineInstance exists and is ready to use
    try {
        const insertedId = await Storyline.createStorylineInstance(NarrativeStylesInstance);


        console.log(`Storyline created with ID: ${insertedId}`);
        return insertedId; // Returning or handling the ID as needed
    } catch (error) {
        console.error("Failed to create storyline instance:", error);
        throw error; // Rethrow or handle as preferred
    }
};


export default updateNarrativeStylesWithInstructions;
