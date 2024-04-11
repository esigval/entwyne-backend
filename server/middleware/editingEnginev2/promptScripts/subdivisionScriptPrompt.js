/**
 * Generates a dynamic prompt for the LLM based on narrative structure part, story summary, and theme.
 * @param {Object} structurePart - The narrative structure part object.
 * @param {string} summary - The summary of the story.
 * @param {string} theme - The theme of the story.
 * @returns {string} - The generated prompt for the LLM.
 */

function generateSubDivisionPrompt(structurePart, summary, theme) {
  let prompt = `Analyze the scene details and theme to determine the optimal number of clips needed for a video segment, considering the overall narrative flow. You may decide that a single clip is sufficient if it effectively captures the scene's essence, or suggest multiple clips if they better convey the story's dynamics. For each proposed clip, include a brief objective, a suggested clip length in seconds, and the type of media (video, audio, image).\n\n`;
  prompt += `Scene Type: ${structurePart.type}\n`;
  prompt += `Total Target Duration for Clips: Between ${structurePart.durationRange.min / 1000} to ${structurePart.durationRange.max / 1000} seconds. Suggested total duration is ${structurePart.suggestedDuration / 1000} seconds.\n`;
  prompt += `Scene Instructions: ${structurePart.sceneInstructions}\n`;
  prompt += `Clip Pace: ${structurePart.clipPace.type}\n`;
  
  if (structurePart.clipPace.bpm) {
    prompt += `BPM: ${structurePart.clipPace.bpm}\n`;
  } else if (structurePart.clipPace.interval) {
    prompt += `Interval: ${structurePart.clipPace.interval} seconds per clip suggested, if applicable.\n`;
  }
  
  prompt += `Story Summary: ${summary}\n`;
  prompt += `Theme: ${theme}.\n\n`;
  prompt += `Based on the scene instructions, total target duration, and the theme's energy, decide how many clips are needed and describe them. Consider whether a single clip could suffice or if multiple clips are necessary. For each clip, provide:\n`;
  prompt += `- Objective: [A brief, 15-20 word description of what needs to be captured]\n`;
  prompt += `- Length: [Suggested clip length in seconds]\n`;
  prompt += `- Type: [Suggested media type: video, audio, image]\n\n`;
  prompt += `Ensure the decision on the number of clips and their characteristics effectively uses the suggested duration, aligning with the story's theme and the scene's instructions.`;

  return prompt;
}

export default generateSubDivisionPrompt;


