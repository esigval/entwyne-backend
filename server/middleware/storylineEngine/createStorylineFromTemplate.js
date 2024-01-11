import StorylineModel from "../../models/storylineModel.js";
import StorylineTemplate from "../../models/storylineTemplateModel.js";

async function createStorylineFromTemplate(templateName, storyId) {
    try {
        // Retrieve storyline parts based on the template name
        const storylineTemplateParts = await StorylineTemplate.getStorylineTemplateParts(templateName);
        if (!storylineTemplateParts) {
            throw new Error("No storyline parts found for the given template name.");
        }
        // console.log("storylineTemplateParts:", storylineTemplateParts);

        // Prepare the data for the new storyline
        const storylineData = {
            storyId: storyId,
            storylineParts: storylineTemplateParts,
        };

        // Create the new storyline
        const newStoryline = await StorylineModel.create(storylineData);

        // Return the newly created storyline
        return newStoryline;
    } catch (error) {
        console.error("Error in createStorylineFromTemplate:", error);
        throw error;
    }
}

export default createStorylineFromTemplate;