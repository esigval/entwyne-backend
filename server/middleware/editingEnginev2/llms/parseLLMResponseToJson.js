/**
 * Parses the LLM's structured text response into an array of objects.
 * @param {string} llmResponse - The LLM's text response.
 * @returns {Array} - An array of objects, each representing a clip.
 */
function parseLLMResponseToJSON(llmResponse) {
  // Assuming each clip description is separated by two newlines (as per your shared format)
  const clipDescriptions = llmResponse.split('\n\n');
  return clipDescriptions.map(description => {
    const lines = description.split('\n').map(line => line.trim());
    const objectiveLine = lines.find(line => line.startsWith('- Objective: '));
    const lengthLine = lines.find(line => line.startsWith('- Length: '));
    const typeLine = lines.find(line => line.startsWith('- Type: '));

    const clip = {
      prompt: objectiveLine ? objectiveLine.replace('- Objective: ', '') : '',
      length: lengthLine ? lengthLine.replace('- Length: ', '') : '',
      type: typeLine ? typeLine.replace('- Type: ', '') : ''
    };
    return clip;
  }).filter(clip => clip.prompt || clip.length || clip.type);
}

export default parseLLMResponseToJSON;