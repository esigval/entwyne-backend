import { openai } from '../../../services/openAiAssistant.js';

async function main() {
  const threadMessages = await openai.beta.threads.messages.list(
    "thread_19JYQ1G1Ixl1L51y2dxFdR5f"
  );

  threadMessages.data.forEach(message => {
    console.log(message.content);
  });
}

main();