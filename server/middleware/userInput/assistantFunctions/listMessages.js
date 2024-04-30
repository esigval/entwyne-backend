import { openai } from '../../../services/openAiAssistant.js';

async function main() {
  const threadMessages = await openai.beta.threads.messages.list(
    "thread_GtuXBXvDqyVjtaoYpAudpqlQ"
  );

  threadMessages.data.forEach(message => {
    console.log(message.content);
  });
}

main();