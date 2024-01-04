// Testing Stage - Move to Route after testing 

import StorylineTemplate from '../models/storylineTemplateModel.js'; // Adjust with your actual file path

const data = {
    "templateName": "What I Love About You",
    "storyNarrative": "In this story, we want to couple to both say one thing they admire about each other. We want to have a transition frame between each interview, and we want to have an ending and starting frame at the beginning and end of the story.",
    "templateStoryStructure": "Custom Structure",
    "templateLengthInTotal": 60,
    "averageCutLength": 4,
    "maxInterviews": 2,
    "transitionFramesBetweenInterviews": "Yes",
    "rulesHeader": "No rules outside of this for now",
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
};

const run = async (data) => {
    try {
        const result = await StorylineTemplate.create(data);
        console.log('Template inserted successfully:', result);
    } catch (error) {
        console.error('Error inserting template:', error);
    }
};

run(data);