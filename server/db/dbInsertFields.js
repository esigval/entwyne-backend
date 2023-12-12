import { connect } from './db.js';

const storylineTest = {
    storyTemplate: [
        {
            "prompt": "Your family's journey starts. Where does it begin?",
            "order": 0,
            "mediaType": "video",
            "length": 5,
            "contentType": "Establishing Shot",
            "storybeat": "Opening",
            "twyneId": null,
            "shotDescription": "Family home or vehicle packed for the adventure.",
            "promptTitle": "Journey's Starting Point"
        },
        {
            "prompt": "Add a Title. What encapsulates your family's adventure?",
            "order": 1,
            "mediaType": "text/still",
            "length": 5,
            "contentType": "Title",
            "storybeat": "Opening",
            "twyneId": null,
            "shotDescription": "Title screen with something like 'Sigvaldsens' Thanksgiving Expedition'.",
            "promptTitle": "Family Adventure Title"
        },
        {
            "prompt": "Describe the feeling starting this family Thanksgiving trip?",
            "order": 2,
            "mediaType": "video",
            "length": 15,
            "contentType": "Interview Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Interview family members about their initial emotions and expectations.",
            "promptTitle": "Emotional Expectations Interview"
        },
        {
            "prompt": "B-Roll family prep. What does anticipation look like?",
            "order": 3,
            "mediaType": "video",
            "length": 3,
            "contentType": "B-Roll Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Family members preparing, packing, and getting into the car.",
            "promptTitle": "Family Preparation Scene"
        },
        {
            "prompt": "Interview about Hidden Forest Cave. First impressions?",
            "order": 4,
            "mediaType": "video",
            "length": 15,
            "contentType": "Interview Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Family's reactions upon encountering the entrance to the cave.",
            "promptTitle": "Cave Entrance Reactions"
        },
        {
            "prompt": "B-Roll Cave Entrance. How's everyone's mood?",
            "order": 5,
            "mediaType": "video",
            "length": 3,
            "contentType": "B-Roll Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Shots of the cave entrance, family members hesitating or exploring.",
            "promptTitle": "Cave Entrance Atmosphere"
        },
        {
            "prompt": "Interview about handling fear. How did Ana cope?",
            "order": 6,
            "mediaType": "video",
            "length": 15,
            "contentType": "Interview Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Discuss Ana's experience with the cave and holding Owen's hand.",
            "promptTitle": "Ana's Fear Management"
        },
        {
            "prompt": "B-Roll Cave Interior. What's the siblings' dynamic like?",
            "order": 7,
            "mediaType": "video",
            "length": 3,
            "contentType": "B-Roll Footage",
            "storybeat": "Middle",
            "twyneId": null,
            "shotDescription": "Inside the cave: Ana nervous, Owen reassures, Rowan's curiosity.",
            "promptTitle": "Siblings in the Cave"
        },
        {
            "prompt": "Montage Cave Triumph. What victory did the kids feel?",
            "order": 8,
            "mediaType": "video",
            "length": 1,
            "contentType": "Montage Footage",
            "storybeat": "Climax",
            "twyneId": null,
            "shotDescription": "Ana smiling post-fear, Rowan exploring fearlessly.",
            "promptTitle": "Kids' Cave Victory"
        },
        {
            "prompt": "Montage Cowboy Dinner Tree Arrival. How did you feel?",
            "order": 9,
            "mediaType": "video",
            "length": 1,
            "contentType": "Montage Footage",
            "storybeat": "Climax",
            "twyneId": null,
            "shotDescription": "Family's arrival at the restaurant, the darkness surrounding them.",
            "promptTitle": "Dinner Tree Arrival"
        },
        {
            "prompt": "Montage Massive Steak. Who had eyes bigger than stomach?",
            "order": 10,
            "mediaType": "video",
            "length": 1,
            "contentType": "Montage Footage",
            "storybeat": "Climax",
            "twyneId": null,
            "shotDescription": "The ridiculously large steak servings at the table.",
            "promptTitle": "Giant Steak Challenge"
        },
        {
            "prompt": "Montage Dinner Enjoyment. What makes a perfect family meal?",
            "order": 11,
            "mediaType": "video",
            "length": 1,
            "contentType": "Montage Footage",
            "storybeat": "Climax",
            "twyneId": null,
            "shotDescription": "Family eating, chatting, laughing around the dinner table.",
            "promptTitle": "Joyful Family Dinner"
        },
        {
            "prompt": "Montage Evening End. How do you wrap up adventure?",
            "order": 12,
            "mediaType": "video",
            "length": 1,
            "contentType": "Montage Footage",
            "storybeat": "Climax",
            "twyneId": null,
            "shotDescription": "Exhausted but satisfied family leaving the restaurant, driving home.",
            "promptTitle": "Adventure Conclusion"
        },
        {
            "prompt": "Add Credits. Who are your Thanksgiving adventure stars?",
            "order": 13,
            "mediaType": "text",
            "length": 5,
            "contentType": "Credits",
            "storybeat": "Closing",
            "twyneId": null,
            "shotDescription": "Credits with family names and a thank you note.",
            "promptTitle": "Thanksgiving Credits"
        }
    ]
};


const renameCollection = async () => {
    const db = await connect();
    await db.collection('twynemedia').rename('twynes');
    console.log('Collection renamed');
};

renameCollection();