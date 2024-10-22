import { useState } from 'react';
import useUpload from '../hooks/useUpload';

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const { uploadFile } = useUpload();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      setMessage('Uploading...');
      const link = await uploadFile(file);
      setLoading(false);
      if (link) {
        const fullLink = `http://localhost:5173/file/${link}`;
        setDownloadLink(fullLink);
        setMessage(`File uploaded successfully.`);
      } else {
        setMessage('Error uploading file.');
      }
    }
  };

  const handleCopy = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      setMessage('Download link copied to clipboard.');
    }
  };

  return (
    <div>
      <h2>Upload and share your files! {"٩>ᴗ<)و"}</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '4px',
          width: '300px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px auto',
          position: 'relative',
        }}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag and drop a file here, or click to select a file</p>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            width: '300px',
            height: '200px',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
      <button onClick={handleUpload} disabled={!file || loading}>
        Upload File
      </button>
      {loading && <p>{message}</p>}
      {!loading && downloadLink && (
        <div>
          <p>{message}</p>
          <button onClick={handleCopy}>Copy Download Link</button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;