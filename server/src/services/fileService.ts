import fs from 'fs';

// Interface for file metadata
interface FileMetadata {
    filePath: string;
    expiresAt: number;
}

// In-memory storage for file metadata
const fileStore: { [key: string]: FileMetadata } = {};

// Store file metadata
export const storeFile = (id: string, filePath: string, expiresAt: number) => {
    fileStore[id] = { filePath, expiresAt };
};

// Retrieve file metadata by ID
export const getFile = (id: string): FileMetadata | undefined => {
    return fileStore[id];
};

// Schedule file deletion
export const scheduleFileDeletion = (id: string, filePath: string, expiresAt: number) => {
    const timeUntilDeletion = expiresAt - Date.now();

    setTimeout(() => {
        if (fileStore[id]) {
            fs.unlink(fileStore[id].filePath, (err) => {
                if (err) console.error(`Failed to delete file: ${fileStore[id].filePath}`, err);
                delete fileStore[id]; // Remove file metadata from the store
            });
        }
    }, timeUntilDeletion);
};
