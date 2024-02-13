
function parseTranscription(transcriptionEvent) {
    const results = transcriptionEvent.TranscriptEvent.Transcript.Results;
    if (results.length === 0 || results[0].Alternatives.length === 0) {
      return ''; // No transcription available
    }
    
    // If you need to process individual words or rebuild the sentence manually:
    const items = results[0].Alternatives[0].Items;
    const sentence = items.reduce((acc, item) => {
      // Append content with a space for pronunciation, directly for punctuation
      return acc + (item.Type === "pronunciation" ? item.Content + " " : item.Content);
    }, '').trim();
  
    return sentence;
  }

export default parseTranscription;