import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the directories
const directories = ['downloads', 'processing', 'temp'];

const deleteFiles = () => {
  directories.forEach((dir) => {
    const directoryPath = path.join(__dirname, dir);

    fs.readdir(directoryPath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directoryPath, file), err => {
          if (err) throw err;
        });
      }
    });
  });
};

export default deleteFiles;

deleteFiles();