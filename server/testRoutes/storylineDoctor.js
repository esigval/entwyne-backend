const extractObjectIds = (data) => {
  const momentIds = [];
  const promptIds = [];
  let twyneId = null;

  // Extract twyneId
  if (data.twyneId && data.twyneId.$oid) {
    twyneId = `ObjectId("${data.twyneId.$oid}")`;
  }

  // Extract momentIds and promptIds from the structure
  data.structure.forEach(part => {
    if (part.promptId && part.promptId.$oid) {
      promptIds.push(`ObjectId("${part.promptId.$oid}")`);
    }
    part.clips.forEach(clip => {
      if (clip.momentId && clip.momentId.$oid) {
        momentIds.push(`ObjectId("${clip.momentId.$oid}")`);
      }
    });
  });

  return { momentIds, promptIds, twyneId };
};
  

const data = {
    "_id": {
      "$oid": "666853b82fd5288688800091"
    },
    "name": "The Joy of Making a Cup of Coffee",
    "theme": "Joyful, Energetic",
    "totalTargetDuration": 60000,
    "structure": [
      {
        "part": "Coffee Joy Title",
        "type": "Title Sequence",
        "order": 0,
        "durationRange": {
          "min": 2000,
          "max": 5000
        },
        "suggestedDuration": 5000,
        "targetedDuration": 5000,
        "blockInstructions": "used to introduce the film or segment",
        "sceneInstructions": "Introduces the video title and sets the theme.",
        "clipPace": {
          "type": "timed",
          "bpm": 120,
          "quantity": 3,
          "interval": 2,
          "clipLength": 2
        },
        "clips": [
          {
            "momentId": {
              "$oid": "666856ec2fd528868880009a"
            },
            "clipLength": 2,
            "mediaType": null,
            "id": "666856ec2fd528868880009b"
          },
          {
            "momentId": {
              "$oid": "666857bf2fd52886888000a4"
            },
            "clipLength": 2,
            "mediaType": null,
            "id": "666857c02fd52886888000a5"
          },
          {
            "momentId": {
              "$oid": "666858292fd52886888000a8"
            },
            "clipLength": 2,
            "mediaType": null,
            "id": "666858292fd52886888000a9"
          }
        ],
        "promptId": {
          "$oid": "666853b92fd5288688800093"
        }
      },
      {
        "part": "Brief Introduction",
        "type": "Montage",
        "order": 1,
        "durationRange": {
          "min": 5000,
          "max": 25000
        },
        "suggestedDuration": 10000,
        "targetedDuration": 10000,
        "blockInstructions": "used to fill in background information or compress time",
        "sceneInstructions": "Introduction to the topic",
        "clipPace": {
          "type": "timed",
          "bpm": 120,
          "quantity": 3,
          "interval": 4,
          "clipLength": 4
        },
        "clips": [
          {
            "momentId": {
              "$oid": "666856c82fd5288688800098"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666856c82fd5288688800099"
          },
          {
            "momentId": {
              "$oid": "666859fd2fd52886888000b4"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666859fd2fd52886888000b5"
          },
          {
            "momentId": {
              "$oid": "66685a302fd52886888000b6"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "66685a302fd52886888000b7"
          }
        ],
        "promptId": {
          "$oid": "666853b92fd5288688800094"
        }
      },
      {
        "part": "Brewing Coffee",
        "type": "Montage",
        "order": 2,
        "durationRange": {
          "min": 5000,
          "max": 25000
        },
        "suggestedDuration": 25000,
        "targetedDuration": 25000,
        "blockInstructions": "used to fill in background information or compress time",
        "sceneInstructions": "Steps to brew a perfect cup of coffee",
        "clipPace": {
          "type": "timed",
          "bpm": 120,
          "quantity": 6,
          "interval": 4,
          "clipLength": 4
        },
        "clips": [
          {
            "momentId": {
              "$oid": "666857192fd528868880009c"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666857192fd528868880009d"
          },
          {
            "momentId": {
              "$oid": "666857342fd528868880009e"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666857342fd528868880009f"
          },
          {
            "momentId": {
              "$oid": "666858bc2fd52886888000ac"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666858bc2fd52886888000ad"
          },
          {
            "momentId": {
              "$oid": "666858bd2fd52886888000ae"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666858bd2fd52886888000af"
          },
          {
            "momentId": {
              "$oid": "666859542fd52886888000b0"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666859542fd52886888000b1"
          },
          {
            "momentId": {
              "$oid": "666859d22fd52886888000b2"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666859d22fd52886888000b3"
          }
        ],
        "promptId": {
          "$oid": "666853b92fd5288688800095"
        }
      },
      {
        "part": "Enjoying the Coffee",
        "type": "Montage",
        "order": 3,
        "durationRange": {
          "min": 5000,
          "max": 25000
        },
        "suggestedDuration": 10000,
        "targetedDuration": 10000,
        "blockInstructions": "used to fill in background information or compress time",
        "sceneInstructions": "Shows clips of people appreciating the freshly brewed coffee.",
        "clipPace": {
          "type": "timed",
          "bpm": 120,
          "quantity": 3,
          "interval": 4,
          "clipLength": 4
        },
        "clips": [
          {
            "momentId": {
              "$oid": "6668574f2fd52886888000a0"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "6668574f2fd52886888000a1"
          },
          {
            "momentId": {
              "$oid": "666857e72fd52886888000a6"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666857e72fd52886888000a7"
          },
          {
            "momentId": {
              "$oid": "666858602fd52886888000aa"
            },
            "clipLength": 4,
            "mediaType": null,
            "id": "666858602fd52886888000ab"
          }
        ],
        "promptId": {
          "$oid": "666853b92fd5288688800096"
        }
      },
      {
        "part": "Sipping the Coffee",
        "type": "Outro Card",
        "order": 4,
        "durationRange": {
          "min": 2000,
          "max": 5000
        },
        "suggestedDuration": 5000,
        "targetedDuration": 10000,
        "blockInstructions": "used to display credits or closing information",
        "sceneInstructions": "Closing scene with coffee being enjoyed",
        "clipPace": {
          "type": "fixed",
          "bpm": null,
          "quantity": 1,
          "interval": null,
          "clipLength": 10
        },
        "clips": [
          {
            "momentId": {
              "$oid": "666857642fd52886888000a2"
            },
            "clipLength": 10,
            "mediaType": null,
            "id": "666857642fd52886888000a3"
          }
        ],
        "promptId": {
          "$oid": "666853b92fd5288688800097"
        }
      }
    ],
    "soundRules": null,
    "createdAt": {
      "$date": "2024-06-11T13:40:08.806Z"
    },
    "lastUpdated": {
      "$date": "2024-06-11T13:40:08.806Z"
    },
    "twyneId": {
      "$oid": "6668526b2fd5288688800090"
    },
    "rendered": false,
    "twyneRenderUri": null
  };
  
  const { momentIds, promptIds, twyneId } = extractObjectIds(data);
  
  console.log("Moment IDs:", momentIds);
  console.log("Prompt IDs:", promptIds);
  console.log("Twyne ID:", twyneId);

  