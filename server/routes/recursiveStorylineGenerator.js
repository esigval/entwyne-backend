// User makes prompt - for this test "I want you to reorder all the clips that contain fruit by alphtebtical order of the fruit name"
// We need to query the database for the transcripts and pull them into a json object to be analyzed by GPT-3
// We'll ask GPT to process the result based on the user prompt and return a json object with the results
// The return response needs to be references to the story clips drawn from the database, reordered. Probably id numbers.
// We'll store this result (essentially a new name for a storyline, and an array of reference ids to the original storyline in a new database table called storylines
// Media Assembly will take this and use this as the basis for stitching.
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const pool = require('../db/mySQL'); // Adjust the path as necessary
const OpenAi = require('openai'); // Include the correct path and library for interacting with OpenAI's API
const router = express.Router();
const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});
const prepareStorylineData = require('../models/prepareStorylinesData'); // Adjust the path as necessary

router.post('/', async (req, res) => {
  try {
    // User prompt
    const userPrompt = req.body.text + "To acheive this task, read the transcription field. Format the output as json with the properties as id, order(summarized from earlier), and transcription";
    console.log(userPrompt);

    // Query the database for transcripts
    const [transcripts] = await pool.query('SELECT id, transcription FROM media'); // Adjust the query as needed
    console.log(transcripts);

    // Format data for GPT-3
    const formattedTranscripts = transcripts.map(t => `ID: ${t.id}, Transcript: ${t.transcription}`).join('\n');

    const gptResponse = await processWithGPT3(userPrompt, formattedTranscripts);
    console.log(gptResponse);

    // Parse GPT-3 response
    const orderedClipIds = prepareStorylineData(gptResponse);
    console.log(orderedClipIds);

    // Store results in the database
    const storylineName = 'Generated Storyline Name'; // This could be generated or provided by the user
    const insertStorylineQuery = 'INSERT INTO storylines (name, clip_ids) VALUES (?, ?)';
    await pool.query(insertStorylineQuery, [storylineName, JSON.stringify(orderedClipIds)]);

    // Return response
    res.json({ storylineName, clipIds: orderedClipIds });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the request.');
  }
});

async function processWithGPT3(userPrompt, formattedTranscripts) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: userPrompt }, { role: "user", content: formattedTranscripts }],
      model: "gpt-4-1106-preview",
    });

    return completion.choices[0].message.content; // Adjust according to the expected response format
  } catch (error) {
    console.error('Error processing with GPT-3:', error);
    throw error; // Rethrow to handle it in the outer try-catch
  }
}

module.exports = router;
