import Music from '../../../models/musicModel.js'; // Adjust the path if necessary

export default async function getMusicTracks(trackName) {
    const tracks = await Music.findAllByTrackName(trackName);
    const trackMap = {};

    tracks.forEach(track => {
        trackMap[track.partType] = track;
    });

    console.log(trackMap);
    return trackMap;
}