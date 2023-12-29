import mongoose from 'mongoose';

const storylineSchema = new mongoose.Schema({
    threadId: String,
    created: { type: Date, default: Date.now },
    storyName: String,
    storyline: [{
        prompt: String,
        order: Number,
        mediaType: String,
        length: Number,
        contentType: String,
        storybeat: String,
        twyneId: String,
        shotDescription: String,
        promptTitle: String,
    }],
});

const Storyline = mongoose.model('Storyline', storylineSchema, 'storylines');

export default Storyline;
