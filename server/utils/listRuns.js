// Can I make a function call? What does that look like?



import { openai } from "../services/openAiAssistant.js";
import 



async function main() {
    const runs = await openai.beta.threads.runs.list(
      "thread_062QdTjrY9CnDmd6UPRtjc8N"
    );
  
    console.log(runs);
  }
  
  main();