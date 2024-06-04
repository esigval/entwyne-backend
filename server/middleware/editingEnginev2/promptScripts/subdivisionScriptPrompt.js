/**
 * Generates a dynamic prompt for the LLM based on narrative structure part, story summary, and theme.
 * @param {Object} structurePart - The narrative structure part object.
 * @param {string} summary - The summary of the story.
 * @param {string} theme - The theme of the story.
 * @returns {string} - The generated prompt for the LLM.
 */

function generateSubDivisionPrompt(structurePart, summary, theme, storySummary) {
  let prompt = `Analyze the scene details and theme to determine the optimal number of clips needed for a video segment, considering the overall narrative flow. You may decide that a single clip is sufficient if it effectively captures the scene's essence, or suggest multiple clips if they better convey the story's dynamics. For each proposed clip, include a description of a task that is userfriendly and informative, helping the user take the action neccesary to complete the task, a suggested clip length in seconds, and the type of media (video, audio, image).\n\n`;
  prompt += `Clip Type: ${structurePart.type}\n`;
  prompt += `Clip Length: ${structurePart.clipPace.clipLength} seconds.\n`; 
  prompt += `Scene Instructions: ${structurePart.sceneInstructions}\n`;
  prompt += `Number of Clips: ${structurePart.clipPace.quantity}\n`;
  
  
  prompt += `Twyne Summary: ${summary}\n`;
  prompt += `Story Summary and only use this for context, but don't expand outside the twyne Summary: ${storySummary}\n`;
  prompt += `Theme: ${theme}.\n\n`;
  prompt += `Using the scene instructions, Twyne Summary, Story Summary, create the number of clips indicated above. For each clip, provide:\n`;
  prompt += `- Objective: [A brief, 15-20 word description of what needs to be captured, taking into context the type. If its an interview, make the prompt a curious question about the user, and if its a montage, make it descriptive following the theme.]\n`;
  prompt += `- Length: [Clip Length]\n`;
  prompt += `- Type: [Suggested media type: video, audio, image]\n\n`;
  prompt += `Ensure the decision on the number of clips and their characteristics effectively uses the suggested duration, aligning with the story's theme and the scene's instructions.`;

  console.log(prompt);
  return prompt;
}

export default generateSubDivisionPrompt;


