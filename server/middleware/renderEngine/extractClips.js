import Prompts from '../../models/promptModel.js';
import Moment from '../../models/momentModel.js';

const data = {
    "_id": {
        "$oid": "6626fe29ea24b38c154fafdd"
    },
    "name": "Simplified Application Journey",
    "theme": "Concise, Reflective, Insightful",
    "totalTargetDuration": 45000,
    "structure": [
        {
            "part": "Exploring Motives",
            "type": "Interview",
            "order": 0,
            "durationRange": {
                "min": 5000,
                "max": 30000
            },
            "suggestedDuration": 20000,
            "targetedDuration": 20000,
            "blockInstructions": "used to provide insights or personal perspectives directly by film",
            "sceneInstructions": "A brief session discussing your application reasons and motivations, highlighting the personal insights.",
            "clipPace": {
                "type": "fixed",
                "bpm": null,
                "quantity": 1,
                "interval": null,
                "clipLength": 20
            },
            "clips": [
                {
                    "prompt": "Capture the applicant's concise and reflective insights on their motivations for applying.",
                    "length": "20 seconds",
                    "type": "Video",
                    "id": "6626fe2bea24b38c154fafdf",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafe6"
                    }
                }
            ]
        },
        {
            "part": "Reflective Moments",
            "type": "Montage",
            "order": 1,
            "durationRange": {
                "min": 5000,
                "max": 25000
            },
            "suggestedDuration": 20000,
            "targetedDuration": 20000,
            "blockInstructions": "used to fill in background information or compress time",
            "sceneInstructions": "A visual sequence of photos showing you in thoughtful poses, emphasizing the reflective nature of your journey.",
            "clipPace": {
                "type": "timed",
                "bpm": 120,
                "quantity": 5,
                "interval": 4,
                "clipLength": 4
            },
            "clips": [
                {
                    "prompt": "Introduce the reflective journey with a close-up image of you in a contemplative pose.",
                    "length": "4 seconds",
                    "type": "Image",
                    "id": "6626fe30ea24b38c154fafe0",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafe7"
                    }
                },
                {
                    "prompt": "Show a series of images portraying different stages of reflection and introspection.",
                    "length": "4 seconds",
                    "type": "Image",
                    "id": "6626fe30ea24b38c154fafe1",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafe8"
                    }
                },
                {
                    "prompt": "Highlight moments of insight and realization through a sequence of images.",
                    "length": "4 seconds",
                    "type": "Image",
                    "id": "6626fe30ea24b38c154fafe2",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafe9"
                    }
                },
                {
                    "prompt": "Convey a sense of growth and understanding with images reflecting personal development.",
                    "length": "4 seconds",
                    "type": "Image",
                    "id": "6626fe30ea24b38c154fafe3",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafea"
                    }
                },
                {
                    "prompt": "End the montage with a powerful image symbolizing the culmination of the reflective journey.",
                    "length": "4 seconds",
                    "type": "Image",
                    "id": "6626fe30ea24b38c154fafe4",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafeb"
                    }
                }
            ]
        },
        {
            "part": "Final Thoughts",
            "type": "Outro Card",
            "order": 2,
            "durationRange": {
                "min": 2000,
                "max": 5000
            },
            "suggestedDuration": 5000,
            "targetedDuration": 5000,
            "blockInstructions": "used to display credits or closing information",
            "sceneInstructions": "A conclusive segment that reinforces the message and provides a reflective ending.",
            "clipPace": {
                "type": "fixed",
                "bpm": null,
                "quantity": 1,
                "interval": null,
                "clipLength": 5
            },
            "clips": [
                {
                    "prompt": "Showcase a visually appealing outro card with the main message of the video.",
                    "length": "5 seconds",
                    "type": "Image",
                    "id": "6626fe31ea24b38c154fafe5",
                    "promptId": {
                        "$oid": "6626fe31ea24b38c154fafec"
                    }
                }
            ]
        }
    ],
    "soundRules": null,
    "createdAt": {
        "$date": "2024-04-23T00:17:45.116Z"
    },
    "lastUpdated": {
        "$date": "2024-04-23T00:17:45.116Z"
    },
    "twyneId": {
        "$oid": "6626d10b1ad7958d21275ee7"
    }
}

async function extractClipData(data) {
    let results = [];

    // Get the map of proxy URIs
    const proxyUrisMap = await Moment.getProxyUrisMap();

    for (const [index, part] of data.structure.entries()) {
        for (const [clipIndex, clip] of part.clips.entries()) {
            let clipData = {
                orderIndex: `${index}.${clipIndex}`,
                type: clip.type,
                promptId: clip.promptId.$oid
            };
            // Add momentId to clipData
            const momentIds = await Prompts.findMomentIdsByPromptIds([clipData.promptId]);
            clipData.momentId = momentIds[0]; // Assuming each promptId corresponds to one momentId

            // Add proxy URIs to clipData
            const proxyUris = proxyUrisMap[clipData.momentId];
            if (proxyUris) {
                clipData.audioUri = proxyUris.audioUri;
                clipData.videoUri = proxyUris.videoUri;
            }

            results.push(clipData);
        }
    }
    return results;
}

// Get the extracted clip data
extractClipData(data).then(clipData => {
    console.log(clipData);
}).catch(error => {
    console.error('Error extracting clip data:', error);
});