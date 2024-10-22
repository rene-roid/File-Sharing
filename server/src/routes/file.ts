import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { storeFile, getFile, scheduleFileDeletion } from '../services/fileService';

const router = Router();
const UPLOAD_DIR = path.join(__dirname, '../../../s3');
const API_URL = 'https://api.thekenji.xyz/api/v1';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    // Generate unique ID and expiration time
    const uniqueId = uuidv4();
    const expiresAt = Date.now() + 86400000; // 24 hours

    // Store file information and schedule deletion
    storeFile(uniqueId, req.file.path, expiresAt);
    scheduleFileDeletion(uniqueId, req.file.path, expiresAt);

    // Send download link to client
    res.json({ message: 'File uploaded successfully', downloadLink: `${uniqueId}` });
});

// Download route
router.get('/download/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const fileData = getFile(id);

    if (!fileData || fileData.expiresAt < Date.now()) {
        return res.status(404).json({ message: 'File not found or has expired' });
    }

    // Extract the filename from the file path
    const fileName = fileData.filePath.split('/').pop() || 'downloaded_file';

    // Set the Content-Disposition header to include the filename
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Serve the file for download
    res.download(fileData.filePath, (err) => {
        if (err) console.error(`Failed to download file: ${fileData.filePath}`, err);
    });
});

export default router;