import axios from 'axios';

const useDownload = () => {
    const downloadFile = async (id: string) => {
        try {
            const API_URL = 'https://api.thekenji.xyz/api/v1';

            const res = await axios.get(`${API_URL}/file/download/${id}`, {
                responseType: 'blob',
            });

            // Extract file name from Content-Disposition header
            const contentDisposition = res.headers['content-disposition'];
            const contentType = res.headers['content-type'];
            console.log("Content-Disposition: ", contentDisposition);
            console.log("Content-Type: ", contentType);
            console.log("Headers: ", res.headers);

            let fileName = 'downloaded_file';
            let fileExtension = '';

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                    const fileNameParts = fileName.split('.');
                    if (fileNameParts.length > 1) {
                        fileExtension = fileNameParts.pop()!;
                        fileName = fileNameParts.join('.');
                    }
                }
            }

            // If file extension is not found in Content-Disposition, use Content-Type
            if (!fileExtension && contentType) {
                const mimeTypes: { [key: string]: string } = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'application/pdf': 'pdf',
                    'text/plain': 'txt',
                    'application/zip': 'zip',
                    'application/x-rar-compressed': 'rar',
                    'application/vnd.ms-excel': 'xls',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
                    'application/msword': 'doc',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                    'application/vnd.ms-powerpoint': 'ppt',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
                    'application/json': 'json',
                    'application/xml': 'xml',
                    'application/octet-stream': 'bin',
                };
                fileExtension = mimeTypes[contentType] || 'bin';
            }

            console.log(`Filename: ${fileName}`);
            console.log(`Extension: ${fileExtension}`);

            const url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.${fileExtension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    return { downloadFile };
}

export default useDownload;