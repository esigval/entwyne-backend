// In this block, we want to prepare a preparation script that will run each clip according to their part type
const ffmpegCommands = {
  // Command definitions for different narrative blocks
  "Title Sequence": {
    cutAndNormalize: (clip, framerate, orientation, quality) => {
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
    process: (clip, framerate, orientation, quality) => {
      return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},pad=ih:ih:0:(ow-ih)/2,setsar=1" -c:a copy -af "volume=0.1" interview_output.mp4`;
    }
  },
  "Montage": {
    cutAndNormalize: (clip, framerate, orientation, quality) => {
      return `ffmpeg -i ${clip} -r ${framerate} -vf "${quality},pad=ih:ih:0:(ow-ih)/2,setsar=1" -an -t ${clip.length} montage_temp.mp4`;
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
  }
};

// Function to calculate quality based on user settings
function getScale(quality, orientation) {
  switch (quality) {
    case 'SD':
      return orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
    case 'LowHD':
      return orientation === 'horizontal' ? 'scale=1280:-2' : 'scale=-2:1280';
    case 'HD':
      return orientation === 'horizontal' ? 'scale=1920:-2' : 'scale=-2:1920';
    case 'Proxy':
      return orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
    default:
      throw new Error('Invalid quality: ' + quality);
  }
}

// Example usage
const clipConfig = {
  clip: 'path/to/clip.mp4',
  length: 10,
  framerate: 30,
  orientation: 'horizontal',
  quality: 'HD'
};
const qualitySettings = getScale(clipConfig.quality, clipConfig.orientation);

console.log(ffmpegCommands["Title Sequence"].cutAndNormalize(clipConfig.clip, clipConfig.framerate, clipConfig.orientation, qualitySettings));
