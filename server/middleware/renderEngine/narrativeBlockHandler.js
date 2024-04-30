import extractClipData from "./extractClips.js";
import processTitle from "./processTitle.js";
import processOutro from "./processOutro.js";
import processMontage from "./processMontage.js";
import processInterview from "./processInterview.js";
import deleteFiles from "./deleteFiles.js";

const renderVideo = async (storylineId, twyneQuality, twyneOrientation, music, twyneId, title, outro) => {
    const narrativeBlocks = await extractClipData(storylineId);

    const fileLocations = [];
    const finalOutput = `finals/twyne_${twyneId}.mp4`;

    for (const block of narrativeBlocks) {
        let fileLocation;
        switch (block.partType) {
            case "Title Sequence":
                fileLocation = await processTitle(block, twyneQuality, twyneOrientation, music, twyneId, title);
                break;
            case "Outro Card":
                fileLocation = await processOutro(block, twyneQuality, twyneOrientation, music, twyneId, outro);
                break;
            case "Montage":
                fileLocation = await processMontage(block, twyneQuality, twyneOrientation, music, twyneId);
                break;
            case "Interview":
                fileLocation = await processInterview(block, twyneQuality, twyneOrientation, music, twyneId);
                break;
        }
        fileLocations.push(fileLocation);
    }

    console.log(`All blocks processed successfully. File locations:`, fileLocations);

    // Call deleteFiles after all promises have resolved
    // deleteFiles();
}

renderVideo("662adef494d07d65cfb47cce", "Proxy", "horizontal", "s3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3", "65f138c9336de84ab7cb3ed7", "The Greatest Rock", "outro");