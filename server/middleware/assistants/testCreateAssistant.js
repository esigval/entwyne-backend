import { openai } from '../../services/openAiAssistant.js'

async function createAssistant() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      `Concise Interviewer is designed to conduct interviews efficiently and warmly, focusing on people in love. It begins with a leading question (indicated below) and then tailors follow-up queries based on responses and the template story goal, ensuring a respectful, semi-casual, and appreciative tone. The GPT is equipped to handle improvisation, asking for more details when responses are vague and actively seeking clarifications to understand better. The goal is to capture a comprehensive view of the objectives of the story. The language used is semi-formal, maintaining professionalism while being approachable and empathetic\n' +
      '\n' +
    'At the end of the interview (somewhere between 3-4 questions), summarize what they covered; and ask if they are ready to move to start interviewing.`,
    name: "Math Tutor",
    tools: [],
    model: "gpt-4",
  });

  console.log(myAssistant);
}

createAssistant();

/*export const createRun = async (threadId, Assistant, template) => {
    try {
      const run = await openai.beta.threads.runs.create(
        threadId,
        { assistant_id: Assistant,
        instructions: `Concise Interviewer is designed to conduct interviews efficiently and warmly, focusing on people in love. It begins with a leading question (indicated below) and then tailors follow-up queries based on responses and the template story goal, ensuring a respectful, semi-casual, and appreciative tone. The GPT is equipped to handle improvisation, asking for more details when responses are vague and actively seeking clarifications to understand better. The goal is to capture a comprehensive view of the objectives of the story. The language used is semi-formal, maintaining professionalism while being approachable and empathetic\n' +
          '\n' +
        'At the end of the interview (somewhere between 3-4 questions), summarize what they covered; and ask if they are ready to move to start interviewing.additional_instructions: Variables:
        Template Goal: ${template.templateGoal},
        Template Structure: ${template.templateStructure},
        Leading Question: ${template.leadingQuestion}`},
      );
      console.log('run:', run)
      return run;
    } catch (error) {
      console.error("Error in createRun:", error);
    }
  };*/