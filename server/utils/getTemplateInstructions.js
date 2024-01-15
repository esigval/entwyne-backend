import StorylineTemplate from '../models/storylineTemplateModel.js';

async function runGetTemplateDetails(data) {
    const data = 'Name of Template'; // Replace with the actual data you want to use
    const details = await StorylineTemplate.getTemplateDetails(data);
    console.log(details);
}

