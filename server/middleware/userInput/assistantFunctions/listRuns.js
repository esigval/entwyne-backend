import { openai } from '../../../services/openAiAssistant.js';
async function main() {
  const runs = await openai.beta.threads.runs.list(
    "thread_m8Spb3a8nGS6DNRHyMUNnub0"
  );

  console.log(runs);
}

main();