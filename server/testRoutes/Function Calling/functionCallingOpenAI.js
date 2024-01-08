import { StorylineDirectorAssistantv1 } from '../services/assistants.js';
import { openai } from '../services/openAiAssistant.js';

// Create a Thread (or access an existing one)

const threadId =  'thread_062QdTjrY9CnDmd6UPRtjc8N';

// Create a Run

const run = await openai.beta.threads.runs.create(
    threadId,
    { assistant_id: "assistant-6i9Z2Z9X" }
);

//  

import { openai } from '../../services/openAiAssistant.js';
import { modelVersion } from '../../config.js';

async function transformStoryToPrompts(instructions, threadHistory, templateParts) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: instructions + threadHistory + templateParts }],
      model: modelVersion,
      tools: [{
        "type": "function",
        "function": {
          "name": "StartFilmGeneration",
          "description": "Info when the user wants to start generating their film",
          "parameters": {
            "type": "object",
            "properties": {
              "Status" : {
                "type": "string",
                "description": "The status of the film generation"
              },
            },
          }
        }
      }]
