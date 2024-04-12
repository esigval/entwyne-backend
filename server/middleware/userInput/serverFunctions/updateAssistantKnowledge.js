import { uploadFile } from '../assistantController/uploadFile.js';
import { createAssistantFile } from '../assistantController/createAssistantFile.js';
import { listAssistantFiles } from '../assistantController/listAssistantFiles.js';
import { listFiles } from '../assistantController/listFiles.js';
import { deleteFile } from '../assistantController/deleteFile.js';

async function updateAssistantKnowledge(assistantId) {
    const files = await listFiles();
    console.log("Files:", files);  // Verify the files

  const templateFiles = files.filter(file => file.filename === "templates.json");
  console.log("Filtered templateFiles:", templateFiles);  // Check what files are being filtered

  for (const templateFile of templateFiles) {
    console.log("Processing templateFile ID:", templateFile.id);
    const assistantFiles = await listAssistantFiles(assistantId);
    console.log("Assistant Files:", assistantFiles);  // Log the assistant files

    const matchingFile = assistantFiles.data.find(file => file.id === templateFile.id);
    if (matchingFile) {
      await deleteFile(matchingFile.id);
      console.log("Deleted file with ID:", matchingFile.id);
    }
  }

  const uploadResponse = await uploadFile("./middleware/userInput/assistantData/knowledge/templates.json", "assistants");
  const fileId = uploadResponse.id;
  await createAssistantFile(assistantId, fileId);
}

updateAssistantKnowledge('asst_HW7vJdo7CPOjz5ffrebd2Hw9');