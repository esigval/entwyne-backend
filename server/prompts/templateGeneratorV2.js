Template Creation Questions:

Template Name: "What is the name of this template?"
Template Story Structure: "What story structure would you like to use? (e.g., 3 Act Structure, 5 Act Structure, Hero's Journey, etc.)"
Template Length in Total: "What is the total length of time for the template? (e.g., in minutes or hours)"
Average Cut Length: "What should be the average length of each cut? (e.g., in seconds or minutes)"
Max Interviews: "How many maximum interviews would you like to include in this template?"
Transition Frames Between Interviews: "Would you like to have transition frames between interviews? (Yes or No)"
Generation of StorylineParts:

Based on your answers to the above questions, I will generate the StorylineParts section of the JSON template, detailing each part of the storyline.
Rules Header:

You can send a "rules header" with the key points or specific rules that you want to be included in the template.For example, if you want a transition frame between each act, or specific media types to be used, these rules can be stated upfront.

// Example Json Output
{
    "TemplateName": "Marketing Test",
        "TemplateStoryStructure": "3 Act Structure",
            "TemplateLengthInTotal": "1 minute",
                "AverageCutLength": "1 second for photos, 10 seconds for interviews",
                    "MaxInterviews": "3",
                        "TransitionFramesBetweenInterviews": "Yes",
                            "RulesHeader": "Transition frames between each act",
                                "StorylineParts": [
                                    // Sample Storyline Parts
                                    {
                                        "Order": "1",
                                        "SuggestedLength": "10 seconds",
                                        "MediaType": "video",
                                        "Storypart": "Act 1",
                                        "ActDescription": "Set-up"
                                    },
                                    {
                                        "Order": "2",
                                        "SuggestedLength": "1 second",
                                        "MediaType": "transition",
                                        "Storypart": "Transition"
                                    },

                                ]
}

{
    "TemplateName": "{User Variable}",
        "TemplateStoryStructure": "{3 Act Structure, 5 Act Structure, Heroes Journey, etc}",
            "TemplateLengthInTotal": "{time variable}",
                "AverageCutLength": "{Use this variable}",
                    "MaxInterviews": "{User Variable}",
                        "TransitionFramesBetweenInterviews": "{Yes, No}",
                            "RulesHeader": "{User Variable}",
                                "StorylineParts": [
                                    {
                                        "Order": "{x}",
                                        "SuggestedLength": "{length of time}",
                                        "MediaType": "{video, picture, audio, graphic}",
                                        "Storypart": "{of Template Story Structure}"
                                    }



        I would like you to take each storyline part in this list, and generate a list of prompts and prompt titles that give the user instructions on how to best capture the content.The output should be JSON, like this:
                                    {
                                        "order": 1,
                                        "prompt": { should be a prompt to the user on what to capture },
                                        "promptTitle": { should be summary of the prompt in 3 words }
                                    },


                                    Try again, but with this: I would like you to take each storyline part in this list, and generate a list of prompts and prompt titles that give the user instructions on how to best capture the content.The output should be JSON, like this: { "order": 1, "prompt": {should be a prompt to the user on what to capture }, "promptTitle": {should be summary of the prompt in 3 words } },


Template:
{
    "storylineParts": [
      {
        "order": 1,
        "suggestedLength": 4,
        "mediaType": "picture",
        "storyPart": "Intro Frame"
      },
      {
        "order": 2,
        "suggestedLength": 20,
        "mediaType": "video",
        "storyPart": "First Interview from Couple 1"
      },
      {
        "order": 3,
        "suggestedLength": 4,
        "mediaType": "picture",
        "storyPart": "Transition Frame"
      },
      {
        "order": 4,
        "suggestedLength": 20,
        "mediaType": "video",
        "storyPart": "Second Interview from Couple 2"
      },
      {
        "order": 5,
        "suggestedLength": 4,
        "mediaType": "picture",
        "storyPart": "Transition Frame"
      },
      {
        "order": 6,
        "suggestedLength": 4,
        "mediaType": "picture",
        "storyPart": "Outro Frame"
      }
    ]
  }

                                    Conversation history:
                                    Hello! I'm glad you could join me today. I'd love to learn more about your love story. To start, could you tell me how you and your partner first met?
Well there were two meetings. I knew her cousin pretty well (we were friends), but I think the first time we connected was at a house party over there with our friends, and she decided to come over
It sounds like a serendipitous first encounter through mutual friends at a house party. What happened during that initial meeting that made it memorable for you? And how did the second meeting come about?
She was cute, of course, also pretty funny. i thought she was smart and I get pretty excited when people challenge my thinking!
It's lovely to hear that her intelligence and sense of humor captivated you. It's interesting how a challenge in conversation can spark an attraction. So, after this engaging first impression, how did things progress between you two? Did you find yourselves seeking each other out after the party?
6 months later we decided to work together on a project, and one thing led to the next
It's quite fascinating how a professional collaboration can sometimes serve as a prelude to a deeper connection. Working closely on a project must have allowed you both to see different aspects of each other's personalities and work ethics. Could you share a moment during this project that made you realize your relationship was evolving beyond just a professional collaboration?

Also, please feel free to dive into any significant turning points or moments of realization that defined your journey from collaborators to partners in love.
Basically, I loved her intelligence and curiosity. She was very devote with God too, which was important to me. I felt she would be a great partner who I wanted to build a life with
It's truly touching to know that shared values, such as spirituality and devotion, alongside her intelligence and curiosity, laid the foundation for your connection. That desire to build a life with someone who aligns with your core beliefs is a significant moment of recognition in any relationship.

Your story beautifully illustrates a theme of friendship blossoming into love, with intellectual challenge and shared faith as cornerstones of your bond.

Thank you for sharing your experience with me. Are you and your partner ready to start filming and bring your love story to life on screen?