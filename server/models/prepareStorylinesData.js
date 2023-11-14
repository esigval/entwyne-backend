const prepareStorylineData = (jsonResponse) => {
  // Remove the prefix
  const jsonPrefix = '```json ';
  const jsonSuffix = ' ```';
  const cleanJsonResponse = jsonResponse.slice(jsonPrefix.length, -jsonSuffix.length);

  // Parse the cleaned JSON response
  const parsedResponse = JSON.parse(cleanJsonResponse);

  // Prepare the data for the 'storylines' table
  // Assuming the 'storylines' table has columns 'id', 'name', 'clip_ids', 'order', and 'transcription'
  // 'order' will store the position of each clip ID in the ordered list
  const storylineData = parsedResponse.map((item, index) => ({
    id: item.id,
    order: index + 1, // Starts from 1 instead of 0
    transcription: item.transcription
  }));

  return storylineData;
};

module.exports = prepareStorylineData;

