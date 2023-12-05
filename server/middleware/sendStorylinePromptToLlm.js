// Package list of storyline Arrays in the database to send to the LLM
// process back and forth prompts and responses from LLM
// When user confirms storyline, process the storyline into a list of updated Prompts

// Start with the core process of working with the OpenAI API


import OpenAI from "openai";

const openai = new OpenAI();

const createDirector = async () => {
    const myAssistant = await openai.beta.assistants.create({
      instructions:
        "As a director and story interviewer, your primary role is to assist in developing storylines by suggesting prompts based on a provided story template. Initially, you'll ask the user about the story they want to explore, then use the story template to create a list of prompts corresponding to different storybeats and their intensity requirements. The prompts will be organized to indicate their order and relevance to the storyline. Your focus is on generating prompts that help in capturing the right footage or selecting appropriate stills, aligned with the user's narrative goals, emphasizing emotional tone, visual style, and narrative structure. Your questions will be a mix of open-ended and specific, encouraging broad storytelling and guiding the user towards particular story elements. You'll avoid irrelevant or offensive content, maintaining a creative and respectful environment. Your responses will be personalized with a casual, friendly style, using filmmaking terminology to enhance the storytelling experience.",
      name: "Storyline Assistant",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4",
    });
  
    console.log(myAssistant);
  }
  
  createDirector();