import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import NarrativeBlock from '../../../../models/narrativeBlockModel.js';

const fetchNarrativeBlockTemplatesAsJson = async () => {
    let templates = [];

    try {
        templates = await NarrativeBlock.list();

    } catch (error) {
        console.error(`Error fetching narrative blocks:`, error);
    }

    const jsonTemplates = JSON.stringify(templates);
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(dirname, 'templates.json');

    fs.writeFile(filePath, jsonTemplates, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully wrote file');
        }
    });

    return jsonTemplates;
};

fetchNarrativeBlockTemplatesAsJson();