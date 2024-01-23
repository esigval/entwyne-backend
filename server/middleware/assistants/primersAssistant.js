import { openai } from '../../services/openAiAssistant.js';
import { modelVersion35 } from '../../config.js';
import fetchAndSummarizeThread from '../storylineEngine/fetchAndSummarizeThread.js';
import {primerAssistantInstrucitons} from '../../prompts/assistantInstructions.js';


async function primersAssistant(threadHistory, promptJson, transcription) {
const instructions = primerAssistantInstrucitons;
  try {
      const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: instructions +`//thread history//`+ threadHistory + `//prompts//`+ promptJson }],
      model: modelVersion35,
    });

    let content = completion.choices[0].message.content;
    console.log('content:', completion.choices[0].message.content)

    return content;
  } catch (error) {
    console.error('Error in directorReviewScoreAssistant:', error);
    throw error;
  }
}

export default directorReviewScoreAssistant;