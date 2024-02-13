import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { createReadStream } from 'fs';

const LanguageCode = "en-US";
const MediaEncoding = "flac";
const MediaSampleRateHertz = "16000";

export default async function startRequest(downloadPath ) {

  const audio = createReadStream(downloadPath, { highWaterMark: 1024 * 16 });

  const client = new TranscribeStreamingClient({region: "us-east-1" });

  const params = {
    LanguageCode,
    MediaEncoding,
    MediaSampleRateHertz,
    AudioStream: (async function* () {
      for await (const chunk of audio) {
        yield {AudioEvent: {AudioChunk: chunk}};
      }
    })(),
  };
  const command = new StartStreamTranscriptionCommand(params);
  // Send transcription request
  const response = await client.send(command);
  // Start to print response
  const transcriptionResults = [];
  try {
    let lastTranscript;
    for await (const event of response.TranscriptResultStream) {
      lastTranscript = event;
    }
    return lastTranscript;
  } catch(err) {
    console.log("error")
    console.log(err)
  }
  return transcriptionResults;
}