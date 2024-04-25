import { openai } from '../../../services/openAiAssistant.js';

async function main() {
  const threadMessages = await openai.beta.threads.messages.list(
    "thread_ePJ0zK5LuhvX4FfnoGK2Cqlp"
  );

  threadMessages.data.forEach(message => {
    console.log(message.content);
  });
}

main();