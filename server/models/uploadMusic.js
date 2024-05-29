import Music from './musicModel.js';

const tracks = [
    {
        trackName: 'Neon Beach Conspiracy Nation Background Vocals Verse',
        partType: 'Montage',
        bpm: 120,
        name: 'Neon Beach Conspiracy Nation',
        description: 'A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.',
        uri: 's3://music-tracks/Montage/Neon_Beach_Conspiracy_Nation_background_vocals_verse_0_37.mp3',
        length: '0:37',
        key: 'A Minor' // Added key
    },
    {
        trackName: 'Neon Beach Conspiracy Nation Background Vocals Intro',
        partType: 'Intro',
        bpm: 120,
        name: 'Neon Beach Conspiracy Nation',
        description: 'A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.',
        uri: 's3://music-tracks/Intro/Neon_Beach_Conspiracy_Nation_background_vocals_intro_0_29.mp3',
        length: '0:29',
        key: 'A Minor' // Added key
    },
    {
        trackName: 'Neon Beach Conspiracy Nation Background Vocals Verse',
        partType: 'Interviews',
        bpm: 120,
        name: 'Neon Beach Conspiracy Nation',
        description: 'A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.',
        uri: 's3://music-tracks/Interviews/Neon_Beach_Conspiracy_Nation_background_vocals_verse_0_37.mp3',
        length: '0:37',
        key: 'A Minor' // Added key
    },
    {
        trackName: 'Neon Beach Conspiracy Nation Background Vocals Intro',
        partType: 'Outro',
        bpm: 120,
        name: 'Neon Beach Conspiracy Nation',
        description: 'A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.',
        uri: 's3://music-tracks/Outro/Neon_Beach_Conspiracy_Nation_background_vocals_intro_0_29.mp3',
        length: '0:29',
        key: 'A Minor' // Added key
    }
];

tracks.forEach(async track => {
    const music = new Music(track);
    const insertedId = await Music.insertOne(music);
    console.log(`Inserted track with ID: ${insertedId}`);
});