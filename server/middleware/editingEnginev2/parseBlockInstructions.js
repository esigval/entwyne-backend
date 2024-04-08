/**
 * Parses a JSON string containing block instructions into a structured object.
 * @param {string} instructionsJson - A JSON string representing block instructions.
 * @returns {object} A structured object with order as keys and instructions as values.
 */
function parseBlockInstructions(instructionsJson) {
    try {
        // Remove markdown code block backticks
        const cleanedInstructionsJson = instructionsJson.replace(/```json\n|\n```/g, '').trim();

        // Parse the JSON string into an object
        const instructionsObject = JSON.parse(cleanedInstructionsJson);

        // Transform the object to ensure each key represents an order with its instruction
        const structuredInstructions = Object.entries(instructionsObject).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        // Convert back to JSON string if needed for further processing
        const structuredInstructionsJson = JSON.stringify(structuredInstructions, null, 2);

        return structuredInstructionsJson; // Return the transformed JSON string
    } catch (error) {
        console.error("Error parsing block instructions:", error);
        throw error; // Rethrow or handle as needed
    }
}

export default parseBlockInstructions;
