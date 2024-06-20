// Assuming ObjectId is imported from the MongoDB driver
import { ObjectId } from 'mongodb';

const extractObjectIds = (data) => {
  const momentIds = [];
  const promptIds = [];
  let twyneId = null;

  // Extract twyneId
  if (data.twyneId && data.twyneId.$oid) {
    twyneId = new ObjectId(data.twyneId.$oid);
  }

  // Extract momentIds and promptIds from the structure
  data.structure.forEach(part => {
    if (part.promptId && part.promptId.$oid) {
      promptIds.push(new ObjectId(part.promptId.$oid));
    }
    part.clips.forEach(clip => {
      if (clip.momentId && clip.momentId.$oid) {
        momentIds.push(new ObjectId(clip.momentId.$oid));
      }
    });
  });

  // Format for MongoDB Compass query
  const query = {
    ...(twyneId && { twyneId }), // Keep twyneId as is
    // Ensure momentIds and promptIds are correctly formatted for $in query
    ...(momentIds.length > 0 && { momentIds: { _id: { $in: momentIds } } }),
    ...(promptIds.length > 0 && { promptIds: { _id: { $in: promptIds } } }),
  };

  return query;
};
  

const data = {
  "_id": {
    "$oid": "666c6c3d630867dd329cd2ff"
  },
  "name": "Pacific Crest Endurance Sports Festival",
  "theme": "Inspiring, Energetic, Community-focused",
  "totalTargetDuration": 120000,
  "structure": [
    {
      "part": "Opening Title",
      "type": "Title Sequence",
      "order": 0,
      "durationRange": {
        "min": 2000,
        "max": 5000
      },
      "suggestedDuration": 5000,
      "targetedDuration": 10000,
      "blockInstructions": "used to introduce the film or segment",
      "sceneInstructions": "Kick off with high-energy visuals of the Pacific Crest Endurance Sports Festival title, date, and location. Use upbeat music to set the tone.",
      "clipPace": {
        "type": "timed",
        "bpm": 120,
        "quantity": 5,
        "interval": 2,
        "clipLength": 2
      },
      "clips": [
        {
          "momentId": {
            "$oid": "666cb003630867dd329cd305"
          },
          "clipLength": 2,
          "mediaType": null,
          "id": "666cb003630867dd329cd306"
        },
        {
          "momentId": {
            "$oid": "666cb08b630867dd329cd307"
          },
          "clipLength": 2,
          "mediaType": null,
          "id": "666cb08b630867dd329cd308"
        },
        {
          "momentId": {
            "$oid": "666cb0e3630867dd329cd309"
          },
          "clipLength": 2,
          "mediaType": null,
          "id": "666cb0e3630867dd329cd30a"
        },
        {
          "momentId": {
            "$oid": "666cb86c630867dd329cd30b"
          },
          "clipLength": 2,
          "mediaType": null,
          "id": "666cb86c630867dd329cd30c"
        },
        {
          "momentId": {
            "$oid": "666cbd05630867dd329cd30d"
          },
          "clipLength": 2,
          "mediaType": null,
          "id": "666cbd05630867dd329cd30e"
        }
      ],
      "promptId": {
        "$oid": "666c6c40630867dd329cd301"
      }
    },
    {
      "part": "Event Overview",
      "type": "Montage",
      "order": 1,
      "durationRange": {
        "min": 5000,
        "max": 25000
      },
      "suggestedDuration": 25000,
      "targetedDuration": 40000,
      "blockInstructions": "used to fill in background information or compress time",
      "sceneInstructions": "A dynamic montage showcasing athletes as they prepare and warm up. Capture the vibrant atmosphere and excitement, transitioning smoothly into action shots from the Half Ironman, 10k, and 5k segments.",
      "clipPace": {
        "type": "timed",
        "bpm": 120,
        "quantity": 10,
        "interval": 4,
        "clipLength": 4
      },
      "clips": [
        {
          "momentId": {
            "$oid": "666db109dba7f61d8efe48f0"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db109dba7f61d8efe48f1"
        },
        {
          "momentId": {
            "$oid": "666db12ddba7f61d8efe48f2"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db12ddba7f61d8efe48f3"
        },
        {
          "momentId": {
            "$oid": "666db14edba7f61d8efe48f4"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db14edba7f61d8efe48f5"
        },
        {
          "momentId": {
            "$oid": "666db177dba7f61d8efe48f6"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db177dba7f61d8efe48f7"
        },
        {
          "momentId": {
            "$oid": "666db19fdba7f61d8efe48f8"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db19fdba7f61d8efe48f9"
        },
        {
          "momentId": {
            "$oid": "666db1c3dba7f61d8efe48fa"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db1c3dba7f61d8efe48fb"
        },
        {
          "momentId": {
            "$oid": "666db212dba7f61d8efe48fc"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db212dba7f61d8efe48fd"
        },
        {
          "momentId": {
            "$oid": "666db23fdba7f61d8efe48fe"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db23fdba7f61d8efe48ff"
        },
        {
          "momentId": {
            "$oid": "666db268dba7f61d8efe4900"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db268dba7f61d8efe4901"
        },
        {
          "momentId": {
            "$oid": "666db293dba7f61d8efe4902"
          },
          "clipLength": 4,
          "mediaType": null,
          "id": "666db293dba7f61d8efe4903"
        }
      ],
      "promptId": {
        "$oid": "666c6c40630867dd329cd302"
      }
    },
    {
      "part": "Voices of the Festival",
      "type": "Interview",
      "order": 2,
      "durationRange": {
        "min": 5000,
        "max": 30000
      },
      "suggestedDuration": 30000,
      "targetedDuration": 50000,
      "blockInstructions": "used to provide insights or personal perspectives directly by film",
      "sceneInstructions": "Mix in impactful interviews. Start with an organizer discussing the significance of the event, followed by a perspirant’s personal story and motivation. Include relevant footage between interviews for variety and engagement.",
      "clipPace": {
        "type": "fixed",
        "bpm": null,
        "quantity": 1,
        "interval": null,
        "clipLength": 50
      },
      "clips": [
        {
          "momentId": {
            "$oid": "666f041fdba7f61d8efe4921"
          },
          "clipLength": 50,
          "mediaType": null,
          "id": "666f041fdba7f61d8efe4922"
        }
      ],
      "promptId": {
        "$oid": "666c6c40630867dd329cd303"
      }
    },
    {
      "part": "Finale",
      "type": "Outro Card",
      "order": 3,
      "durationRange": {
        "min": 2000,
        "max": 5000
      },
      "suggestedDuration": 5000,
      "targetedDuration": 20000,
      "blockInstructions": "used to display credits or closing information",
      "sceneInstructions": "Highlight the festival's key moments, emphasizing community spirit and support. Close with a thank you message accompanied by uplifting music, leaving viewers with a lasting positive impression.",
      "clipPace": {
        "type": "fixed",
        "bpm": null,
        "quantity": 1,
        "interval": null,
        "clipLength": 20
      },
      "clips": [
        {
          "momentId": {
            "$oid": "666e2434dba7f61d8efe4906"
          },
          "clipLength": 20,
          "mediaType": null,
          "id": "666e2434dba7f61d8efe4907"
        }
      ],
      "promptId": {
        "$oid": "666c6c40630867dd329cd304"
      }
    }
  ],
  "soundRules": null,
  "createdAt": {
    "$date": "2024-06-14T16:13:49.939Z"
  },
  "lastUpdated": {
    "$date": "2024-06-14T16:13:49.939Z"
  },
  "twyneId": {
    "$oid": "666b72aa630867dd329cd2e5"
  },
  "rendered": false,
  "twyneRenderUri": null
};
  
  const { momentIds, promptIds, twyneId } = extractObjectIds(data);
  
  console.log("Moment IDs:", momentIds);
  console.log("Prompt IDs:", promptIds);
  console.log("Twyne ID:", twyneId);

  