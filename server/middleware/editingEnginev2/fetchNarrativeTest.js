import NarrativeStyle from '../../models/narrativeStylesModel.js';

async function fetchNarrativeTest(name) {
    const selectedNarrative = await NarrativeStyle.findByName(name);
    console.log(selectedNarrative);
    return selectedNarrative;
}

fetchNarrativeTest('Adventure Narrative Style').catch(console.error);