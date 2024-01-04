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