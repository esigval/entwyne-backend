import NarrativeBlock from "../../models/narrativeBlockModel.js";

const Montage = {
    name: "Montage",
    type: "Montage",
    durationRange: { min: 5000, max: 25000 },
    description: "used to fill in background information or compress time",
    clipPace: {
        type: "timed",
        quantity: null,
        bpm: 120,
        interval: 4
    }
};

const Interview = {
    name: "Interview",
    type: "Interview",
    durationRange: { min: 5000, max: 30000 },
    description: "used to provide insights or personal perspectives directly by film",
    clipPace: {
        type: "fixed",
        quantity: 1,
        bpm: null
    }
};

const OutroCard = {
    name: "Outro Card",
    type: "Outro Card",
    durationRange: { min: 2000, max: 5000 },
    description: "used to display credits or closing information",
    clipPace: {
        type: "fixed",
        quantity: 1,
        bpm: null
    }
};

const TitleSequence = {
    name: "Title Sequence",
    type: "Title Sequence",
    durationRange: { min: 2000, max: 5000 },
    description: "used to introduce the film or segment",
    clipPace: {
        type: "timed",
        quantity: 1,
        bpm: 120,
        interval: 4
    }
};

const importTemplates = async (NarrativeBlock) => {
    try {
        await NarrativeBlock.insertOne(Montage);
        await NarrativeBlock.insertOne(Interview);
        await NarrativeBlock.insertOne(OutroCard);
        await NarrativeBlock.insertOne(TitleSequence);
        console.log('Narrative block templates imported successfully.');
    } catch (error) {
        console.error('Error importing narrative block templates:', error);
        throw error;
    }
}

importTemplates(NarrativeBlock);