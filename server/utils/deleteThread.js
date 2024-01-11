import { openai } from "../services/openAiAssistant.js";

export default async function deleteThread(threadId) {
    try {
        const response = await openai.beta.threads.del(threadId);
        
        if (response.deleted === true) {
            console.log("Thread deleted successfully.");
        } else {
            console.log("Failed to delete thread.");
        }
        
        console.log(response);
    } catch (error) {
        console.error("Error deleting thread:", error);
        throw error;
    }
}