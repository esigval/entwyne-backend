export const getNarrativeBlockTemplates = (bpm) => ({
    "Montage": {
        type: "Montage",
        durationRange: { min: 5000, max: 15000 }, // Example duration in milliseconds
        description: "used to fill in background information or compress time",
        clipPace: {
            type: "timed",
            bpm: bpm,
            interval: 4

          }
    },
    "Interview": {
        type: "Interview",
        durationRange: { min: 5000, max: 20000 },
        description: "used to provide insights or personal perspectives directly by film",
        clipPace: {
            type: "fixed",
            bpm: null
          }
    },
    "Outro Card": {
        type: "Card",
        durationRange: { min: 2000, max: 5000 },
        description: "used to display credits or closing information",
        clipPace: {
            type: "fixed",
            bpm: null
          }
    },
    "Title Sequence": {
        type: "Title",
        durationRange: { min: 2000, max: 5000 },
        description: "used to introduce the film or segment",
        clipPace: {
            type: "timed",
            bpm: bpm,
            interval: 2
          }
    }
});