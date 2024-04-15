import { uploadFile } from '../assistantController/uploadFile.js';
import { createAssistantFile } from '../assistantController/createAssistantFile.js';
import { listAssistantFiles } from '../assistantController/listAssistantFiles.js';
import { listFiles } from '../assistantController/listFiles.js';
import { deleteFile } from '../assistantController/deleteFile.js';
import { fetchNarrativeBlockTemplatesAsJson } from '../assistantData/knowledge/retrieveTemplates.js';  
import { deleteAssistantFile } from '../assistantController/deleteAssistantFile.js';

async function updateAssistantKnowledge(assistantId) {
    await fetchNarrativeBlockTemplatesAsJson();

    const files = await listFiles();

    const templateFiles = files.filter(file => file.filename === "templates.json");

    for (const templateFile of templateFiles) {
        const assistantFiles = await listAssistantFiles(assistantId);

        const matchingFile = assistantFiles.data.find(file => file.id === templateFile.id);
        if (matchingFile) {
            await deleteFile(matchingFile.id);
            await deleteAssistantFile(assistantId, matchingFile.id);
        }
    }

    const uploadResponse = await uploadFile("./middleware/userInput/assistantData/knowledge/templates.json", "assistants");
    const fileId = uploadResponse.id;
    await createAssistantFile(assistantId, fileId);
    console.log('Successfully updated assistant knowledge');
}

updateAssistantKnowledge('asst_HW7vJdo7CPOjz5ffrebd2Hw9');
