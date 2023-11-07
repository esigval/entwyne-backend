const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const { exec } = require('child_process');

dotenv.config({ path: path.join(__dirname, '../.env') });

const outputPath = path.join(__dirname, '../assets/temp_output/output.webm');
const finalOutput = path.join(__dirname, '../assets/final_output/output.mp4');

function concatenateVideos(callback) {
    const rawFootagePath = path.join(__dirname, '../assets/rawfootage');
    const videosTxtPath = path.join(__dirname, '../assets/videos.txt');

    // Read all files in the rawfootage directory
    fs.readdir(rawFootagePath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return callback(err);
        }

        // Filter out non-video files if necessary
        const videoFiles = files.filter(file => path.extname(file) === '.mp4' || path.extname(file) === '.webm');
        
        // Write file paths to videos.txt
        const content = videoFiles.map(file => `file '${path.join(rawFootagePath, file)}'`).join('\n');
        fs.writeFileSync(videosTxtPath, content, 'utf8');

        console.log('Starting concatenation of videos...');
        exec(`ffmpeg -f concat -safe 0 -i ${videosTxtPath} -c copy ${outputPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error concatenating videos: ${error}`);
                return callback(error);
            }
            console.log('Concatenation of videos finished successfully!');
            callback(null);
        });
    });
}


function convertToMP4(callback) {
    console.log('Starting conversion to mp4...');
    exec(`ffmpeg -i ${outputPath} -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest ${finalOutput}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting to mp4: ${error}`);
            return callback(error);
        }
        console.log('Conversion to mp4 finished successfully!');
        callback(null);
    });
}

// Execute the functions
concatenateVideos((err) => {
    if (err) {
        process.exit(1);
    } else {
        convertToMP4((err) => {
            if (err) {
                process.exit(1);
            } else {
                console.log('Videos processed successfully!');
                process.exit(0);
            }
        });
    }
});
