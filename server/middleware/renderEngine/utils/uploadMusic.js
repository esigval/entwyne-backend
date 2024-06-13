
import Music from '../../../models/musicModel.js'; // Adjust the path to your Music model file

const tracks = [
  {
    
    trackName: "Neon Beach Humblebrag Instrumental Verse",
    partType: "Montage",
    bpm: 120,
    name: "Neon Beach Humblebrag Instrumental Verse",
    description: "A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.",
    uri: "s3://music-tracks/Montage/Neon_Beach_Humblebrag_instrumental_verse_0_21.mp3",
    length: "0:21",
    key: "A Minor"
  },
  {
    
    trackName: "Neon Beach Humblebrag Instrumental Intro",
    partType: "Intro",
    bpm: 120,
    name: "Neon Beach Humblebrag Instrumental Intro",
    description: "A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.",
    uri: "s3://music-tracks/Intro/Neon_Beach_Humblebrag_instrumental_intro_0_14.mp3",
    length: "0:14",
    key: "A Minor"
  },
  {
    
    trackName: "Neon Beach Humblebrag Instrumental Intro",
    partType: "Interviews",
    bpm: 120,
    name: "Neon Beach Humblebrag Instrumental Intro",
    description: "A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.",
    uri: "s3://music-tracks/Interviews/Neon_Beach_Humblebrag_instrumental_intro_0_14.mp3",
    length: "0:14",
    key: "A Minor"
  },
  {
    
    trackName: "Neon Beach Humblebrag Instrumental Chorus",
    partType: "Outro",
    bpm: 120,
    name: "Neon Beach Humblebrag Instrumental Chorus",
    description: "A medium energy, electronic song that is best described as fun and happy. Synth and bass are the primary instruments in this track.",
    uri: "s3://music-tracks/Outro/Neon_Beach_Humblebrag_instrumental_chorus_0_22.mp3",
    length: "0:22",
    key: "A Minor"
  }
];

const insertTracks = async () => {
  try {
    for (const track of tracks) {
      const music = new Music(track);
      await Music.insertOne(music);
      console.log(`Inserted track: ${track.trackName}`);
    }
  } catch (error) {
    console.error('Error inserting tracks:', error);
  }
};

insertTracks();
