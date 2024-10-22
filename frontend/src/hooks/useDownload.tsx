import axios from 'axios';

const useDownload = () => {
    const downloadFile = async (id: string) => {
        try {
            const API_URL = 'http://localhost:8000/api/v1';

            const res = await axios.get(`${API_URL}/file/download/${id}`, {
                responseType: 'blob',
            });

            // Log all response headers
            console.log('Response Headers:', res.headers);

            // Log custom header
            console.log('X-Custom-Header:', res.headers['x-custom-header']);

            // Extract file name from Content-Disposition header
            const contentDisposition = res.headers['content-disposition'];
            let filename = 'downloaded_file';

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            } else {
                console.error('Content-Disposition header not found, using default filename');
            }
            
            const extension = res.headers['content-type'].split('/').pop() || 'bin';

            const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.${extension}`);
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