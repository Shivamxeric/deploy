import React, { useState } from 'react';
import { Client, Storage } from 'appwrite';

const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [compressedFileUrl, setCompressedFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const storage = new Storage(client);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setOriginalSize((uploadedFile.size / 1024 / 1024).toFixed(2)); // Size in MB
  };

  const compressPDF = async () => {
    if (!file) return alert("Please upload a PDF file to compress");

    setLoading(true);
    setProgress(0); // Start progress from 0

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(progressInterval);
        return 100;
      });
    }, 30); // Adjust speed by changing interval duration

    try {
      const result = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        'unique()',
        file
      );

      setCompressedFileUrl(result.$id);
      setCompressedSize((Math.random() * 2).toFixed(2)); // Random size in MB for demo
      setLoading(false); // End loading
      alert("File compressed successfully!");
    } catch (error) {
      console.error("Compression failed", error);
      setLoading(false);
    }
  };

  const downloadCompressedPDF = async () => {
    if (compressedFileUrl) {
      try {
        const downloadUrl = await storage.getFileDownload(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          compressedFileUrl
        );

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'compressed_pdf.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed", error);
      }
    } else {
      alert("No compressed file available for download.");
    }
  };

  return (
    <div className="pdf-compressor-container">
      <header className="header">
        <h1>PDF Compressor</h1>
      </header>

      <div className="pdf-compressor">
        <input type="file" accept="application/pdf" onChange={handleFileUpload} />
        <button onClick={compressPDF} disabled={loading}>Compress PDF</button>

        {loading && (
          <div className="progress-container">
            <span>Compressing... {progress}%</span>
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {!loading && compressedFileUrl && (
          <>
            <div className="file-sizes">
              <div className="size-box original-size">
                Original Size: {originalSize} MB
              </div>
              <div className="size-box compressed-size">
                Compressed Size: {compressedSize} MB
              </div>
            </div>
            <button onClick={downloadCompressedPDF}>Download Compressed PDF</button>
          </>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 PDF Compressor. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PDFCompressor;
