import { useParams } from 'react-router-dom';
import '/hacking.gif';
import useDownload from '../hooks/useDownload';

function FileDownload() {
    const { id } = useParams<{ id: string }>();
    const { downloadFile } = useDownload();

    const handleDownload = () => {
        if (id) {
            downloadFile(id);
        } else {
            console.error("ID is undefined");
        }
    };

    return (
        <div>
            <h2>Download your file!! (⌐▰U▰)</h2>
            <img src="/hacking.gif" alt="Hacking GIF" />
            <br />
            <button onClick={handleDownload}>Download File</button>
        </div>
    );
}

export default FileDownload;