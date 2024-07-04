function generateRandomId() {
    return Math.floor(Math.random() * 1e16).toString(16);
  }
  
  const clips1 = [
    {
      "momentId": {
        "$oid": "6676444b0f1a2ab8cb6bede3"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "6676444c0f1a2ab8cb6bede4"
    },
    {
      "momentId": {
        "$oid": "6677b1820f1a2ab8cb6bedfc"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "6677b1820f1a2ab8cb6bedfd"
    },
    {
      "momentId": {
        "$oid": "6677b1a30f1a2ab8cb6bedfe"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "6677b1a30f1a2ab8cb6bedff"
    },
    {
      "momentId": {
        "$oid": "6677b1ce0f1a2ab8cb6bee00"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "6677b1ce0f1a2ab8cb6bee01"
    },
    {
      "momentId": {
        "$oid": "667b35200f1a2ab8cb6bee34"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "667b35200f1a2ab8cb6bee35"
    }
  ];
  
  const clips2 = [
    {
      "momentId": {
        "$oid": "667b5ff20f1a2ab8cb6bee5a"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "667b5ff20f1a2ab8cb6bee5b"
    },
    {
      "momentId": {
        "$oid": "667b60250f1a2ab8cb6bee5c"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "667b60250f1a2ab8cb6bee5d"
    },
    {
      "momentId": {
        "$oid": "667b603c0f1a2ab8cb6bee5e"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "667b603c0f1a2ab8cb6bee5f"
    },
    {
      "momentId": {
        "$oid": "667b60620f1a2ab8cb6bee60"
      },
      "clipLength": 4,
      "mediaType": null,
      "id": "667b60620f1a2ab8cb6bee61"
    }
  ];
  
  // Merge clips1 and clips2, removing duplicates based on momentId
  const mergedClips = [...clips1];
  
  clips2.forEach(clip2 => {
    const duplicate = mergedClips.find(clip1 => clip1.momentId.$oid === clip2.momentId.$oid);
    if (!duplicate) {
      mergedClips.push(clip2);
    }
  });
  
  console.log(JSON.stringify(mergedClips, null, 2));
  