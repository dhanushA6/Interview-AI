import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ResumeUpload({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (open) {
      fetchResumes();
      setSuccess(false);
    }
  }, [open]);

  const fetchResumes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/resumes', {
        withCredentials: true,
      });
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setResumes([]);
      setError('Failed to fetch resumes');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post('http://localhost:3000/api/resumes/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      setSuccess(true);
      fetchResumes();
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Invalid file type. Only PDF or DOCX allowed.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(file.type);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Resume</h3>

        {/* Drop area */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-md p-4 text-center text-sm transition ${
            file
              ? 'border-green-400 bg-green-50 text-green-700'
              : 'border-gray-400 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {file ? (
            <p>Selected: <strong>{file.name}</strong></p>
          ) : (
            <p>Drag & drop your resume here, or use the file picker below</p>
          )}
        </div>

        <form onSubmit={handleUpload} className="space-y-4 mt-4">
          {/* File Picker */}
          <input
            id="resume"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {/* Upload Button */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-2 rounded-md font-bold flex items-center justify-center transition ${
              loading || !file
                ? 'bg-blue-300 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </button>
        </form>

        {/* Status Messages */}
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        {success && <div className="text-green-600 mt-2 text-sm">Upload successful ✅</div>}

        {/* Resume List */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-2">Your Resumes</h4>
          <ul className="max-h-40 overflow-y-auto divide-y text-sm text-gray-700">
            {resumes.length > 0 ? (
              resumes.map((r) => (
                <li
                  key={r._id || `${r.originalName}-${r.uploadDate}`}
                  className="py-2 flex flex-col"
                >
                  <span className="font-medium">{r.originalName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(r.uploadDate).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic py-2">No resumes found.</li>
            )}
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
