const axios = require('axios');
const fs = require('fs');

async function downloadVideo(url, destination) {
    const writer = fs.createWriteStream(destination);

    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports = downloadVideo;