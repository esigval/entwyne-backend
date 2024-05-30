const ffmpegNarrativeCommands = {
    // Command definitions for different narrative blocks
    "Title": {
        process: (clip, length, framerate, pad, quality, outputPath) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},${pad},setsar=1" -c:v libx264 -an -pix_fmt yuv420p -profile:v main -t ${length} ${outputPath}`;
        },
        mergeClips: (clips) => {
            const fileList = clips.map((clip, index) => `file '${clip}_temp.mp4'`).join('\n');
            return `printf "${fileList}" > concat_list.txt && ffmpeg -f concat -safe 0 -i concat_list.txt -c copy title_sequence.mp4`;
        },
        addMusic: (videoFile, musicFile, outputFile) => {
            return `ffmpeg -i "${videoFile}" -i "${musicFile}" -filter_complex "[1:a]volume=1.5[a2];[a2]amix=inputs=1" -c:v libx264 -c:a aac -b:a 192k -ar 44100 -strict experimental -shortest "${outputFile}"`;
        }
    },
    "Interview": {
        process: (clip, length, framerate, pad, quality, outputPath) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},${pad},setsar=1" -c:a aac -b:a 192k -ar 44100 -c:v libx264 -pix_fmt yuv420p -profile:v main -t ${length} ${outputPath}`;
        },
        addMusic: (videoFile, musicFile, outputFile) => {
            return `ffmpeg -i "${videoFile}" -i "${musicFile}" -filter_complex "[0:a]volume=2.0[a1];[1:a]volume=0.7[a2];[a1][a2]amix=inputs=2:duration=first:dropout_transition=2" -c:v libx264 -c:a aac -b:a 192k -ar 44100 -strict experimental -shortest "${outputFile}"`;
        }
    },
    "Montage": {
        process: (clip, length, framerate, pad, quality, outputPath) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},${pad},setsar=1" -c:v libx264 -an -pix_fmt yuv420p -profile:v main -t ${length} ${outputPath}`;
        },
        addMusic: (videoFile, musicFile, outputFile) => {
            return `ffmpeg -i "${videoFile}" -i "${musicFile}" -filter_complex "[1:a]volume=1.5[a2];[a2]amix=inputs=1" -c:v libx264 -c:a aac -b:a 192k -ar 44100 -strict experimental -shortest "${outputFile}"`;
        }
    },
    "Outro": {
        process: (clip, length, framerate, pad, quality, outputPath) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},${pad},setsar=1" -c:v libx264 -an -pix_fmt yuv420p -profile:v main -t ${length} ${outputPath}`;
        },
        addMusic: (videoFile, musicFile, outputFile) => {
            return `ffmpeg -i "${videoFile}" -i "${musicFile}" -filter_complex "[1:a]volume=1.5[a2];[a2]amix=inputs=1" -c:v libx264 -c:a aac -b:a 192k -ar 44100 -strict experimental -shortest "${outputFile}"`;
        }
    },
};

export default ffmpegNarrativeCommands;
