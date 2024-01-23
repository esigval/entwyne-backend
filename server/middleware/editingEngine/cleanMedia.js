import { promises as fs } from 'fs';

export const cleanMedia = async (paths) => {
    for (const filePath of paths) {
        try {
            await fs.rm(filePath, { recursive: true, force: true });
            console.log(`Deleted: ${filePath}`);
        } catch (error) {
            console.error(`Error deleting ${filePath}:`, error);
        }
    }
};