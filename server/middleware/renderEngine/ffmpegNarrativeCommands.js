const ffmpegNarrativeCommands = {
    // Command definitions for different narrative blocks
    "Title Sequence": {
        cutAndNormalize: (clip, length, framerate, orientation, quality) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},pad=ih:ih:0:(ow-ih)/2,setsar=1" -an -t ${clip.length} title_temp.mp4`;
        },
        mergeClips: (clips) => {
            // This would require a more complex setup to concatenate clips
            const fileList = clips.map((clip, index) => `file '${clip}_temp.mp4'`).join('\n');
            return `printf "${fileList}" > concat_list.txt && ffmpeg -f concat -safe 0 -i concat_list.txt -c copy title_sequence.mp4`;
        },
        addMusic: (outputFile, musicFile) => {
            return `ffmpeg -i ${outputFile} -i ${musicFile} -c:v copy -c:a aac -strict experimental -shortest final_output.mp4`;
        }
    },
    "Interview": {
        process: (clip, length, framerate, orientation, quality) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},pad=ih:ih:0:(ow-ih)/2,setsar=1" -c:a copy -af "volume=0.1" interview_output.mp4`;
        }
    },
    "Montage": {
        cutAndNormalize: (clip, length, framerate, pad, quality, outputPath) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},${pad},setsar=1" -an -t ${length} ${outputPath}`;
        },
        mergeAndAddMusic: (clips, musicFile) => {
            const fileList = clips.map((clip, index) => `file '${clip}_temp.mp4'`).join('\n');
            return `printf "${fileList}" > concat_list.txt && ffmpeg -f concat -safe 0 -i concat_list.txt -i ${musicFile} -c:v copy -c:a aac -strict experimental -shortest montage_sequence.mp4`;
        }
    },

    "Outro Card": {
        process: (clip, framerate, orientation, quality, musicFile) => {
            return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},pad=ih:ih:0:(ow-ih)/2,setsar=1, fade=t=out:st=${clip.length - 5}:d=5" -i ${musicFile} -c:v copy -c:a aac -af "afade=t=out:st=${clip.length - 5}:d=5" -shortest outro_card.mp4`;
        }
    },
};

export default ffmpegNarrativeCommands;