import { openai } from '../../services/openAiAssistant.js';
import { modelVersion35 } from '../../config.js';


async function sentimentAnalysisAssistant(instructions, transcription) {
    
    try {
        const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: instructions + `//transcription//`+ transcription}],
        model: modelVersion35,
      });
  
      let content = completion.choices[0].message.content;
      console.log('content:', completion.choices[0].message.content)
  
      return content;
    } catch (error) {
      console.error('Error in sentimentAnalysisAssistant:', error);
      throw error;
    }
}
  
export default sentimentAnalysisAssistant;