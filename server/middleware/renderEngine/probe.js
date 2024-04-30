import { exec } from 'child_process';

const cmd = 'ffprobe -print_format json -show_format -show_streams /mnt/f/MemoryCollectionApp/server/middleware/renderEngine/finals/final_montage.mp4';

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`Result: ${stdout}`);
});