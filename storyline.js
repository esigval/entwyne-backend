import { model } from "mongoose"
import Prompts from "./server/models/promptModel"

[
    {
      "storyName": "What I Love About You",
      "prompt": "Choose a picture that symbolizes the beginning of your love story or an image that represents your relationship.",
      "mediaType": "picture",
      "promptTitle": "Intro Image"
    },
    {
      "storyName": "What I Love About You",
      "prompt": "Discuss the moment you knew you were in love with Katie, including how her communication skills played a role in that realization.",
      "mediaType": "video",
      "promptTitle": "Love Realization"
    },
    {
      "storyName": "What I Love About You",
      "prompt": "Select a picture that showcases an important moment or event that Katie helped you navigate through her communication and idea clarification skills.",
      "mediaType": "picture",
      "promptTitle": "Significant Moment"
    },
    {
      "storyName": "What I Love About You",
      "prompt": "Share a recent example of how Katie's communication abilities positively impacted your family life or vacation experience.",
      "mediaType": "video",
      "promptTitle": "Family Impact"
    },
    {
      "storyName": "What I Love About You",
      "prompt": "Choose a picture that represents the growth or change in your relationship thanks to Katie's influence on your decision-making.",
      "mediaType": "picture",
      "promptTitle": "Growth Snapshot"
    },
    {
      "storyName": "What I Love About You",
      "prompt": "Select an image that reflects the current happiness or stability in your relationship, conveying a sense of closure and contentment.",
      "mediaType": "picture",
      "promptTitle": "Content Together"
    }
  ]

  {
    "storyName": {Title},
    "prompt": {Description},
    "twyneId": null,
    "mediaType": {Video},
    "promptTitle": {PromptTitle}
}


  {
    "_id": {
      "$oid": "6595b28269f388bd7df8049f"
    },
    "TemplateName": "What I Love About You",
    "TemplateStoryStructure": "Custom Structure",
    "TemplateLengthInTotal": 60,
    "AverageCutLength": 4,
    "MaxInterviews": 2,
    "TransitionFramesBetweenInterviews": "Yes",
    "RulesHeader": "No rules outside of this for now",
    "StorylineParts": [
      {
        "Order": 1,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Intro Frame"
      },
      {
        "Order": 2,
        "SuggestedLength": 20,
        "MediaType": "video",
        "Storypart": "First Interview"
      },
      {
        "Order": 3,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Transition Frame"
      },
      {
        "Order": 4,
        "SuggestedLength": 20,
        "MediaType": "video",
        "Storypart": "Second Interview"
      },
      {
        "Order": 5,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Transition Frame"
      },
      {
        "Order": 6,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Outro Frame"
      }
    ]
  }

  All I need generated from the LLM is:

  A Prompts
  and a Prompt Title


  my goal is to take the context of the story that we've gathered so far, and using the a template, generate a list of prompts that will be used to create the story. The prompts should have the following properties. I need a function that creates this model.   
  
  {
    "storyId": {Title},
    "prompt": {Description},
    "twyneId": null,
    "mediaType": {Video},
    "promptTitle": {PromptTitle}
}

Then we need to take the created Prompts, and tie them to the storyId (which should be native in MongoDB?), and their associated storylinePart from earlier in the process, so that they look like the following: 

{
    "Order": 1,
    "SuggestedLength": 4,
    "MediaType": "picture",
    "Storypart": "Intro Frame"
    "promptId": {promptId}
  },

  Here is the sample template we'd be converting / extracting from, and in particular the StorylineParts section:


  {
    "_id": {
      "$oid": "6595b28269f388bd7df8049f"
    },
    "TemplateName": "What I Love About You",
    "TemplateStoryStructure": "Custom Structure",
    "TemplateLengthInTotal": 60,
    "AverageCutLength": 4,
    "MaxInterviews": 2,
    "TransitionFramesBetweenInterviews": "Yes",
    "RulesHeader": "No rules outside of this for now",
    "StorylineParts": [
      {
        "Order": 1,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Intro Frame"
      },
      {
        "Order": 2,
        "SuggestedLength": 20,
        "MediaType": "video",
        "Storypart": "First Interview"
      },
      {
        "Order": 3,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Transition Frame"
      },
      {
        "Order": 4,
        "SuggestedLength": 20,
        "MediaType": "video",
        "Storypart": "Second Interview"
      },
      {
        "Order": 5,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Transition Frame"
      },
      {
        "Order": 6,
        "SuggestedLength": 4,
        "MediaType": "picture",
        "Storypart": "Outro Frame"
      }
    ]
  }


  function createPrompts(templateData) {
    const storylineParts = templateData.StorylineParts;
    return storylineParts.map(part => {
      return {
        storyId: templateData._id.$oid, // Assuming this is the title
        prompt: `Describe the ${part.Storypart}`, // Example description
        twyneId: null,
        mediaType: part.MediaType,
        promptTitle: part.Storypart
      };
    });
  }
  