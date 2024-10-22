import axios from 'axios';
import { useState } from 'react';

interface IUploadResponse {
    downloadLink: string;
    message: string;
}

const useUpload = () => {
    const [response, setResponse] = useState<IUploadResponse | null>(null);

    const uploadFile = async (file: File) => {
        try {
            // const API_URL = 'https://api.thekenji.xyz/api/v1';
            const API_URL = 'http://localhost:8000/api/v1';

            const formData = new FormData();
            formData.append('file', file);
            formData.append('lastModified', file.lastModified.toString());
            formData.append('name', file.name);
            formData.append('size', file.size.toString());
            formData.append('type', file.type);
            formData.append('webkitRelativePath', file.webkitRelativePath);

            const res = await axios.post(`${API_URL}/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'json',
            });

            setResponse(res.data);
            console.log(res.data);

            return res.data.downloadLink;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    return { uploadFile, response };
}

export default useUpload;