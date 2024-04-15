import { openai } from '../../../services/openAiAssistant.js';


export const submitToolOutputs = async (threadId, runId, callIds) => {
    const run = await openai.beta.threads.runs.submitToolOutputs(
        threadId,
        runId,
        {
            tool_outputs: [
                {
                    tool_call_id: callIds[0], // Assuming callIds is an array
                    output: "true",
                },
            ],
        }
    )
    return run;
  };