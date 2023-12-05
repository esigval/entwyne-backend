const db = require('../db/db');
const ObjectId = require('mongodb').ObjectId;

const template = {
    id: new ObjectId(),
    created: new Date(),
    templateName: "Test Template",
    storyTemplate: [
        {
            defaultPrompt: "Establishing Shot",
            storylineOrder: 0,
            mediaType: "video",
            lengthDefault: 5,
            contentType: "Establishing Shot",
            storybeat: "Opening"
        },
        {
            defaultPrompt: "Title",
            storylineOrder: 1,
            mediaType: "text/still",
            lengthDefault: 5,
            contentType: "Title",
            storybeat: "Opening"
        },
        {
            defaultPrompt: "Interview Footage",
            storylineOrder: 2,
            mediaType: "video",
            lengthDefault: 15,
            contentType: "Interview Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "B-Roll Footage",
            storylineOrder: 3,
            mediaType: "video",
            lengthDefault: 3,
            contentType: "B-Roll Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "Interview Footage",
            storylineOrder: 4,
            mediaType: "video",
            lengthDefault: 15,
            contentType: "Interview Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "B-Roll Footage",
            storylineOrder: 5,
            mediaType: "video", 
            lengthDefault: 3,
            contentType: "B-Roll Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "Interview Footage",
            storylineOrder: 6,
            mediaType: "video",
            lengthDefault: 15,
            contentType: "Interview Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "B-Roll Footage",
            storylineOrder: 7,
            mediaType: "video",
            lengthDefault: 3,
            contentType: "B-Roll Footage",
            storybeat: "Middle"
        },
        {
            defaultPrompt: "Montage Footage",
            storylineOrder: 8,
            mediaType: "video",
            lengthDefault: 1,
            contentType: "Montage Footage",
            storybeat: "Climax"
        },
        {
            defaultPrompt: "Montage Footage",
            storylineOrder: 9,
            mediaType: "video",
            lengthDefault: 1,
            contentType: "Montage Footage",
            storybeat: "Climax"
        },
        {
            defaultPrompt: "Montage Footage",
            storylineOrder: 10,
            mediaType: "video",
            lengthDefault: 1,
            contentType: "Montage Footage",
            storybeat: "Climax"
        },
        {
            defaultPrompt: "Montage Footage",
            storylineOrder: 11,
            mediaType: "video",
            lengthDefault: 1,
            contentType: "Montage Footage",
            storybeat: "Climax"
        },
        {
            defaultPrompt: "Montage Footage",
            storylineOrder: 12,
            mediaType: "video",
            lengthDefault: 1,
            contentType: "Montage Footage",
            storybeat: "Climax"
        },
        { 
            defaultPrompt: "Credits", 
            storylineOrder: 13, 
            mediaType: "text", 
            lengthDefault: 5, 
            contentType: "Credits",
            storybeat: "Closing"
        }
    ]
};



const createTemplate = async (template) => {
    const database = await db.connect();
    const result = await database.collection('storylineTemplates').insertOne(template);
    console.log(result);
    process.exit(0);
}

createTemplate(template);