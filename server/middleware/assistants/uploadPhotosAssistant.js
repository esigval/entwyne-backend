import { openai } from '../../services/openAiAssistant.js';
import { modelVersion35 } from '../../config.js';
import fetchAndSummarizeThread from '../storylineEngine/fetchAndSummarizeThread.js';


async function directorReviewAssistant(instructions, threadId, prompts, transcription) {
    
    try {
        const threadHistory = await fetchAndSummarizeThread(threadId); // Implement this function
        const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: instructions +`//thread history//`+ threadHistory + `//prompts//`+ prompts + `//transcription//`+ transcription}],
        model: modelVersion35,
      });
  
      let content = completion.choices[0].message.content;
      console.log('content:', completion.choices[0].message.content)
  
      return content;
    } catch (error) {
      console.error('Error in directorReviewAssistant:', error);
      throw error;
    }
  }
  
  export default directorReviewAssistant;