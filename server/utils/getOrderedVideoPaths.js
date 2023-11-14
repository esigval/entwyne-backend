const pool = require('../db/mySQL');

const getOrderedVideoPaths = async (storylineId) => {
    // Fetch the JSON string from the storyline
    const storylineQuery = 'SELECT clip_ids FROM storylines WHERE id = ?';
    const [rows] = await pool.query(storylineQuery, [storylineId]);
    
    // Check if the query returned a result
    if (rows.length === 0) {
        throw new Error(`No storyline found with id ${storylineId}`);
    }

    const storyline = rows[0];

    // Parse the JSON to extract the IDs
    const clipData = JSON.parse(storyline.clip_ids); // Use clip_ids here
    const clipIds = clipData.map(clip => clip.id);

    // Fetch the file paths from the media table using the IDs
    const mediaQuery = 'SELECT id, webmFilePath FROM media WHERE id IN (?)';
    const [mediaFiles] = await pool.query(mediaQuery, [clipIds]);

    // Order the file paths based on the order in the storyline JSON
    const orderedFilePaths = clipIds.map(id => {
        const file = mediaFiles.find(file => file.id === id);
        if (!file) {
            throw new Error(`No media found with id ${id}`);
        }
        return file.webmFilePath;
    });

    return orderedFilePaths;
};

module.exports = getOrderedVideoPaths;