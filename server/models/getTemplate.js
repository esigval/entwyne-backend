const db = require('../db/db');

templateId = ''

const getTemplate = async (templateId) => {
    const database = await db.connect();
    const template = await database.collection('templates').findOne({ id: templateId });
    return template;
}

