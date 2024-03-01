import express from 'express';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// List of markdown files
const markdownFiles = ['createNewUser.md', 'updateUser.md', 'deleteUser.md'];

router.get('/', (req, res) => {
    let sidebarHtml = '<div class="sidebar"><ul>';

    // Create a list item for each markdown file
    markdownFiles.forEach(file => {
        const route = file.split('.')[0]; // Remove the .md extension to get the route
        sidebarHtml += `<li><a href="/${route}">${route}</a></li>`;
    });

    sidebarHtml += '</ul></div>';

    res.send(sidebarHtml);
});

markdownFiles.forEach(file => {
    const route = file.split('.')[0]; // Remove the .md extension to get the route

    router.get(`/${route}`, (req, res) => {
        const filePath = path.join(__dirname, `../api-spec/${file}`);
        const markdownString = fs.readFileSync(filePath, 'utf8');
        const htmlString = marked(markdownString);
        res.send(htmlString);
    });
});

export default router;