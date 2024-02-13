import startRequest from './streamTranscription.js';
import parseTranscription from './parseTranscription.js';
import downloadAudio from './downloadAudio.js';
import storeTranscription from './storeTranscriptions.js';

exports.handler = async (event, context) => {

  const downloadPath = await downloadAudio();
  const stream = await startRequest(downloadPath);
  const transcript = await parseTranscription(stream);
  await storeTranscription(transcript, promptId);

  console.log("result:", transcript);
  console.log("event:", event);

  // You can return the transcript if you want the Lambda function to return this value
  return transcript;
};